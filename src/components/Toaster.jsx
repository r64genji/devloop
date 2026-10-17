import { X } from "lucide-react";
import { useFeed } from "../store";

// Stack of short-lived messages above the mobile tab bar
export default function Toaster() {
  const { toasts, dismissToast } = useFeed();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-toast flex flex-col items-center gap-2 px-4 md:bottom-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex max-w-full animate-rise items-center gap-3 rounded-xl bg-primary py-1 pl-4 pr-1 font-bold text-on-primary"
        >
          <span className="py-2">{t.message}</span>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action.run();
                dismissToast(t.id);
              }}
              className="min-h-11 rounded-lg px-2 font-extrabold underline underline-offset-2 hover:bg-on-primary/10"
            >
              {t.action.label}
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
            className="grid h-11 w-11 place-items-center rounded-lg opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
