import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 45_000,
  reporter: [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "mobile-375", testMatch: ["**/mobile-375.spec.ts", "**/v6-showcase.spec.ts"], use: { browserName: "chromium", viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" } },
    { name: "mobile-390", testIgnore: "**/mobile-375.spec.ts", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "tablet-768", testIgnore: "**/mobile-375.spec.ts", use: { browserName: "chromium", viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "desktop-1440", testIgnore: "**/mobile-375.spec.ts", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
