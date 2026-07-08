import { Duotone } from "@/lib/duotones";

export function PhotoFrame({
  duotone,
  seed,
}: {
  duotone: Duotone;
  seed: string;
}) {
  const tilt = seed.charCodeAt(0) % 2 === 0 ? "-rotate-2" : "rotate-2";

  return (
    <div
      className={`${tilt} w-full max-w-[280px] aspect-[4/5] rounded-sm p-2 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.45)]`}
      style={{ background: duotone.bg }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[2px]"
        style={{
          backgroundImage: `linear-gradient(155deg, ${duotone.ink}22, transparent 55%), linear-gradient(-25deg, ${duotone.ink}33, ${duotone.bg} 70%)`,
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay"
          aria-hidden
        >
          <filter id={`grain-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
        </svg>
      </div>
    </div>
  );
}
