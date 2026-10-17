// Illustrated thumbnails built with plain markup, so the project needs no image assets.
// Flat fills from the design system only: navy, cream, brand, stickers and category colours.

function LoginThumb() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-on-brand px-10">
      <div className="w-full rounded-full bg-cream py-2 text-center text-label font-bold text-on-brand">
        Continue with Google
      </div>
      <div className="w-full rounded-full bg-cream py-2 text-center text-label font-bold text-on-brand">
        Email me a one-time link
      </div>
      <div className="flex w-full items-center gap-3 text-caption text-brand">
        <hr className="flex-1 border-brand/40" /> OR <hr className="flex-1 border-brand/40" />
      </div>
      <div className="w-full rounded-xl border border-brand/40 px-4 py-3 text-label text-brand">
        Email or username <span className="text-sticker-over">*</span>
      </div>
    </div>
  );
}

function CodeThumb() {
  const lines = [
    ["text-sticker-over", "export default", "text-brand", " function App() {"],
    ["text-cat-transfers", "  // server component", "", ""],
    ["text-sticker-over", "  const", "text-cream", " data = await getPosts();"],
    ["text-sticker-over", "  return", "text-sticker-ok", " <Feed posts={data} />;"],
    ["text-cream", "}", "", ""],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-on-brand px-6 font-mono text-caption sm:text-label">
      {lines.map(([c1, t1, c2, t2], i) => (
        <p key={i} className="whitespace-pre">
          <span className="mr-4 text-cat-transfers">{i + 1}</span>
          <span className={c1}>{t1}</span>
          <span className={c2}>{t2}</span>
        </p>
      ))}
    </div>
  );
}

function BrandThumb() {
  return (
    <div className="grid h-full place-items-center bg-brand">
      <span className="text-hero font-extrabold text-on-brand">v4</span>
    </div>
  );
}

function GraphThumb() {
  return (
    <div className="grid h-full place-items-center bg-sand">
      <svg viewBox="0 0 200 100" className="h-3/4" aria-hidden="true">
        <path d="M10 50 H190" strokeWidth="3" className="stroke-on-brand" />
        <path d="M60 50 C80 50 80 20 100 20 H150 C170 20 170 50 190 50" strokeWidth="3" fill="none" className="stroke-cat-transport" />
        {[10, 60, 100, 150, 190].map((x) => (
          <circle key={x} cx={x} cy={x === 100 || x === 150 ? 20 : 50} r="6" strokeWidth="3" className="fill-cream stroke-on-brand" />
        ))}
      </svg>
    </div>
  );
}

function TerminalThumb() {
  return (
    <div className="flex h-full flex-col bg-on-brand font-mono text-caption sm:text-label">
      <div className="flex gap-2 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-sticker-over" />
        <span className="h-2.5 w-2.5 rounded-full bg-sticker-tight" />
        <span className="h-2.5 w-2.5 rounded-full bg-sticker-ok" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 px-5 text-cream">
        <p><span className="text-sticker-ok">$</span> npm audit --production</p>
        <p className="text-sticker-over">3 vulnerabilities (1 critical)</p>
        <p><span className="text-sticker-ok">$</span> git push origin main</p>
        <p className="text-mist">✓ checks passed · deployed in 42s</p>
      </div>
    </div>
  );
}

function ChartThumb() {
  const bars = [40, 65, 50, 80, 55, 95, 70];
  return (
    <div className="flex h-full items-end justify-center gap-2 bg-sand px-8 pb-5 pt-8">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-full rounded-t ${i === 5 ? "bg-on-brand" : "bg-brand"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function BrowserThumb() {
  return (
    <div className="flex h-full flex-col bg-cat-transport p-4">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-cream">
        <div className="flex items-center gap-2 border-b border-sand px-2 py-2">
          <span className="h-2 w-2 rounded-full bg-sand-line" />
          <span className="h-2 w-2 rounded-full bg-sand-line" />
          <span className="ml-2 h-3 flex-1 rounded bg-sand" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2 p-2">
          <span className="col-span-2 rounded bg-sand" />
          <span className="row-span-2 rounded bg-sticker-ok" />
          <span className="rounded bg-sand" />
          <span className="rounded bg-sand" />
        </div>
      </div>
    </div>
  );
}

const thumbs = {
  login: LoginThumb,
  code: CodeThumb,
  brand: BrandThumb,
  graph: GraphThumb,
  terminal: TerminalThumb,
  chart: ChartThumb,
  browser: BrowserThumb,
};

export default function PostThumb({ type, className = "", children }) {
  const Thumb = thumbs[type] ?? BrandThumb;
  return (
    <div className={`relative aspect-video overflow-hidden rounded-xl ${className}`}>
      <Thumb />
      {children}
    </div>
  );
}
