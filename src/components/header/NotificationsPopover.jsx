import { ArrowBigUp, Bell, Flame, MessageSquare, Users } from "lucide-react";
import Popover from "../Popover";
import IconButton from "../IconButton";
import { useFeed } from "../../store";

// Each kind gets a category-style sign: a solid colour tile with a white icon
const kinds = {
  upvote: { icon: ArrowBigUp, color: "bg-cat-income" },
  squad: { icon: Users, color: "bg-cat-travel" },
  streak: { icon: Flame, color: "bg-cat-home" },
  reply: { icon: MessageSquare, color: "bg-cat-bills" },
};

export default function NotificationsPopover() {
  const { notifications, markRead, markAllRead } = useFeed();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <Popover
      width="w-96"
      header
      label="Notifications"
      trigger={({ triggerProps }) => (
        <span className="relative block">
          <IconButton label={`Notifications${unread ? `, ${unread} unread` : ""}`} {...triggerProps}>
            <Bell className="h-5 w-5" />
          </IconButton>
          {unread > 0 && (
            <span className="pointer-events-none absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-caption font-bold tabular-nums text-on-primary">
              {unread}
            </span>
          )}
        </span>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-button font-extrabold">Notifications</h3>
            <button
              type="button"
              onClick={markAllRead}
              disabled={!unread}
              className="min-h-11 text-label font-bold text-link hover:underline disabled:text-muted disabled:no-underline"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.map((n) => {
              const { icon: Icon, color } = kinds[n.kind];
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markRead(n.id);
                      close();
                    }}
                    className="flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-raised"
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md text-white ${color}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-label leading-snug ${n.unread ? "font-bold text-ink" : "text-muted"}`}>
                        {n.text}
                      </span>
                      <span className="mt-1 block text-caption text-muted">{n.time}</span>
                    </span>
                    {n.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Popover>
  );
}
