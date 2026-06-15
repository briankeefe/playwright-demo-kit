import { test } from "@playwright/test";
import {
  enableDemoCaptions,
  enableDemoCursor,
  hideDemoCaption,
  hoverClickDemo,
  pauseAfterNavigation,
  showDemoCaption,
  sleep,
  typeSlowDemo,
} from "./helpers";

test.skip("template demo flow", async ({ page }) => {
  const beat = 1000;
  const read = 2500;

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
  await sleep(beat);

  await hideDemoCaption(page);
});
