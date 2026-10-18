/**
 * Multi-stop linear-gradient with eased alpha.
 * Inspired by https://codepen.io/jh3y/pen/MYyvqBd (easedHslGradient) —
 * easing stop positions/alpha so the dissolve isn’t a harsh 2-stop ramp.
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
  // Degenerate linear
  if (x1 === y1 && x2 === y2) return (t) => clamp01(t);

  // Sample X(t) / Y(t) for cubic Bézier with P0=(0,0), P3=(1,1)
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
      const x2 = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(x2) < 1e-6 || Math.abs(d) < 1e-6) break;
      t = clamp01(t - x2 / d);
    }
    // Bisection fallback
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
  // Theme-safe: works with CSS variables like var(--color-bg-base)
  return `color-mix(in srgb, ${color} ${+(a * 100).toFixed(2)}%, transparent)`;
}

/**
 * @param {object} opts
 * @param {string} [opts.direction='to bottom']
 * @param {string} [opts.color='var(--color-bg-base)']
 * @param {number} [opts.steps=16] - stop count (8–24 typical)
 * @param {string|number[]} [opts.easing='ease-in-out']
 * @param {number} [opts.solidPct=0] - % of gradient held fully opaque at the opaque end
 * @param {number} [opts.maxAlpha=1]
 * @param {boolean} [opts.easePosition=true] - ease stop *positions* (HD trick from the pen)
 * @returns {string} CSS linear-gradient(...)
 */
export function easedAlphaGradient({
  direction = "to bottom",
  color = "var(--color-bg-base)",
  steps = 16,
  easing = "ease-in-out",
  solidPct = 0,
  maxAlpha = 1,
  easePosition = true,
} = {}) {
  const n = Math.max(2, Math.round(steps));
  const ease = resolveEasing(easing);
  const solid = clamp01(solidPct / 100);
  // Eased region occupies the non-solid portion
  const fadeEnd = 1 - solid; // in 0..1 along the gradient axis
  const stops = [];

  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 1 : i / (n - 1); // 0 → 1 master
    // Alpha: 0 at start → maxAlpha at end of fade region, then hold
    const alphaT = t >= fadeEnd || fadeEnd === 0 ? 1 : t / fadeEnd;
    // Ease alpha (smooth dissolve) — not a constant-rate 2-stop ramp
    const alpha = maxAlpha * ease(alphaT);

    // Position along gradient (0% → 100%)
    let posT = t;
    if (easePosition && t < fadeEnd && fadeEnd > 0) {
      // Pack stops where the eased curve changes most (pen’s easePos)
      const local = t / fadeEnd;
      posT = ease(local) * fadeEnd;
    }
    const pos = +(posT * 100).toFixed(2);
    stops.push(`${stopColor(color, alpha)} ${pos}%`);
  }

  // Guarantee fully opaque final stop at 100%
  stops.push(`${stopColor(color, maxAlpha)} 100%`);

  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}

/** Tint dissolve into page background (opaque at bottom). */
export function buildFadeTintGradient({
  steps,
  easing,
  solidPct,
  maxAlpha = 1,
} = {}) {
  return easedAlphaGradient({
    direction: "to bottom",
    color: "var(--color-bg-base)",
    steps,
    easing,
    solidPct,
    maxAlpha,
    easePosition: true,
  });
}

/** Matching mask for blur layer (opaque blur at bottom). */
export function buildFadeMaskGradient({ steps, easing, solidPct } = {}) {
  return easedAlphaGradient({
    direction: "to bottom",
    color: "#000",
    steps,
    easing,
    solidPct,
    maxAlpha: 1,
    easePosition: true,
  });
}

/** Harsh 2-stop reference (for before/compare). */
export function buildTwoStopFadeGradient({
  solidPct = 22,
  color = "var(--color-bg-base)",
} = {}) {
  const solid = clamp01(solidPct / 100);
  const solidPos = +((1 - solid) * 100).toFixed(2);
  return `linear-gradient(to bottom, transparent 0%, ${color} ${solidPos}%, ${color} 100%)`;
}
