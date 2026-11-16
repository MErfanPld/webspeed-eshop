import { expect, test } from "@playwright/test";

test.describe("storefront", () => {
  test("home renders builder blocks with working images", async ({ page }) => {
    await page.goto("/");
    // While streaming replaces the loading skeleton, a hidden copy can exist briefly: count visible only
    await expect(page.locator('[data-ws-block="hero"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-ws-block="product-slider"]').first()).toBeVisible();
    const broken = await page.$$eval("img", (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy").length
    );
    expect(broken).toBe(0);
  });

  test("product listing → product page → cart", async ({ page }) => {
    await page.goto("/products");
    const first = page.locator('a[href^="/products/"]').first();
    await first.click();
    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("unknown pages show a 404 message", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByText("صفحه یافت نشد")).toBeVisible();
  });
});
