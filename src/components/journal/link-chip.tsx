import {
  Briefcase,
  Camera,
  FileText,
  Highlighter,
  Link2,
  MapPin,
  Music2,
  Newspaper,
  PenTool,
  Search,
  Sparkles,
  Video,
  type LucideIcon,
} from "lucide-react";

const SERVICES: { test: RegExp; label: string; icon: LucideIcon }[] = [
  { test: /(^|\.)spotify\.com$/, label: "Spotify", icon: Music2 },
  { test: /(^|\.)traxsource\.com$/, label: "Traxsource", icon: Music2 },
  { test: /(^|\.)(youtube\.com|youtu\.be)$/, label: "YouTube", icon: Video },
  { test: /(^|\.)instagram\.com$/, label: "Instagram", icon: Camera },
  { test: /(^|\.)substack\.com$/, label: "Substack", icon: Newspaper },
  { test: /(^|\.)readwise\.io$/, label: "Highlight", icon: Highlighter },
  { test: /(^|\.)perplexity\.ai$/, label: "Perplexity", icon: Search },
  { test: /(^|\.)claude\.ai$/, label: "Claude", icon: Sparkles },
  { test: /(^|\.)figma\.com$/, label: "Figma", icon: PenTool },
  { test: /(^|\.)atlassian\.net$/, label: "Confluence", icon: FileText },
  { test: /(^|\.)linkedin\.com$/, label: "LinkedIn", icon: Briefcase },
  {
    test: /(^|\.)(maps\.app\.goo\.gl|maps\.google\.com|google\.com)$/,
    label: "Map",
    icon: MapPin,
  },
];

function truncateMiddle(value: string, max: number): string {
  if (value.length <= max) return value;
  const keep = max - 1;
  const head = Math.ceil(keep * 0.6);
  const tail = keep - head;
  return `${value.slice(0, head)}…${value.slice(value.length - tail)}`;
}

function truncateEnd(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function describeLink(href: string): { label: string; icon: LucideIcon } {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const service = SERVICES.find((s) => s.test.test(host));
    if (service) return { label: service.label, icon: service.icon };
    return { label: truncateMiddle(host, 28), icon: Link2 };
  } catch {
    return { label: truncateEnd(href, 28), icon: Link2 };
  }
}

/** A compact, iconed pill for a link, sized to sit inline within body copy. */
export function LinkChip({ href, label }: { href: string; label?: string }) {
  const meta = describeLink(href);
  const isCustomLabel = label && label.trim() && label !== href;
  const text = isCustomLabel ? truncateEnd(label!.trim(), 40) : meta.label;
  const Icon = meta.icon;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-0.5 inline-flex translate-y-[-0.05em] items-center gap-1 rounded-full border border-current/30 bg-current/[0.06] px-2.5 py-0.5 align-middle text-[0.45em] leading-none font-sans font-medium tracking-wide whitespace-nowrap uppercase no-underline transition-colors hover:bg-current/[0.14]"
    >
      <Icon className="size-3 shrink-0" aria-hidden strokeWidth={2.25} />
      {text}
    </a>
  );
}
