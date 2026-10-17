import { useId, useState } from "react";
import { Check, Hash, LayoutGrid, Rows3, Search } from "lucide-react";
import Modal from "./Modal";
import BudgetBar from "./BudgetBar";
import { TextField } from "./ui";
import { allTags, tagLabel } from "../data";
import { useFeed } from "../store";

const sections = [
  { id: "tags", label: "Tags" },
  { id: "layout", label: "Layout" },
  { id: "budget", label: "Reading budget" },
];

function Toggle({ checked, onChange, label, description }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line p-4">
      <div>
        <p id={`${id}-label`} className="font-bold">
          {label}
        </p>
        <p id={`${id}-desc`} className="text-label text-muted">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "border border-strong bg-raised"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-surface transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function TagsSection() {
  const { followedTags, toggleTag } = useFeed();
  const [filter, setFilter] = useState("");
  const tags = allTags.filter((t) => tagLabel(t).toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      <p className="text-muted">
        Follow tags to shape <span className="font-bold text-ink">For you</span>. Followed tags also appear as tabs above your feed.
      </p>
      <TextField
        icon={Search}
        className="mt-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter tags"
        aria-label="Filter tags"
      />
      <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-y-auto p-1">
        {tags.map((t) => {
          const on = followedTags.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => toggleTag(t)}
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 font-bold transition-colors ${
                on ? "border-primary bg-primary text-on-primary" : "border-control text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {on ? <Check className="h-4 w-4" aria-hidden="true" /> : <Hash className="h-4 w-4" aria-hidden="true" />}
              {tagLabel(t)}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-label tabular-nums text-muted">{followedTags.length} tags followed</p>
    </>
  );
}

function LayoutSection() {
  const { layout, setLayout, showHappening, setShowHappening, showShortcuts, setShowShortcuts, dark, toggleTheme } = useFeed();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Card layout">
        {[
          { id: "grid", icon: LayoutGrid, label: "Cards", text: "Big thumbnails in a grid" },
          { id: "list", icon: Rows3, label: "List", text: "Compact rows, more per screen" },
        ].map(({ id, icon: Icon, label, text }) => (
          <button
            key={id}
            type="button"
            aria-pressed={layout === id}
            onClick={() => setLayout(id)}
            className={`rounded-xl border-2 p-4 text-left transition-colors ${
              layout === id ? "border-ink bg-raised" : "border-control hover:border-ink"
            }`}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            <p className="mt-2 font-bold">{label}</p>
            <p className="text-label text-muted">{text}</p>
          </button>
        ))}
      </div>
      <Toggle label="Show Happening Now" description="Breaking tech news at the top of For you" checked={showHappening} onChange={setShowHappening} />
      <Toggle label="Show shortcuts" description="Quick links to your favourite sites above the feed" checked={showShortcuts} onChange={setShowShortcuts} />
      <Toggle label="Dark mode" description="Easier on the eyes at night" checked={dark} onChange={toggleTheme} />
    </div>
  );
}

function BudgetSection() {
  const { readingBudget, setReadingBudget } = useFeed();
  return (
    <div className="space-y-5">
      <p className="text-muted">
        Like a spending budget, but for your time. Every post shows a sticker for how it fits what's left of today.
      </p>
      <div>
        <label htmlFor="budget" className="flex justify-between text-label font-bold">
          Daily reading budget <span className="tabular-nums">{readingBudget} min</span>
        </label>
        <input
          id="budget"
          type="range"
          min={10}
          max={90}
          step={5}
          value={readingBudget}
          onChange={(e) => setReadingBudget(Number(e.target.value))}
          className="mt-3 w-full accent-[rgb(var(--primary))]"
        />
      </div>
      <BudgetBar />
    </div>
  );
}

export default function FeedSettings() {
  const { setModal } = useFeed();
  const [section, setSection] = useState("tags");
  const base = useId();

  const onKeyDown = (e) => {
    const i = sections.findIndex((s) => s.id === section);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key];
    if (next === undefined) return;
    const target = sections[(next + sections.length) % sections.length];
    setSection(target.id);
    document.getElementById(`${base}-${target.id}`)?.focus();
  };

  return (
    <Modal onClose={() => setModal(null)} title="Feed settings" size="max-w-2xl">
      <div role="tablist" aria-label="Settings sections" onKeyDown={onKeyDown} className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line px-5 pt-3">
        {sections.map((s) => (
          <button
            key={s.id}
            id={`${base}-${s.id}`}
            type="button"
            role="tab"
            aria-selected={section === s.id}
            aria-controls={`${base}-panel`}
            tabIndex={section === s.id ? 0 : -1}
            onClick={() => setSection(s.id)}
            className={`-mb-px min-h-11 shrink-0 whitespace-nowrap border-b-2 px-3 font-bold transition-colors ${
              section === s.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-${section}`} className="p-5">
        {section === "tags" && <TagsSection />}
        {section === "layout" && <LayoutSection />}
        {section === "budget" && <BudgetSection />}
      </div>
    </Modal>
  );
}
