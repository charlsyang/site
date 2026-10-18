# Work gallery

`/work` shows a persistent sidebar (intro, contact, live San Francisco clock) beside an auto-scrolling three-row masonry of images and videos from `data/visuals.json`. Users can pause the motion, shuffle the media, and, by shuffling six times within ten seconds, "break" the grid into a draggable Matter.js physics pile with a "DM on Twitter" prompt and a Fix layout button.

## Sub-features

- `gallery-scroll` rows scroll continuously; items are shuffled on every mount.
- `gallery-pause` `Pause animation` freezes every row and flips to `Resume animation` with `aria-pressed=true`.
- `gallery-shuffle` `Shuffle media` (appears ~3s after mount) crossfades to a new arrangement where items change rows.
- `gallery-broken` six Shuffle clicks within 10s replace the grid with physics bodies, the message "Your love for my work has broken through.", and a "DM on Twitter" link.
- `gallery-drag` in broken mode, items can be dragged and thrown with the pointer.
- `gallery-fix` `Fix layout` restores the scrolling grid with a fresh shuffle.
- `gallery-sidebar` sidebar intro, contact links, and a ticking `America/Los_Angeles` clock.

## How to get to it (user POV)

- Click "Work" in the nav, or "designs" in the home intro.
- Close a case study (`/work/<slug>`).

## Driving it with drive.mjs (Playwright)

Preconditions:

- Doctor passes. `data/visuals.json` is non-empty and its files exist under `public/visuals/`.

- **Load.** `page.goto("/work")`; wait for `[aria-label="Visual gallery"] li`. Wait until every gallery `img` is `complete` with `naturalWidth > 0` before the first screenshot.
- **Scrolling.** Read the first `li`'s `getBoundingClientRect().x`, wait 800ms, read again; the values differ.
- **Pause.** Click `getByRole("button", { name: "Pause animation" })`. `Resume animation` has `aria-pressed="true"`, and the x position is unchanged across 800ms. Click Resume to restore.
- **Shuffle.** Wait for `getByRole("button", { name: "Shuffle media" })` (up to 10s). Record the `src`s of the first `ul`'s non-`aria-hidden` items, click, wait 700ms; the list differs.
- **Break.** Click Shuffle five more times, 650ms apart. `getByRole("button", { name: "Fix layout" })` appears with the broken-mode text and "DM on Twitter" link.
- **Drag.** Optional: `page.mouse` down on a physics item, move, up; its transform changes.
- **Fix.** Click Fix layout; the gallery `li`s return and Fix layout is gone.
- **Proof.** Run `node scripts/drive.mjs journeys/work-gallery.mjs`; screenshots `gallery-initial`, `gallery-paused`, `gallery-shuffled`, `gallery-broken`, `gallery-fixed`.

## Gotchas

- Shuffle clicks during the 0.5s crossfade are ignored and do not count toward the six; space them more than 500ms apart, and all six must land within 10s.
- With `--reduced-motion` the Shuffle button appears immediately, videos are paused, and shuffles do not animate. Test both modes when touching motion code.
- The grid renders client-only (`mounted` gate), so the SSR HTML has no gallery; do not curl for it.
- Row content is random per mount. Assert on change, never on specific images.
- Screenshots right after load show blur placeholders; that is expected loading state, not a bug.
