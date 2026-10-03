import { defineConfig, devices } from "@playwright/test";

// Tests run against a real production build made with a test form ID, kept in ./out-e2e.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    command: "node scripts/e2e-build.mjs && node scripts/serve.mjs out-e2e",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
