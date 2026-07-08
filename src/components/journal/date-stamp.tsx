"use client";

import { useState } from "react";
import { formatStampDate } from "@/lib/stamp";
import { InkText } from "@/components/journal/ink-text";
import { cn } from "@/lib/utils";

export function DateStamp({
  date,
  color = "#1a1a1a",
  className,
}: {
  date: string;
  color?: string;
  className?: string;
}) {
  const [nonce, setNonce] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setNonce((n) => n + 1)}
      aria-label="Restamp date"
      className="cursor-pointer transition-transform active:scale-95"
    >
      <InkText
        text={formatStampDate(date)}
        seed={date}
        color={color}
        nonce={nonce}
        wrap={false}
        className={cn("font-mono font-bold uppercase", className)}
      />
    </button>
  );
}
