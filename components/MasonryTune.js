/**
 * TEMPORARY phone masonry tune panel — remove before merge (or keep behind ?tune=1).
 * Open: /work?tune=1 at ≤550px (or any width; vars only affect phone layout CSS).
 */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { QUERIES } from "../utils/constants";

export const MASONRY_TUNE_DEFAULTS = {
  gridHeightVh: 55,
  fadeHeightPx: 120,
  fadeSolidPct: 0,
  fadeEndPct: 100,
  fadeBlurPx: 16,
  fadeTint: 0.3,
  headlineOverlapPx: 52,
};

const VAR_MAP = {
  gridHeightVh: "--masonry-grid-height",
  fadeHeightPx: "--masonry-fade-height",
  fadeSolidPct: "--masonry-fade-solid",
  fadeEndPct: "--masonry-fade-end",
  fadeBlurPx: "--masonry-fade-blur",
  fadeTint: "--masonry-fade-tint",
  headlineOverlapPx: "--masonry-headline-overlap",
};

function formatVar(key, value) {
  if (key === "gridHeightVh") return `${value}vh`;
  if (key === "fadeTint") return String(value);
  if (key === "fadeSolidPct" || key === "fadeEndPct") return `${value}%`;
  return `${value}px`;
}

function applyVars(values) {
  const root = document.documentElement;
  Object.entries(VAR_MAP).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, formatVar(key, values[key]));
  });
}

function clearVars() {
  const root = document.documentElement;
  Object.values(VAR_MAP).forEach((cssVar) => {
    root.style.removeProperty(cssVar);
  });
}

export default function MasonryTune() {
  const [values, setValues] = useState(MASONRY_TUNE_DEFAULTS);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    applyVars(values);
    return () => clearVars();
  }, [values]);

  const set = (key, raw) => {
    const num = Number(raw);
    setValues((prev) => ({ ...prev, [key]: num }));
  };

  const snippet = Object.entries(values)
    .map(([key, value]) => `${VAR_MAP[key]}: ${formatVar(key, value)};`)
    .join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Panel data-masonry-tune>
      <Header>
        <Title>TEMP masonry tune</Title>
        <HeaderActions>
          <SmallBtn type="button" onClick={() => setValues(MASONRY_TUNE_DEFAULTS)}>
            Reset
          </SmallBtn>
          <SmallBtn type="button" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? "Open" : "Hide"}
          </SmallBtn>
        </HeaderActions>
      </Header>
      {!collapsed && (
        <>
          <Hint>
            Preview only · remove before merge · <code>?tune=1</code>
          </Hint>
          <Slider
            label="Grid height"
            unit="vh"
            min={40}
            max={75}
            step={1}
            value={values.gridHeightVh}
            onChange={(v) => set("gridHeightVh", v)}
          />
          <Slider
            label="Fade height"
            unit="px"
            min={48}
            max={240}
            step={1}
            value={values.fadeHeightPx}
            onChange={(v) => set("fadeHeightPx", v)}
          />
          <Slider
            label="Fade solid stop"
            unit="%"
            min={0}
            max={80}
            step={1}
            value={values.fadeSolidPct}
            onChange={(v) => set("fadeSolidPct", v)}
          />
          <Slider
            label="Fade end (transparent)"
            unit="%"
            min={20}
            max={100}
            step={1}
            value={values.fadeEndPct}
            onChange={(v) => set("fadeEndPct", v)}
          />
          <Slider
            label="Blur"
            unit="px"
            min={0}
            max={40}
            step={1}
            value={values.fadeBlurPx}
            onChange={(v) => set("fadeBlurPx", v)}
          />
          <Slider
            label="Tint opacity"
            unit=""
            min={0}
            max={1}
            step={0.05}
            value={values.fadeTint}
            onChange={(v) => set("fadeTint", v)}
          />
          <Slider
            label="Headline overlap"
            unit="px"
            min={0}
            max={120}
            step={1}
            value={values.headlineOverlapPx}
            onChange={(v) => set("headlineOverlapPx", v)}
          />
          <Values>
            <ValuesHeader>
              <span>CSS vars</span>
              <SmallBtn type="button" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </SmallBtn>
            </ValuesHeader>
            <pre>{snippet}</pre>
          </Values>
        </>
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

const Panel = styled.aside`
  display: none;

  @media ${QUERIES.phoneAndBelow} {
    display: block;
    position: fixed;
    left: 8px;
    right: 8px;
    bottom: 8px;
    z-index: 9999;
    max-height: min(55vh, 420px);
    overflow: auto;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(20, 18, 16, 0.92);
    color: #f5f2ec;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 11px;
    line-height: 1.35;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(8px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Title = styled.strong`
  font-size: 11px;
  letter-spacing: 0.02em;
  color: #ffb4a2;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 6px;
`;

const Hint = styled.p`
  margin: 6px 0 10px;
  opacity: 0.7;

  code {
    color: #ffd7a8;
  }
`;

const Row = styled.label`
  display: block;
  margin-bottom: 8px;

  input[type="range"] {
    width: 100%;
    margin: 2px 0 0;
  }
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const ValueReadout = styled.span`
  color: #ffd7a8;
  font-variant-numeric: tabular-nums;
`;

const Values = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);

  pre {
    margin: 6px 0 0;
    white-space: pre-wrap;
    word-break: break-word;
    color: #d8d2c8;
  }
`;

const ValuesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SmallBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  border-radius: 6px;
  padding: 3px 8px;
  font: inherit;
  cursor: pointer;

  &:active {
    background: rgba(255, 255, 255, 0.16);
  }
`;
