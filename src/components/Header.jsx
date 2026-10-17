import { BriefcaseBusiness, Gift, Search } from "lucide-react";
import Logo from "./Logo";
import IconButton from "./IconButton";
import StreakPopover from "./header/StreakPopover";
import NotificationsPopover from "./header/NotificationsPopover";
import ProfileMenu from "./header/ProfileMenu";
import { useFeedActions } from "../store";

const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

export default function Header() {
  const { setModal, toast } = useFeedActions();

  return (
    <header className="sticky top-0 z-30 flex h-header items-center gap-3 border-b border-line bg-page/90 px-3 backdrop-blur md:px-4">
      <Logo />

      {/* Opens the command palette; looks like a search field */}
      <button
        type="button"
        onClick={() => setModal("search")}
        aria-label="Search posts and tags"
        aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
        className="ml-2 flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl bg-surface px-4 text-left text-muted transition-colors hover:bg-raised md:ml-8 md:max-w-xl"
      >
        <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-button">Search</span>
        <kbd className="hidden items-center gap-1 font-sans text-label md:flex">
          <span className="rounded-md border border-line px-2 py-1">{isMac ? "⌘" : "Ctrl"}</span>+
          <span className="rounded-md border border-line px-2 py-1">K</span>
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <span className="hidden md:block">
          <IconButton label="Jobs" onClick={() => toast("Jobs board coming soon")}>
            <BriefcaseBusiness className="h-5 w-5" />
          </IconButton>
        </span>
        <StreakPopover />
        <span className="hidden md:block">
          <IconButton label="Rewards" onClick={() => toast("You have 2 rewards to claim")}>
            <Gift className="h-5 w-5" />
          </IconButton>
        </span>
        <NotificationsPopover />
        <ProfileMenu />
      </div>
    </header>
  );
}
