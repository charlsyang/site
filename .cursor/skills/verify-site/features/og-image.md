# OG image

`/api/og` is an edge route that renders a 1200x630 PNG social card with the given title in ABC Diatype, the fleuron mark, and "charlsyang.com". Blog posts point their `og:image` and `twitter:image` meta at it.

## Sub-features

- `og-title` `?title=` text is rendered; long titles (> 24 chars) use a smaller size.
- `og-default` no `title` falls back to "Charlsy Yang".
- `og-format` responds `image/png` at 1200x630.

## How to get to it (user POV)

- Share a blog post link anywhere that unfurls Open Graph cards.
- Open `/api/og?title=Hello` directly.

## Driving it with drive.mjs (Playwright)

Preconditions:

- Doctor passes. `public/fonts/ABCDiatypeEdu-Regular.otf` exists.

- **Fetch.** `page.request.get("/api/og?title=<title>")` returns 200 with `content-type: image/png`.
- **Size.** PNG header bytes 16-23 decode to width 1200 and height 630.
- **Look.** The journey saves `og.png` and renders it into the page for an `og-rendered.png` screenshot. Open it and confirm the title text and font.
- **Proof.** Run `OG_TITLE="Your title" node scripts/drive.mjs journeys/og-image.mjs`.

## Gotchas

- In production, post meta points at `https://charlsyang.com/api/og`, not the local instance; verify local changes by hitting the local route directly.
- The first request compiles the edge route and loads the font; it can take a few seconds.
