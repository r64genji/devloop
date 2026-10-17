import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FOR_YOU,
  defaultFollowedSources,
  defaultFollowedTags,
  defaultShortcuts,
  initialNotifications,
  postsById,
  readMinutes,
  seedHistory,
} from "./data";
import { scrollBehavior, usePersistentState } from "./hooks";

const STREAK_DAYS = 8; // streak before today's read
const MINUTES_ALREADY_READ = 14; // mock: minutes read earlier today
const TOAST_MS = 4000;
const MAX_TOASTS = 3;

const toggleIn = (list, item) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

// State and actions live in separate contexts. Actions are created once, so
// components that only call them never re-render because of state changes.
const StateContext = createContext(null);
const ActionsContext = createContext(null);

export function FeedProvider({ children }) {
  // Preferences that survive reloads
  const [dark, setDark] = usePersistentState("theme-dark", false);
  const [sidebarOpen, setSidebarOpen] = usePersistentState("sidebar", true);
  const [layout, setLayout] = usePersistentState("layout", "grid");
  const [showHappening, setShowHappening] = usePersistentState("happening", true);
  const [showShortcuts, setShowShortcuts] = usePersistentState("showShortcuts", false);
  const [readingBudget, setReadingBudget] = usePersistentState("budget", 30);
  const [followedTags, setFollowedTags] = usePersistentState("tags", defaultFollowedTags);
  const [followedSources, setFollowedSources] = usePersistentState("sources", defaultFollowedSources);
  const [bookmarks, setBookmarks] = usePersistentState("bookmarks", []);
  const [history, setHistory] = usePersistentState("history", seedHistory);
  const [shortcuts, setShortcuts] = usePersistentState("shortcuts", defaultShortcuts);

  // Session state
  const [view, setView] = useState("feed"); // feed | following | explore | bookmarks | history | discussions
  const [tab, setTab] = useState(FOR_YOU);
  const [votes, setVotes] = useState({}); // postId -> 1 | -1 | 0
  const [pollVotes, setPollVotes] = useState({}); // postId -> optionId
  const [hidden, setHidden] = useState([]);
  const [comments, setComments] = useState({}); // postId -> [comment]
  const [openPostId, setOpenPostId] = useState(null);
  const [feedIds, setFeedIds] = useState([]); // order of the visible feed, for ← → in the post view
  const [notifications, setNotifications] = useState(initialNotifications);
  const [readToday, setReadToday] = useState(false);
  const [minutesRead, setMinutesRead] = useState(MINUTES_ALREADY_READ);
  const [usedSearch, setUsedSearch] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [modal, setModalState] = useState(null); // "search" | "settings" | "submit" | null

  // Actions read current values through this ref instead of closing over them
  const latest = useRef();
  latest.current = { bookmarks, history, tab, readToday };
  const counted = useRef(new Set()); // posts already counted toward today's minutes
  const toastId = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const actions = useMemo(() => {
    const toast = (message, action) => {
      const id = ++toastId.current;
      setToasts((t) => [...t.slice(-(MAX_TOASTS - 1)), { id, message, action }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), TOAST_MS);
    };

    const openPost = (id) => {
      setOpenPostId(id);
      setHistory((h) => [id, ...h.filter((x) => x !== id)]);
      if (!counted.current.has(id)) {
        counted.current.add(id);
        setMinutesRead((m) => m + readMinutes(postsById[id]));
      }
      if (!latest.current.readToday) {
        setReadToday(true);
        toast(`Streak extended to ${STREAK_DAYS + 1} days`);
      }
    };

    return {
      toast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
      toggleTheme: () => setDark((d) => !d),
      setSidebarOpen,
      setLayout,
      setShowHappening,
      setShowShortcuts,
      setShortcuts,
      setReadingBudget,
      setTab,
      setFeedIds,
      setModal: (m) => {
        if (m === "search") setUsedSearch(true);
        setModalState(m);
      },

      navigate: (nextView, nextTab) => {
        setView(nextView);
        setTab(nextTab ?? (nextView === "explore" ? "Popular" : FOR_YOU));
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      },

      toggleTag: (t) => {
        setFollowedTags((x) => toggleIn(x, t));
        if (latest.current.tab === t) setTab(FOR_YOU);
      },
      toggleSource: (s) => setFollowedSources((x) => toggleIn(x, s)),

      vote: (id, dir) => setVotes((v) => ({ ...v, [id]: v[id] === dir ? 0 : dir })),
      votePoll: (id, option) => setPollVotes((p) => ({ ...p, [id]: option })),

      toggleBookmark: (id) => {
        const saved = latest.current.bookmarks.includes(id);
        toast(saved ? "Removed from bookmarks" : "Added to bookmarks");
        // Newest first, like History
        setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [id, ...b]));
      },

      hidePost: (id) => {
        setHidden((h) => [...h, id]);
        toast("You won't see this post again", {
          label: "Undo",
          run: () => setHidden((h) => h.filter((x) => x !== id)),
        });
      },

      clearHistory: () => {
        const previous = latest.current.history;
        setHistory([]);
        toast("Reading history cleared", { label: "Undo", run: () => setHistory(previous) });
      },

      copyLink: (id) => {
        const url = `${window.location.origin}${window.location.pathname}?post=${id}`;
        if (!navigator.clipboard) return toast("Copying isn't available in this browser");
        navigator.clipboard.writeText(url).then(
          () => toast("Link copied to clipboard"),
          () => toast("Couldn't copy the link")
        );
      },

      openPost,
      closePost: () => setOpenPostId(null),

      addComment: (postId, text) =>
        setComments((c) => ({
          ...c,
          [postId]: [...(c[postId] ?? []), { id: `me-${Date.now()}`, author: "me", text, time: "now", upvotes: 0 }],
        })),

      markRead: (id) => setNotifications((n) => n.map((x) => (x.id === id ? { ...x, unread: false } : x))),
      markAllRead: () => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))),
    };
    // Setters from useState are stable, so this object is built once.
  }, [setBookmarks, setDark, setFollowedSources, setFollowedTags, setHistory, setLayout, setReadingBudget,
      setShortcuts, setShowHappening, setShowShortcuts, setSidebarOpen]);

  // Deep links: /?post=12 opens that post, and the URL follows the open post
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current) return; // StrictMode runs effects twice in development
    deepLinked.current = true;
    const id = Number(new URLSearchParams(window.location.search).get("post"));
    if (postsById[id]) actions.openPost(id);
  }, [actions]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (openPostId == null) url.searchParams.delete("post");
    else url.searchParams.set("post", openPostId);
    window.history.replaceState(null, "", url);
  }, [openPostId]);

  const state = useMemo(
    () => ({
      dark, sidebarOpen, layout, showHappening, showShortcuts, readingBudget, followedTags, followedSources,
      bookmarks, history, shortcuts, view, tab, votes, pollVotes, hidden, comments, openPostId, feedIds,
      notifications, readToday, minutesRead, usedSearch, toasts, modal,
      streak: STREAK_DAYS + (readToday ? 1 : 0),
    }),
    [dark, sidebarOpen, layout, showHappening, showShortcuts, readingBudget, followedTags, followedSources,
      bookmarks, history, shortcuts, view, tab, votes, pollVotes, hidden, comments, openPostId, feedIds,
      notifications, readToday, minutesRead, usedSearch, toasts, modal]
  );

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

// Actions only: never re-renders on state changes
export function useFeedActions() {
  return useContext(ActionsContext);
}

// State and actions together
export function useFeed() {
  return { ...useContext(StateContext), ...useContext(ActionsContext) };
}
