import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

const PORT = Number(process.env.PORT || 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;
const mobileViewport = { width: 430, height: 932 };
const recordVideoSize = { width: 860, height: 1864 };
const webServerCommand = process.env.PLAYWRIGHT_DEMO_WEB_SERVER_COMMAND;

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
    video: "on",
    viewport: mobileViewport,
    screen: mobileViewport,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: "demo-artifacts",
      size: recordVideoSize,
    },
    launchOptions: {
      slowMo: 120,
    },
  },
  projects: [
    {
      name: "chromium-demo",
      use: {
        browserName: "chromium",
        viewport: mobileViewport,
        screen: mobileViewport,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: devices["Pixel 7"].userAgent,
        recordVideo: {
          dir: "demo-artifacts",
          size: recordVideoSize,
        },
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
