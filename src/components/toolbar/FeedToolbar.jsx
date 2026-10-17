import { Bookmark, Eye, History, MessagesSquare, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { FOR_YOU, exploreTabs, tagLabel } from "../../data";
import { useFeed } from "../../store";
import FeedTabs from "./FeedTabs";
import Checklist from "./Checklist";
import LayoutToggle from "./LayoutToggle";
import { outlineChip } from "./styles";

const headings = {
  bookmarks: { icon: Bookmark, title: "Bookmarks", sub: "Posts you saved for later, newest first" },
  history: { icon: History, title: "Reading history", sub: "Everything you opened, newest first" },
  following: { icon: Eye, title: "Following", sub: "Latest from the sources you follow" },
  discussions: { icon: MessagesSquare, title: "Discussions", sub: "The posts people can't stop talking about" },
};

// Bar above the feed: a page heading for list views, or tabs plus feed actions.
// Every action stays reachable on small screens; labels collapse to icons.
export default function FeedToolbar() {
  const { view, followedTags, setModal, showShortcuts, setShowShortcuts, history, clearHistory } = useFeed();

  if (headings[view]) {
    const { icon: Icon, title, sub } = headings[view];
    return (
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-title font-extrabold">{title}</h1>
          <p className="text-muted">{sub}</p>
        </div>
        {view === "history" && history.length > 0 && (
          <button type="button" onClick={clearHistory} className={outlineChip}>
            <Trash2 className="h-5 w-5" aria-hidden="true" /> Clear history
          </button>
        )}
        <LayoutToggle />
      </div>
    );
  }

  const explore = view === "explore";
  const tabs = explore
    ? exploreTabs.map((t) => ({ id: t, label: t }))
    : [{ id: FOR_YOU, label: FOR_YOU }, ...followedTags.map((t) => ({ id: t, label: tagLabel(t) }))];

  return (
    <div className="flex items-center gap-3">
      <h1 className="sr-only">{explore ? "Explore" : "My feed"}</h1>
      <FeedTabs tabs={tabs} label={explore ? "Sort posts" : "Feeds"} />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setModal("settings")}
          aria-label="Feed settings"
          className={`${outlineChip} w-14 justify-center px-0 xl:w-auto xl:px-4`}
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          <span className="hidden xl:inline">Feed settings</span>
        </button>
        {!explore && (
          <span className="hidden xl:block">
            <button
              type="button"
              aria-pressed={showShortcuts}
              onClick={() => setShowShortcuts(!showShortcuts)}
              className={`${outlineChip} ${showShortcuts ? "bg-surface" : ""}`}
            >
              <Plus className={`h-5 w-5 transition-transform ${showShortcuts ? "rotate-45" : ""}`} aria-hidden="true" />
              Shortcuts
            </button>
          </span>
        )}
        <span className="hidden sm:block">
          <Checklist />
        </span>
        <span className="hidden lg:block">
          <LayoutToggle />
        </span>
      </div>
    </div>
  );
}
