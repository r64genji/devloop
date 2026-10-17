// Square outlined button used across the header. Wrap it to hide it at some sizes.
export default function IconButton({ label, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-control bg-surface text-ink transition-colors hover:bg-raised"
      {...props}
    >
      {children}
    </button>
  );
}
