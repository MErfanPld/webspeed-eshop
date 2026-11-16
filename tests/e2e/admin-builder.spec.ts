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

  test("nested blocks are editable; palette (Ctrl+K) and the + button add blocks", async ({ page }) => {
    const slug = `e2e-nest-${Date.now().toString(36)}`;
    await login(page);
    const created = await page.request.post("/api/v1/admin/pages", {
      data: { name: "تو در تو", slug: `/${slug}` },
      headers: { Origin: new URL(page.url()).origin },
    });
    const { page: pg } = await created.json();
    await page.goto(`/admin/builder/${pg.id}`);
    const frame = page.frameLocator("iframe[data-builder-frame]");
    const props = page.getByTestId("properties-panel");

    // columns block, then a heading inside it (adding with a container selected nests the block)
    await page.locator('aside button[data-block-type="columns"]').click();
    await page.locator('aside button[data-block-type="heading"]').click();
    const nested = frame.locator('[data-block-type="columns"] [data-block-type="heading"]');
    await expect(nested).toHaveCount(1);

    // select the nested heading: the properties panel must show it (regression: top-level only)
    await nested.click({ position: { x: 40, y: 12 } });
    await expect(props.getByRole("textbox", { name: "نام بلوک" })).toHaveAttribute("placeholder", "عنوان");
    await expect(props.getByRole("navigation", { name: "مسیر بلوک" })).toContainText("ستون‌ها");
    await props.locator('input[type="text"]').first().fill("تیتر داخل ستون");
    await expect(nested).toContainText("تیتر داخل ستون");

    // Ctrl+K → type → Enter adds a block after the selection
    await page.keyboard.press("Escape");
    await page.keyboard.press("Control+k");
    await page.getByRole("combobox", { name: "جستجو" }).fill("جداکننده");
    await page.keyboard.press("Enter");
    await expect(frame.locator('[data-block-type="divider"]')).toHaveCount(1);

    // "+" under the columns block inserts right after it (not inside)
    await frame.locator('[data-block-type="columns"]').first().click({ position: { x: 5, y: 5 } });
    await frame.getByRole("button", { name: /افزودن بلوک بعد از ستون‌ها/ }).click();
    await page.getByRole("combobox", { name: "جستجو" }).fill("فاصله");
    await page.keyboard.press("Enter");
    const order = await frame.locator("[data-builder-canvas-page] > [data-block-id]").evaluateAll((els) =>
      els.map((e) => e.getAttribute("data-block-type"))
    );
    expect(order.slice(0, 2)).toEqual(["columns", "spacer"]);

    await page.request.delete(`/api/v1/admin/pages/${pg.id}`, { headers: { Origin: new URL(page.url()).origin } });
  });
});
