import { formatStampDate } from "@/lib/stamp";
import { InkText } from "@/components/journal/ink-text";
import { cn } from "@/lib/utils";

export function DateStamp({
  date,
  color = "#1a1a1a",
  nonce = 0,
  className,
}: {
  date: string;
  color?: string;
  /** Bump to re-roll the impression without changing the displayed date. */
  nonce?: number;
  className?: string;
}) {
  return (
    <InkText
      text={formatStampDate(date)}
      seed={date}
      color={color}
      nonce={nonce}
      wrap={false}
      className={cn("font-mono font-bold uppercase", className)}
    />
  );
}
