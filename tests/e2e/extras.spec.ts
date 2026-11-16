import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

/**
 * Coupons, online payment (mock gateway), brands, reviews moderation,
 * addresses, password recovery, audit log, help page, sitemap/robots.
 * The API must run with PAYMENT_PROVIDER=mock and FRONTEND_URL pointing at
 * this frontend (see README "E2E tests").
 */

async function adminLogin(page: Page) {
  await page.goto("/admin/login");
  await page.fill("input[type=email]", E2E_ADMIN.email);
  await page.fill("input[type=password]", E2E_ADMIN.password);
  await page.click("button[type=submit]");
  await expect(page).toHaveURL(/\/admin$/);
}

type ApiProduct = { slug: string; stock: number; price: number; sizes: string[]; colors: { name: string }[] };

async function inStockProduct(request: APIRequestContext): Promise<ApiProduct> {
  const { products } = await (await request.get("/api/v1/products?pageSize=100")).json();
  const p = (products as ApiProduct[]).find((x) => x.stock >= 3 && x.price >= 100000);
  expect(p, "a seeded product with stock").toBeTruthy();
  return p!;
}

async function addToCart(page: Page, p: ApiProduct) {
  await page.goto(`/products/${p.slug}`);
  if (p.colors[0]) await page.getByRole("button", { name: p.colors[0].name, exact: true }).first().click();
  if (p.sizes[0]) await page.getByRole("button", { name: p.sizes[0], exact: true }).first().click();
  await page.getByRole("button", { name: /افزودن به سبد/ }).first().click();
  await expect(page.getByRole("button", { name: /اضافه شد/ }).first()).toBeVisible();
}

async function fillShipping(page: Page) {
  await page.goto("/checkout");
  await page.fill("#fullName", "خریدار آنلاین");
  await page.fill("#phone", "09127654321");
  await page.fill("#province", "تهران");
  await page.fill("#city", "تهران");
  await page.fill("#address", "خیابان تست، پلاک ۲");
  await page.fill("#postalCode", "1234567890");
}

test.describe("coupons and online payment", () => {
  test("admin creates a coupon; shopper applies it and pays online (mock gateway)", async ({ page, browser, request }) => {
    const code = `E2E${Date.now().toString(36).toUpperCase()}`;
    await adminLogin(page);
    await page.goto("/admin/coupons");
    await page.getByRole("button", { name: "کد جدید" }).click();
    await page.locator('input[name="code"]').fill(code);
    await page.locator('input[name="value"]').fill("10");
    await page.getByRole("button", { name: "ذخیره" }).click();
    await expect(page.getByTestId("coupon-row").filter({ hasText: code })).toBeVisible();

    const ctx = await browser.newContext();
    const shopper = await ctx.newPage();
    const product = await inStockProduct(request);
    await addToCart(shopper, product);
    await fillShipping(shopper);
    await shopper.getByLabel("کد تخفیف").fill(code.toLowerCase());
    await shopper.getByRole("button", { name: "اعمال" }).click();
    await expect(shopper.getByText("اعمال شد")).toBeVisible();
    await expect(shopper.getByText("تخفیف", { exact: true })).toBeVisible();

    await shopper.getByRole("button", { name: /ادامه به پرداخت/ }).click();
    await shopper.getByLabel("پرداخت آنلاین").check();
    await expect(shopper.locator('input[type="file"]')).toHaveCount(0); // no receipt for online payment
    await shopper.getByRole("button", { name: "ثبت سفارش و پرداخت" }).click();

    // Mock bank page served by the API
    await expect(shopper.getByRole("heading", { name: "درگاه پرداخت آزمایشی" })).toBeVisible();
    await shopper.locator("#pay-ok").click();
    await expect(shopper).toHaveURL(/\/checkout\/result\?.*status=ok/);
    await expect(shopper.getByTestId("payment-result")).toHaveText("پرداخت موفق بود");
    const number = new URL(shopper.url()).searchParams.get("order")!;
    await ctx.close();

    // Admin: paid, confirmed, discounted; the coupon counts one use
    const { orders } = await (await page.request.get(`/api/v1/admin/orders?q=${number}`)).json();
    expect(orders[0]).toMatchObject({ status: "confirmed", paymentMethod: "online", paid: true, couponCode: code });
    expect(orders[0].discount).toBeGreaterThan(0);
    await page.goto("/admin/coupons");
    await expect(page.getByTestId("coupon-row").filter({ hasText: code })).toContainText("۱");

    // audit log (owner) records the coupon
    await page.goto("/admin/audit");
    await expect(page.getByTestId("audit-row").filter({ hasText: code }).first()).toBeVisible();
  });

  test("a failed online payment cancels the order", async ({ page, request }) => {
    const product = await inStockProduct(request);
    await addToCart(page, product);
    await fillShipping(page);
    await page.getByRole("button", { name: /ادامه به پرداخت/ }).click();
    await page.getByLabel("پرداخت آنلاین").check();
    await page.getByRole("button", { name: "ثبت سفارش و پرداخت" }).click();
    await page.locator("#pay-fail").click();
    await expect(page.getByTestId("payment-result")).toHaveText("پرداخت ناموفق بود");
    const number = new URL(page.url()).searchParams.get("order")!;
    const track = await request.get(`/api/v1/orders/track?number=${number}&phone=09127654321`);
    expect((await track.json()).order.status).toBe("cancelled");
  });
});

test.describe("catalog extras and admin pages", () => {
  test("brands, reviews, help and pagination pages work", async ({ page }) => {
    await adminLogin(page);
    const slug = `e2e-brand-${Date.now().toString(36)}`;
    await page.goto("/admin/brands");
    await page.getByRole("button", { name: "برند جدید" }).click();
    await page.locator('input[name="brandName"]').fill("برند تست");
    await page.locator('input[name="brandSlug"]').fill(slug);
    await page.getByRole("button", { name: "ذخیره" }).click();
    await expect(page.getByTestId("brand-card").filter({ hasText: slug })).toBeVisible();

    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "نظرات مشتریان" })).toBeVisible();

    await page.goto("/admin/help");
    await expect(page.getByRole("heading", { name: "آموزش و راهنما" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "صفحه‌ساز" })).toBeVisible();

    await page.goto("/admin/orders?page=1");
    await expect(page.getByRole("heading", { name: "سفارش‌ها" })).toBeVisible();
    await page.goto("/admin/customers");
    await expect(page.getByRole("heading", { name: "مشتری‌ها" })).toBeVisible();

    // clean up
    const { brands } = await (await page.request.get("/api/v1/admin/brands")).json();
    const created = brands.find((b: { slug: string }) => b.slug === slug);
    await page.request.delete(`/api/v1/admin/brands/${created.id}`, { headers: { Origin: new URL(page.url()).origin } });
  });

  test("forgot password always confirms without revealing accounts", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("link", { name: "رمز عبور را فراموش کرده‌اید؟" }).click();
    await expect(page).toHaveURL(/\/admin\/forgot-password$/);
    await page.fill("input[type=email]", "nobody@example.com");
    await page.getByRole("button", { name: "ارسال لینک بازیابی" }).click();
    await expect(page.getByRole("status")).toContainText("لینک بازیابی");
    await page.goto("/admin/reset-password?uid=x&token=y");
    await page.locator('input[type="password"]').nth(0).fill("Brand-New-Pass1!");
    await page.locator('input[type="password"]').nth(1).fill("Brand-New-Pass1!");
    await page.getByRole("button", { name: "ذخیره رمز جدید" }).click();
    await expect(page.getByText("لینک بازیابی نامعتبر یا منقضی شده است.")).toBeVisible();
  });

  test("customer saves an address and checkout is prefilled", async ({ page }) => {
    const phone = `0935${Date.now().toString().slice(-7)}`;
    await page.goto("/login");
    await page.fill('input[placeholder="09121234567"]', phone);
    await page.getByRole("button", { name: "دریافت کد تأیید" }).click();
    const code = (await page.locator("[data-dev-code] span").textContent())!.trim();
    for (let i = 0; i < 6; i++) await page.fill(`#otp-${i}`, code[i]);
    await page.getByRole("button", { name: /ورود|ثبت‌نام/ }).click();
    await expect(page).toHaveURL(/\/profile$/);

    await page.getByRole("button", { name: "افزودن آدرس" }).click();
    const form = page.getByRole("form", { name: "فرم آدرس" });
    await form.locator('input[name="title"]').fill("خانه");
    await form.locator('input[name="fullName"]').fill("مشتری آدرس‌دار");
    await form.locator('input[name="phone"]').fill(phone);
    await form.locator('input[name="province"]').fill("اصفهان");
    await form.locator('input[name="city"]').fill("اصفهان");
    await form.locator('input[name="postalCode"]').fill("8888888888");
    await form.locator('input[name="address"]').fill("خیابان چهارباغ");
    await page.getByRole("button", { name: "ذخیره آدرس" }).click();
    await expect(page.getByTestId("address-item")).toContainText("خانه");

    // checkout prefills from the default address (cart needs an item)
    const { products } = await (await page.request.get("/api/v1/products?pageSize=100")).json();
    const p = (products as ApiProduct[]).find((x) => x.stock > 0)!;
    await addToCart(page, p);
    await page.goto("/checkout");
    await expect(page.locator("#city")).toHaveValue("اصفهان");
    await expect(page.locator("#fullName")).toHaveValue("مشتری آدرس‌دار");
  });

  test("sitemap.xml and robots.txt are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/products/");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Sitemap:");
  });
});
