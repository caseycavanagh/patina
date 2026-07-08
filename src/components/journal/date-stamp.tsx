import { formatStampDate, stampParamsFor } from "@/lib/stamp";
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
  const text = formatStampDate(date);
  const params = stampParamsFor(date, text, nonce);
  const filterId = `stamp-filter-${params.seed}`;

  const maskImage = `radial-gradient(circle at ${params.pressureCx}% ${params.pressureCy}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) ${
    params.pressureRadius * 0.8
  }%, rgba(0,0,0,0.55) ${params.pressureRadius * 1.3}%)`;

  return (
    <span
      className={cn("relative inline-block select-none", className)}
      style={{
        transform: `rotate(${params.rotation}deg) translate(${params.translateX}px, ${params.translateY}px)`,
        color,
      }}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden className="relative inline-block">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={params.displaceFreq}
              numOctaves={2}
              seed={params.displaceSeed}
              result="displaceNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displaceNoise"
              scale={params.roughness}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency={params.grainFreq}
              numOctaves={2}
              seed={params.grainSeed}
              result="grain"
            />
            <feComponentTransfer in="grain" result="grainMask">
              <feFuncA type="discrete" tableValues={params.grainTable} />
            </feComponentTransfer>
            <feComposite in="displaced" in2="grainMask" operator="in" result="inked" />
            <feGaussianBlur in="inked" stdDeviation={params.blur} result="softened" />
            <feComponentTransfer in="softened">
              <feFuncA type="linear" slope={params.alphaPunch} intercept={0} />
            </feComponentTransfer>
          </filter>
        </svg>

        <span
          className="inline-block whitespace-nowrap font-mono font-bold uppercase"
          style={{
            filter: `url(#${filterId})`,
            WebkitMaskImage: maskImage,
            maskImage,
          }}
        >
          {Array.from(text).map((ch, i) => {
            const jitter = params.chars[i];
            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  marginRight: `${jitter.spacing}em`,
                  transform: `rotate(${jitter.rotate}deg) translateY(${jitter.y}px)`,
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            );
          })}
        </span>

        {params.specks.map((speck, i) => (
          <span
            key={i}
            className="absolute rounded-full mix-blend-multiply"
            style={{
              left: `${speck.x}%`,
              top: `${speck.y}%`,
              width: speck.size,
              height: speck.size,
              background: color,
              opacity: speck.opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </span>
    </span>
  );
}
