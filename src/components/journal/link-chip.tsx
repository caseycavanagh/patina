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

const SERVICES: { test: RegExp; icon: LucideIcon }[] = [
  { test: /(^|\.)spotify\.com$/, icon: Music2 },
  { test: /(^|\.)traxsource\.com$/, icon: Music2 },
  { test: /(^|\.)(youtube\.com|youtu\.be)$/, icon: Video },
  { test: /(^|\.)instagram\.com$/, icon: Camera },
  { test: /(^|\.)substack\.com$/, icon: Newspaper },
  { test: /(^|\.)readwise\.io$/, icon: Highlighter },
  { test: /(^|\.)perplexity\.ai$/, icon: Search },
  { test: /(^|\.)claude\.ai$/, icon: Sparkles },
  { test: /(^|\.)figma\.com$/, icon: PenTool },
  { test: /(^|\.)atlassian\.net$/, icon: FileText },
  { test: /(^|\.)linkedin\.com$/, icon: Briefcase },
  { test: /(^|\.)(maps\.app\.goo\.gl|maps\.google\.com|google\.com)$/, icon: MapPin },
];

const PREVIEW_MAX = 30;

function truncateEnd(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

/** A same-domain-recognizing icon, plus a truncated `host/path` preview of the URL. */
function describeLink(href: string): { preview: string; icon: LucideIcon } {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname === "/" ? "" : url.pathname;
    const icon = SERVICES.find((s) => s.test.test(host))?.icon ?? Link2;
    return { preview: truncateEnd(`${host}${path}`, PREVIEW_MAX), icon };
  } catch {
    return { preview: truncateEnd(href, PREVIEW_MAX), icon: Link2 };
  }
}

/** A compact, iconed pill for a link, sized to sit inline within body copy. */
export function LinkChip({ href, label }: { href: string; label?: string }) {
  const { preview, icon: Icon } = describeLink(href);
  const customLabel =
    label && label.trim() && label !== href ? truncateEnd(label.trim(), 40) : null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href}
      className="mx-0.5 inline-flex translate-y-[-0.05em] items-center gap-1 rounded-full border border-current/30 bg-current/[0.06] px-2.5 py-0.5 align-middle text-[0.5em] leading-none font-medium whitespace-nowrap no-underline transition-colors hover:bg-current/[0.14]"
    >
      <Icon className="size-3 shrink-0" aria-hidden strokeWidth={2.25} />
      <span className={customLabel ? undefined : "font-mono tracking-tight"}>
        {customLabel ?? preview}
      </span>
    </a>
  );
}
