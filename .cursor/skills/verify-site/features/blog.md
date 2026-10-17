# Blog

The blog lists every published post by date and renders each post from MDX with GFM, sidenotes, syntax-highlighted code, and custom links/images. Posts set Open Graph images via `/api/og`, and an RSS feed is published at `/feed.xml`.

## Sub-features

- `blog-index` `/blog` lists all `isPublished: true` posts, newest first, with "Subscribe via RSS or email".
- `blog-post` `/blog/<slug>` renders title, date, and MDX body.
- `blog-sidenotes` `<SideNote>` renders a numbered marker with "(Note: ...)" content; tap-to-toggle on phone widths.
- `blog-code` fenced code renders in `<pre>` via `CodeSnippet`.
- `blog-og-meta` post pages set `og:image` to `https://charlsyang.com/api/og?title=<title>`.
- `blog-back` arrow back button returns to `/blog`.
- `blog-rss` `/feed.xml` is an RSS 2.0 document with one `<item>` per published post.

## How to get to it (user POV)

- Click "Blog" in the nav, "writes" in the home intro, or "All posts" on home.
- Click a post title on home or `/blog`.
- Click "RSS" on `/blog`.

## Driving it with drive.mjs (Playwright)

Preconditions:

- Doctor passes. `blog/sidenotes.mdx` and `blog/code-snippet.mdx` are published (they are the fixtures the journey uses).

- **Index.** `page.goto("/blog")`; `getByRole("heading", { name: "Blog", level: 1 })` visible; `ul a[href^='/blog/']` count equals the number of published MDX files.
- **Sidenotes.** Click `a[href='/blog/sidenotes']`. Wait for `input[type=checkbox][id^='sideNote_']` to be attached; count > 0; text "(Note:" present.
- **OG meta.** `meta[property='og:image']` content contains `/api/og?title=`.
- **Code.** `page.goto("/blog/code-snippet")`; `pre` count > 0.
- **Back.** Click `a[href='/blog']:has(svg)`; URL ends in `/blog`.
- **RSS.** `page.request.get("/feed.xml")` is 200 and contains `<rss`; item count matches the index.
- **Proof.** Run `node scripts/drive.mjs journeys/blog.mjs`; screenshots `blog-index.png`, `blog-sidenotes.png`, `blog-code-snippet.png`. For phone sidenote behavior add `--mobile` and click the marker label.

## Gotchas

- Sidenote checkboxes appear after the MDX bundle hydrates; counting immediately after navigation returns 0. Wait for attachment first.
- `getByRole("link", { name: "Blog" })` matches both the nav link and the back button. Use `:has(svg)` for the back button.
- `/feed.xml` is generated when the home page renders, not by `/blog`. On a fresh instance, load `/` (launch already does) before asserting on it.
- Each post is bundled with esbuild on first request; the first hit to a slug can take several seconds in dev.
