import { useFeedActions } from "../store";

// Original logo mark: two overlapping loops. Takes you back to My feed.
export default function Logo() {
  const { navigate } = useFeedActions();
  return (
    <button
      type="button"
      onClick={() => navigate("feed")}
      className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg"
      aria-label="devloop, go to My feed"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="12" cy="16" r="7" fill="none" strokeWidth="3.5" className="stroke-current" />
        <circle cx="20" cy="16" r="7" fill="none" strokeWidth="3.5" className="stroke-brand" />
      </svg>
      <span className="hidden text-title font-extrabold sm:inline">devloop</span>
    </button>
  );
}
