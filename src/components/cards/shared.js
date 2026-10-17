// Non-component helpers shared by the cards and the post view.

export const postMeta = (post) =>
  post.type === "video" ? `${post.date} • ${post.readTime} watch` : `${post.date} • ${post.readTime}`;

// Card shell. The title button stretches over the whole card (see CardTitle),
// so controls inside sit above it with `relative z-10`. A card with an open
// menu is lifted so the menu overlaps the cards after it.
export const cardShell =
  "group relative rounded-2xl border border-line bg-surface transition-colors hover:border-muted/50 has-[[aria-expanded=true]]:z-30";
