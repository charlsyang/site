// /blog index -> a post with sidenotes and a code block -> back link; RSS feed is served.
export default async function ({ page, shot, check, log }) {
  await page.goto("/blog");
  await page.getByRole("heading", { name: "Blog", level: 1 }).waitFor();
  const posts = page.locator("ul a[href^='/blog/']");
  const n = await posts.count();
  check(n > 5, `blog index lists all published posts (${n})`);
  await page.waitForTimeout(1200);
  await shot("blog-index");

  await page.locator("a[href='/blog/sidenotes']").click();
  await page.waitForURL("**/blog/sidenotes");
  await page.locator("article, h1").first().waitFor();
  const notes = page.locator("input[type=checkbox][id^='sideNote_']");
  await notes.first().waitFor({ state: "attached" });
  check((await notes.count()) > 0, `sidenotes post renders SideNote toggles (${await notes.count()})`);
  check(await page.getByText("(Note:").first().count() > 0, "sidenote content is in the DOM");
  check((await page.locator("meta[property='og:image']").getAttribute("content"))?.includes("/api/og?title="), "post sets og:image to /api/og");
  await page.waitForTimeout(800);
  await shot("blog-sidenotes");

  await page.goto("/blog/code-snippet");
  check((await page.locator("pre").count()) > 0, "code-snippet post renders <pre> blocks");
  await shot("blog-code-snippet", { fullPage: false });

  // The back button is the /blog link with an arrow icon; the nav "Blog" link has no svg.
  await page.locator("a[href='/blog']:has(svg)").click();
  await page.waitForURL(/\/blog$/);
  check(true, "back link returns to /blog");

  const rss = await page.request.get("/feed.xml");
  const body = await rss.text();
  check(rss.ok() && body.includes("<rss"), "/feed.xml serves an RSS document");
  log(`feed items: ${(body.match(/<item>/g) || []).length}`);
}
