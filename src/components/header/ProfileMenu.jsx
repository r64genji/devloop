import {
  Bookmark, Eye, Gem, History, LogOut, MessageCircleHeart, MessagesSquare, Moon, Settings, Sun, Trophy, User, Zap,
} from "lucide-react";
import Popover, { MenuItem } from "../Popover";
import { closeThen } from "../../hooks";
import { useFeed } from "../../store";

const stats = [
  { label: "Reputation", value: "510", icon: Zap },
  { label: "Cores", value: "1.1K", icon: Gem },
  { label: "Rank", value: "#82", icon: Trophy },
];

export default function ProfileMenu() {
  const { dark, toggleTheme, navigate, setModal, toast } = useFeed();

  return (
    <Popover
      width="w-72"
      header
      menu
      label="Profile"
      trigger={({ triggerProps }) => (
        <button
          type="button"
          {...triggerProps}
          aria-label="Open profile menu"
          className="flex items-center gap-4 rounded-xl border border-control bg-surface p-1 transition-colors hover:bg-raised lg:pl-3"
        >
          <span className="hidden items-center gap-2 text-label font-bold lg:flex">
            <span className="h-4 w-4 rounded-full border-2 border-dashed border-strong" />0
          </span>
          {stats.slice(0, 2).map(({ label, value, icon: Icon }) => (
            <span key={label} className="hidden items-center gap-2 text-label font-bold tabular-nums lg:flex">
              <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
              {value}
            </span>
          ))}
          <span className="h-9 w-9 rounded-lg bg-cat-travel" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center gap-3 rounded-xl bg-raised p-3">
            <span className="h-12 w-12 rounded-xl bg-cat-travel" />
            <div className="min-w-0">
              <p className="font-extrabold">Your profile</p>
              <p className="text-label text-muted">@you · joined 2024</p>
            </div>
          </div>
          <div className="my-2 grid grid-cols-3 gap-2 text-center">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-line py-2">
                <Icon className="mx-auto h-4 w-4 text-muted" aria-hidden="true" />
                <p className="mt-1 text-label font-extrabold tabular-nums">{value}</p>
                <p className="text-caption text-muted">{label}</p>
              </div>
            ))}
          </div>
          <MenuItem icon={User} onClick={closeThen(close, () => toast("Profile page coming soon"))}>Profile</MenuItem>
          <MenuItem icon={Eye} onClick={closeThen(close, () => navigate("following"))}>Following</MenuItem>
          <MenuItem icon={MessagesSquare} onClick={closeThen(close, () => navigate("discussions"))}>Discussions</MenuItem>
          <MenuItem icon={Bookmark} onClick={closeThen(close, () => navigate("bookmarks"))}>Bookmarks</MenuItem>
          <MenuItem icon={History} onClick={closeThen(close, () => navigate("history"))}>Reading history</MenuItem>
          <MenuItem
            icon={dark ? Sun : Moon}
            onClick={toggleTheme}
            right={<span className="text-label text-muted">{dark ? "Dark" : "Light"}</span>}
          >
            Appearance
          </MenuItem>
          <MenuItem icon={Settings} onClick={closeThen(close, () => setModal("settings"))}>Feed settings</MenuItem>
          <MenuItem icon={MessageCircleHeart} onClick={closeThen(close, () => toast("Thanks! Real people read every message"))}>
            Send feedback
          </MenuItem>
          <hr className="my-2 border-line" />
          <MenuItem icon={LogOut} danger onClick={closeThen(close, () => toast("Logged out (not really, this is a demo)"))}>
            Log out
          </MenuItem>
        </>
      )}
    </Popover>
  );
}
