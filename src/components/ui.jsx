// Small shared building blocks so buttons, fields and pills look the same everywhere.

const buttonVariants = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  outline: "border border-control text-ink hover:bg-raised",
  ghost: "text-muted hover:bg-raised hover:text-ink",
};

export function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-button font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Bordered input wrapper with an optional leading icon
export function TextField({ icon: Icon, className = "", ...props }) {
  return (
    <label className={`flex h-11 items-center gap-2 rounded-xl border border-strong bg-page px-3 focus-within:border-focus ${className}`}>
      {Icon && <Icon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
      <input
        className="min-w-0 flex-1 bg-transparent placeholder:text-muted focus:outline-none focus-visible:ring-0"
        {...props}
      />
    </label>
  );
}

export function TagPill({ tag }) {
  return <li className="rounded-lg border border-line px-2 py-1 text-label text-muted">#{tag}</li>;
}

// Flat, tilted label with an ink outline (the design system's sticker)
export function Sticker({ className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border-sticker border-sticker-ink px-2 py-1 text-caption font-extrabold text-sticker-ink ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children, className = "" }) {
  return <p className={`text-overline font-extrabold uppercase text-muted ${className}`}>{children}</p>;
}
