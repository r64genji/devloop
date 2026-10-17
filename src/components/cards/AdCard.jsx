import { ArrowUpRight } from "lucide-react";
import CardMenu from "./CardMenu";
import PostThumb from "./PostThumb";
import { SourceAvatar } from "./parts";
import { Button } from "../ui";
import { useFeedActions } from "../../store";

// Sponsored slot. Same shell as a post card but with a "Promoted" label and a CTA.
export default function AdCard({ post, layout = "grid" }) {
  const { toast } = useFeedActions();
  const cta = (
    <Button variant="outline" onClick={() => toast("This is a demo ad slot")}>
      {post.cta} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
  const header = (avatarSize) => (
    <div className="flex items-center gap-3">
      <SourceAvatar post={post} size={avatarSize} />
      <span className="text-label font-bold text-muted">Promoted</span>
      <span className="ml-auto">
        <CardMenu post={post} />
      </span>
    </div>
  );

  if (layout === "list") {
    return (
      <article className="relative flex gap-4 rounded-2xl border border-line bg-surface p-4 has-[[aria-expanded=true]]:z-30" aria-label="Promoted">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {header("h-8 w-8 text-body")}
          <h3 className="text-title font-extrabold leading-snug">{post.title}</h3>
          <p className="text-muted">{post.summary}</p>
          <div className="mt-1 self-start">{cta}</div>
        </div>
        <PostThumb type={post.thumb} className="hidden w-48 shrink-0 self-center sm:block lg:w-56" />
      </article>
    );
  }

  return (
    <article className="relative flex flex-col rounded-2xl border border-line bg-surface p-2 has-[[aria-expanded=true]]:z-30" aria-label="Promoted">
      <div className="px-4 pt-4">
        {header("h-11 w-11 text-title")}
        <h3 className="mt-4 text-title font-extrabold leading-snug">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-muted">{post.summary}</p>
      </div>
      <div className="mt-3 flex flex-1 flex-col justify-end">
        <PostThumb type={post.thumb} />
      </div>
      <div className="flex flex-col p-2 pt-3">{cta}</div>
    </article>
  );
}
