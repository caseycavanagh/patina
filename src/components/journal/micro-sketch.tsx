"use client";

import { useRef, useState } from "react";
import { Duotone } from "@/lib/duotones";

const BOUND = 64;

export function MicroSketch({ duotone }: { duotone: Duotone }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function clamp(v: number) {
    return Math.max(-BOUND, Math.min(BOUND, v));
  }

  function handleMove(e: React.PointerEvent) {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: clamp(e.clientX - cx), y: clamp(e.clientY - cy) });
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        handleMove(e);
      }}
      onPointerMove={handleMove}
      onPointerUp={() => {
        setDragging(false);
        setPos({ x: 0, y: 0 });
      }}
      onPointerCancel={() => {
        setDragging(false);
        setPos({ x: 0, y: 0 });
      }}
      className="relative flex size-56 touch-none items-center justify-center rounded-full border-2"
      style={{ borderColor: `${duotone.ink}55` }}
    >
      <span
        className="absolute rounded-full"
        style={{
          width: BOUND * 2,
          height: BOUND * 2,
          border: `1px dashed ${duotone.ink}33`,
        }}
      />
      <span
        className="size-14 cursor-grab rounded-full active:cursor-grabbing"
        style={{
          background: duotone.ink,
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${dragging ? 1.12 : 1})`,
          transition: dragging
            ? "transform 0.05s linear"
            : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
    </div>
  );
}
