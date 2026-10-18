/**
 * Multi-stop linear-gradient with eased alpha — mapped from
 * https://codepen.io/jh3y/pen/MYyvqBd `easedHslGradient`.
 *
 * Critical: ease **position** (easePos) and **alpha** (easeA) separately
 * from the same master t. If easePos === easeA, alpha-vs-screen-position
 * collapses to a linear ramp (looks identical to a 2-stop gradient).
 * Default: easePos = linear (even spacing), easeA = selected easing.
 */

export const EASING_PRESETS = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  /** Matches the pen’s inOutCubic feel */
  "in-out-cubic": [0.65, 0, 0.35, 1],
};

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Unit cubic-bezier solver → (t) => eased progress in [0,1].
 * @param {[number, number, number, number]|string} easing
 */
export function resolveEasing(easing = "ease-in-out") {
  let bezier = easing;
  if (typeof easing === "string") {
    bezier = EASING_PRESETS[easing] || EASING_PRESETS["ease-in-out"];
  }
  const [x1, y1, x2, y2] = bezier;
  if (x1 === y1 && x2 === y2) return (t) => clamp01(t);

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;

  function solveX(x) {
    let t0 = 0;
    let t1 = 1;
    let t = x;
    for (let i = 0; i < 12; i++) {
      const x2 = sampleX(t);
      if (Math.abs(x2 - x) < 1e-6) break;
      if (x > x2) t0 = t;
      else t1 = t;
      t = (t0 + t1) / 2;
    }
    return t;
  }

  return (t) => clamp01(sampleY(solveX(clamp01(t))));
}

function stopColor(color, alpha) {
  const a = Math.round(clamp01(alpha) * 10000) / 10000;
  if (a <= 0) return "transparent";
  if (a >= 1) return color;
  return `color-mix(in srgb, ${color} ${+(a * 100).toFixed(2)}%, transparent)`;
}

/**
 * Pen-faithful stop builder:
 *   t = i/(steps-1)
 *   pos = lerp(0, fadeEnd, easePos(t))
 *   alpha = maxAlpha * easeA(t)
 * then solid hold from fadeEnd → 100%.
 *
 * @param {object} opts
 * @param {string} [opts.direction='to bottom']
 * @param {string} [opts.color='var(--color-bg-base)']
 * @param {number} [opts.steps=16]
 * @param {string|number[]} [opts.easeA='ease-in-out'] - alpha channel easing
 * @param {string|number[]} [opts.easePos='linear'] - position easing (pack stops)
 * @param {number} [opts.solidPct=0] - % held fully opaque at the opaque end
 * @param {number} [opts.maxAlpha=1]
 */
export function easedAlphaGradient({
  direction = "to bottom",
  color = "var(--color-bg-base)",
  steps = 16,
  easeA = "ease-in-out",
  easePos = "linear",
  solidPct = 0,
  maxAlpha = 1,
} = {}) {
  const n = Math.max(2, Math.round(steps));
  const easeAlpha = resolveEasing(easeA);
  const easePosition = resolveEasing(easePos);
  const solid = clamp01(solidPct / 100);
  const fadeEnd = 1 - solid; // transition occupies [0, fadeEnd]
  const stops = [];

  if (fadeEnd <= 0) {
    // Fully solid band
    stops.push(`${stopColor(color, maxAlpha)} 0%`);
    stops.push(`${stopColor(color, maxAlpha)} 100%`);
    return `linear-gradient(${direction}, ${stops.join(", ")})`;
  }

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // Pen: tp = easePos(t), uA = easeA(t) — same master t, separate curves
    const tp = easePosition(t);
    const uA = easeAlpha(t);
    const pos = +(tp * fadeEnd * 100).toFixed(2);
    const alpha = maxAlpha * uA;
    stops.push(`${stopColor(color, alpha)} ${pos}%`);
  }

  // Solid hold through the opaque end (matches prior solid% behavior)
  const solidStart = +(fadeEnd * 100).toFixed(2);
  stops.push(`${stopColor(color, maxAlpha)} ${solidStart}%`);
  stops.push(`${stopColor(color, maxAlpha)} 100%`);

  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}

/** Tint dissolve into page background. Default: opaque at bottom (`to bottom`). */
export function buildFadeTintGradient({
  direction = "to bottom",
  steps,
  easeA,
  easePos,
  solidPct,
  maxAlpha = 1,
} = {}) {
  return easedAlphaGradient({
    direction,
    color: "var(--color-bg-base)",
    steps,
    easeA: easeA ?? "ease-in-out",
    easePos: easePos ?? "linear",
    solidPct,
    maxAlpha,
  });
}

/** Matching mask for blur layer. Default: opaque blur at bottom (`to bottom`). */
export function buildFadeMaskGradient({
  direction = "to bottom",
  steps,
  easeA,
  easePos,
  solidPct,
} = {}) {
  return easedAlphaGradient({
    direction,
    color: "#000",
    steps,
    easeA: easeA ?? "ease-in-out",
    easePos: easePos ?? "linear",
    solidPct,
    maxAlpha: 1,
  });
}
