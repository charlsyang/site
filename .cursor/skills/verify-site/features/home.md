# Home

The home page introduces Charlsy with links to Work and Blog, lists the five most recent published posts with dates, links to the full blog, and shows contact details.

## Sub-features

- `home-intro` shows "Charlsy designs & writes." with inline links to `/work` and `/blog`.
- `home-latest` lists up to five newest `isPublished: true` posts, newest first, each linking to `/blog/<slug>`.
- `home-all-posts` "All posts" with an arrow takes the user to `/blog`.
- `home-contact` shows the email `hi@charlsy.me` and the `@imcharlsy` X link.
- `home-nav` top nav: logo to `/`, "Work", "Blog".

## How to get to it (user POV)

- Open `/`.
- Click the logo in the nav from any non-work page.

## Driving it with drive.mjs (Playwright)

Preconditions:

- Doctor passes. At least one post in `blog/` has `isPublished: true`.

- **Load.** `page.goto("/")`. Title is exactly `Charlsy Yang`.
- **Latest posts.** `page.locator("section a[href^='/blog/']")` has 1-5 entries. Clicking the first lands on `/blog/<slug>` whose `h1` equals the link text.
- **All posts.** `page.locator("a", { hasText: "All posts" })` should have `href="/blog"`; clicking it lands on `/blog`.
- **Contact.** `getByRole("link", { name: "hi@charlsy.me" })` is visible.
- **Nav.** `getByRole("navigation").getByRole("link", { name: "Work" })` lands on `/work`.
- **Proof.** Run `node scripts/drive.mjs journeys/home.mjs`; screenshots `home.png` and `home-first-post.png`.

## Gotchas

- Known failure as of 628fe91a: "All posts" renders `<a>` with no `href` (`next/link` `legacyBehavior` without `passHref` around a styled `a` in `pages/index.js`). Clicking works through JS, but it has no link role, cannot be focused by Tab, and cannot be middle-clicked. `home.mjs` fails the `'All posts' is a real link` check until that is fixed. Do not weaken the check.
- Sections fade in on load (`onload-fade`); wait ~1s before a screenshot or it may be blank.
- Loading `/` rewrites `public/feed.xml` (gitignored) as a side effect of `getStaticProps`.
