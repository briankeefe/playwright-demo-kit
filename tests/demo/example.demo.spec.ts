import { test } from "@playwright/test";
import {
  dismissDevOverlays,
  enableDemoCaptions,
  enableDemoCursor,
  hideDemoCaption,
  hoverClickDemo,
  injectLocalStorage,
  isSafeDemoTarget,
  pauseAfterNavigation,
  showDemoCaption,
  sleep,
  typeSlowDemo,
} from "./helpers";

// In a real spec, gate it so it never fires against an unintended target:
//   test.beforeEach(() => test.skip(!isSafeDemoTarget(), "set DEMO_CONFIRM=1 or use a localhost base URL"));
void isSafeDemoTarget;

// Template is skipped until you customize the selectors below.
test.skip("template demo flow", async ({ page }) => {
  const read = 2500;

  // 1) Hide dev-server error overlays (CRA / webpack-dev-server / Vite) before anything loads.
  await dismissDevOverlays(page);

  // 2) Optional: skip the login UI by seeding auth. Pull from env, never hardcode secrets.
  await injectLocalStorage(page, {
    TOKEN: process.env.DEMO_TOKEN ?? "",
    CURRENT_LOCATION: process.env.DEMO_LOCATION ?? "",
  });

  await enableDemoCaptions(page);
  await enableDemoCursor(page);

  await page.goto("/");
  await pauseAfterNavigation(page);
  await showDemoCaption(page, "Opening scene", "Replace with your own product message");
  await sleep(read);

  await hoverClickDemo(page, page.getByRole("link", { name: /replace me/i }));
  await pauseAfterNavigation(page);
  await showDemoCaption(page, "Key action", "Walk viewer through one important step at a time");
  await sleep(read);

  await typeSlowDemo(page, page.getByRole("textbox", { name: /replace me/i }), "demo input");
  await sleep(read);

  await hideDemoCaption(page);
});
