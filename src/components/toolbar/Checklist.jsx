import { Check, ShieldCheck } from "lucide-react";
import Popover from "../Popover";
import { Button } from "../ui";
import { defaultFollowedTags } from "../../data";
import { useFeed } from "../../store";
import { outlineChip } from "./styles";

// "Get started" checklist. Every task ticks itself off when you actually do it.
export default function Checklist() {
  const { followedTags, readToday, votes, bookmarks, usedSearch, toast } = useFeed();
  const tasks = [
    { label: "Follow a new tag", done: followedTags.some((t) => !defaultFollowedTags.includes(t)) },
    { label: "Read a post today", done: readToday },
    { label: "Upvote a post", done: Object.values(votes).includes(1) },
    { label: "Bookmark a post", done: bookmarks.length > 0 },
    { label: "Search with Ctrl + K", done: usedSearch },
  ];
  const done = tasks.filter((t) => t.done).length;
  const complete = done === tasks.length;

  return (
    <Popover
      width="w-80"
      label="Get started"
      trigger={({ triggerProps }) => (
        <button
          type="button"
          {...triggerProps}
          className={`${outlineChip} tabular-nums`}
          aria-label={`Get started checklist, ${done} of ${tasks.length} done`}
        >
          <ShieldCheck className="h-6 w-6" aria-hidden="true" /> {done}/{tasks.length}
        </button>
      )}
    >
      <div className="p-3">
        <h3 className="text-button font-extrabold">Get started</h3>
        <p className="text-label text-muted">Finish these to unlock your profile badge.</p>
        <div className="mt-3 h-2 overflow-hidden rounded bg-raised">
          <div className="h-full rounded bg-primary transition-[width] duration-500" style={{ width: `${(done / tasks.length) * 100}%` }} />
        </div>
        <ul className="mt-3 space-y-1">
          {tasks.map((t) => (
            <li key={t.label} className="flex items-center gap-3 rounded-lg px-1 py-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                  t.done ? "border-primary bg-primary text-on-primary" : "border-strong"
                }`}
              >
                {t.done && <Check className="h-4 w-4" strokeWidth={3} aria-label="Done" />}
              </span>
              <span className={t.done ? "text-muted line-through" : "font-medium"}>{t.label}</span>
            </li>
          ))}
        </ul>
        {complete && (
          <Button className="mt-3 w-full" onClick={() => toast("Badge claimed")}>
            Claim your badge
          </Button>
        )}
      </div>
    </Popover>
  );
}
