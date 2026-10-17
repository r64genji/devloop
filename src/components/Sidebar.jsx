import { useState } from "react";
import {
  PanelLeft, PanelLeftClose, Plus, Home, Eye, Compass, Bookmark, History,
  Hash, Rss, Trophy, MessagesSquare, Link2, Lightbulb, Joystick, Settings,
} from "lucide-react";
import { squads } from "../data";
import { useMediaQuery } from "../hooks";
import { useFeed } from "../store";
import { SectionLabel } from "./ui";

const mainItems = [
  { icon: Home, label: "My feed", view: "feed" },
  { icon: Eye, label: "Following", view: "following" },
  { icon: Compass, label: "Explore", view: "explore" },
  { icon: Bookmark, label: "Bookmarks", view: "bookmarks" },
  { icon: History, label: "History", view: "history" },
];

function NavItem({ icon: Icon, label, active, expanded, onClick, children, badge }) {
  return (
    <button
      type="button"
      aria-label={badge ? `${label}, ${badge}` : label}
      title={expanded ? undefined : label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`flex h-10 w-full shrink-0 items-center gap-3 rounded-lg transition-colors ${
        expanded ? "px-3" : "justify-center"
      } ${active ? "bg-brand text-on-brand" : "text-muted hover:bg-raised hover:text-ink"}`}
    >
      {Icon ? <Icon className="h-5 w-5 shrink-0" aria-hidden="true" /> : children}
      {expanded && <span className="flex-1 truncate text-left font-bold">{label}</span>}
      {expanded && badge ? (
        <span className="rounded-md bg-raised px-2 text-caption font-bold tabular-nums text-muted">{badge}</span>
      ) : null}
    </button>
  );
}

function Section({ title, expanded, children }) {
  return (
    <div className="flex w-full flex-col gap-1">
      {expanded ? <SectionLabel className="px-3 pb-1 pt-4">{title}</SectionLabel> : <hr className="mx-auto my-3 w-8 border-line" />}
      {children}
    </div>
  );
}

// Tablet and desktop: collapsible rail on the left. It starts collapsed on
// tablets so the feed keeps two columns; the desktop choice is remembered.
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, view, navigate, bookmarks, setModal, toast } = useFeed();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [tabletOpen, setTabletOpen] = useState(false);
  const expanded = isDesktop ? sidebarOpen : tabletOpen;
  const toggle = () => (isDesktop ? setSidebarOpen(!sidebarOpen) : setTabletOpen((o) => !o));
  const soon = (what) => () => toast(`${what} is coming soon`);

  return (
    <aside
      className={`no-scrollbar sticky top-header hidden h-[calc(100dvh-theme(spacing.header))] shrink-0 flex-col items-center overflow-y-auto border-r border-line py-4 transition-[width] duration-200 md:flex ${
        expanded ? "w-60 px-3" : "w-rail px-2"
      }`}
    >
      <div className={`flex w-full items-center gap-2 ${expanded ? "" : "flex-col"}`}>
        <button
          type="button"
          onClick={toggle}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          {expanded ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </button>
        <button
          type="button"
          aria-label="New post"
          onClick={() => setModal("submit")}
          className={`flex h-10 items-center justify-center gap-2 rounded-xl bg-primary font-extrabold text-on-primary transition-opacity hover:opacity-90 ${
            expanded ? "flex-1" : "mt-2 w-10"
          }`}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          {expanded && "New post"}
        </button>
      </div>

      <nav aria-label="Main" className="mt-3 flex w-full flex-col gap-1">
        {mainItems.map((item) => (
          <NavItem
            key={item.view}
            {...item}
            badge={item.view === "bookmarks" ? bookmarks.length : undefined}
            expanded={expanded}
            active={view === item.view}
            onClick={() => navigate(item.view)}
          />
        ))}
      </nav>

      <Section title="Squads" expanded={expanded}>
        {squads.map((s) => (
          <NavItem key={s.id} label={s.label} expanded={expanded} onClick={soon(s.label)}>
            <span className={`h-6 w-6 shrink-0 rounded-full ${s.color}`} aria-hidden="true" />
          </NavItem>
        ))}
        <NavItem icon={Plus} label="New squad" expanded={expanded} onClick={soon("Creating squads")} />
      </Section>

      <Section title="Discover" expanded={expanded}>
        <NavItem icon={Hash} label="Tags" expanded={expanded} onClick={() => setModal("settings")} />
        <NavItem icon={Rss} label="Sources" expanded={expanded} onClick={() => navigate("following")} />
        <NavItem icon={Trophy} label="Leaderboard" expanded={expanded} onClick={soon("The leaderboard")} />
        <NavItem
          icon={MessagesSquare}
          label="Discussions"
          expanded={expanded}
          active={view === "discussions"}
          onClick={() => navigate("discussions")}
        />
      </Section>

      <Section title="Contribute" expanded={expanded}>
        <NavItem icon={Link2} label="Submit a link" expanded={expanded} onClick={() => setModal("submit")} />
        <NavItem icon={Lightbulb} label="Suggest new source" expanded={expanded} onClick={soon("Source suggestions")} />
      </Section>

      <div className="min-h-4 flex-1" />

      <div className="flex w-full flex-col gap-1 border-t border-line pt-3">
        <NavItem icon={Joystick} label="Games" expanded={expanded} onClick={soon("Games")} />
        <NavItem icon={Settings} label="Feed settings" expanded={expanded} onClick={() => setModal("settings")} />
      </div>
    </aside>
  );
}

// Phones: the rail becomes a bottom tab bar.
export function MobileNav() {
  const { view, navigate, setModal } = useFeed();
  const items = [
    { icon: Home, label: "My feed", view: "feed" },
    { icon: Compass, label: "Explore", view: "explore" },
    { icon: Plus, label: "New post", action: () => setModal("submit") },
    { icon: Bookmark, label: "Bookmarks", view: "bookmarks" },
    { icon: History, label: "History", view: "history" },
  ];
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-page/95 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur md:hidden"
    >
      {items.map(({ icon: Icon, label, view: v, action }) => {
        const active = v && view === v;
        return (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            onClick={action ?? (() => navigate(v))}
            className={`mb-2 grid h-11 w-11 place-items-center rounded-xl ${active ? "bg-brand text-on-brand" : "text-muted"}`}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
