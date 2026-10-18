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

export const EASING_PRESET_KEYS = Object.keys(EASING_PRESETS);

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
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  function solveX(x) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xErr = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(xErr) < 1e-6 || Math.abs(d) < 1e-6) break;
      t = clamp01(t - xErr / d);
    }
    let t0 = 0;
    let t1 = 1;
    t = x;
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
  /** @deprecated use easeA — kept so old call sites keep working */
  easing,
  solidPct = 0,
  maxAlpha = 1,
} = {}) {
  const n = Math.max(2, Math.round(steps));
  const easeAlpha = resolveEasing(easeA ?? easing ?? "ease-in-out");
  const easePosition = resolveEasing(easePos ?? "linear");
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
    const t = n === 1 ? 1 : i / (n - 1);
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
  easing,
  solidPct,
  maxAlpha = 1,
} = {}) {
  return easedAlphaGradient({
    direction,
    color: "var(--color-bg-base)",
    steps,
    easeA: easeA ?? easing ?? "ease-in-out",
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
  easing,
  solidPct,
} = {}) {
  return easedAlphaGradient({
    direction,
    color: "#000",
    steps,
    easeA: easeA ?? easing ?? "ease-in-out",
    easePos: easePos ?? "linear",
    solidPct,
    maxAlpha: 1,
  });
}

/** Harsh 2-stop reference (for before/compare). */
export function buildTwoStopFadeGradient({
  direction = "to bottom",
  solidPct = 22,
  color = "var(--color-bg-base)",
} = {}) {
  const solid = clamp01(solidPct / 100);
  const solidPos = +((1 - solid) * 100).toFixed(2);
  return `linear-gradient(${direction}, transparent 0%, ${color} ${solidPos}%, ${color} 100%)`;
}
