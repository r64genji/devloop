import { BarChart3, Check } from "lucide-react";
import CardMenu from "./CardMenu";
import { ActionBar, CardTitle, SourceAvatar } from "./parts";
import { cardShell } from "./shared";
import { sources } from "../../data";
import { useFeed } from "../../store";

// Votable poll. `embedded` is the version shown inside the post view.
export default function PollCard({ post, layout = "grid", embedded = false, onComments }) {
  const { pollVotes, votePoll } = useFeed();
  const choice = pollVotes[post.id];
  const showResults = Boolean(choice) || post.ended;
  const total = post.options.reduce((n, o) => n + o.votes, 0) + (choice ? 1 : 0);
  const list = layout === "list";

  return (
    <article className={`${cardShell} flex flex-col ${list ? "p-4" : "p-2"}`}>
      <div className={list ? "" : "px-4 pt-4"}>
        <div className="flex items-center gap-2">
          <SourceAvatar post={post} size={list ? "h-8 w-8 text-body" : "h-11 w-11 text-title"} />
          {list && (
            <span className="ml-1 font-bold" aria-hidden="true">
              {sources[post.source].name}
            </span>
          )}
          <span className="ml-2 inline-flex items-center gap-1 rounded bg-raised px-2 py-1 text-caption font-extrabold">
            <BarChart3 className="h-3 w-3" aria-hidden="true" /> Poll
          </span>
          <span className="ml-auto">
            <CardMenu post={post} />
          </span>
        </div>

        {embedded ? (
          <h3 className="mt-4 text-title font-extrabold leading-snug">{post.title}</h3>
        ) : (
          <CardTitle post={post} className="mt-4 text-title" />
        )}

        <div className="mt-4 space-y-2" role="group" aria-label="Poll options">
          {post.options.map((o) => {
            const votes = o.votes + (choice === o.id ? 1 : 0);
            const pct = Math.round((votes / total) * 100);
            const mine = choice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                disabled={showResults}
                aria-pressed={mine}
                onClick={() => votePoll(post.id, o.id)}
                className={`relative z-10 flex h-11 w-full items-center overflow-hidden rounded-xl border px-4 text-left font-bold transition-colors ${
                  mine ? "border-ink" : "border-control"
                } ${showResults ? "cursor-default" : "hover:border-ink hover:bg-raised"}`}
              >
                {showResults && (
                  <span
                    className={`absolute inset-y-0 left-0 transition-[width] duration-700 ${mine ? "bg-brand" : "bg-raised"}`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative flex-1">{o.label}</span>
                {mine && <Check className="relative mr-2 h-4 w-4" aria-label="Your vote" />}
                {showResults && <span className="relative text-label tabular-nums text-muted">{pct}%</span>}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-label tabular-nums text-muted">
          {total.toLocaleString()} votes • {post.endsIn}
        </p>
      </div>

      <div className={`mt-auto ${list ? "pt-3" : "px-2 pt-3"}`}>
        <ActionBar post={post} compact={list} onComments={onComments} />
      </div>
    </article>
  );
}
