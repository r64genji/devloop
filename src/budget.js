// Reading budget: the Finance Tracker's "safe to spend" idea applied to time.
// Each post is a purchase of minutes against today's budget.

const TIGHT_MARGIN = 5; // minutes left over that still count as comfortable

export function budgetFit(minutes, remaining) {
  if (!minutes) return null;
  if (minutes <= remaining - TIGHT_MARGIN) return "ok";
  if (minutes <= remaining) return "tight";
  return "over";
}

export const fitStyles = {
  ok: { label: "Fits today", className: "bg-sticker-ok rotate-tilt-left" },
  tight: { label: "Tight fit", className: "bg-sticker-tight rotate-tilt-right" },
  over: { label: "Over budget", className: "bg-sticker-over rotate-tilt-soft" },
};

// Status of the whole day, for the budget bar
export function dayStatus(used, budget) {
  const left = (budget - used) / budget;
  if (left >= 0.5) return { word: "On track", bar: "bg-health-good", sticker: "ok" };
  if (left > 0) return { word: "Getting tight", bar: "bg-health-tight", sticker: "tight" };
  return { word: "Over today", bar: "bg-health-over", sticker: "over" };
}
