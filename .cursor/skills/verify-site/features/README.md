# Site verification map

This directory is the maintained source for verifying the user-facing behavior of the site. Read this index before driving the app, then use the matching feature file as the recipe. Each feature has a runnable journey in `../journeys/`.

## Baseline preconditions

- `scripts/launch.sh` has started `next dev` on `http://127.0.0.1:3100` (or your chosen port) from this checkout.
- `scripts/doctor.sh` exits 0 and prints the git HEAD you intend to verify.
- Content is whatever is in `blog/` and `projects/` on this checkout. There is no seed step; only `isPublished: true` MDX renders.
- Never drive an instance that this skill did not start (`doctor.sh` checks port ownership).

## Driving conventions

- Run journeys with `node scripts/drive.mjs journeys/<name>.mjs`. Ad-hoc steps go in a scratch journey module with the same signature.
- Prefer ARIA roles, accessible names, `aria-label`s, and `href`s. styled-components class names are build hashes and change.
- Wait for state, not time, wherever the page exposes it. Fixed waits are only for CSS animation settling before a screenshot.
- Each feature recipe starts from a fresh browser context; nothing persists between runs.

## Proof and skip reporting

- Capture the user action and the resulting state: a screenshot before and after, plus a `check()` on URL, text, attribute, or element position.
- Open the screenshots. Blur placeholders or a blank fade-in frame are not proof of content.
- Record the journey name and evidence directory with every claim.
- Report an unreachable path with the attempted step and the unmet precondition. Do not report a path as verified through a different one.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior, then exactly four H2 sections in order: `Sub-features`, `How to get to it (user POV)`, `Driving it with drive.mjs (Playwright)` (starting with `Preconditions:`), and `Gotchas`.

## Features

- [Home](./home.md) covers the intro, latest posts, "All posts", contact, and nav. Journey: `home.mjs`.
- [Blog](./blog.md) covers the index, post rendering (sidenotes, code blocks, OG meta), back button, and RSS. Journey: `blog.mjs`.
- [Work gallery](./work-gallery.md) covers the scrolling masonry, pause/resume, Shuffle, and the broken-physics easter egg. Journey: `work-gallery.mjs`.
- [Work case study](./work-case-study.md) covers `/work/<slug>` pages and closing back to the gallery. Journey: `work-case-study.mjs`.
- [OG image](./og-image.md) covers the `/api/og` social card. Journey: `og-image.mjs`.

Not yet mapped: `/colophon` (static text, reached from the footer link on non-work pages) and `/playground` (internal Button component showcase, no inbound links).
