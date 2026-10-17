import { Check, Flame } from "lucide-react";
import Popover from "../Popover";
import BudgetBar from "../BudgetBar";
import { SectionLabel } from "../ui";
import { useFeed } from "../../store";

const STREAK_GOAL = 10; // days for a full ring
const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const TODAY = 4; // Friday in the mock week

function StreakRing({ days, done }) {
  return (
    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface">
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="22" cy="22" r={RADIUS} fill="none" strokeWidth="4" className="stroke-line" />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(days / STREAK_GOAL) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          className={`transition-all duration-700 ${done ? "stroke-brand" : "stroke-brand/60"}`}
        />
      </svg>
      <span className="text-label font-extrabold tabular-nums">{days}</span>
    </span>
  );
}

export default function StreakPopover() {
  const { streak, readToday } = useFeed();

  return (
    <Popover
      width="w-80"
      header
      label="Reading streak and budget"
      trigger={({ triggerProps }) => (
        <button type="button" {...triggerProps} aria-label={`${streak} day reading streak`} className="rounded-full">
          <StreakRing days={streak} done={readToday} />
        </button>
      )}
    >
      <div className="p-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand">
            <Flame className="h-6 w-6 text-on-brand" />
          </span>
          <div>
            <p className="text-title font-extrabold tabular-nums">{streak} days</p>
            <p className="text-label text-muted">Current reading streak</p>
          </div>
        </div>

        <ol className="mt-5 flex justify-between" aria-label="This week">
          {WEEK.map((d, i) => {
            const done = i < TODAY || (i === TODAY && readToday);
            return (
              <li key={i} className="flex flex-col items-center gap-2">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 ${
                    done ? "border-brand bg-brand text-on-brand" : i === TODAY ? "border-dashed border-strong" : "border-line"
                  }`}
                >
                  {done && <Check className="h-4 w-4" aria-label="Read" />}
                </span>
                <span className={`text-caption ${i === TODAY ? "font-extrabold text-ink" : "text-muted"}`}>{d}</span>
              </li>
            );
          })}
        </ol>

        <p className="mt-4 rounded-xl bg-raised px-3 py-2 text-label text-muted">
          {readToday ? "Nice! You read today. See you tomorrow." : "Read a post today to keep your streak alive."}
        </p>

        <hr className="my-4 border-line" />
        <SectionLabel className="mb-2">Safe to read today</SectionLabel>
        <BudgetBar />
      </div>
    </Popover>
  );
}
