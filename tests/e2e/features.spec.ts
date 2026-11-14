import { expect, test, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

async function adminLogin(page: Page, email = E2E_ADMIN.email, password = E2E_ADMIN.password) {
  await page.goto("/admin/login");
  await page.fill("input[type=email]", email);
  await page.fill("input[type=password]", password);
  await page.click("button[type=submit]");
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("theme, team, password, customer OTP", () => {
  test("store theme is saved through the API and applied on the storefront", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/theme");
    await page.getByLabel("رنگ اصلی (دکمه‌ها)").fill("#aa3300");
    await page.getByRole("button", { name: "ذخیره تم" }).click();
    await expect(page.getByRole("status")).toContainText("ذخیره شد");
    await page.goto("/");
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--primary").trim());
    expect(primary).toBe("#aa3300");
    // reset
    await page.goto("/admin/theme");
    await page.getByRole("button", { name: "بازگشت به پیش‌فرض" }).click();
    await expect(page.getByRole("status")).toContainText("پیش‌فرض");
  });

  test("owner adds a member who can sign in and change their password", async ({ page, browser }) => {
    const email = `member-${Date.now().toString(36)}@test.local`;
    const firstPassword = "First-Pass-2026!";
    await adminLogin(page);
    await page.goto("/admin/team");
    const form = page.locator("form");
    await form.locator('input[type="email"]').fill(email);
    await form.locator("select").selectOption("editor");
    await form.locator('input[type="password"]').fill(firstPassword);
    await page.getByRole("button", { name: "افزودن" }).click();
    await expect(page.getByText(email).first()).toBeVisible();

    const ctx = await browser.newContext();
    const member = await ctx.newPage();
    await adminLogin(member, email, firstPassword);
    // editors cannot manage the team
    await member.goto("/admin/team");
    await expect(member.getByText("فقط مالک فروشگاه")).toBeVisible();
    // change own password
    await member.goto("/admin/account");
    const inputs = member.locator('input[type="password"]');
    await inputs.nth(0).fill(firstPassword);
    await inputs.nth(1).fill("Second-Pass-2026!");
    await inputs.nth(2).fill("Second-Pass-2026!");
    await member.getByRole("button", { name: "تغییر رمز" }).click();
    await expect(member.getByRole("status")).toContainText("تغییر کرد");
    await ctx.close();

    const ctx2 = await browser.newContext();
    const again = await ctx2.newPage();
    await adminLogin(again, email, "Second-Pass-2026!");
    await ctx2.close();

    // owner removes the member
    page.on("dialog", (d) => d.accept());
    await page.reload();
    await page.getByRole("button", { name: `حذف ${email}` }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "حذف" }).click();
    await expect(page.getByText(email)).toHaveCount(0);
  });

  test("customer signs in with an OTP and sees the profile", async ({ page }) => {
    const phone = `0912${Date.now().toString().slice(-7)}`;
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login$/);
    await page.fill('input[type="tel"], input[inputmode="tel"], input[placeholder="09121234567"]', phone);
    await page.getByRole("button", { name: "دریافت کد تأیید" }).click();
    const code = (await page.locator("[data-dev-code] span").textContent())!.trim();
    expect(code).toMatch(/^\d{6}$/);
    for (let i = 0; i < 6; i++) await page.fill(`#otp-${i}`, code[i]);
    await page.getByRole("button", { name: /ورود|ثبت‌نام/ }).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByText(phone)).toBeVisible();
    await page.getByLabel("نام").fill("مشتری تست");
    await page.getByRole("button", { name: "ذخیره" }).click();
    await expect(page.getByRole("status")).toContainText("ذخیره شد");
    await page.getByRole("button", { name: "خروج" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
