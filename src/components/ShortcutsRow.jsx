import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useFeed } from "../store";

const colors = ["bg-cat-groceries", "bg-cat-subscriptions", "bg-cat-health", "bg-cat-home", "bg-cat-shopping", "bg-cat-education"];

// Row of quick links to the user's favourite sites, toggled by "Shortcuts".
export default function ShortcutsRow() {
  const { shortcuts, setShortcuts, toast } = useFeed();
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");

  const add = (e) => {
    e.preventDefault();
    let parsed;
    try {
      parsed = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`);
    } catch {
      toast("That doesn't look like a valid URL");
      return;
    }
    const name = parsed.hostname.replace(/^www\./, "");
    setShortcuts((s) => [
      ...s,
      { id: `${Date.now()}`, name, url: parsed.href, color: colors[s.length % colors.length] },
    ]);
    setUrl("");
    setAdding(false);
  };

  return (
    <div className="mt-6 flex flex-wrap items-start gap-4 rounded-2xl border border-line bg-surface p-4">
      {shortcuts.map((s) => (
        <div key={s.id} className="group relative">
          <a href={s.url} target="_blank" rel="noreferrer" className="flex w-16 flex-col items-center gap-2">
            <span
              className={`grid h-12 w-12 place-items-center rounded-xl text-title font-extrabold uppercase text-white transition-transform group-hover:-translate-y-0.5 ${s.color}`}
            >
              {s.name[0]}
            </span>
            <span className="w-full truncate text-center text-caption text-muted">{s.name}</span>
          </a>
          <button
            type="button"
            aria-label={`Remove ${s.name}`}
            onClick={() => setShortcuts((list) => list.filter((x) => x.id !== s.id))}
            className="absolute -right-3 -top-3 hidden h-8 w-8 place-items-center rounded-full border border-control bg-surface text-muted hover:text-ink focus-visible:grid group-hover:grid group-focus-within:grid"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={add} className="flex h-12 items-center gap-2">
          <input
            autoFocus
            aria-label="Shortcut URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="h-11 w-48 rounded-xl border border-strong bg-page px-3 text-label focus:border-focus focus:outline-none"
          />
          <button type="submit" className="h-11 rounded-xl bg-primary px-4 text-label font-extrabold text-on-primary">
            Add
          </button>
          <button type="button" onClick={() => setAdding(false)} className="h-11 px-2 text-label font-bold text-muted hover:text-ink">
            Cancel
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="flex w-16 flex-col items-center gap-2">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-dashed border-strong text-muted transition-colors hover:border-muted hover:text-ink">
            <Plus className="h-5 w-5" />
          </span>
          <span className="text-caption text-muted">Add</span>
        </button>
      )}
    </div>
  );
}
