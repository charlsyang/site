---
name: verify-site
description: Drive Charlsy's personal site (Next.js 13 pages router, styled-components, MDX blog and work case studies) in a real Chrome via Playwright to prove UI behavior on /, /blog, /blog/<slug>, /work (physics masonry gallery), /work/<slug>, and /api/og. Use when a change touches pages, components, MDX content, or the OG route and you need screenshots and checks, not just a build.
---

# verify-site

The site's only user surface is the web UI served by `next dev`. There are no tests or browser harness in the repo; this skill ships its own. Everything below was executed from this directory against a fresh checkout.

All helpers live in `.cursor/skills/verify-site/scripts/` and work from any cwd. State, the Playwright install, and evidence live outside the repo under `$VERIFY_SITE_HOME` (default `~/.cache/verify-site`). Default port is `3100` (`VERIFY_SITE_PORT` or a positional arg overrides).

## Launch

```bash
.cursor/skills/verify-site/scripts/launch.sh          # port 3100
.cursor/skills/verify-site/scripts/launch.sh 3200     # another port
```

- Runs `npm ci` if `node_modules/.bin/next` is missing, then starts `node_modules/.bin/next dev -p <port>` in its own process group (pid recorded in `$VERIFY_SITE_HOME/state/<port>.pid`, log in `<port>.log`).
- Ready means usable: it blocks until `GET /` renders the blog list (`href="/blog/`), which proves `blog/*.mdx` was read. Typically ~5s; pages compile on first hit, so the first visit to each route takes a few extra seconds.
- Idempotent: if this skill already owns an instance on the port it is reused.
- Refuses (exit 1) when the port is held by something it did not start, or when any other `next dev` is running in this checkout. Two dev servers share `.next/` and corrupt each other, so there is one instance per checkout. Need a second? Use a separate worktree.
- No env vars, database, auth, or seed data. Content is the MDX in `blog/` (only `isPublished: true` posts render) and `projects/`.

Side effects of running the app, all gitignored: `.next/`, and `public/feed.xml` (rewritten whenever the home page's `getStaticProps` runs). Do **not** use `npm run build` for verification: its `prebuild` runs `scripts/generate-media.mjs`, which rewrites the tracked `data/visuals.json` and needs ffmpeg.

## Doctor

```bash
.cursor/skills/verify-site/scripts/doctor.sh [port]
```

Read-only. Exits 0 only if: the recorded process is alive, the port's listener is in our process group, `/` renders the blog list, and `/blog` returns 200. Also prints the checkout path, git HEAD/branch, and Next version, so you can confirm you are driving the code you changed. Run it first whenever anything looks off.

## Drive

```bash
node .cursor/skills/verify-site/scripts/drive.mjs .cursor/skills/verify-site/journeys/<journey>.mjs [--port N] [--mobile] [--reduced-motion] [--headed]
```

- First run installs `playwright-core@1.64.1` into `$VERIFY_SITE_HOME/playwright` (not the repo). It drives the system Chrome: auto-detected on macOS and Linux, or set `CHROME_PATH`.
- Fresh browser context per run. Desktop viewport 1440x900; `--mobile` is 390x844 with touch (sidenotes become tap-to-expand there). `--reduced-motion` emulates `prefers-reduced-motion: reduce`, which makes the gallery's Shuffle button appear immediately and pauses videos.
- Exit code 0 only when every `check()` passed and nothing threw.

Shipped journeys (one per mapped feature, see `features/`):

| journey | proves |
|---|---|
| `home.mjs` | home intro, latest posts, "All posts", nav |
| `blog.mjs` | blog index, sidenotes + code-block posts, back button, `/feed.xml` |
| `work-gallery.mjs` | gallery scroll, pause/resume, Shuffle, 6-click broken-physics mode, Fix layout |
| `work-case-study.mjs` | `/work/<slug>` (env `CASE_STUDY`, default `aura`), close button |
| `og-image.mjs` | `/api/og` PNG size/type (env `OG_TITLE`) |

To prove a new change, write a journey next to these (or a scratch one anywhere). A journey is an ES module:

```js
export default async function ({ page, context, baseURL, shot, log, check, evidenceDir }) {
  await page.goto("/work");                         // baseURL is preset
  await page.getByRole("button", { name: "Pause animation" }).click();
  check(await page.getByRole("button", { name: "Resume animation" }).isVisible(), "pause toggles");
  await shot("paused");                             // -> NN-paused.png
}
```

Stable handles in this app (prefer these over CSS classes, which are styled-components hashes):

- Nav: `getByRole("navigation").getByRole("link", { name: "Work" | "Blog" })`; home logo is `a[href="/"]`.
- Gallery: `[aria-label="Visual gallery"]` (rows are `ul`, items `li`; `li[aria-hidden=true]` are loop duplicates). Buttons by aria-label: `Pause animation` / `Resume animation` (with `aria-pressed`), `Shuffle media` (appears ~3s after mount), `Fix layout` (only in broken mode). Broken mode text: "Your love for my work has broken through." and link "DM on Twitter".
- Case study: `getByRole("button", { name: "Close and return to work" })`.
- Blog post back button: `a[href='/blog']:has(svg)` (the nav "Blog" link has no svg; the back button's text is opacity 0 until hover).
- Sidenotes: `input[type=checkbox][id^='sideNote_']`, content wrapped in "(Note: ...)".
- "All posts" on home: `page.locator("a", { hasText: "All posts" })` (it has no href, so it has no link role; see `features/home.md`).

Gallery motion is CSS `animation-play-state` on each `li`; to prove paused vs running, compare an item's `getBoundingClientRect().x` across ~800ms rather than trusting the button.

## Evidence

Each run writes `$VERIFY_SITE_HOME/evidence/<YYYYMMDD-HHMMSS>-<journey>/`:

- `NN-<label>.png` screenshots, in order.
- `journey.log`: every `log()` line and `PASS`/`FAIL` check.
- `console.log`: browser console errors/warnings and uncaught page errors.
- `network.log`: failed requests and HTTP >= 400 responses.
- `summary.json`: `{ journey, baseURL, pass, checks, error }`.

Proof standards:

- Drive the user path: click the real control, navigate by links. No calling React state, no test-only routes.
- Capture the action and the resulting state (screenshot before and after), plus a `check()` on observable state (URL, text, attribute, element position), not just the final screen.
- Verify side effects where they exist: `/feed.xml` contents for blog changes, PNG bytes for `/api/og`.
- Open the screenshots and read them. The gallery shows blur placeholders until media decodes; a screenshot of blurs proves nothing about content.
- Diff `console.log` against a run on the base branch before blaming your change. Baseline noise today: many styled-components "unknown prop" warnings, React `stroke-width`/`strokeWidth` warnings, "Ignoring Event: localhost", and `ERR_ABORTED` on case-study `.mp4`s when navigating away mid-load.

## Cleanup

```bash
.cursor/skills/verify-site/scripts/cleanup.sh [port] [--keep-log]
```

Sends TERM then KILL to the process group recorded in the pidfile, removes the pidfile and log (unless `--keep-log`), and never touches anything it did not start or the evidence directory. Running it when nothing is up is a no-op. Run it after every session, including failed ones.

## Feature map

`features/README.md` indexes the user-facing features with how to reach, drive, and prove each one. A proof that only drives one entry point is incomplete when the map lists others. Keep it current with `/maintain-verification-skill`.
