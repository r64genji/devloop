import { MoreHorizontal, Share2, Bookmark, EyeOff, Flag, Plus, Check, MessageSquare } from "lucide-react";
import Popover, { MenuItem } from "../Popover";
import { closeThen } from "../../hooks";
import { sources } from "../../data";
import { useFeed } from "../../store";

// The "⋯" options menu on every card.
export default function CardMenu({ post }) {
  const { bookmarks, toggleBookmark, followedSources, toggleSource, hidePost, copyLink, toast, openPost } = useFeed();
  const source = sources[post.source];
  const following = followedSources.includes(post.source);
  const saved = bookmarks.includes(post.id);

  return (
    <div className="relative z-10">
      <Popover
        width="w-64"
        menu
        label="Post options"
        trigger={({ open, triggerProps }) => (
          <button
            type="button"
            {...triggerProps}
            aria-label="Post options"
            className={`grid h-11 w-11 place-items-center rounded-xl text-muted transition-colors hover:bg-raised hover:text-ink ${
              open ? "bg-raised text-ink" : ""
            }`}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuItem icon={Share2} onClick={closeThen(close, () => copyLink(post.id))}>Share via link</MenuItem>
            {post.type !== "ad" && (
              <>
                <MenuItem icon={MessageSquare} onClick={closeThen(close, () => openPost(post.id))}>Open discussion</MenuItem>
                <MenuItem icon={Bookmark} onClick={closeThen(close, () => toggleBookmark(post.id))}>
                  {saved ? "Remove from bookmarks" : "Save to bookmarks"}
                </MenuItem>
              </>
            )}
            <MenuItem
              icon={following ? Check : Plus}
              onClick={closeThen(close, () => {
                toggleSource(post.source);
                toast(following ? `Unfollowed ${source.name}` : `Following ${source.name}`);
              })}
            >
              {following ? "Unfollow" : "Follow"} {source.name}
            </MenuItem>
            <hr className="my-1 border-line" />
            <MenuItem icon={EyeOff} onClick={closeThen(close, () => hidePost(post.id))}>Not interested</MenuItem>
            <MenuItem icon={Flag} danger onClick={closeThen(close, () => toast("Thanks, our moderators will take a look"))}>
              Report
            </MenuItem>
          </>
        )}
      </Popover>
    </div>
  );
}
