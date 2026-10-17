import { ArrowBigDown, ArrowBigUp, ArrowUpRight, Bookmark, Layers, Link2, MessageSquare, Play } from "lucide-react";
import PostThumb from "./PostThumb";
import { Sticker, TagPill } from "../ui";
import { budgetFit, fitStyles } from "../../budget";
import { getAuthor, readMinutes, sources } from "../../data";
import { useFeed } from "../../store";

// Components shared by the feed cards and the post view.

export function CardTitle({ post, className = "" }) {
  const { openPost } = useFeed();
  return (
    <h3 className={`font-extrabold leading-snug ${className}`}>
      <button
        type="button"
        onClick={() => openPost(post.id)}
        className="inline text-left after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:ring-0 focus-visible:after:ring-2 focus-visible:after:ring-focus"
      >
        {post.title}
      </button>
    </h3>
  );
}

function Action({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`relative z-10 flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 font-bold tabular-nums transition-colors hover:bg-raised ${
        active ? "bg-raised text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

// Upvote / downvote / comments / bookmark / copy link
export function ActionBar({ post, compact = false, onComments }) {
  const { votes, vote, bookmarks, toggleBookmark, copyLink, comments, openPost } = useFeed();
  const v = votes[post.id] ?? 0;
  const saved = bookmarks.includes(post.id);
  const commentCount = post.comments + (comments[post.id]?.length ?? 0);
  const big = compact ? "h-5 w-5" : "h-6 w-6";
  const small = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center ${compact ? "gap-1 text-label" : "justify-between"}`}>
      <Action label="Upvote" active={v === 1} onClick={() => vote(post.id, 1)}>
        {/* Changing the key remounts the icon so the pop animation replays */}
        <ArrowBigUp key={v === 1} className={`${big} ${v === 1 ? "animate-pop fill-current" : ""}`} aria-hidden="true" />
        {post.upvotes + (v === 1 ? 1 : 0)}
      </Action>
      <Action label="Downvote" active={v === -1} onClick={() => vote(post.id, -1)}>
        <ArrowBigDown className={`${big} ${v === -1 ? "fill-current" : ""}`} aria-hidden="true" />
      </Action>
      <Action label="Comments" onClick={onComments ?? (() => openPost(post.id))}>
        <MessageSquare className={small} aria-hidden="true" />
        {commentCount}
      </Action>
      <Action label="Bookmark" active={saved} onClick={() => toggleBookmark(post.id)}>
        <Bookmark className={`${small} ${saved ? "fill-current" : ""}`} aria-hidden="true" />
      </Action>
      <Action label="Copy link" onClick={() => copyLink(post.id)}>
        <Link2 className={small} aria-hidden="true" />
      </Action>
    </div>
  );
}

// Source logo with the author's avatar tucked into the corner, like a byline.
export function SourceAvatar({ post, size = "h-11 w-11 text-title" }) {
  const source = sources[post.source];
  const author = post.author && getAuthor(post.author);
  const letter = (s) => `grid ${size} place-items-center rounded-full font-extrabold text-white ring-2 ring-surface ${s.color}`;

  if (post.type === "collection") {
    return (
      <span className="flex -space-x-3">
        <span className="sr-only">From {post.collectionSources.map((id) => sources[id].name).join(", ")}</span>
        {post.collectionSources.map((id) => (
          <span key={id} aria-hidden="true" className={letter(sources[id])}>
            {sources[id].letter}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="relative inline-flex" title={author ? `${source.name} · ${author.name}` : source.name}>
      <span className="sr-only">{author ? `${source.name}, by ${author.name}` : source.name}</span>
      <span aria-hidden="true" className={letter(source)}>
        {source.letter}
      </span>
      {author && <span aria-hidden="true" className={`absolute -bottom-1 -right-2 h-6 w-6 rounded-full border-2 border-surface ${author.color}`} />}
    </span>
  );
}

export function TypeBadge({ type }) {
  const badges = {
    video: { icon: Play, label: "Video" },
    collection: { icon: Layers, label: "Collection" },
  };
  const badge = badges[type];
  if (!badge) return null;
  const Icon = badge.icon;
  return (
    <span className="inline-flex items-center gap-1 rounded bg-raised px-2 py-1 text-caption font-extrabold text-ink">
      <Icon className="h-3 w-3" aria-hidden="true" /> {badge.label}
    </span>
  );
}

// How a post fits today's reading budget, as a tilted sticker
export function BudgetSticker({ post }) {
  const { minutesRead, readingBudget } = useFeed();
  const fit = budgetFit(readMinutes(post), readingBudget - minutesRead);
  if (!fit) return null;
  const { label, className } = fitStyles[fit];
  return <Sticker className={className}>{label}</Sticker>;
}

export function Tags({ tags, max = 3 }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.slice(0, max).map((tag) => (
        <TagPill key={tag} tag={tag} />
      ))}
      {tags.length > max && <li className="rounded-lg border border-line px-2 py-1 text-label text-muted">+{tags.length - max}</li>}
    </ul>
  );
}

export function Thumb({ post, className }) {
  return (
    <PostThumb type={post.thumb} className={className}>
      {post.type === "video" && (
        <>
          <span className="absolute inset-0 grid place-items-center bg-on-brand/20">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-on-brand transition-transform group-hover:scale-110">
              <Play className="ml-1 h-5 w-5 fill-current" aria-hidden="true" />
            </span>
          </span>
          <span className="absolute bottom-2 right-2 rounded bg-on-brand px-2 py-1 text-caption font-bold tabular-nums text-white">
            {post.readTime}
          </span>
        </>
      )}
    </PostThumb>
  );
}

// "Read post" only appears on hover-capable devices; touch users tap the card.
export function ReadButton({ post }) {
  const { toast } = useFeed();
  return (
    <button
      type="button"
      onClick={() => toast(`Opening “${post.title.slice(0, 40)}…” in a new tab`)}
      className="relative z-10 hidden min-h-11 items-center gap-1 rounded-xl bg-primary px-3 text-label font-extrabold text-on-primary opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex"
    >
      {post.type === "video" ? "Watch" : "Read post"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
