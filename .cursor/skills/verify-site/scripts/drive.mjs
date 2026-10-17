#!/usr/bin/env node
// Usage: node drive.mjs <journey.mjs> [--port N] [--mobile] [--reduced-motion] [--headed]
//
// Runs one journey module against a running instance in a fresh Chrome profile.
// A journey exports `default async ({ page, context, baseURL, shot, log, check, evidenceDir })`.
// Evidence lands in $VERIFY_SITE_HOME/evidence/<timestamp>-<journey>/:
//   NN-<name>.png    screenshots from shot()
//   journey.log      log() lines and check() results
//   console.log      browser console errors/warnings and page errors
//   network.log      failed requests and HTTP >= 400 responses
//   summary.json     { journey, pass, checks, error }
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const PLAYWRIGHT_VERSION = "1.64.1";

const args = process.argv.slice(2);
const journeyPath = args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a));
const flag = (name) => args.includes(`--${name}`);
const portIdx = args.indexOf("--port");
const port = portIdx >= 0 ? args[portIdx + 1] : process.env.VERIFY_SITE_PORT || "3100";
if (!journeyPath) {
  console.error("usage: node drive.mjs <journey.mjs> [--port N] [--mobile] [--reduced-motion] [--headed]");
  process.exit(2);
}

const home = process.env.VERIFY_SITE_HOME || path.join(os.homedir(), ".cache", "verify-site");
const pwDir = path.join(home, "playwright");
if (!fs.existsSync(path.join(pwDir, "node_modules", "playwright-core"))) {
  fs.mkdirSync(pwDir, { recursive: true });
  fs.writeFileSync(path.join(pwDir, "package.json"), '{"private":true}');
  execSync(`npm install --silent --no-audit --no-fund playwright-core@${PLAYWRIGHT_VERSION}`, {
    cwd: pwDir,
    stdio: "inherit",
  });
}
const { chromium } = createRequire(path.join(pwDir, "package.json"))("playwright-core");

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/local/bin/google-chrome",
    "/usr/bin/google-chrome",
    "/opt/google/chrome/chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return candidates.find((p) => p && fs.existsSync(p));
}
const executablePath = findChrome();
if (!executablePath) {
  console.error("no Chrome found; set CHROME_PATH to a Chrome/Chromium binary");
  process.exit(2);
}

const name = path.basename(journeyPath, ".mjs");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
const evidenceDir = path.join(home, "evidence", `${stamp}-${name}`);
fs.mkdirSync(evidenceDir, { recursive: true });
const append = (file, line) => fs.appendFileSync(path.join(evidenceDir, file), line + "\n");

const baseURL = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ executablePath, headless: !flag("headed") });
const context = await browser.newContext({
  baseURL,
  viewport: flag("mobile") ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: flag("mobile") ? 2 : 1,
  isMobile: flag("mobile"),
  hasTouch: flag("mobile"),
  reducedMotion: flag("reduced-motion") ? "reduce" : "no-preference",
});
const page = await context.newPage();
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) append("console.log", `[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => append("console.log", `[pageerror] ${e.message}`));
page.on("requestfailed", (r) => append("network.log", `FAILED ${r.method()} ${r.url()} ${r.failure()?.errorText}`));
page.on("response", (r) => {
  if (r.status() >= 400) append("network.log", `${r.status()} ${r.request().method()} ${r.url()}`);
});

let shotIndex = 0;
const shot = async (label, opts = {}) => {
  const file = `${String(++shotIndex).padStart(2, "0")}-${label}.png`;
  await page.screenshot({ path: path.join(evidenceDir, file), ...opts });
  append("journey.log", `shot ${file}`);
  return file;
};
const log = (msg) => {
  append("journey.log", msg);
  console.log(msg);
};
const checks = [];
const check = (cond, label) => {
  checks.push({ label, pass: !!cond });
  log(`${cond ? "PASS" : "FAIL"} ${label}`);
};

let error = null;
try {
  const mod = await import(pathToFileURL(path.resolve(journeyPath)).href);
  await mod.default({ page, context, baseURL, shot, log, check, evidenceDir });
} catch (e) {
  error = String(e?.stack || e);
  log(`ERROR ${error}`);
  await shot("error").catch(() => {});
} finally {
  await browser.close();
}

const pass = !error && checks.length > 0 && checks.every((c) => c.pass);
fs.writeFileSync(
  path.join(evidenceDir, "summary.json"),
  JSON.stringify({ journey: name, baseURL, pass, checks, error }, null, 2)
);
console.log(`${pass ? "PASS" : "FAIL"} ${name}  evidence: ${evidenceDir}`);
process.exit(pass ? 0 : 1);
