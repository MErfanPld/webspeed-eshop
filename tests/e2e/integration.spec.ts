import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

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

async function cookie(context: BrowserContext, name: string) {
  return (await context.cookies()).find((c) => c.name === name);
}

test.describe("Django API integration", () => {
  test("login sets httpOnly JWT cookies; /auth/me works", async ({ page, context }) => {
    await login(page);
    const access = await cookie(context, "ws_access");
    expect(access?.httpOnly).toBe(true);
    expect((await cookie(context, "ws_refresh"))?.httpOnly).toBe(true);
    const me = await page.request.get("/api/v1/auth/me");
    expect(me.status()).toBe(200);
    expect((await me.json()).user.email).toBe(E2E_ADMIN.email);
  });

  test("expired access token is refreshed (server middleware and client retry)", async ({ page, context }) => {
    await login(page);
    // Server side: page render with no access token → middleware rotates via refresh
    await context.clearCookies({ name: "ws_access" });
    await page.goto("/admin/products");
    await expect(page.locator("h1")).toContainText("محصولات");
    expect(await cookie(context, "ws_access")).toBeTruthy();

    // Client side: API call with no access token → 401 → refresh → retried once
    await page.goto("/admin/media");
    await context.clearCookies({ name: "ws_access" });
    await page.locator('input[type="file"]').setInputFiles({ name: "refresh.png", mimeType: "image/png", buffer: PNG });
    await expect(page.locator("figure").filter({ hasText: "refresh.png" }).first()).toBeVisible();
  });

  test("logout revokes the session", async ({ page, context }) => {
    await login(page);
    await page.click('button[aria-haspopup="menu"]');
    await page.getByRole("menuitem", { name: "خروج" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    expect(await cookie(context, "ws_refresh")).toBeFalsy();
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login\?next=/);
    expect((await page.request.get("/api/v1/admin/pages")).status()).toBe(401);
  });

  test("invalid refresh token sends the user to login", async ({ page, context }) => {
    await login(page);
    await context.clearCookies({ name: "ws_access" });
    const url = new URL(page.url());
    await context.addCookies([{ name: "ws_refresh", value: "not-a-token", domain: url.hostname, path: "/" }]);
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Forders/);
  });

  test("multi-store isolation: a new store has its own catalog, pages and orders", async ({ page }) => {
    await login(page);
    const slug = `s${Date.now().toString(36)}`;
    await page.goto("/admin/stores");
    const inputs = page.locator("form input");
    await inputs.nth(0).fill("فروشگاه تست");
    await inputs.nth(1).fill(slug);
    await page.getByRole("button", { name: "ساخت فروشگاه" }).click();
    await expect(page).toHaveURL(/\/admin\/settings/);

    const products = await (await page.request.get("/api/v1/admin/products")).json();
    expect(products.products).toEqual([]);
    const orders = await (await page.request.get("/api/v1/admin/orders")).json();
    expect(orders.orders).toEqual([]);
    const pages = await (await page.request.get("/api/v1/admin/pages")).json();
    expect(pages.pages.map((p: { id: string }) => p.id)).toContain("home");

    // A store id the user is not a member of is ignored
    const res = await page.request.get("/api/v1/admin/products", {
      headers: { "X-Store-Id": "00000000-0000-0000-0000-000000000000" },
    });
    expect(res.status()).toBe(200);

    // Switch back to the first store
    const stores = (await (await page.request.get("/api/v1/admin/stores")).json()).stores as { id: string; slug: string }[];
    const first = stores.find((s) => s.slug === "default")!;
    await page.goto("/admin/stores");
    await page.locator("div", { hasText: "default" }).getByRole("button", { name: "ورود" }).first().click();
    await expect(page).toHaveURL(/\/admin$/);
    const me = await (await page.request.get("/api/v1/auth/me")).json();
    expect(me.store.storeId).toBe(first.id);
  });

  test("payment receipts are only reachable through short-lived signed URLs", async ({ page, request }) => {
    await login(page);
    const { orders } = await (await page.request.get("/api/v1/admin/orders")).json();
    test.skip(!orders.length, "needs an order (run commerce.spec first)");
    const order = orders.find((o: { hasReceipt: boolean }) => o.hasReceipt);
    const { url, expiresIn } = await (await page.request.get(`/api/v1/admin/orders/${order.id}/receipt`)).json();
    expect(expiresIn).toBeGreaterThan(0);
    const anon = await request.get(url);
    expect(anon.status()).toBe(200);
    expect(anon.headers()["cache-control"]).toContain("no-store");
    expect((await request.get(`${url}x`)).status()).toBe(403);
    // Without the signature there is no way to the file
    expect((await request.get(`/api/v1/admin/orders/${order.id}/receipt`)).status()).toBe(401);
  });

  test("store settings and categories persist through the API", async ({ page }) => {
    await login(page);
    const tagline = `شعار ${Date.now()}`;
    await page.goto("/admin/settings");
    await page.getByLabel("شعار / توضیح کوتاه").fill(tagline);
    await page.getByRole("button", { name: "ذخیره" }).click();
    await expect(page.getByRole("status")).toContainText("ذخیره شد");
    const store = await (await page.request.get("/api/v1/store")).json();
    expect(store.store.tagline).toBe(tagline);

    const slug = `cat-${Date.now().toString(36)}`;
    await page.goto("/admin/categories");
    await page.getByRole("button", { name: "دسته جدید" }).click();
    const inputs = page.locator("form input");
    await inputs.nth(0).fill("دسته تست");
    await inputs.nth(1).fill(slug);
    await page.getByRole("button", { name: "ذخیره" }).click();
    await expect(page.getByText(slug)).toBeVisible();
    const cats = await (await page.request.get("/api/v1/categories")).json();
    expect(cats.categories.map((c: { slug: string }) => c.slug)).toContain(slug);
  });

  test("dashboard and customers render API data", async ({ page }) => {
    await login(page);
    await expect(page.getByText("فروش ۱۴ روز اخیر")).toBeVisible();
    await page.goto("/admin/customers");
    await expect(page.locator("h1")).toContainText("مشتری‌ها");
  });
});
