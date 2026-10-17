import { useFeedActions } from "../store";

const avatars = ["bg-cat-groceries", "bg-cat-bills", "bg-cat-gifts"];

// Floating feedback button. Hidden on phones, where it would cover card actions;
// "Send feedback" lives in the profile menu there.
export default function FeedbackButton() {
  const { toast } = useFeedActions();
  return (
    <button
      type="button"
      onClick={() => toast("Thanks! Real people read every message")}
      className="fixed bottom-4 right-6 z-20 hidden items-center gap-4 rounded-2xl bg-primary px-4 py-3 text-left text-on-primary transition-transform hover:-translate-y-1 md:flex"
    >
      <span>
        <span className="block text-button font-extrabold">Feedback</span>
        <span className="block text-caption font-medium opacity-80">Real people reply</span>
      </span>
      <span className="flex -space-x-3" aria-hidden="true">
        {avatars.map((c) => (
          <span key={c} className={`h-10 w-10 rounded-full border-2 border-primary ${c}`} />
        ))}
      </span>
    </button>
  );
}
