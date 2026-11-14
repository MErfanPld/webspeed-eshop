import { defineConfig, devices } from "@playwright/test";

export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || "admin@webspeed.local",
  password: process.env.E2E_ADMIN_PASSWORD || "admin12345",
};

const PORT = Number(process.env.E2E_PORT || 3100);
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

/**
 * E2E tests run the frontend production build (`next build && next start`)
 * against a running Django API (API_INTERNAL_URL). They are API contract
 * tests: every request goes through the real backend.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "off",
    locale: "fa-IR",
    ...(process.env.PW_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } }
      : {}),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        // The Django API must already be running (see README "E2E tests")
        env: { API_INTERNAL_URL: process.env.API_INTERNAL_URL || "http://localhost:8000/api/v1" },
      },
});
