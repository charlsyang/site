/**
 * TEMPORARY phone masonry tune panel — remove before merge (or keep behind ?tune=1).
 * Open: /work?tune=1 at ≤550px.
 * Compact by default so the grid dissolve stays visible while dragging.
 *
 * Locked bottom defaults (Charlsy-approved):
 *   Alpha ease-in-out · Pos linear · Fade h 140 · Solid 12% · Stops 16
 *   Blur 2 · Strength 1 · Overlap 56 · Top inset 28
 *
 * Top fade starts as a slightly shorter mirror; dial via Top section.
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

/**
 * Locked defaults (Charlsy-approved).
 * easeA (fadeEasing) shapes alpha; easePos stays linear so the dissolve
 * curve is visible (identical easePos+easeA collapses to a linear ramp).
 */
export const MASONRY_TUNE_DEFAULTS = {
  gridHeightVh: 55,
  topInsetPx: 20,
  /* —— Bottom (locked) —— */
  fadeHeightPx: 140,
  fadeSolidPct: 12,
  fadeBlurPx: 2,
  fadeTint: 1,
  fadeStops: 16,
  fadeEasing: "ease-in-out", // easeA — alpha channel
  fadePosEasing: "linear", // easePos — stop packing (keep linear!)
  headlineOverlapPx: 56,
  /* —— Top (locked) —— */
  topFadeHeightPx: 88,
  topFadeSolidPct: 0,
  topFadeBlurPx: 2,
  topFadeTint: 1,
  /** Debug: force harsh 2-stop gradient for A/B */
  fadeTwoStop: 0,
};

const LAYOUT_VAR_MAP = {
  gridHeightVh: "--masonry-grid-height",
  topInsetPx: "--masonry-top-inset",
  fadeHeightPx: "--masonry-fade-height",
  fadeSolidPct: "--masonry-fade-solid",
  fadeBlurPx: "--masonry-fade-blur",
  fadeTint: "--masonry-fade-tint",
  headlineOverlapPx: "--masonry-headline-overlap",
  topFadeHeightPx: "--masonry-top-fade-height",
  topFadeSolidPct: "--masonry-top-fade-solid",
  topFadeBlurPx: "--masonry-top-fade-blur",
  topFadeTint: "--masonry-top-fade-tint",
};

const BOTTOM_FADE_KEYS = [
  "fadeHeightPx",
  "fadeSolidPct",
  "fadeBlurPx",
  "fadeTint",
  "headlineOverlapPx",
];

const TOP_FADE_KEYS = [
  "topFadeHeightPx",
  "topFadeSolidPct",
  "topFadeBlurPx",
  "topFadeTint",
];

const LAYOUT_KEYS = ["gridHeightVh", "topInsetPx"];

const ALL_SLIDERS = [
  { key: "gridHeightVh", label: "Grid h", unit: "vh", min: 40, max: 75, step: 1 },
  { key: "topInsetPx", label: "Top inset", unit: "px", min: 0, max: 64, step: 1 },
  { key: "fadeHeightPx", label: "Fade h", unit: "px", min: 48, max: 240, step: 1 },
  { key: "fadeSolidPct", label: "Solid %", unit: "%", min: 0, max: 80, step: 1 },
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
  {
    key: "topFadeHeightPx",
    label: "Fade h",
    unit: "px",
    min: 32,
    max: 200,
    step: 1,
  },
  {
    key: "topFadeSolidPct",
    label: "Solid %",
    unit: "%",
    min: 0,
    max: 80,
    step: 1,
  },
  {
    key: "topFadeBlurPx",
    label: "Blur",
    unit: "px",
    min: 0,
    max: 40,
    step: 1,
  },
  {
    key: "topFadeTint",
    label: "Strength",
    unit: "",
    min: 0,
    max: 1,
    step: 0.05,
  },
];

function formatVar(key, value) {
  if (key === "gridHeightVh") return `${value}vh`;
  if (key === "fadeTint" || key === "topFadeTint") return String(value);
  if (key === "fadeSolidPct" || key === "topFadeSolidPct") return `${value}%`;
  if (key === "fadeStops" || key === "fadeTwoStop") return String(value);
  if (key === "fadeEasing" || key === "fadePosEasing") return String(value);
  return `${value}px`;
}

function sliderByKey(key) {
  return ALL_SLIDERS.find((s) => s.key === key);
}

export function buildFadeGradients(values) {
  const steps = values.fadeStops;
  const easeA = values.fadeEasing;
  const easePos = values.fadePosEasing || "linear";
  const solidPct = values.fadeSolidPct;
  const topSolidPct = values.topFadeSolidPct ?? solidPct;

  if (values.fadeTwoStop) {
    return {
      tint: buildTwoStopFadeGradient({ solidPct }),
      mask: buildTwoStopFadeGradient({ solidPct, color: "#000" }),
      topTint: buildTwoStopFadeGradient({
        direction: "to top",
        solidPct: topSolidPct,
      }),
      topMask: buildTwoStopFadeGradient({
        direction: "to top",
        solidPct: topSolidPct,
        color: "#000",
      }),
    };
  }

  return {
    tint: buildFadeTintGradient({
      steps,
      easeA,
      easePos,
      solidPct,
      maxAlpha: 1,
    }),
    mask: buildFadeMaskGradient({ steps, easeA, easePos, solidPct }),
    topTint: buildFadeTintGradient({
      direction: "to top",
      steps,
      easeA,
      easePos,
      solidPct: topSolidPct,
      maxAlpha: 1,
    }),
    topMask: buildFadeMaskGradient({
      direction: "to top",
      steps,
      easeA,
      easePos,
      solidPct: topSolidPct,
    }),
  };
}

/** Apply numeric layout vars + regenerated eased gradients to :root */
export function applyMasonryTuneVars(values) {
  const root = document.documentElement;
  Object.entries(LAYOUT_VAR_MAP).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, formatVar(key, values[key]));
  });
  const { tint, mask, topTint, topMask } = buildFadeGradients(values);
  root.style.setProperty("--masonry-fade-tint-gradient", tint);
  root.style.setProperty("--masonry-fade-mask-gradient", mask);
  root.style.setProperty("--masonry-top-fade-tint-gradient", topTint);
  root.style.setProperty("--masonry-top-fade-mask-gradient", topMask);
  root.style.setProperty("--masonry-fade-stops", String(values.fadeStops));
  root.style.setProperty("--masonry-fade-easing", values.fadeEasing);
  root.style.setProperty(
    "--masonry-fade-pos-easing",
    values.fadePosEasing || "linear"
  );
}

function clearVars() {
  const root = document.documentElement;
  Object.values(LAYOUT_VAR_MAP).forEach((cssVar) => {
    root.style.removeProperty(cssVar);
  });
  root.style.removeProperty("--masonry-fade-tint-gradient");
  root.style.removeProperty("--masonry-fade-mask-gradient");
  root.style.removeProperty("--masonry-top-fade-tint-gradient");
  root.style.removeProperty("--masonry-top-fade-mask-gradient");
  root.style.removeProperty("--masonry-fade-stops");
  root.style.removeProperty("--masonry-fade-easing");
  root.style.removeProperty("--masonry-fade-pos-easing");
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

  const gradients = buildFadeGradients(values);
  const snippet = [
    ...Object.entries(LAYOUT_VAR_MAP).map(
      ([key, cssVar]) => `${cssVar}: ${formatVar(key, values[key])};`
    ),
    `--masonry-fade-stops: ${values.fadeStops};`,
    `--masonry-fade-easing: ${values.fadeEasing}; /* easeA */`,
    `--masonry-fade-pos-easing: ${values.fadePosEasing || "linear"}; /* easePos */`,
    `/* bottom tint (${values.fadeTwoStop ? "2-stop" : "eased"}) */`,
    `--masonry-fade-tint-gradient: ${gradients.tint};`,
    `/* top tint */`,
    `--masonry-top-fade-tint-gradient: ${gradients.topTint};`,
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

  const bottomKeys = showAll
    ? [...LAYOUT_KEYS, ...BOTTOM_FADE_KEYS]
    : BOTTOM_FADE_KEYS;
  const topKeys = TOP_FADE_KEYS;

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
          <SectionLabel>Shared</SectionLabel>
          <EasingRow>
            <span title="Alpha easing (easeA) — shapes both fades">Alpha</span>
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
          <EasingRow>
            <span title="Position easing (easePos) — keep linear or curve collapses">
              Pos
            </span>
            <select
              value={values.fadePosEasing || "linear"}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  fadePosEasing: e.target.value,
                }))
              }
            >
              {EASING_PRESET_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </EasingRow>
          <StopsRow>
            <span>Stops</span>
            <ValueReadout>{values.fadeStops}</ValueReadout>
            <input
              type="range"
              min={4}
              max={24}
              step={1}
              value={values.fadeStops}
              onChange={(e) => set("fadeStops", e.target.value)}
            />
          </StopsRow>

          <SectionLabel>Bottom</SectionLabel>
          <Grid>
            {bottomKeys.map((key) => {
              const s = sliderByKey(key);
              if (!s) return null;
              return (
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
              );
            })}
          </Grid>

          <SectionLabel>Top</SectionLabel>
          <Grid>
            {topKeys.map((key) => {
              const s = sliderByKey(key);
              if (!s) return null;
              return (
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
              );
            })}
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
    width: min(54vw, 220px);
    z-index: 9999;
    max-height: ${({ $collapsed }) => ($collapsed ? "auto" : "42vh")};
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

const SectionLabel = styled.div`
  margin: 6px 0 3px;
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffb4a2;
  opacity: 0.85;

  &:first-child {
    margin-top: 2px;
  }
`;

const EasingRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 3px;
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

const StopsRow = styled.label`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 6px;
  align-items: center;
  margin-bottom: 2px;
  font-size: 9px;

  input[type="range"] {
    grid-column: 1 / -1;
    width: 100%;
    height: 14px;
    margin: 0;
    padding: 0;
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
