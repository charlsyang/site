/**
 * TEMPORARY phone easter-egg physics tune panel — strip before merge.
 * Open: /work?tune=1 at ≤550px. Values persist in localStorage.
 *
 * To remove: delete this file and the `EggTune` lines in MasonryGrid.js
 * (search "EggTune").
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { QUERIES } from "../utils/constants";

const STORAGE_KEY = "eggTune:v1";

export const EGG_TUNE_DEFAULTS = {
  floor: 56, // px above the band bottom; below it, tiles are clipped by the band
  tiles: "mostly", // "mostly" (≥60% in view) | "visible" (any part) | "all"
  cap: 8, // 0 = no cap
  burst: 1, // × upward launch speed
  spread: 0, // outward launch speed
  gravity: 1.5,
  restitution: 0.2,
  friction: 0.3,
  frictionAir: 0.05,
  density: 1, // × Matter default (0.001)
  walls: true,
  fixDelay: 800, // ms before the fix button is tappable
};

const MIN_VISIBLE = { mostly: 0.6, visible: 0.001, all: -Infinity };

const SLIDERS = [
  {
    key: "floor",
    label: "Floor",
    min: -600,
    max: 200,
    step: 4,
    unit: "px",
  },
  { key: "cap", label: "Cap", min: 0, max: 18, step: 1, fmt: (v) => v || "∞" },
  { key: "burst", label: "Burst", min: 0, max: 3, step: 0.1 },
  { key: "spread", label: "Spread", min: 0, max: 10, step: 0.5 },
  { key: "gravity", label: "Gravity", min: 0, max: 4, step: 0.1 },
  { key: "restitution", label: "Bounce", min: 0, max: 1, step: 0.05 },
  { key: "friction", label: "Friction", min: 0, max: 1, step: 0.05 },
  { key: "frictionAir", label: "Air", min: 0, max: 0.2, step: 0.005 },
  { key: "density", label: "Density", min: 0.2, max: 5, step: 0.1 },
  { key: "fixDelay", label: "Fix in", min: 0, max: 2000, step: 50, unit: "ms" },
];

const gridBottomGap = () => {
  const grid = document.querySelector('[aria-label="Visual gallery"]');
  return grid
    ? Math.round(window.innerHeight - grid.getBoundingClientRect().bottom)
    : 300;
};

const PRESETS = [
  { label: "Default", values: () => ({}) },
  { label: "Fewer tiles", values: () => ({ cap: 4 }) },
  { label: "Lower floor", values: () => ({ floor: -120 }) },
  // Tiles overhang their bodies by ~24px; land the visual edge on the screen edge
  { label: "Screen bottom", values: () => ({ floor: 24 - gridBottomGap() }) },
];

// ============================================
// Store (module-level so the physics loop can read it without re-renders)
// ============================================

let enabled = null;
let values = EGG_TUNE_DEFAULTS;
const listeners = new Set();

function isEnabled() {
  if (enabled === null && typeof window !== "undefined") {
    enabled = new URLSearchParams(window.location.search).get("tune") === "1";
    if (enabled) {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved) values = { ...EGG_TUNE_DEFAULTS, ...saved };
      } catch (e) {
        // Ignore unreadable storage
      }
    }
  }
  return !!enabled;
}

function setValues(next) {
  values = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch (e) {
    // Ignore storage failures (private mode)
  }
  listeners.forEach((fn) => fn(values));
}

function toBounds(v) {
  return {
    groundInset: v.floor,
    minVisible: MIN_VISIBLE[v.tiles] ?? 0.6,
    maxBodies: v.cap > 0 ? v.cap : Infinity,
    burst: v.burst,
    spread: v.spread,
    gravity: v.gravity,
    restitution: v.restitution,
    friction: v.friction,
    frictionAir: v.frictionAir,
    density: v.density * 0.001,
    walls: v.walls,
  };
}

/** Phone bounds with tune overrides applied (no-op without ?tune=1) */
export function withEggTune(bounds) {
  return isEnabled() ? { ...bounds, ...toBounds(values) } : bounds;
}

/** Live values for React (null without ?tune=1) */
export function useEggTune() {
  const [v, setV] = useState(null);
  useEffect(() => {
    if (!isEnabled()) return;
    setV(values);
    listeners.add(setV);
    return () => listeners.delete(setV);
  }, []);
  return v;
}

/**
 * Push live changes into a running engine. Launch values (tiles, cap, burst,
 * spread) apply on the next break. Returns an unsubscribe.
 */
export function subscribeEggTuneLive({
  Matter,
  engine,
  bounds,
  ground,
  walls,
  bodiesRef,
  sizeRef,
}) {
  if (!isEnabled()) return () => {};

  const apply = (v) => {
    const b = toBounds(v);
    Object.assign(bounds, {
      groundInset: b.groundInset,
      gravity: b.gravity,
      restitution: b.restitution,
      friction: b.friction,
      frictionAir: b.frictionAir,
      density: b.density,
      walls: b.walls,
    });
    engine.gravity.y = b.gravity;
    bodiesRef.current.forEach(({ body }) => {
      body.restitution = b.restitution;
      body.friction = b.friction;
      body.frictionAir = b.frictionAir;
      Matter.Body.setDensity(body, b.density);
    });
    const { width, height } = sizeRef.current;
    Matter.Body.setPosition(ground, {
      x: width / 2,
      y: height - b.groundInset + bounds.wallThickness / 2,
    });
    const inWorld = engine.world.bodies.includes(walls.left);
    if (b.walls && !inWorld) {
      Matter.Composite.add(engine.world, [walls.left, walls.right]);
    } else if (!b.walls && inWorld) {
      Matter.Composite.remove(engine.world, walls.left);
      Matter.Composite.remove(engine.world, walls.right);
    }
  };

  apply(values);
  listeners.add(apply);
  return () => listeners.delete(apply);
}

// ============================================
// Panel
// ============================================

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function EggTunePanel({ onRetrigger }) {
  const v = useEggTune();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!v) return null;

  const set = (patch) => setValues({ ...values, ...patch });
  const copy = async () => {
    const ok = await copyText(JSON.stringify(values, null, 2));
    setCopied(ok ? "Copied" : "Failed");
    setTimeout(() => setCopied(false), 1200);
  };

  return createPortal(
    <Panel aria-label="Easter egg tuning">
      <Header>
        <Title>Egg</Title>
        <Btn type="button" $accent onClick={onRetrigger}>
          Re-break
        </Btn>
        <Btn type="button" onClick={copy}>
          {copied || "Copy"}
        </Btn>
        <Btn type="button" onClick={() => setValues(EGG_TUNE_DEFAULTS)}>
          Reset
        </Btn>
        <Btn
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand tuning" : "Collapse tuning"}
        >
          {collapsed ? "▴" : "▾"}
        </Btn>
      </Header>
      {!collapsed && (
        <>
          <Chips>
            {PRESETS.map((p) => (
              <Btn
                key={p.label}
                type="button"
                onClick={() => {
                  setValues({ ...EGG_TUNE_DEFAULTS, ...p.values() });
                  onRetrigger();
                }}
              >
                {p.label}
              </Btn>
            ))}
          </Chips>
          <Chips>
            {Object.keys(MIN_VISIBLE).map((mode) => (
              <Btn
                key={mode}
                type="button"
                $active={v.tiles === mode}
                onClick={() => set({ tiles: mode })}
              >
                {mode}
              </Btn>
            ))}
            <Btn
              type="button"
              $active={v.walls}
              onClick={() => set({ walls: !v.walls })}
            >
              Walls {v.walls ? "on" : "off"}
            </Btn>
          </Chips>
          <Grid>
            {SLIDERS.map((s) => (
              <Slider key={s.key}>
                <span>
                  {s.label}
                  <b>
                    {s.fmt ? s.fmt(v[s.key]) : v[s.key]}
                    {s.unit}
                  </b>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={v[s.key]}
                  onChange={(e) => set({ [s.key]: Number(e.target.value) })}
                />
              </Slider>
            ))}
          </Grid>
        </>
      )}
    </Panel>,
    document.body
  );
}

/* Bottom strip over the bio — the grid band and egg message stay visible */
const Panel = styled.aside`
  display: none;

  @media ${QUERIES.phoneAndBelow} {
    display: block;
    position: fixed;
    left: 6px;
    right: 6px;
    bottom: calc(6px + env(safe-area-inset-bottom));
    z-index: 9999;
    padding: 5px 6px;
    border-radius: 8px;
    background: rgba(20, 18, 16, 0.88);
    color: #f5f2ec;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 9px;
    line-height: 1.2;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  & > :nth-child(2) {
    margin-left: auto;
  }
`;

const Title = styled.strong`
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffb4a2;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-top: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px 8px;
  margin-top: 3px;
`;

const Slider = styled.label`
  display: block;

  span {
    display: flex;
    justify-content: space-between;
  }

  b {
    font-weight: normal;
    color: #ffd7a8;
    font-variant-numeric: tabular-nums;
  }

  input[type="range"] {
    width: 100%;
    height: 18px;
    margin: 0;
    padding: 0;
  }
`;

const Btn = styled.button`
  appearance: none;
  border: 1px solid
    ${({ $active, $accent }) =>
      $active || $accent
        ? "rgba(255, 180, 162, 0.7)"
        : "rgba(255, 255, 255, 0.22)"};
  background: ${({ $active, $accent }) =>
    $active || $accent
      ? "rgba(255, 180, 162, 0.18)"
      : "rgba(255, 255, 255, 0.08)"};
  color: inherit;
  border-radius: 4px;
  padding: 3px 6px;
  font: inherit;
  cursor: pointer;
  line-height: 1.2;
`;
