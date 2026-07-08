"use client";

import { useRef, useState } from "react";
import { Duotone } from "@/lib/duotones";

const ROOT_HZ = 220;

export function SongSketch({
  notes,
  duotone,
}: {
  notes: number[];
  duotone: Duotone;
}) {
  const [playing, setPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const ctxRef = useRef<AudioContext | null>(null);

  async function play() {
    if (playing) return;
    setPlaying(true);

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    const stepDuration = 0.32;
    const now = ctx.currentTime;

    notes.forEach((semitones, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = ROOT_HZ * Math.pow(2, semitones / 12);

      const start = now + i * stepDuration;
      const end = start + stepDuration * 0.9;

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.05);

      setTimeout(() => setActiveStep(i), i * stepDuration * 1000);
    });

    const totalMs = notes.length * stepDuration * 1000;
    setTimeout(() => {
      setPlaying(false);
      setActiveStep(-1);
    }, totalMs + 100);
  }

  return (
    <button
      onClick={play}
      aria-label={playing ? "Playing sketch" : "Play sketch"}
      className="flex flex-col items-center gap-6 cursor-pointer"
    >
      <span
        className="flex size-20 items-center justify-center rounded-full border-2 transition-transform active:scale-95"
        style={{ borderColor: duotone.ink }}
      >
        {playing ? (
          <span className="flex gap-1">
            <span
              className="h-6 w-1.5 rounded-full"
              style={{ background: duotone.ink }}
            />
            <span
              className="h-6 w-1.5 rounded-full"
              style={{ background: duotone.ink }}
            />
          </span>
        ) : (
          <span
            className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent"
            style={{ borderLeftColor: duotone.ink }}
          />
        )}
      </span>

      <span className="flex items-end gap-2">
        {notes.map((n, i) => (
          <span
            key={i}
            className="w-2 rounded-full transition-all duration-150"
            style={{
              height: 10 + n * 3,
              background: duotone.ink,
              opacity: activeStep === i ? 1 : 0.35,
              transform: activeStep === i ? "scaleY(1.15)" : "scaleY(1)",
            }}
          />
        ))}
      </span>
    </button>
  );
}
