# Work case study

Each project in `projects/*.mdx` renders at `/work/<slug>` inside the persistent work sidebar: a header with title, subtitle, timeline, team, and contribution from frontmatter, an MDX body with hero mocks and media rows, a "next project" link, and a close button that slides back to the gallery.

## Sub-features

- `case-head` title, subtitle, timeline, team, and contribution from frontmatter.
- `case-body` MDX body with `HeroMock`, `MediaRow`, `MediaStack`, `Contact`.
- `case-next` next-project link cycling through aura, role, aps, vol.
- `case-close` `Close and return to work` button navigates to `/work` with a downward exit transition.
- `case-title` document title is `<frontmatter title> — Charlsy Yang`.

## How to get to it (user POV)

- Direct URL only today: `/work/aura`, `/work/role`, `/work/aps`, `/work/vol`. The sidebar project list in `components/WorkLayout.js` is commented out, so the gallery does not link to case studies.
- From another case study via the next-project link.

## Driving it with drive.mjs (Playwright)

Preconditions:

- Doctor passes. The target slug exists in `projects/` (journey env `CASE_STUDY`, default `aura`).

- **Load.** `page.goto("/work/aura")`; wait for `getByRole("button", { name: "Close and return to work" })`.
- **Header.** The frontmatter title (e.g. "Enliven the Aura") and subtitle are visible; sidebar heading "Charlsy Yang" persists.
- **Title.** `page.title()` matches `^<title> — Charlsy Yang$`.
- **Close.** Click the close button; URL becomes `/work` and the gallery's `li`s render.
- **Proof.** Run `CASE_STUDY=aura node scripts/drive.mjs journeys/work-case-study.mjs`; screenshots `case-study-aura.png`, `after-close.png`. Repeat per slug when changing shared case-study components.

## Gotchas

- Known failure as of 628fe91a: the title is doubled, e.g. `Enliven the Aura – Charlsy Yang — Charlsy Yang`, because `pages/work/[slug].js` appends ` – Charlsy Yang` and `components/Head.js` appends ` — Charlsy Yang` again. `work-case-study.mjs` fails the title check until that is fixed.
- The case study scrolls inside its own container (`overflow-y: auto`), not the window. Use `locator.scrollIntoViewIfNeeded()` or scroll the container, not `window.scrollTo`.
- Navigating away while hero `.mp4`s load logs `ERR_ABORTED` in `network.log`; that is baseline, not a regression.
- `getStaticPaths` lists every file in `projects/`, ignoring `isPublished`, so unpublished projects are still reachable by URL.
