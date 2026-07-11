import type { ReactNode } from "react";

const LINK_PATTERN =
  /!?\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"')\]]+)/g;

const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/;

/**
 * Splits `text` on URLs (bare, or markdown `[label](url)` / `![alt](url)`
 * links pasted from elsewhere) and renders the URLs as real anchors.
 * Everything else passes through untouched so whitespace-pre-line still
 * controls line breaks.
 */
export function linkify(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [full, mdLabel, mdUrl, bareUrl] = match;

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    let href = mdUrl ?? bareUrl;
    let trailing = "";
    if (bareUrl) {
      const trimmed = href.match(TRAILING_PUNCTUATION);
      if (trimmed) {
        trailing = trimmed[0];
        href = href.slice(0, -trailing.length);
      }
    }

    nodes.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 decoration-current/40 hover:decoration-current/80"
      >
        {mdUrl ? mdLabel || href : href}
      </a>,
    );

    if (trailing) nodes.push(trailing);
    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
