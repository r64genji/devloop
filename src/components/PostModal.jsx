import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Plus, Check, ArrowBigUp, Sparkles } from "lucide-react";
import Modal from "./Modal";
import PollCard from "./cards/PollCard";
import { ActionBar, BudgetSticker, SourceAvatar, Thumb } from "./cards/parts";
import { postMeta } from "./cards/shared";
import { Button, SectionLabel, TagPill } from "./ui";
import { getAuthor, posts, postsById, sampleComments, sources } from "../data";
import { useFeed } from "../store";

const COMMENT_BOX_ID = "comment-box";
const allReadable = posts.filter((p) => p.type !== "ad").map((p) => p.id);
const me = { name: "You", color: "bg-cat-travel" };

function Comment({ comment }) {
  const [up, setUp] = useState(false);
  const author = comment.author === "me" ? me : getAuthor(comment.author);
  return (
    <li className="flex gap-3">
      <span className={`h-9 w-9 shrink-0 rounded-full ${author.color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-label">
          <span className="font-bold">{author.name}</span>
          <span className="text-muted"> · {comment.time}</span>
        </p>
        <p className="mt-1">{comment.text}</p>
        <button
          type="button"
          onClick={() => setUp((u) => !u)}
          aria-pressed={up}
          aria-label={`Upvote comment, ${comment.upvotes + (up ? 1 : 0)} upvotes`}
          className={`mt-1 flex min-h-11 items-center gap-1 rounded-lg px-2 text-label font-bold tabular-nums transition-colors hover:bg-raised ${
            up ? "bg-raised text-ink" : "text-muted"
          }`}
        >
          <ArrowBigUp className={`h-5 w-5 ${up ? "fill-current" : ""}`} aria-hidden="true" />
          {comment.upvotes + (up ? 1 : 0)}
        </button>
      </div>
    </li>
  );
}

function Discussion({ post }) {
  const { comments, addComment, toast } = useFeed();
  const [draft, setDraft] = useState("");
  const thread = [...sampleComments, ...(comments[post.id] ?? [])];

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addComment(post.id, draft.trim());
    setDraft("");
    toast("Comment posted");
  };

  return (
    <section className="mt-8" aria-labelledby="discussion-title">
      <h2 id="discussion-title" className="text-button font-extrabold">
        Discussion
      </h2>
      <form onSubmit={submit} className="mt-4 flex gap-3">
        <span className={`h-9 w-9 shrink-0 rounded-full ${me.color}`} aria-hidden="true" />
        <div className="flex-1 rounded-2xl border border-strong bg-page p-2 focus-within:border-focus">
          <textarea
            id={COMMENT_BOX_ID}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && submit(e)}
            rows={2}
            aria-label="Write a comment"
            placeholder="Share your thoughts"
            className="w-full resize-none bg-transparent px-2 py-1 placeholder:text-muted focus:outline-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between gap-2 px-2">
            <span className="text-caption text-muted">Ctrl + Enter to post</span>
            <Button type="submit" disabled={!draft.trim()} className="text-label">
              Comment
            </Button>
          </div>
        </div>
      </form>
      <ul className="mt-6 space-y-5">
        {thread.map((c) => (
          <Comment key={`${post.id}-${c.id}`} comment={c} />
        ))}
      </ul>
    </section>
  );
}

export default function PostModal() {
  const { openPostId, openPost, closePost, followedSources, toggleSource, feedIds, toast } = useFeed();
  const top = useRef(null);
  const post = postsById[openPostId];

  // ← → walk through the feed the post was opened from
  const order = feedIds.includes(openPostId) ? feedIds : allReadable;
  const index = order.indexOf(openPostId);
  const prevId = order[index - 1];
  const nextId = order[index + 1];

  useEffect(() => {
    top.current?.closest('[role="dialog"]')?.parentElement?.scrollTo({ top: 0 });
  }, [openPostId]);

  if (!post) return null;

  const onKey = (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight" && nextId) openPost(nextId);
    if (e.key === "ArrowLeft" && prevId) openPost(prevId);
  };

  const source = sources[post.source];
  const author = post.author && getAuthor(post.author);
  const following = followedSources.includes(post.source);
  const focusCommentBox = () => document.getElementById(COMMENT_BOX_ID)?.focus();
  const navBtn =
    "grid h-11 w-11 place-items-center rounded-xl border border-control text-muted transition-colors hover:bg-raised hover:text-ink disabled:opacity-40";

  return (
    <Modal onClose={closePost} onKey={onKey} title={post.title} size="max-w-3xl" bare>
      <div ref={top} className="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-6">
        <button type="button" className={navBtn} aria-label="Previous post" disabled={!prevId} onClick={() => openPost(prevId)}>
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" className={navBtn} aria-label="Next post" disabled={!nextId} onClick={() => openPost(nextId)}>
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="ml-1 hidden text-label text-muted sm:inline">Use ← → to browse</span>
        <Button className="ml-auto" onClick={() => toast("Opening the original post in a new tab")}>
          {post.type === "video" ? "Watch video" : "Read post"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <button type="button" onClick={closePost} aria-label="Close" className={navBtn}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-4 py-6 sm:px-8">
        <div className="flex items-center gap-4">
          <SourceAvatar post={post} />
          <div className="ml-1 min-w-0 flex-1">
            <p className="truncate font-extrabold">{source.name}</p>
            {author && <p className="truncate text-label text-muted">by {author.name}</p>}
          </div>
          <Button
            variant={following ? "outline" : "primary"}
            aria-pressed={following}
            onClick={() => toggleSource(post.source)}
            className="text-label"
          >
            {following ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {following ? "Following" : "Follow"}
          </Button>
        </div>

        {post.type === "poll" ? (
          <div className="mt-6">
            <PollCard post={post} layout="list" embedded onComments={focusCommentBox} />
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-headline font-extrabold">{post.title}</h1>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => (
                <TagPill key={t} tag={t} />
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-muted">{postMeta(post)}</p>
              <BudgetSticker post={post} />
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-page p-5">
              <SectionLabel className="flex items-center gap-2 text-ink">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> TL;DR
              </SectionLabel>
              <p className="mt-2 text-muted">{post.summary}</p>
            </div>

            {post.type === "collection" && (
              <div className="mt-6">
                <p className="font-extrabold">Sources in this collection</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {post.collectionSources.map((id) => (
                    <li key={id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                      <span
                        aria-hidden="true"
                        className={`grid h-8 w-8 place-items-center rounded-full font-extrabold text-white ${sources[id].color}`}
                      >
                        {sources[id].letter}
                      </span>
                      <span className="font-medium">{sources[id].name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="group mt-6">
              <Thumb post={post} />
            </div>

            <div className="mt-4 border-y border-line py-2">
              <ActionBar post={post} onComments={focusCommentBox} />
            </div>
          </>
        )}

        <Discussion key={post.id} post={post} />
      </div>
    </Modal>
  );
}
