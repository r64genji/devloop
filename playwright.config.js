import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the production build, so they test what ships.
// Set BASE_URL to test a deployed site instead, e.g. BASE_URL=https://devloop.abrahamtan.com
const baseURL = process.env.BASE_URL ?? "http://localhost:4173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run preview -- --port 4173 --strictPort",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
