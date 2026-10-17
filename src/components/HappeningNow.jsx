import { ArrowRight } from "lucide-react";
import { happeningNow } from "../data";
import { useFeedActions } from "../store";

// The screen's one brand moment: a cornflower card with navy text throughout.
export default function HappeningNow() {
  const { toast } = useFeedActions();
  return (
    <section aria-labelledby="happening-now" className="flex flex-col rounded-2xl bg-brand p-4 text-on-brand md:p-5">
      <h2 id="happening-now" className="flex items-center gap-2 px-2 pt-2 text-overline font-extrabold uppercase">
        {/* Pulsing dot: this list updates live */}
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-brand opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-on-brand" />
        </span>
        Happening now
      </h2>

      <ul className="mt-3 flex-1 divide-y divide-on-brand/20">
        {happeningNow.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toast("Opening the full story")}
              className="block w-full rounded-lg px-2 py-3 text-left transition-colors hover:bg-on-brand/10 focus-visible:ring-on-brand focus-visible:ring-offset-brand"
            >
              <span className="block text-button font-extrabold leading-snug">{item.title}</span>
              <span className="mt-1 block text-caption font-medium">{item.time}</span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => toast("Live news page coming soon")}
        className="group mt-2 flex min-h-11 items-center justify-between rounded-xl bg-on-brand px-4 text-button font-extrabold text-brand focus-visible:ring-on-brand focus-visible:ring-offset-brand"
      >
        Read all
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </section>
  );
}
