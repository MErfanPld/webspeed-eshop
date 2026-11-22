import { expect, test } from "@playwright/test";

/** Landing site content comes from the API (managed in django-admin). */
const PD = process.env.E2E_PLATFORM_DOMAIN;
const PORT = Number(process.env.E2E_PORT || 3100);
const url = (path: string) => (PD ? `http://${PD}:${PORT}${path}` : `/platform${path === "/" ? "" : path}`);

test.describe("landing site", () => {
  test("dynamic sections, real stats, articles and blog", async ({ page, request }) => {
    const api = await (await request.get("/api/v1/platform/landing")).json();
    await page.goto(url("/"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(api.settings.heroHighlight);
    // real numbers from the database, rendered by the server
    if (api.stats) {
      const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
      // the server HTML carries the real number (search engines) …
      const html = await page.evaluate(() => fetch(location.href).then((r) => r.text()));
      expect(html).toContain(fa(api.stats.stores));
      // … and in the browser it counts up once scrolled into view
      await page.getByTestId("platform-stats").scrollIntoViewIfNeeded();
      await expect(page.getByTestId("platform-stats")).toContainText(fa(api.stats.stores));
    }
    await expect(page.getByTestId("roadmap").locator("li")).toHaveCount(api.roadmap.length);
    await expect(page.locator("[data-plan]")).toHaveCount(api.plans.length);
    await expect(page.locator("details")).toHaveCount(api.faq.length);
    await expect(page.getByTestId("article-card")).toHaveCount(api.articles.length);

    // blog list → article → related
    await page.getByRole("link", { name: "همه مقالات" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("مقالات و آموزش‌ها");
    await page.getByTestId("article-card").first().click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(api.articles[0].title);
    await expect(page.locator("article h2").first()).toBeVisible(); // "## " headings rendered
    await expect(page.getByRole("heading", { name: "مقالات مرتبط" })).toBeVisible();
    expect((await page.goto(url("/blog/does-not-exist")))?.status()).toBe(404);
  });
});
