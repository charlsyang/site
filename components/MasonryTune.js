/**
 * TEMPORARY phone masonry tune panel — remove before merge (or keep behind ?tune=1).
 * Open: /work?tune=1 at ≤550px.
 * Compact by default so the grid dissolve stays visible while dragging.
 */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { QUERIES } from "../utils/constants";
import {
  EASING_PRESET_KEYS,
  buildFadeMaskGradient,
  buildFadeTintGradient,
  buildTwoStopFadeGradient,
} from "../utils/easedGradient";

/** Defaults: nav-height is 56px → top inset ≈ half = 28px */
export const MASONRY_TUNE_DEFAULTS = {
  gridHeightVh: 55,
  topInsetPx: 28,
  fadeHeightPx: 140,
  fadeSolidPct: 18,
  fadeBlurPx: 16,
  fadeTint: 1,
  fadeStops: 16,
  fadeEasing: "ease-in-out",
  headlineOverlapPx: 56,
  /** Debug: force harsh 2-stop gradient for A/B */
  fadeTwoStop: 0,
};

const VAR_MAP = {
  gridHeightVh: "--masonry-grid-height",
  topInsetPx: "--masonry-top-inset",
  fadeHeightPx: "--masonry-fade-height",
  fadeSolidPct: "--masonry-fade-solid",
  fadeBlurPx: "--masonry-fade-blur",
  fadeTint: "--masonry-fade-tint",
  headlineOverlapPx: "--masonry-headline-overlap",
};

/** Fade-focused controls shown in compact mode (default) */
const FADE_KEYS = [
  "fadeHeightPx",
  "fadeSolidPct",
  "fadeStops",
  "fadeBlurPx",
  "fadeTint",
  "headlineOverlapPx",
];

const ALL_SLIDERS = [
  { key: "gridHeightVh", label: "Grid h", unit: "vh", min: 40, max: 75, step: 1 },
  { key: "topInsetPx", label: "Top inset", unit: "px", min: 0, max: 64, step: 1 },
  { key: "fadeHeightPx", label: "Fade h", unit: "px", min: 48, max: 240, step: 1 },
  { key: "fadeSolidPct", label: "Solid %", unit: "%", min: 0, max: 80, step: 1 },
  { key: "fadeStops", label: "Stops", unit: "", min: 4, max: 24, step: 1 },
  { key: "fadeBlurPx", label: "Blur", unit: "px", min: 0, max: 40, step: 1 },
  { key: "fadeTint", label: "Strength", unit: "", min: 0, max: 1, step: 0.05 },
  {
    key: "headlineOverlapPx",
    label: "Overlap",
    unit: "px",
    min: 0,
    max: 120,
    step: 1,
  },
];

function formatVar(key, value) {
  if (key === "gridHeightVh") return `${value}vh`;
  if (key === "fadeTint") return String(value);
  if (key === "fadeSolidPct") return `${value}%`;
  if (key === "fadeStops" || key === "fadeTwoStop") return String(value);
  if (key === "fadeEasing") return String(value);
  return `${value}px`;
}

export function buildFadeGradients(values) {
  const steps = values.fadeStops;
  const easing = values.fadeEasing;
  const solidPct = values.fadeSolidPct;
  const maxAlpha = values.fadeTint;

  if (values.fadeTwoStop) {
    const tint = buildTwoStopFadeGradient({ solidPct });
    const mask = buildTwoStopFadeGradient({
      solidPct,
      color: "#000",
    });
    return { tint, mask };
  }

  return {
    tint: buildFadeTintGradient({ steps, easing, solidPct, maxAlpha: 1 }),
    mask: buildFadeMaskGradient({ steps, easing, solidPct }),
  };
}

/** Apply numeric layout vars + regenerated eased gradients to :root */
export function applyMasonryTuneVars(values) {
  const root = document.documentElement;
  Object.entries(VAR_MAP).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, formatVar(key, values[key]));
  });
  const { tint, mask } = buildFadeGradients(values);
  root.style.setProperty("--masonry-fade-tint-gradient", tint);
  root.style.setProperty("--masonry-fade-mask-gradient", mask);
  root.style.setProperty("--masonry-fade-stops", String(values.fadeStops));
  root.style.setProperty("--masonry-fade-easing", values.fadeEasing);
}

function clearVars() {
  const root = document.documentElement;
  Object.values(VAR_MAP).forEach((cssVar) => {
    root.style.removeProperty(cssVar);
  });
  root.style.removeProperty("--masonry-fade-tint-gradient");
  root.style.removeProperty("--masonry-fade-mask-gradient");
  root.style.removeProperty("--masonry-fade-stops");
  root.style.removeProperty("--masonry-fade-easing");
}

/** Default gradient strings for CSS fallbacks (no tune widget). */
export const DEFAULT_FADE_GRADIENTS = buildFadeGradients(MASONRY_TUNE_DEFAULTS);

export default function MasonryTune() {
  const [values, setValues] = useState(MASONRY_TUNE_DEFAULTS);
  const [collapsed, setCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showVars, setShowVars] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    applyMasonryTuneVars(values);
    return () => clearVars();
  }, [values]);

  const set = (key, raw) => {
    const num = Number(raw);
    setValues((prev) => ({ ...prev, [key]: num }));
  };

  const snippet = [
    ...Object.entries(VAR_MAP).map(
      ([key, cssVar]) => `${cssVar}: ${formatVar(key, values[key])};`
    ),
    `--masonry-fade-stops: ${values.fadeStops};`,
    `--masonry-fade-easing: ${values.fadeEasing};`,
    `/* tint gradient (${values.fadeTwoStop ? "2-stop" : "eased"}) */`,
    `--masonry-fade-tint-gradient: ${buildFadeGradients(values).tint};`,
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const sliders = showAll
    ? ALL_SLIDERS
    : ALL_SLIDERS.filter((s) => FADE_KEYS.includes(s.key));

  return (
    <Panel data-masonry-tune $collapsed={collapsed}>
      <Header>
        <Title>Tune</Title>
        <HeaderActions>
          {!collapsed && (
            <>
              <SmallBtn
                type="button"
                $active={showAll}
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? "Fade" : "All"}
              </SmallBtn>
              <SmallBtn
                type="button"
                $active={!!values.fadeTwoStop}
                onClick={() =>
                  setValues((prev) => ({
                    ...prev,
                    fadeTwoStop: prev.fadeTwoStop ? 0 : 1,
                  }))
                }
                title="Toggle harsh 2-stop vs eased multi-stop"
              >
                {values.fadeTwoStop ? "2-stop" : "Eased"}
              </SmallBtn>
              <SmallBtn type="button" onClick={() => setValues(MASONRY_TUNE_DEFAULTS)}>
                Reset
              </SmallBtn>
              <SmallBtn type="button" onClick={copy}>
                {copied ? "OK" : "Copy"}
              </SmallBtn>
            </>
          )}
          <SmallBtn type="button" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? "▸" : "▾"}
          </SmallBtn>
        </HeaderActions>
      </Header>
      {!collapsed && (
        <Body>
          <EasingRow>
            <span>Easing</span>
            <select
              value={values.fadeEasing}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, fadeEasing: e.target.value }))
              }
            >
              {EASING_PRESET_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </EasingRow>
          <Grid>
            {sliders.map((s) => (
              <Slider
                key={s.key}
                label={s.label}
                unit={s.unit}
                min={s.min}
                max={s.max}
                step={s.step}
                value={values[s.key]}
                onChange={(v) => set(s.key, v)}
              />
            ))}
          </Grid>
          <VarsToggle type="button" onClick={() => setShowVars((v) => !v)}>
            {showVars ? "Hide vars" : "Show vars"}
          </VarsToggle>
          {showVars && <pre>{snippet}</pre>}
        </Body>
      )}
    </Panel>
  );
}

function Slider({ label, unit, min, max, step, value, onChange }) {
  return (
    <Row>
      <LabelRow>
        <span>{label}</span>
        <ValueReadout>
          {value}
          {unit}
        </ValueReadout>
      </LabelRow>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Row>
  );
}

/* Bottom-right strip — leaves dissolve visible on the left */
const Panel = styled.aside`
  display: none;

  @media ${QUERIES.phoneAndBelow} {
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 6px;
    bottom: 6px;
    left: auto;
    width: min(52vw, 210px);
    z-index: 9999;
    max-height: ${({ $collapsed }) => ($collapsed ? "auto" : "32vh")};
    overflow: hidden;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(20, 18, 16, 0.9);
    color: #f5f2ec;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 10px;
    line-height: 1.2;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-shrink: 0;
`;

const Title = styled.strong`
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffb4a2;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Body = styled.div`
  margin-top: 4px;
  overflow: auto;
  min-height: 0;
  flex: 1;

  pre {
    margin: 4px 0 0;
    white-space: pre-wrap;
    word-break: break-word;
    color: #d8d2c8;
    font-size: 9px;
  }
`;

const EasingRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 9px;

  select {
    flex: 1;
    min-width: 0;
    max-width: 120px;
    font: inherit;
    font-size: 9px;
    color: #f5f2ec;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 4px;
    padding: 2px 4px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 8px;
`;

const Row = styled.label`
  display: block;
  margin: 0;

  input[type="range"] {
    width: 100%;
    height: 14px;
    margin: 0;
    padding: 0;
  }
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  font-size: 9px;
`;

const ValueReadout = styled.span`
  color: #ffd7a8;
  font-variant-numeric: tabular-nums;
`;

const VarsToggle = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: #ffd7a8;
  font: inherit;
  font-size: 9px;
  padding: 4px 0 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
`;

const SmallBtn = styled.button`
  appearance: none;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 180, 162, 0.7)" : "rgba(255, 255, 255, 0.22)"};
  background: ${({ $active }) =>
    $active ? "rgba(255, 180, 162, 0.18)" : "rgba(255, 255, 255, 0.08)"};
  color: inherit;
  border-radius: 4px;
  padding: 1px 5px;
  font: inherit;
  font-size: 9px;
  cursor: pointer;
  line-height: 1.4;

  &:active {
    background: rgba(255, 255, 255, 0.16);
  }
`;
