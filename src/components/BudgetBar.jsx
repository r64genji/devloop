import { dayStatus, fitStyles } from "../budget";
import { useFeed } from "../store";
import { Sticker } from "./ui";

// "Safe to read today": minutes left against the daily reading budget.
export default function BudgetBar() {
  const { minutesRead, readingBudget } = useFeed();
  const left = Math.max(readingBudget - minutesRead, 0);
  const status = dayStatus(minutesRead, readingBudget);
  const pct = Math.min(minutesRead / readingBudget, 1) * 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-headline font-extrabold tabular-nums">
          {left}
          <span className="ml-1 text-label font-bold text-muted">min left today</span>
        </p>
        <Sticker className={fitStyles[status.sticker].className}>{status.word}</Sticker>
      </div>
      <div
        className="mt-2 h-3 overflow-hidden rounded bg-raised"
        role="progressbar"
        aria-label="Reading budget used"
        aria-valuemin={0}
        aria-valuemax={readingBudget}
        aria-valuenow={Math.min(minutesRead, readingBudget)}
      >
        <div className={`h-full rounded transition-[width] duration-500 ${status.bar}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-caption font-medium tabular-nums text-muted">
        {minutesRead} of {readingBudget} min read
      </p>
    </div>
  );
}
