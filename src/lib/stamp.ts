/** Deterministic ink-stamp rendering params, derived from a date string. */

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rng() {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function int(rng: () => number, min: number, max: number): number {
  return Math.floor(range(rng, min, max + 1));
}

/** "2026-07-08" -> "JUL 08 2026", classic dater-stamp format. */
export function formatStampDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  const month = date
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
}

export type Speck = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

export type CharJitter = {
  spacing: number; // extra letter-spacing, em
  rotate: number; // deg
  y: number; // px
};

export type StampParams = {
  seed: number;
  rotation: number;
  translateX: number;
  translateY: number;
  displaceSeed: number;
  displaceFreq: number;
  roughness: number;
  grainSeed: number;
  grainFreq: number;
  grainTable: string;
  blur: number;
  alphaPunch: number;
  pressureCx: number;
  pressureCy: number;
  pressureRadius: number;
  specks: Speck[];
  chars: CharJitter[];
};

/**
 * Same (seed, nonce) always yields the same params. `nonce` exists so a
 * "restamp" interaction can re-roll the impression without changing the
 * text itself.
 */
export function stampParamsFor(seedKey: string, text: string, nonce = 0): StampParams {
  const seed = djb2(`${seedKey}:${nonce}`);
  const rng = mulberry32(seed);

  const rotation = range(rng, -5, 5);
  const translateX = range(rng, -3, 3);
  const translateY = range(rng, -3, 3);

  const displaceSeed = int(rng, 0, 9999);
  const displaceFreq = range(rng, 0.02, 0.035);
  const roughness = range(rng, 0.12, 0.32);

  const grainSeed = int(rng, 0, 9999);
  const grainFreq = range(rng, 0.08, 0.16);
  const gritRatio = range(rng, 0.89, 0.97);
  const table = Array.from({ length: 10 }, () => (rng() < gritRatio ? 1 : 0));
  if (!table.includes(1)) table[Math.floor(table.length / 2)] = 1;
  const grainTable = table.join(" ");

  const blur = range(rng, 0.15, 0.3);
  const alphaPunch = range(rng, 1.4, 1.9);

  const pressureCx = range(rng, 38, 62);
  const pressureCy = range(rng, 30, 70);
  const pressureRadius = range(rng, 78, 100);

  const speckCount = int(rng, 4, 10) + Math.floor(text.length / 30);
  const specks: Speck[] = Array.from({ length: speckCount }, () => ({
    x: range(rng, -10, 110),
    y: range(rng, -30, 130),
    size: range(rng, 1, 3),
    opacity: range(rng, 0.15, 0.45),
  }));

  const chars: CharJitter[] = Array.from({ length: text.length }, () => ({
    spacing: range(rng, -0.01, 0.1),
    rotate: range(rng, -1.5, 1.5),
    y: range(rng, -0.5, 0.5),
  }));

  return {
    seed,
    rotation,
    translateX,
    translateY,
    displaceSeed,
    displaceFreq,
    roughness,
    grainSeed,
    grainFreq,
    grainTable,
    blur,
    alphaPunch,
    pressureCx,
    pressureCy,
    pressureRadius,
    specks,
    chars,
  };
}
