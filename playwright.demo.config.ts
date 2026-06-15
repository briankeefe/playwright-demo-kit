import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

const PORT = Number(process.env.PORT || 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;
const webServerCommand = process.env.PLAYWRIGHT_DEMO_WEB_SERVER_COMMAND;

// Desktop by default; set DEMO_DEVICE=mobile for a tall phone frame.
const isDesktop = (process.env.DEMO_DEVICE || "desktop").toLowerCase() !== "mobile";
const slowMo = Number(process.env.DEMO_SLOWMO || 120);

const mobileViewport = { width: 430, height: 932 };
const mobileVideo = { width: 860, height: 1864 };
const desktopVideo = { width: 1440, height: 900 };

// Shared per-device settings, spread into both top-level `use` and the project.
const deviceUse = isDesktop
  ? {
      // null viewport + maximized = the real window size, not an artificial box.
      viewport: null,
      video: { mode: "on" as const, size: desktopVideo },
      launchOptions: { slowMo, args: ["--start-maximized"] },
    }
  : {
      viewport: mobileViewport,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: devices["Pixel 7"].userAgent,
      video: { mode: "on" as const, size: mobileVideo },
      launchOptions: { slowMo },
    };

const config: PlaywrightTestConfig = {
  testDir: "./tests/demo",
  fullyParallel: false,
  workers: 1,
  timeout: 180000,
  outputDir: "demo-artifacts",
  use: {
    baseURL,
    headless: false,
    trace: "retain-on-failure",
    ...deviceUse,
  },
  projects: [
    {
      name: isDesktop ? "chromium-demo-desktop" : "chromium-demo",
      use: {
        browserName: "chromium",
        ...deviceUse,
      },
    },
  ],
};

if (webServerCommand) {
  config.webServer = {
    command: webServerCommand,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000,
  };
}

export default defineConfig(config);
