// Placeholder content for the feed. Swap for real API data later.

export const allTags = [
  "javascript", "react", "nextjs", "webdev", "css", "tailwind", "html", "htmx", "php",
  "github", "git", "ai", "security", "devops", "rust", "go", "python", "career",
  "nodejs", "typescript", "database", "postgres", "crawling", "productivity",
  "open-source", "linux",
];

// The default tab of My feed
export const FOR_YOU = "For you";

// Tags shown as tabs after "For you" until the user edits them in Feed settings
export const defaultFollowedTags = ["webdev", "php", "github"];

const tagNames = {
  javascript: "JavaScript", react: "React", webdev: "Web Development", css: "CSS",
  tailwind: "Tailwind", php: "PHP", github: "GitHub", git: "Git", ai: "AI",
  security: "Security", devops: "DevOps", rust: "Rust", go: "Go", python: "Python",
  career: "Career", nodejs: "Node.js", typescript: "TypeScript", database: "Database",
  html: "HTML", productivity: "Productivity", "open-source": "Open Source", linux: "Linux",
  nextjs: "Next.js", htmx: "htmx", postgres: "Postgres", crawling: "Crawling",
};

export const tagLabel = (tag) => tagNames[tag] ?? tag;

export const exploreTabs = ["Popular", "Most upvoted", "Best discussions", "Latest"];

export const happeningNow = [
  {
    id: 1,
    title: "Open-weight coding model tops SWE-bench with a 2M-token context window",
    time: "8m ago",
  },
  {
    id: 2,
    title: "Chipmaker commits $40B to new data centres across Southeast Asia",
    time: "2h ago",
  },
  {
    id: 3,
    title: "Critical flaw in popular npm package lets attackers run code on install",
    time: "13h ago",
  },
  {
    id: 4,
    title: "Node.js 24 ships with a built-in TypeScript runner enabled by default",
    time: "1d ago",
  },
];

export const sources = {
  hn: { name: "Hacker Newsroom", letter: "H", color: "bg-cat-eating-out" },
  dev: { name: "Dev Diaries", letter: "D", color: "bg-cat-travel" },
  mag: { name: "Markup Magazine", letter: "M", color: "bg-cat-transport" },
  git: { name: "Git Gazette", letter: "G", color: "bg-cat-bills" },
  php: { name: "PHP Weekly", letter: "P", color: "bg-cat-education" },
  sec: { name: "Secure Bytes", letter: "S", color: "bg-cat-health" },
  ai: { name: "Model Notes", letter: "A", color: "bg-cat-shopping" },
  ops: { name: "Ops Corner", letter: "O", color: "bg-cat-home" },
  rs: { name: "Rustacean Post", letter: "R", color: "bg-cat-entertainment" },
  tube: { name: "DevTube", letter: "T", color: "bg-cat-subscriptions" },
};

export const defaultFollowedSources = ["dev", "git", "rs"];

const authors = {
  lin: { name: "Lin Park", color: "bg-cat-groceries" },
  sam: { name: "Sam Okafor", color: "bg-cat-transfers" },
  ria: { name: "Ria Sen", color: "bg-cat-gifts" },
  max: { name: "Max Weber", color: "bg-cat-income" },
  ava: { name: "Ava Torres", color: "bg-cat-bills" },
};

// `type`: article | video | collection | poll | ad
// `thumb` picks one of the illustrated thumbnails in PostThumb.jsx
export const posts = [
  {
    id: 1,
    type: "article",
    source: "hn",
    author: "lin",
    title: "So Reddit has decided that plain HTML is unsafe",
    summary:
      "A look at why the old, script-free version of the site now sits behind a login wall, what that means for scrapers and accessibility tools, and the trade-offs of treating static markup as an attack surface.",
    tags: ["javascript", "html", "crawling"],
    date: "Jul 22",
    readTime: "9m read time",
    upvotes: 73,
    comments: 12,
    thumb: "login",
  },
  {
    id: 2,
    type: "article",
    source: "dev",
    author: "sam",
    title: "I rebuilt my portfolio with React Server Components. Here's what broke",
    summary:
      "Data fetching got simpler, but third-party UI kits, client-only hooks and the mental model of where code runs caused a week of surprises. The author lists every fix.",
    tags: ["react", "nextjs", "webdev"],
    date: "Jul 21",
    readTime: "6m read time",
    upvotes: 241,
    comments: 38,
    thumb: "code",
  },
  {
    id: 3,
    type: "article",
    source: "mag",
    author: "ria",
    title: "Tailwind v4: everything that changed and how to migrate",
    summary:
      "CSS-first configuration, a new engine that builds up to 10x faster, and native cascade layers. Includes a step-by-step migration checklist for v3 projects.",
    tags: ["css", "tailwind", "webdev"],
    date: "Jul 20",
    readTime: "11m read time",
    upvotes: 512,
    comments: 64,
    thumb: "brand",
  },
  {
    id: 4,
    type: "poll",
    source: "dev",
    author: "max",
    title: "Which runtime are you starting new backend projects on?",
    tags: ["nodejs", "webdev"],
    date: "Jul 20",
    options: [
      { id: "node", label: "Node.js", votes: 412 },
      { id: "bun", label: "Bun", votes: 238 },
      { id: "deno", label: "Deno", votes: 97 },
      { id: "other", label: "Something else", votes: 61 },
    ],
    endsIn: "3 days left",
    ended: false,
    upvotes: 88,
    comments: 45,
  },
  {
    id: 5,
    type: "article",
    source: "git",
    author: "ava",
    title: "Why your Git history is lying to you (and how to fix it)",
    summary:
      "Squash merges, rebases and force-pushes can hide when a bug really landed. Learn how to use reflog, bisect and signed commits to get an honest timeline back.",
    tags: ["git", "github", "productivity"],
    date: "Jul 19",
    readTime: "5m read time",
    upvotes: 98,
    comments: 7,
    thumb: "graph",
  },
  {
    id: 6,
    type: "video",
    source: "tube",
    author: "sam",
    title: "Build a full-stack app with PHP 8.4 and htmx in 30 minutes",
    summary:
      "A live-coded walkthrough that pairs modern PHP with htmx partials to ship a reactive todo app with zero build step.",
    tags: ["php", "htmx", "webdev"],
    date: "Jul 19",
    readTime: "31:04",
    upvotes: 167,
    comments: 22,
    thumb: "terminal",
  },
  {
    id: 7,
    type: "ad",
    source: "ops",
    title: "Preview every pull request on a real URL before you merge",
    summary: "Shipyard spins up an isolated environment for each branch. Free for open source.",
    cta: "Try it free",
    thumb: "browser",
  },
  {
    id: 8,
    type: "article",
    source: "php",
    author: "lin",
    title: "PHP is still running half the web. Should you learn it in 2026?",
    summary:
      "Job boards, hosting costs and framework momentum point in a surprising direction. The author compares PHP, Node and Go for freelancers and agencies.",
    tags: ["php", "career"],
    date: "Jul 18",
    readTime: "7m read time",
    upvotes: 156,
    comments: 91,
    thumb: "code",
  },
  {
    id: 9,
    type: "collection",
    source: "sec",
    author: "ria",
    title: "Everything you need to know about this week's npm supply-chain attack",
    summary:
      "We gathered the best write-ups on how the malicious install script worked, which packages were affected and how to audit your lockfile.",
    tags: ["security", "nodejs", "javascript"],
    date: "Jul 18",
    readTime: "5 sources",
    collectionSources: ["sec", "hn", "dev", "ops"],
    upvotes: 389,
    comments: 57,
    thumb: "terminal",
  },
  {
    id: 10,
    type: "article",
    source: "ai",
    author: "max",
    title: "I let an AI agent refactor a 40k-line codebase. Here's the diff",
    summary:
      "The agent split god-objects, added tests and caught two real bugs, but also invented an API that doesn't exist. Lessons on reviewing machine-written code.",
    tags: ["ai", "productivity", "typescript"],
    date: "Jul 17",
    readTime: "12m read time",
    upvotes: 634,
    comments: 143,
    thumb: "chart",
  },
  {
    id: 11,
    type: "article",
    source: "rs",
    author: "ava",
    title: "Rewriting our image pipeline in Rust cut our cloud bill by 60%",
    summary:
      "A Node service that resized millions of images a day was replaced with a small Rust binary. Benchmarks, memory graphs and the parts that were harder than expected.",
    tags: ["rust", "devops", "open-source"],
    date: "Jul 17",
    readTime: "8m read time",
    upvotes: 421,
    comments: 76,
    thumb: "chart",
  },
  {
    id: 12,
    type: "article",
    source: "mag",
    author: "sam",
    title: "Container queries are the responsive design feature we waited 10 years for",
    summary:
      "Stop guessing viewport widths. Components can now adapt to the space they actually have. Practical patterns for cards, sidebars and dashboards.",
    tags: ["css", "html", "webdev"],
    date: "Jul 16",
    readTime: "6m read time",
    upvotes: 203,
    comments: 19,
    thumb: "browser",
  },
  {
    id: 13,
    type: "video",
    source: "tube",
    author: "lin",
    title: "Postgres indexes explained with animations",
    summary:
      "B-trees, GIN, BRIN and partial indexes visualised step by step, with EXPLAIN output for each so you know when to reach for which.",
    tags: ["database", "postgres"],
    date: "Jul 16",
    readTime: "18:42",
    upvotes: 298,
    comments: 31,
    thumb: "graph",
  },
  {
    id: 14,
    type: "article",
    source: "ops",
    author: "ria",
    title: "The boring GitHub Actions setup that saved our team 20 hours a week",
    summary:
      "Caching, matrix builds, reusable workflows and a merge queue. Nothing fancy, just the defaults most teams skip.",
    tags: ["github", "devops", "productivity"],
    date: "Jul 15",
    readTime: "9m read time",
    upvotes: 187,
    comments: 24,
    thumb: "terminal",
  },
  {
    id: 15,
    type: "poll",
    source: "git",
    author: "ava",
    title: "Merge commits or squash merges for your main branch?",
    tags: ["git", "github"],
    date: "Jul 15",
    options: [
      { id: "squash", label: "Squash merge", votes: 531 },
      { id: "merge", label: "Merge commit", votes: 214 },
      { id: "rebase", label: "Rebase and merge", votes: 302 },
    ],
    endsIn: "Ended",
    ended: true,
    upvotes: 142,
    comments: 88,
  },
  {
    id: 16,
    type: "article",
    source: "sec",
    author: "max",
    title: "Passkeys in production: what we learned after six months",
    summary:
      "Sign-in success rates went up and support tickets went down, but account recovery and cross-device flows still need careful design.",
    tags: ["security", "webdev", "javascript"],
    date: "Jul 14",
    readTime: "10m read time",
    upvotes: 276,
    comments: 41,
    thumb: "login",
  },
  {
    id: 17,
    type: "article",
    source: "dev",
    author: "lin",
    title: "TypeScript 6 beta: the features worth your attention",
    summary:
      "Faster type checking, isolated declarations and stricter defaults. A quick tour of what might break in your build.",
    tags: ["typescript", "javascript"],
    date: "Jul 14",
    readTime: "4m read time",
    upvotes: 355,
    comments: 29,
    thumb: "code",
  },
  {
    id: 18,
    type: "article",
    source: "rs",
    author: "sam",
    title: "Go vs Rust for CLI tools: I built the same app twice",
    summary:
      "Compile times, binary size, error handling and developer experience compared on a real-world log parser.",
    tags: ["rust", "go", "open-source"],
    date: "Jul 13",
    readTime: "8m read time",
    upvotes: 198,
    comments: 66,
    thumb: "code",
  },
  {
    id: 19,
    type: "article",
    source: "hn",
    author: "ria",
    title: "The Linux desktop finally feels ready. Here's my daily setup",
    summary:
      "A tiling window manager, a sane dotfiles repo and the handful of apps that replaced everything the author used on macOS.",
    tags: ["linux", "productivity"],
    date: "Jul 12",
    readTime: "7m read time",
    upvotes: 144,
    comments: 102,
    thumb: "terminal",
  },
  {
    id: 20,
    type: "article",
    source: "php",
    author: "max",
    title: "Laravel's new starter kits ditch the magic for plain React and Vue",
    summary:
      "The framework's onboarding story got simpler. What's inside each kit and when to choose Livewire instead.",
    tags: ["php", "react", "webdev"],
    date: "Jul 12",
    readTime: "5m read time",
    upvotes: 121,
    comments: 15,
    thumb: "browser",
  },
];

export const postsById = Object.fromEntries(posts.map((p) => [p.id, p]));

// Posts the user "read" before this session, so History isn't empty on first load
export const seedHistory = [5, 12];

// Minutes a post takes: "9m read time" -> 9, a "31:04" video -> 31. Polls and collections have none.
export function readMinutes(post) {
  if (!post.readTime) return 0;
  const video = post.readTime.match(/^(\d+):\d+$/);
  if (video) return Number(video[1]);
  const article = post.readTime.match(/^(\d+)m/);
  return article ? Number(article[1]) : 0;
}

export function getAuthor(id) {
  return authors[id];
}

export const sampleComments = [
  {
    id: "c1",
    author: "max",
    text: "Great write-up. The section on trade-offs is exactly what I needed for our team discussion.",
    time: "2h",
    upvotes: 14,
  },
  {
    id: "c2",
    author: "ava",
    text: "I'd push back a bit on the conclusion, but the benchmarks are solid. Would love to see the repo.",
    time: "5h",
    upvotes: 6,
  },
];

export const initialNotifications = [
  {
    id: 1,
    kind: "upvote",
    text: "Your comment on “Tailwind v4: everything that changed” got 10 upvotes",
    time: "12m",
    unread: true,
  },
  {
    id: 2,
    kind: "squad",
    text: "React squad posted: “Show us your weirdest useEffect bug”",
    time: "1h",
    unread: true,
  },
  {
    id: 3,
    kind: "streak",
    text: "You're on an 8 day reading streak. Keep it going!",
    time: "9h",
    unread: true,
  },
  {
    id: 4,
    kind: "reply",
    text: "Sam Okafor replied to your comment on “Why your Git history is lying to you”",
    time: "1d",
    unread: false,
  },
];

export const squads = [
  { id: "react", label: "React squad", color: "bg-cat-travel" },
  { id: "oss", label: "Open source squad", color: "bg-cat-other" },
  { id: "rust", label: "Rust squad", color: "bg-cat-eating-out" },
  { id: "design", label: "Design squad", color: "bg-cat-education" },
];

export const defaultShortcuts = [
  { id: "gh", name: "GitHub", url: "https://github.com", color: "bg-cat-other" },
  { id: "mdn", name: "MDN", url: "https://developer.mozilla.org", color: "bg-cat-travel" },
  { id: "so", name: "Stack Overflow", url: "https://stackoverflow.com", color: "bg-cat-eating-out" },
  { id: "devdocs", name: "DevDocs", url: "https://devdocs.io", color: "bg-cat-bills" },
];

export const recentSearches = ["react server components", "tailwind migration", "rust cli"];
