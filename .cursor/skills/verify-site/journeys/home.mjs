// Home: intro, latest five published posts, contact, nav into Work and Blog.
export default async function ({ page, shot, check }) {
  await page.goto("/");
  check((await page.title()) === "Charlsy Yang", "home title is 'Charlsy Yang'");
  const posts = page.locator("main a[href^='/blog/'], section a[href^='/blog/']");
  await posts.first().waitFor();
  const n = await posts.count();
  check(n >= 1 && n <= 5, `home lists 1-5 latest posts (${n})`);
  const allPosts = page.locator("a", { hasText: "All posts" });
  check((await allPosts.getAttribute("href")) === "/blog", "'All posts' is a real link (href=/blog)");
  check(await page.getByRole("link", { name: "hi@charlsy.me" }).isVisible(), "contact email visible");
  await page.waitForTimeout(1200);
  await shot("home");

  const firstTitle = (await posts.first().innerText()).trim();
  await posts.first().click();
  await page.waitForURL(/\/blog\/.+/);
  check((await page.locator("h1").first().innerText()).trim() === firstTitle, "first post link opens that post");
  await shot("home-first-post");

  await page.goto("/");
  await page.locator("a", { hasText: "All posts" }).click();
  await page.waitForURL(/\/blog$/);
  check(true, "clicking 'All posts' reaches /blog");

  await page.goto("/");
  await page.getByRole("navigation").getByRole("link", { name: "Work" }).click();
  await page.waitForURL(/\/work$/);
  check(true, "nav 'Work' reaches /work");
}
