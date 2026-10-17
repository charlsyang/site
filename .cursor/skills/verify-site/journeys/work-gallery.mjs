// /work: scrolling masonry gallery -> pause/resume -> shuffle -> 6-click "broken" physics easter egg -> Fix layout.
const gallery = '[aria-label="Visual gallery"]';
const items = `${gallery} li`;

const firstItemX = (page) =>
  page.locator(items).first().evaluate((el) => el.getBoundingClientRect().x);
const firstRowSrcs = (page) =>
  page.locator(`${gallery} ul`).first().evaluate((ul) =>
    [...ul.querySelectorAll("li:not([aria-hidden=true])")].map(
      (li) => li.querySelector("img,video")?.getAttribute("src")
    )
  );

export default async function ({ page, shot, log, check }) {
  await page.goto("/work");
  await page.locator(items).first().waitFor();
  check((await page.title()).startsWith("Work"), "title starts with 'Work'");
  check(await page.getByRole("heading", { name: "Charlsy Yang" }).isVisible(), "sidebar intro visible");
  const count = await page.locator(items).count();
  check(count > 0, `gallery renders media items (${count})`);
  // Items show blur placeholders until the real media decodes.
  await page.waitForFunction(
    (sel) => [...document.querySelectorAll(`${sel} img`)].every((i) => i.complete && i.naturalWidth > 0),
    gallery,
    { timeout: 20000 }
  ).catch(() => log("some gallery images still loading at first screenshot"));
  await page.waitForTimeout(1000);
  await shot("gallery-initial");

  const x0 = await firstItemX(page);
  await page.waitForTimeout(800);
  check((await firstItemX(page)) !== x0, "gallery scrolls while running");

  await page.getByRole("button", { name: "Pause animation" }).click();
  const resume = page.getByRole("button", { name: "Resume animation" });
  check((await resume.getAttribute("aria-pressed")) === "true", "pause button flips to Resume (aria-pressed=true)");
  const xp = await firstItemX(page);
  await page.waitForTimeout(800);
  check((await firstItemX(page)) === xp, "gallery is still while paused");
  await shot("gallery-paused");
  await resume.click();
  await page.getByRole("button", { name: "Pause animation" }).waitFor();

  const shuffle = page.getByRole("button", { name: "Shuffle media" });
  await shuffle.waitFor({ timeout: 10000 });
  const before = await firstRowSrcs(page);
  await shuffle.click();
  await page.waitForTimeout(700);
  const after = await firstRowSrcs(page);
  check(JSON.stringify(before) !== JSON.stringify(after), "Shuffle changes the first row's media");
  await shot("gallery-shuffled");

  // Clicks during the 0.5s crossfade are ignored and do not count toward the 6.
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(650);
    await shuffle.click();
  }
  const fix = page.getByRole("button", { name: "Fix layout" });
  await fix.waitFor({ timeout: 5000 });
  check(await page.getByText("Your love for my work has broken through.").isVisible(), "6 shuffles in 10s triggers broken mode");
  check(await page.getByRole("link", { name: "DM on Twitter" }).isVisible(), "broken mode shows 'DM on Twitter' CTA");
  await page.waitForTimeout(1500);
  await shot("gallery-broken");

  await fix.click();
  await page.locator(items).first().waitFor();
  check(!(await fix.isVisible()), "Fix layout restores the gallery");
  await shot("gallery-fixed");
  log(`items before/after shuffle: ${before.length}/${after.length}`);
}
