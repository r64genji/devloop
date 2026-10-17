import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, History, Eye, SearchX, Sparkles } from "lucide-react";
import PostCard from "./cards/PostCard";
import PollCard from "./cards/PollCard";
import AdCard from "./cards/AdCard";
import HappeningNow from "./HappeningNow";
import { Button } from "./ui";
import { FEED_PANEL_ID } from "./toolbar/FeedTabs";
import { FOR_YOU, posts, postsById } from "../data";
import { useFeed } from "../store";

const PAGE_SIZE = 8;
const LOAD_DELAY_MS = 700; // pretend network latency so the skeletons are visible
const score = (p) => p.upvotes + p.comments * 2;

function selectPosts({ view, tab, hidden, followedTags, followedSources, bookmarks, history }) {
  const visible = posts.filter((p) => !hidden.includes(p.id));
  const organic = visible.filter((p) => p.type !== "ad");
  const byIds = (ids) => ids.map((id) => postsById[id]).filter((p) => p && !hidden.includes(p.id));

  switch (view) {
    case "bookmarks":
      return byIds(bookmarks);
    case "history":
      return byIds(history);
    case "following":
      return organic.filter((p) => followedSources.includes(p.source));
    case "discussions":
      return [...organic].sort((a, b) => b.comments - a.comments);
    case "explore":
      if (tab === "Most upvoted") return [...organic].sort((a, b) => b.upvotes - a.upvotes);
      if (tab === "Best discussions") return [...organic].sort((a, b) => b.comments - a.comments);
      if (tab === "Latest") return organic;
      return [...organic].sort((a, b) => score(b) - score(a));
    default:
      if (tab !== FOR_YOU && followedTags.includes(tab)) return organic.filter((p) => p.tags.includes(tab));
      return visible;
  }
}

function SkeletonCard({ layout }) {
  const bar = "rounded-lg bg-raised";
  return (
    <div
      className={`animate-pulse rounded-2xl border border-line bg-surface ${
        layout === "list" ? "flex h-40 gap-4 p-4" : "flex h-96 flex-col p-6"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-11 w-11 rounded-full bg-raised" />
        <div className={`h-6 w-11/12 ${bar}`} />
        <div className={`h-6 w-2/3 ${bar}`} />
        <div className={`h-4 w-1/3 ${bar}`} />
        {layout !== "list" && <div className="mt-auto aspect-video rounded-xl bg-raised" />}
      </div>
    </div>
  );
}

const empties = {
  bookmarks: { icon: Bookmark, title: "Nothing saved yet", text: "Tap the bookmark icon on any post to keep it here for later." },
  history: { icon: History, title: "No reading history", text: "Posts you open will show up here so you can find them again." },
  following: { icon: Eye, title: "You're not following any sources", text: "Use the ⋯ menu on a post to follow its source." },
};

function Empty({ view, onExplore }) {
  const { icon: Icon, title, text } = empties[view] ?? {
    icon: SearchX,
    title: "No posts here yet",
    text: "Try another tab or follow more tags in Feed settings.",
  };
  return (
    <div className="mx-auto mt-10 flex max-w-sm flex-col items-center text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface">
        <Icon className="h-6 w-6 text-muted" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-title font-extrabold">{title}</h2>
      <p className="mt-2 text-muted">{text}</p>
      <Button className="mt-6" onClick={onExplore}>
        Explore posts
      </Button>
    </div>
  );
}

function renderCard(post, layout) {
  if (post.type === "poll") return <PollCard key={post.id} post={post} layout={layout} />;
  if (post.type === "ad") return <AdCard key={post.id} post={post} layout={layout} />;
  return <PostCard key={post.id} post={post} layout={layout} />;
}

export default function Feed() {
  const { view, tab, layout, showHappening, hidden, followedTags, followedSources, bookmarks, history, navigate, setFeedIds } =
    useFeed();
  const list = useMemo(
    () => selectPosts({ view, tab, hidden, followedTags, followedSources, bookmarks, history }),
    [view, tab, hidden, followedTags, followedSources, bookmarks, history]
  );

  const [count, setCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);

  useEffect(() => setCount(PAGE_SIZE), [view, tab]);

  // The post view's ← → follows the order of this feed
  useEffect(() => {
    setFeedIds(list.filter((p) => p.type !== "ad").map((p) => p.id));
  }, [list, setFeedIds]);

  // Infinite scroll: reveal the next page when the sentinel scrolls into view
  useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= list.length) return;
    let timer;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || timer) return;
        setLoading(true);
        timer = setTimeout(() => {
          setCount((c) => c + PAGE_SIZE);
          setLoading(false);
        }, LOAD_DELAY_MS);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      setLoading(false);
    };
  }, [count, list.length]);

  if (!list.length) return <Empty view={view} onExplore={() => navigate("explore")} />;

  const withHappening = view === "feed" && tab === FOR_YOU && showHappening;
  const shown = list.slice(0, count);
  const done = count >= list.length;

  return (
    <>
      <div
        id={FEED_PANEL_ID}
        role={view === "feed" || view === "explore" ? "tabpanel" : undefined}
        aria-busy={loading}
        className={
          layout === "list"
            ? "mx-auto mt-8 flex max-w-4xl flex-col gap-4"
            : "mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6 lg:gap-8 [&>*]:min-w-0"
        }
      >
        {withHappening && <HappeningNow />}
        {shown.map((p) => renderCard(p, layout))}
        {loading && Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} layout={layout} />)}
      </div>

      <div ref={sentinel} className="h-px" />
      {done && list.length > PAGE_SIZE && (
        <p className="mt-10 flex items-center justify-center gap-2 text-muted">
          <Sparkles className="h-4 w-4" aria-hidden="true" /> You're all caught up
        </p>
      )}
    </>
  );
}
