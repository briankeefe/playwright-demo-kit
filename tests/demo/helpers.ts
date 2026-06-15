import type { Locator, Page } from "@playwright/test";

export const Pace = {
  short: 800,
  medium: 1600,
  long: 2600,
} as const;

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function smoothScroll(page: Page, distance = 420) {
  await page.evaluate(async (totalDistance) => {
    await new Promise<void>((resolve) => {
      let total = 0;
      const step = 12;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= totalDistance) {
          clearInterval(timer);
          resolve();
        }
      }, 16);
    });
  }, distance);
}

export async function pauseAfterNavigation(page: Page) {
  await page.waitForLoadState("networkidle");
  await sleep(Pace.medium);
}

export async function hoverClick(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.hover();
  await sleep(Pace.short);
  await locator.click();
}

export async function typeSlow(locator: Locator, value: string) {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
  await sleep(Pace.short);
  await locator.clear();
  await locator.pressSequentially(value, { delay: 100 });
  await sleep(Pace.medium);
}

const CURSOR_ID = "__pw-demo-cursor";
const CURSOR_STYLE_ID = "__pw-demo-cursor-style";
const CAPTION_ID = "__pw-demo-caption";
const CAPTION_STYLE_ID = "__pw-demo-caption-style";

async function installCursor(page: Page) {
  await page.evaluate(
    ({ cursorId, styleId }) => {
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          * { cursor: none !important; }
          #${cursorId} {
            position: fixed;
            top: 0;
            left: 0;
            width: 18px;
            height: 18px;
            border-radius: 9999px;
            border: 2px solid rgba(30, 58, 95, 0.95);
            background: rgba(255, 255, 255, 0.88);
            box-shadow: 0 4px 10px rgba(30, 58, 95, 0.22);
            pointer-events: none;
            transform: translate(-9999px, -9999px);
            transition: transform 80ms linear;
            z-index: 2147483647;
          }
          #${cursorId}::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            border-radius: 9999px;
            background: rgba(30, 58, 95, 0.95);
            transform: translate(-50%, -50%);
          }
        `;
        (document.head || document.documentElement).appendChild(style);
      }

      if (!document.getElementById(cursorId)) {
        const cursor = document.createElement("div");
        cursor.id = cursorId;
        document.body.appendChild(cursor);
      }
    },
    { cursorId: CURSOR_ID, styleId: CURSOR_STYLE_ID },
  );
}

export async function enableDemoCursor(page: Page) {
  await page.addInitScript(
    ({ cursorId, styleId }) => {
      const install = () => {
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            * { cursor: none !important; }
            #${cursorId} {
              position: fixed;
              top: 0;
              left: 0;
              width: 18px;
              height: 18px;
              border-radius: 9999px;
              border: 2px solid rgba(30, 58, 95, 0.95);
              background: rgba(255, 255, 255, 0.88);
              box-shadow: 0 4px 10px rgba(30, 58, 95, 0.22);
              pointer-events: none;
              transform: translate(-9999px, -9999px);
              transition: transform 80ms linear;
              z-index: 2147483647;
            }
            #${cursorId}::after {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              width: 4px;
              height: 4px;
              border-radius: 9999px;
              background: rgba(30, 58, 95, 0.95);
              transform: translate(-50%, -50%);
            }
          `;
          (document.head || document.documentElement).appendChild(style);
        }

        if (!document.getElementById(cursorId)) {
          const cursor = document.createElement("div");
          cursor.id = cursorId;
          document.body.appendChild(cursor);
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install, { once: true });
      } else {
        install();
      }
    },
    { cursorId: CURSOR_ID, styleId: CURSOR_STYLE_ID },
  );

  await installCursor(page);
}

async function installCaption(page: Page) {
  await page.evaluate(
    ({ captionId, styleId }) => {
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          #${captionId} {
            position: fixed;
            left: 50%;
            bottom: 36px;
            transform: translateX(-50%) translateY(18px);
            width: min(86vw, 360px);
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(18, 24, 38, 0.84);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.35;
            letter-spacing: -0.01em;
            text-align: center;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.3);
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 180ms ease, transform 180ms ease;
            pointer-events: none;
            z-index: 2147483646;
          }
          #${captionId}[data-visible="true"] {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          #${captionId} .eyebrow {
            display: block;
            margin-bottom: 6px;
            color: rgba(134, 239, 172, 0.95);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
        `;
        (document.head || document.documentElement).appendChild(style);
      }
      if (!document.getElementById(captionId)) {
        const caption = document.createElement("div");
        caption.id = captionId;
        caption.setAttribute("data-visible", "false");
        document.body.appendChild(caption);
      }
    },
    { captionId: CAPTION_ID, styleId: CAPTION_STYLE_ID },
  );
}

export async function enableDemoCaptions(page: Page) {
  await page.addInitScript(
    ({ captionId, styleId }) => {
      const install = () => {
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            #${captionId} {
              position: fixed;
              left: 50%;
              bottom: 36px;
              transform: translateX(-50%) translateY(18px);
              width: min(86vw, 360px);
              padding: 14px 16px;
              border-radius: 18px;
              background: rgba(18, 24, 38, 0.84);
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
              font-size: 18px;
              font-weight: 600;
              line-height: 1.35;
              letter-spacing: -0.01em;
              text-align: center;
              box-shadow: 0 16px 40px rgba(15, 23, 42, 0.3);
              backdrop-filter: blur(10px);
              opacity: 0;
              transition: opacity 180ms ease, transform 180ms ease;
              pointer-events: none;
              z-index: 2147483646;
            }
            #${captionId}[data-visible="true"] {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
            #${captionId} .eyebrow {
              display: block;
              margin-bottom: 6px;
              color: rgba(134, 239, 172, 0.95);
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
          `;
          (document.head || document.documentElement).appendChild(style);
        }
        if (!document.getElementById(captionId)) {
          const caption = document.createElement("div");
          caption.id = captionId;
          caption.setAttribute("data-visible", "false");
          document.body.appendChild(caption);
        }
      };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
      else install();
    },
    { captionId: CAPTION_ID, styleId: CAPTION_STYLE_ID },
  );

  await installCaption(page);
}

export async function showDemoCaption(page: Page, title: string, body?: string) {
  await installCaption(page);
  await page.evaluate(
    ({ captionId, titleText, bodyText }) => {
      const caption = document.getElementById(captionId);
      if (!caption) return;
      caption.innerHTML = bodyText ? `<span class="eyebrow">${titleText}</span>${bodyText}` : titleText;
      caption.setAttribute("data-visible", "true");
    },
    { captionId: CAPTION_ID, titleText: title, bodyText: body ?? "" },
  );
}

export async function hideDemoCaption(page: Page) {
  await page.evaluate(({ captionId }) => {
    const caption = document.getElementById(captionId);
    if (caption) caption.setAttribute("data-visible", "false");
  }, { captionId: CAPTION_ID });
}

export async function moveDemoMouse(page: Page, x: number, y: number, steps = 18) {
  await page.mouse.move(x, y, { steps });
  await page.evaluate(
    ({ cursorId, xPos, yPos }) => {
      const cursor = document.getElementById(cursorId);
      if (cursor) cursor.style.transform = `translate(${xPos - 9}px, ${yPos - 9}px)`;
    },
    { cursorId: CURSOR_ID, xPos: x, yPos: y },
  );
}

export async function moveToLocator(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Could not resolve locator position for demo cursor");
  await moveDemoMouse(page, box.x + box.width / 2, box.y + box.height / 2);
}

export async function hoverClickDemo(page: Page, locator: Locator) {
  await moveToLocator(page, locator);
  await locator.hover();
  await sleep(Pace.short);
  await locator.click();
}

export async function typeSlowDemo(page: Page, locator: Locator, value: string) {
  await moveToLocator(page, locator);
  await locator.click();
  await sleep(Pace.short);
  await locator.clear();
  await locator.pressSequentially(value, { delay: 100 });
  await sleep(Pace.medium);
}

/**
 * Continuously hide dev-server error overlays (Create React App / webpack-dev-server,
 * Vite, React Refresh) so they never block or photobomb a demo.
 *
 * Why it is built this way:
 * - Registered via addInitScript so it runs before app code / first error.
 * - CSS uses !important to beat the overlay's inline display:block.
 * - Appends to document.head || documentElement because head may not exist yet at init.
 * - Re-applies on a short interval because webpack-dev-server re-shows the overlay by
 *   flipping a style attribute, which a childList-only MutationObserver would miss.
 *
 * Prefer disabling the overlay at the dev-server config when you control it
 * (e.g. webpack devServer.client.overlay = false); use this for servers you don't.
 */
export async function dismissDevOverlays(page: Page) {
  await page.addInitScript(() => {
    const STYLE_ID = "__pw-demo-overlay-kill";
    const ensure = () => {
      try {
        const root = document.head || document.documentElement;
        if (root && !document.getElementById(STYLE_ID)) {
          const style = document.createElement("style");
          style.id = STYLE_ID;
          style.textContent =
            "iframe[id*='overlay'],iframe[id*='error'],#react-refresh-overlay," +
            "#webpack-dev-server-client-overlay{display:none!important;visibility:hidden!important;pointer-events:none!important}";
          root.appendChild(style);
        }
        for (const frame of Array.from(document.querySelectorAll("iframe"))) {
          const el = frame as HTMLElement;
          const z = parseInt(el.style.zIndex || "0", 10);
          if (/overlay|error/i.test(frame.id) || z >= 2_147_483_000) {
            el.style.setProperty("display", "none", "important");
            el.style.setProperty("pointer-events", "none", "important");
          }
        }
      } catch {
        /* ignore */
      }
    };
    ensure();
    setInterval(ensure, 150);
  });
}

/**
 * Inject localStorage values before the app loads (e.g. an auth token + current
 * location), so a demo skips the login UI. Pull secrets from env, never hardcode.
 *
 *   await injectLocalStorage(page, {
 *     TOKEN: process.env.DEMO_TOKEN ?? "",
 *     CURRENT_LOCATION: process.env.DEMO_LOCATION ?? "",
 *   });
 */
export async function injectLocalStorage(page: Page, values: Record<string, string>) {
  await page.addInitScript((vals) => {
    try {
      for (const [key, value] of Object.entries(vals)) window.localStorage.setItem(key, value);
    } catch {
      /* storage may be unavailable on the initial about:blank */
    }
  }, values);
}

/**
 * Guard so a demo never fires against an unintended (e.g. production) target.
 * Safe when DEMO_CONFIRM=1, or when PLAYWRIGHT_BASE_URL points at localhost/127.0.0.1.
 * Use at the top of a spec: test.skip(!isSafeDemoTarget(), "set DEMO_CONFIRM=1 …").
 *
 * Note: this only checks the frontend URL. It cannot tell which database the
 * backend is connected to, so still confirm the backend target yourself.
 */
export function isSafeDemoTarget(): boolean {
  if (process.env.DEMO_CONFIRM === "1") return true;
  const url = process.env.PLAYWRIGHT_BASE_URL ?? "";
  return /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:|\/|$)/i.test(url);
}
