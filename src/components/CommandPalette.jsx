import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Clock, Hash, FileText, CornerDownLeft, Compass, Bookmark, History, Eye, MessagesSquare } from "lucide-react";
import Modal from "./Modal";
import { allTags, posts, recentSearches, sources, tagLabel } from "../data";
import { useFeed } from "../store";

const LISTBOX_ID = "search-results";
const optionId = (i) => `search-option-${i}`;

// Every word of the query must appear somewhere in the text
const matches = (text, words) => words.every((w) => text.includes(w));

const jumps = [
  { label: "Explore popular posts", icon: Compass, view: "explore" },
  { label: "Following", icon: Eye, view: "following" },
  { label: "Discussions", icon: MessagesSquare, view: "discussions" },
  { label: "Your bookmarks", icon: Bookmark, view: "bookmarks" },
  { label: "Reading history", icon: History, view: "history" },
];

// Ctrl/Cmd + K search: posts, tags and quick navigation in one keyboard-driven list.
export default function CommandPalette() {
  const { setModal, openPost, navigate, followedTags, toggleTag } = useFeed();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef(null);
  const q = query.trim().toLowerCase();

  const items = useMemo(() => {
    const words = q.split(/\s+/).filter(Boolean);
    const run = (fn) => () => {
      setModal(null);
      fn();
    };
    const openTag = (t) =>
      run(() => {
        if (!followedTags.includes(t)) toggleTag(t);
        navigate("feed", t);
      });
    const search = (s) => () => {
      setQuery(s);
      setActive(0);
    };

    if (!words.length) {
      return [
        ...recentSearches.map((s) => ({ group: "Recent searches", icon: Clock, label: s, run: search(s) })),
        ...jumps.map((j) => ({ group: "Jump to", icon: j.icon, label: j.label, run: run(() => navigate(j.view)) })),
        ...["react", "rust", "ai"].map((t) => ({ group: "Popular tags", icon: Hash, label: tagLabel(t), run: openTag(t) })),
      ];
    }

    const postHits = posts
      .filter((p) => p.type !== "ad" && matches(`${p.title} ${p.summary ?? ""} ${p.tags.join(" ")}`.toLowerCase(), words))
      .slice(0, 6)
      .map((p) => ({ group: "Posts", icon: FileText, label: p.title, hint: sources[p.source].name, run: run(() => openPost(p.id)) }));
    const tagHits = allTags
      .filter((t) => matches(`${t} ${tagLabel(t)}`.toLowerCase(), words))
      .slice(0, 4)
      .map((t) => ({
        group: "Tags",
        icon: Hash,
        label: tagLabel(t),
        hint: followedTags.includes(t) ? "Following" : "Follow",
        run: openTag(t),
      }));
    return [...postHits, ...tagHits];
  }, [q, followedTags, navigate, openPost, setModal, toggleTag]);

  // Keep the highlighted option in view while moving with the arrow keys
  useEffect(() => {
    list.current?.querySelector(`#${optionId(active)}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && items[active]) {
      e.preventDefault();
      items[active].run();
    }
  };

  let lastGroup = null;

  return (
    <Modal onClose={() => setModal(null)} title="Search" size="max-w-2xl" position="top" bare>
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        <input
          data-autofocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search posts, tags and more"
          role="combobox"
          aria-label="Search"
          aria-expanded="true"
          aria-controls={LISTBOX_ID}
          aria-activedescendant={items[active] ? optionId(active) : undefined}
          aria-autocomplete="list"
          className="h-16 flex-1 bg-transparent text-button placeholder:text-muted focus:outline-none focus-visible:ring-0"
        />
        <kbd className="rounded-md border border-line px-2 py-1 font-sans text-caption text-muted">Esc</kbd>
      </div>

      <ul ref={list} id={LISTBOX_ID} className="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
        {items.length === 0 && (
          <li role="presentation" className="px-4 py-10 text-center text-muted">
            No results for “{query}”
          </li>
        )}
        {items.map((item, i) => {
          const header = item.group !== lastGroup ? item.group : null;
          lastGroup = item.group;
          const Icon = item.icon;
          return (
            <li key={`${item.group}-${item.label}`} role="presentation">
              {header && (
                <p role="presentation" className="px-3 pb-1 pt-3 text-overline font-extrabold uppercase text-muted">
                  {header}
                </p>
              )}
              <div
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={item.run}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${i === active ? "bg-raised" : ""}`}
              >
                <Icon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                <span className="flex-1 truncate font-medium">{item.label}</span>
                {item.hint && <span className="shrink-0 text-label text-muted">{item.hint}</span>}
                {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-4 border-t border-line px-5 py-3 text-caption text-muted">
        <span>↑ ↓ to navigate</span>
        <span>Enter to open</span>
        <span>Esc to close</span>
      </div>
    </Modal>
  );
}
