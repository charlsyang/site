// /work/<slug> case study: header from frontmatter, MDX body, close button back to /work.
const slug = process.env.CASE_STUDY || "aura";

export default async function ({ page, shot, check }) {
  await page.goto(`/work/${slug}`);
  const close = page.getByRole("button", { name: "Close and return to work" });
  await close.waitFor();
  const title = await page.title();
  check(/^[^—–]+ — Charlsy Yang$/.test(title), `title is '<frontmatter title> — Charlsy Yang' (got '${title}')`);
  check(await page.getByRole("heading", { name: "Charlsy Yang" }).isVisible(), "work sidebar persists on case study");
  await page.waitForTimeout(1200);
  await shot(`case-study-${slug}`);

  await close.click();
  await page.waitForURL(/\/work$/);
  await page.locator('[aria-label="Visual gallery"] li').first().waitFor();
  check(true, "close button returns to /work gallery");
  await shot("after-close");
}
