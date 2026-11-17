import { expect, test, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

/**
 * Multi-tenant platform on subdomains. Runs only when both the frontend and
 * the API use PLATFORM_DOMAIN=E2E_PLATFORM_DOMAIN (e.g. "ws.localhost":
 * Chromium resolves *.localhost to this machine).
 */
const PD = process.env.E2E_PLATFORM_DOMAIN;
const PORT = Number(process.env.E2E_PORT || 3100);
const at = (host: string, path = "/") => `http://${host}:${PORT}${path}`;

test.describe("platform: landing, sign-up and isolated subdomains", () => {
  test.skip(!PD, "set E2E_PLATFORM_DOMAIN (and PLATFORM_DOMAIN on both servers)");

  async function signIn(page: Page, host: string, email: string, password: string) {
    await page.goto(at(host, "/admin/login"));
    await page.fill("input[type=email]", email);
    await page.fill("input[type=password]", password);
    await page.click("button[type=submit]");
  }

  test("landing → sign-up → new shop on its own subdomain, isolated from other shops", async ({ page, browser }) => {
    const sub = `e2e${Date.now().toString(36)}`;
    const email = `${sub}@test.local`;
    const password = "Platform-Pass-2026!";

    // landing site with plans
    await page.goto(at(PD!));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("فروشگاه اینترنتی");
    await expect(page.locator("[data-plan]")).toHaveCount(3);
    await page.locator('[data-plan="pro"] a').click();
    await expect(page).toHaveURL(/\/signup\?plan=pro/);

    // sign-up with live subdomain check
    await page.locator('input[name="storeName"]').fill("فروشگاه تست پلتفرم");
    await page.locator('input[name="subdomain"]').fill("panel");
    await expect(page.getByText("این نام رزرو شده است")).toBeVisible();
    await page.locator('input[name="subdomain"]').fill(sub);
    await expect(page.getByText("این آدرس آزاد است")).toBeVisible();
    await page.locator('input[name="name"]').fill("مالک تست");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: /ساخت فروشگاه و شروع/ }).click();
    await expect(page.getByRole("status")).toContainText("ساخته شد");

    // the new shop exists on its subdomain (empty catalog, its own name)
    const shopHost = `${sub}.${PD}`;
    await page.goto(at(shopHost));
    await expect(page).toHaveTitle(/فروشگاه تست پلتفرم/);

    // its owner signs in on the shop's own panel and sees the trial plan
    await signIn(page, shopHost, email, password);
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto(at(shopHost, "/admin/billing"));
    await expect(page.getByTestId("current-subscription")).toContainText("حرفه‌ای");
    await page.goto(at(shopHost, "/admin/products"));
    await expect(page.getByText("هنوز محصولی ندارید")).toBeVisible();

    // the default shop's owner can't sign in to this shop's panel…
    const ctx = await browser.newContext();
    const other = await ctx.newPage();
    await signIn(other, shopHost, E2E_ADMIN.email, E2E_ADMIN.password);
    await expect(other.getByText("ایمیل یا رمز عبور اشتباه است.")).toBeVisible();
    // …and the new owner can't sign in to the default shop's panel
    await signIn(other, `default.${PD}`, email, password);
    await expect(other.getByText("ایمیل یا رمز عبور اشتباه است.")).toBeVisible();
    await ctx.close();

    // unknown subdomain and the panel host
    await page.goto(at(`does-not-exist.${PD}`));
    await expect(page.getByTestId("store-unavailable")).toContainText("فروشگاهی در این آدرس وجود ندارد");
    await page.goto(at(`panel.${PD}`));
    await expect(page).toHaveURL(new RegExp(`panel\\.${PD!.replace(/\./g, "\\.")}:${PORT}/admin`));
  });
});
