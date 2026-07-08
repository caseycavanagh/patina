import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2026-07-08" -> "7.8" */
export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  return `${month}.${day}`;
}

export function formatLongDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
