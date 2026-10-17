import { LayoutGrid, Rows3 } from "lucide-react";
import { useFeed } from "../../store";

const options = [
  { id: "grid", icon: LayoutGrid, label: "Grid view" },
  { id: "list", icon: Rows3, label: "List view" },
];

export default function LayoutToggle() {
  const { layout, setLayout } = useFeed();
  return (
    <div role="group" aria-label="Layout" className="flex h-14 shrink-0 items-center gap-1 rounded-2xl border border-control p-1">
      {options.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-pressed={layout === id}
          onClick={() => setLayout(id)}
          className={`grid h-full w-11 place-items-center rounded-xl transition-colors ${
            layout === id ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
