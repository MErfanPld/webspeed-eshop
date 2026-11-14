import { expect, test, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

async function login(page: Page) {
  await page.goto("/admin/pages");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.fill("input[type=email]", E2E_ADMIN.email);
  await page.fill("input[type=password]", E2E_ADMIN.password);
  await page.click("button[type=submit]");
  await expect(page).toHaveURL(/\/admin\/pages/);
}

test.describe("admin & builder", () => {
  test("admin pages and API require login", async ({ page, request }) => {
    const res = await request.get("/api/v1/admin/pages");
    expect(res.status()).toBe(401);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login\?next=/);
  });

  test("wrong password shows an error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("input[type=email]", E2E_ADMIN.email);
    await page.fill("input[type=password]", "definitely-wrong");
    await page.click("button[type=submit]");
    await expect(page.getByText("ایمیل یا رمز عبور اشتباه است.")).toBeVisible();
  });

  test("create page → add block → publish → visible on storefront with SEO", async ({ page }) => {
    const slug = `e2e-${Date.now().toString(36)}`;
    await login(page);
    await page.getByRole("button", { name: "صفحه جدید" }).click();
    await page.fill('input[placeholder="مثلاً درباره ما"]', "صفحه تست");
    await page.fill('input[placeholder="about-us"]', slug);
    await page.getByRole("button", { name: "ساخت و ورود به صفحه‌ساز" }).click();
    await expect(page).toHaveURL(/\/admin\/builder\//);

    const frame = page.frameLocator("iframe[data-builder-frame]");
    await expect(frame.getByText("بوم خالی است", { exact: false })).toBeVisible();

    // click-to-add from the library
    await page.locator("aside button").filter({ hasText: "بنر تبلیغاتی" }).first().click();
    await expect(frame.locator('[data-block-type="promo-banner"]')).toBeVisible();
    const props = page.locator('aside[aria-label="ویژگی‌ها"]');
    await props.locator('input[type="text"]').first().fill("پیشنهاد تست E2E");
    await expect(frame.getByText("پیشنهاد تست E2E")).toBeVisible();

    // page SEO
    await page.keyboard.press("Escape");
    await props.locator("input").nth(2).fill("عنوان سئو E2E");
    await expect(page.locator("header p[title]")).toContainText("ذخیره شد", { timeout: 10_000 });

    // publish with confirmation
    await page.locator("header button:has(svg.lucide-upload)").click();
    await page.getByRole("alertdialog").getByRole("button", { name: "انتشار" }).click();
    await expect(page.locator("header p[title]")).toContainText("منتشر");

    await page.goto(`/${slug}`);
    await expect(page.getByText("پیشنهاد تست E2E")).toBeVisible();
    await expect(page).toHaveTitle(/عنوان سئو E2E/);
  });

  test("responsive preview uses the real device width", async ({ page }) => {
    await login(page);
    await page.goto("/admin/builder/home");
    const iframe = page.locator("iframe[data-builder-frame]");
    await expect(iframe).toBeVisible();
    await page.locator('header button[title="موبایل"]').click();
    const width = await page
      .frameLocator("iframe[data-builder-frame]")
      .locator("body")
      .evaluate(() => window.innerWidth);
    expect(width).toBe(390);
  });
});
