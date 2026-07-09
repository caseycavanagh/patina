"use client";

import { useEffect, useRef, useState } from "react";

const MIN_THUMB_HEIGHT = 32;

export function ScrollIndicator({ scrollContainerId }: { scrollContainerId: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startY: number; startScrollTop: number } | null>(
    null,
  );
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false });
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const container = document.getElementById(scrollContainerId);
    const track = trackRef.current;
    if (!container || !track) return;

    function measure() {
      if (!container || !track) return;
      const trackHeight = track.clientHeight;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollable = scrollHeight - clientHeight;

      if (scrollable <= 0) {
        setThumb((t) => (t.visible ? { ...t, visible: false } : t));
        return;
      }

      const thumbHeight = Math.max(MIN_THUMB_HEIGHT, (clientHeight / scrollHeight) * trackHeight);
      const fraction = scrollTop / scrollable;
      const top = fraction * (trackHeight - thumbHeight);

      setThumb({ top, height: thumbHeight, visible: true });
      setPercent(Math.round(fraction * 100));
    }

    measure();
    container.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    return () => {
      container.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
    };
  }, [scrollContainerId]);

  function scrollToClientY(clientY: number) {
    const container = document.getElementById(scrollContainerId);
    const track = trackRef.current;
    if (!container || !track) return;

    const trackHeight = track.clientHeight;
    const scrollable = container.scrollHeight - container.clientHeight;
    const thumbHeight = Math.max(
      MIN_THUMB_HEIGHT,
      (container.clientHeight / container.scrollHeight) * trackHeight,
    );
    const rect = track.getBoundingClientRect();
    const fraction = (clientY - rect.top - thumbHeight / 2) / (trackHeight - thumbHeight);
    container.scrollTop = Math.max(0, Math.min(1, fraction)) * scrollable;
  }

  function handleThumbPointerDown(e: React.PointerEvent) {
    const container = document.getElementById(scrollContainerId);
    if (!container) return;
    dragRef.current = { pointerId: e.pointerId, startY: e.clientY, startScrollTop: container.scrollTop };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleThumbPointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    const container = document.getElementById(scrollContainerId);
    const track = trackRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !container || !track) return;

    const trackHeight = track.clientHeight;
    const scrollable = container.scrollHeight - container.clientHeight;
    const thumbHeight = Math.max(
      MIN_THUMB_HEIGHT,
      (container.clientHeight / container.scrollHeight) * trackHeight,
    );
    const scrollableTrack = trackHeight - thumbHeight;
    const deltaY = e.clientY - drag.startY;
    const deltaScroll = scrollableTrack > 0 ? (deltaY / scrollableTrack) * scrollable : 0;

    container.scrollTop = drag.startScrollTop + deltaScroll;
  }

  function handleThumbPointerUp(e: React.PointerEvent) {
    if (dragRef.current?.pointerId === e.pointerId) dragRef.current = null;
  }

  function handleTrackPointerDown(e: React.PointerEvent) {
    if (e.target !== trackRef.current) return;
    scrollToClientY(e.clientY);
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={handleTrackPointerDown}
      className="fixed right-0 bottom-0 z-40 w-3"
      style={{ top: "var(--header-height, 4.5rem)" }}
    >
      {thumb.visible && (
        <div
          role="scrollbar"
          aria-orientation="vertical"
          aria-controls={scrollContainerId}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
          className="absolute right-1 w-1.5 touch-none rounded-full bg-white/40 transition-colors hover:bg-white/60 active:bg-white/70"
          style={{ top: thumb.top, height: thumb.height }}
        />
      )}
    </div>
  );
}
