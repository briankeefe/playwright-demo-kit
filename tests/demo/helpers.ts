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
  await locator.type(value, { delay: 100 });
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
        document.head.appendChild(style);
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
          document.head.appendChild(style);
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
        document.head.appendChild(style);
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
          document.head.appendChild(style);
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
  await locator.type(value, { delay: 100 });
  await sleep(Pace.medium);
}
