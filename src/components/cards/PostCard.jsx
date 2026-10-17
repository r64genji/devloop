import CardMenu from "./CardMenu";
import { ActionBar, BudgetSticker, CardTitle, ReadButton, SourceAvatar, Tags, Thumb, TypeBadge } from "./parts";
import { cardShell, postMeta } from "./shared";
import { sources } from "../../data";

// Article, video and collection card, in grid or list layout.
export default function PostCard({ post, layout = "grid" }) {
  const actions = (
    <span className="ml-auto flex items-center gap-1">
      <ReadButton post={post} />
      <CardMenu post={post} />
    </span>
  );

  if (layout === "list") {
    return (
      <article className={`${cardShell} flex gap-4 p-4`}>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-3 text-label text-muted">
            <SourceAvatar post={post} size="h-8 w-8 text-body" />
            <span className="ml-1 truncate font-bold text-ink" aria-hidden="true">
              {sources[post.source].name}
            </span>
            <TypeBadge type={post.type} />
            <span className="hidden sm:inline">{postMeta(post)}</span>
            {actions}
          </div>
          <CardTitle post={post} className="line-clamp-2 text-title" />
          <div className="flex flex-wrap items-center gap-3">
            <Tags tags={post.tags} />
            <BudgetSticker post={post} />
          </div>
          <ActionBar post={post} compact />
        </div>
        <Thumb post={post} className="hidden w-48 shrink-0 self-center sm:block lg:w-56" />
      </article>
    );
  }

  return (
    <article className={`${cardShell} flex flex-col p-2`}>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <SourceAvatar post={post} />
          <span className="ml-2">
            <TypeBadge type={post.type} />
          </span>
          {actions}
        </div>

        <CardTitle post={post} className="mt-4 line-clamp-3 text-title" />

        <div className="mt-3">
          <Tags tags={post.tags} />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted">{postMeta(post)}</p>
          <BudgetSticker post={post} />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-end">
        <Thumb post={post} />
      </div>

      <div className="px-2 pt-2">
        <ActionBar post={post} />
      </div>
    </article>
  );
}
