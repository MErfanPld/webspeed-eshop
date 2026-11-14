import { defineConfig, devices } from "@playwright/test";

export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || "admin@webspeed.local",
  password: process.env.E2E_ADMIN_PASSWORD || "admin12345",
};

const PORT = Number(process.env.E2E_PORT || 3100);
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

/**
 * E2E tests run against a production build (`next build && next start`).
 * In CI the server is started here; locally an already-running server on the
 * same port is reused.
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
        env: {
          DATA_DIR: process.env.DATA_DIR || ".e2e-data",
          AUTH_SECRET: process.env.AUTH_SECRET || "e2e-only-secret-not-for-production-0123456789",
          ADMIN_EMAIL: E2E_ADMIN.email,
          ADMIN_PASSWORD: E2E_ADMIN.password,
          INSECURE_COOKIES: "1",
        },
      },
});
