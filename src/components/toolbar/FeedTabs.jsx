import { useEffect, useRef } from "react";
import { scrollBehavior } from "../../hooks";
import { useFeed } from "../../store";
import { chip } from "./styles";

export const FEED_PANEL_ID = "feed-panel";

// Scrollable tab row. Follows the ARIA tabs pattern: one tab in the Tab order,
// arrow keys / Home / End move between tabs.
export default function FeedTabs({ tabs, label }) {
  const { tab: active, setTab } = useFeed();
  const list = useRef(null);

  // Keep the selected tab visible, e.g. after jumping to a tag from search
  useEffect(() => {
    const el = list.current?.querySelector('[aria-selected="true"]');
    if (el) list.current.scrollTo({ left: el.offsetLeft - list.current.offsetLeft - 24, behavior: scrollBehavior() });
  }, [active]);

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const target = tabs[(next + tabs.length) % tabs.length];
    setTab(target.id);
    list.current.querySelector(`[data-tab="${target.id}"]`)?.focus();
  };

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="no-scrollbar flex min-w-0 flex-1 gap-3 overflow-x-auto"
    >
      {tabs.map(({ id, label: text }) => {
        const selected = id === active;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            data-tab={id}
            aria-selected={selected}
            aria-controls={FEED_PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => setTab(id)}
            className={`${chip} ${
              selected ? "border border-primary bg-primary text-on-primary" : "border border-control text-muted hover:text-ink"
            }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
