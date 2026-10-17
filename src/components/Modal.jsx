import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// Open dialogs, topmost last. Only the top one reacts to the keyboard, and the
// page stays scroll-locked until the last one closes.
const stack = [];
const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

function trapTab(e, panel) {
  const items = [...panel.querySelectorAll(FOCUSABLE)];
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// Overlay dialog: closes on Escape or backdrop click, traps focus, and gives
// focus back to whatever opened it. `onKey` receives other keys while on top.
// Mark a field with data-autofocus to focus it on open.
export default function Modal({ onClose, onKey, title, children, size = "max-w-lg", position = "center", bare = false }) {
  const panel = useRef(null);
  const handlers = useRef({ onClose, onKey });
  handlers.current = { onClose, onKey };

  useEffect(() => {
    const layer = {};
    stack.push(layer);
    document.body.style.overflow = "hidden";
    const opener = document.activeElement;
    // Focus the field marked data-autofocus, or the panel itself
    (panel.current.querySelector("[data-autofocus]") ?? panel.current).focus();

    const onKeyDown = (e) => {
      if (stack[stack.length - 1] !== layer) return;
      if (e.key === "Escape") {
        e.preventDefault();
        handlers.current.onClose();
      } else if (e.key === "Tab") {
        trapTab(e, panel.current);
      } else {
        handlers.current.onKey?.(e);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stack.splice(stack.indexOf(layer), 1);
      if (!stack.length) document.body.style.overflow = "";
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-on-brand/50 p-3 sm:p-6 ${
        position === "top" ? "sm:pt-[12vh]" : ""
      }`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* my-auto centres short dialogs without clipping the top of tall ones */}
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`w-full ${size} animate-rise rounded-2xl border border-control bg-surface focus:outline-none focus-visible:ring-0 ${
          position === "top" ? "" : "my-auto"
        }`}
      >
        {!bare && (
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-button font-extrabold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
