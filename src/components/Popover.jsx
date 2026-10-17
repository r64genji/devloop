import { useEffect, useRef, useState } from "react";

// Click-to-open dropdown that closes on outside click or Escape.
// `trigger` is a render function: spread `triggerProps` onto the button.
// `menu` gives the panel menu semantics and arrow-key navigation.
// `header` popovers span the screen on phones instead of hanging off their trigger.
export default function Popover({ trigger, children, width = "w-80", header = false, menu = false, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const items = () => [...panel.current.querySelectorAll('[role="menuitem"]:not([disabled])')];
    if (menu) items()[0]?.focus();

    const onDown = (e) => !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => {
      if (e.key === "Escape") {
        // Capture phase + stopPropagation: an open popover eats the Escape so
        // the dialog underneath stays open.
        e.stopPropagation();
        setOpen(false);
        ref.current.querySelector("[aria-expanded]")?.focus();
      } else if (menu && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        e.stopPropagation();
        const list = items();
        const i = list.indexOf(document.activeElement);
        const next = e.key === "ArrowDown" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        list[next]?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, menu]);

  const close = () => setOpen(false);
  const triggerProps = {
    "aria-expanded": open,
    "aria-haspopup": menu ? "menu" : "dialog",
    onClick: () => setOpen((o) => !o),
  };

  return (
    <div ref={ref} className="relative">
      {trigger({ open, triggerProps })}
      {open && (
        <div
          ref={panel}
          role={menu ? "menu" : "dialog"}
          aria-label={label}
          className={`absolute right-0 top-full z-40 mt-2 ${width} max-w-[calc(100vw-1.5rem)] origin-top animate-drop rounded-2xl border border-control bg-surface p-2 ${
            header ? "max-sm:fixed max-sm:inset-x-3 max-sm:top-header max-sm:mt-1 max-sm:w-auto max-sm:max-w-none" : ""
          }`}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ icon: Icon, children, onClick, danger, right }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-medium transition-colors hover:bg-raised focus-visible:bg-raised ${
        danger ? "text-error" : "text-ink"
      }`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0 text-muted" />}
      <span className="flex-1">{children}</span>
      {right}
    </button>
  );
}
