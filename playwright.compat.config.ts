import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

const browser = process.env.PREFLIGHT_BROWSER;
if (browser !== "chromium" && browser !== "firefox" && browser !== "webkit") {
  throw new Error("Set PREFLIGHT_BROWSER to chromium, firefox, or webkit.");
}
const port = browser === "chromium" ? 3113 : browser === "firefox" ? 3111 : 3112;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  ...base,
  use: { ...base.use, baseURL },
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
  outputDir: "test-results/compat-" + browser,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/" + browser }], ["json", { outputFile: "test-results/" + browser + "-results.json" }]],
  projects: base.projects!.map(project => ({
    ...project,
    use: {
      ...project.use,
      browserName: browser,
      // Firefox supports responsive viewports and touch, but not isMobile emulation.
      ...(browser === "firefox" ? { isMobile: false } : {}),
    },
  })),
});
