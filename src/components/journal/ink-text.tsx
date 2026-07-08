import { stampParamsFor, CharJitter } from "@/lib/stamp";
import { cn } from "@/lib/utils";

function CharSpan({ ch, jitter }: { ch: string; jitter: CharJitter }) {
  return (
    <span
      className="inline-block"
      style={{
        marginRight: `${jitter.spacing}em`,
        transform: `rotate(${jitter.rotate}deg) translateY(${jitter.y}px)`,
      }}
    >
      {ch}
    </span>
  );
}

/**
 * Renders `text` through the same generative ink-stamp pipeline as
 * DateStamp: seeded SVG grain/displacement filter, an alpha mask for
 * uneven pressure, scattered specks, and per-character letter-spacing +
 * rotation jitter. Same (seed, nonce) always renders identically.
 *
 * `wrap: true` (default) lets the text flow and break between words, for
 * body copy. `wrap: false` keeps it a single unbreakable line, for short
 * labels like a wordmark or a date.
 */
export function InkText({
  text,
  seed,
  color = "currentColor",
  nonce = 0,
  wrap = true,
  className,
}: {
  text: string;
  seed: string;
  color?: string;
  nonce?: number;
  wrap?: boolean;
  className?: string;
}) {
  const params = stampParamsFor(seed, text, nonce);
  const filterId = `ink-filter-${params.seed}`;

  const maskImage = `radial-gradient(circle at ${params.pressureCx}% ${params.pressureCy}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) ${
    params.pressureRadius * 0.8
  }%, rgba(0,0,0,0.78) ${params.pressureRadius * 1.3}%)`;

  const words = text.split(" ");
  const wordStarts = words.reduce<number[]>((starts, word, i) => {
    const prevStart = i === 0 ? 0 : starts[i - 1];
    const prevLen = i === 0 ? 0 : words[i - 1].length + 1;
    starts.push(prevStart + prevLen);
    return starts;
  }, []);

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

        {wrap ? (
          <span
            className="inline"
            style={{
              filter: `url(#${filterId})`,
              WebkitMaskImage: maskImage,
              maskImage,
            }}
          >
            {words.map((word, wi) => {
              const wordSpan = (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {Array.from(word).map((ch, ci) => {
                    const jitter = params.chars[wordStarts[wi] + ci] ?? {
                      spacing: 0,
                      rotate: 0,
                      y: 0,
                    };
                    return <CharSpan key={ci} ch={ch} jitter={jitter} />;
                  })}
                </span>
              );
              return wi === 0 ? (
                wordSpan
              ) : (
                <span key={`sp-${wi}`}>
                  {" "}
                  {wordSpan}
                </span>
              );
            })}
          </span>
        ) : (
          <span
            className="inline-block whitespace-nowrap"
            style={{
              filter: `url(#${filterId})`,
              WebkitMaskImage: maskImage,
              maskImage,
            }}
          >
            {Array.from(text).map((ch, i) => {
              const jitter = params.chars[i] ?? { spacing: 0, rotate: 0, y: 0 };
              return (
                <CharSpan key={i} ch={ch === " " ? " " : ch} jitter={jitter} />
              );
            })}
          </span>
        )}

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
