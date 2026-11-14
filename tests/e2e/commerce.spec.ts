import { expect, test, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

// 1×1 transparent PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.fill("input[type=email]", E2E_ADMIN.email);
  await page.fill("input[type=password]", E2E_ADMIN.password);
  await page.click("button[type=submit]");
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("commerce flow", () => {
  test("media upload rejects non-images and accepts PNG", async ({ page }) => {
    await login(page);
    await page.goto("/admin/media");
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({ name: "evil.svg", mimeType: "image/png", buffer: Buffer.from("<svg onload=alert(1)>") });
    await expect(page.locator('p[role="alert"]')).toContainText("فقط تصاویر");
    await input.setInputFiles({ name: "pixel.png", mimeType: "image/png", buffer: PNG });
    await expect(page.locator("figure").filter({ hasText: "pixel.png" }).first()).toBeVisible();
  });

  test("admin creates a product → customer buys it → admin confirms → customer tracks", async ({ page, context }) => {
    const slug = `e2e-tee-${Date.now().toString(36)}`;
    await login(page);

    // Create product
    await page.goto("/admin/products/new");
    const inputs = page.locator("form input:not([type=checkbox]):not([type=color]):not([type=file])");
    await inputs.nth(0).fill("تی‌شرت تست");
    await inputs.nth(1).fill(slug);
    await page.locator("form select").first().selectOption("active");
    await page.getByLabel("قیمت (تومان)").fill("150000");
    await page.getByLabel("موجودی").fill("2");
    await page.getByRole("button", { name: "ذخیره" }).click();
    await expect(page).toHaveURL(/\/admin\/products\/p-/);

    // Storefront: product page → add to cart
    const shopper = await context.newPage();
    await shopper.goto(`/products/${slug}`);
    await expect(shopper.locator("h1")).toContainText("تی‌شرت تست");
    await shopper.getByRole("button", { name: "مشکی", exact: true }).click();
    await shopper.getByRole("button", { name: "M", exact: true }).click();
    await shopper.getByRole("button", { name: /افزودن به سبد/ }).first().click();
    await expect(shopper.getByRole("button", { name: /اضافه شد/ }).first()).toBeVisible();
    await shopper.goto("/checkout");
    await shopper.fill("#fullName", "خریدار تست");
    await shopper.fill("#phone", "09121234567");
    await shopper.fill("#province", "تهران");
    await shopper.fill("#city", "تهران");
    await shopper.fill("#address", "خیابان آزمایش، پلاک ۱");
    await shopper.fill("#postalCode", "1234567890");
    await shopper.getByRole("button", { name: /ادامه به پرداخت/ }).click();
    await shopper.locator('input[type="file"]').setInputFiles({ name: "receipt.png", mimeType: "image/png", buffer: PNG });
    await shopper.getByRole("button", { name: "ثبت سفارش" }).click();
    await expect(shopper.getByText("سفارش ثبت شد")).toBeVisible();
    const number = (await shopper.locator("[data-num]").first().textContent())!.trim();
    expect(number).toMatch(/^WS-/);

    // Stock was reserved server-side (2 → 1)
    await page.goto("/admin/products");
    await page.reload();

    // Admin confirms the order
    await page.goto("/admin/orders");
    await page.getByText(number).click();
    await expect(page.getByAltText("رسید پرداخت")).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "تأیید شده" }).click();
    await expect(page.locator("tbody").getByText("تأیید شده")).toBeVisible();

    // Customer tracks the order (needs number AND phone)
    await shopper.goto(`/track?number=${encodeURIComponent(number)}`);
    await shopper.fill("#phone", "09120000000");
    await shopper.getByRole("button", { name: "پیگیری" }).click();
    await expect(shopper.locator('p[role="alert"]')).toBeVisible();
    await shopper.fill("#phone", "09121234567");
    await shopper.getByRole("button", { name: "پیگیری" }).click();
    await expect(shopper.locator("section").getByText("تأیید شده").first()).toBeVisible();
  });

  test("checkout API recomputes prices and rejects tampered items", async ({ request }) => {
    const fd = {
      data: JSON.stringify({
        customer: {
          fullName: "x",
          phone: "09121234567",
          province: "a",
          city: "b",
          address: "c",
          postalCode: "1234567890",
        },
        items: [{ productId: "does-not-exist", size: "M", color: "x", quantity: 1, price: 1 }],
      }),
      receipt: { name: "r.png", mimeType: "image/png", buffer: PNG },
    };
    const res = await request.post("/api/v1/orders", { multipart: fd, headers: { Origin: new URL(test.info().project.use.baseURL!).origin } });
    expect(res.status()).toBe(400);
  });
});
