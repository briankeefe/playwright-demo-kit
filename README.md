# Playwright Demo Kit

Human-paced Playwright harness for polished product demos.

## What this is for

Use this when normal product screens exist, but demo experience still feels rough.

This kit turns Playwright from test runner into repeatable demo runner:

- opens app in controlled mobile viewport
- moves through flow at human pace
- shows clean on-screen cursor
- adds short captions for story beats
- records browser video automatically
- renders higher-quality mp4 for sharing

Good fit for:

- founder demos
- investor walkthroughs
- sales enablement clips
- product teasers
- internal launch videos
- repeatable QA demos across multiple apps

## Why use it

Raw screen recordings usually break down in same ways:

- mouse moves too fast
- important moments pass without context
- clicks feel chaotic
- narration becomes required to explain basics
- every retake is manual and inconsistent

This kit fixes that by making demo itself scripted, repeatable, and product-aware.

Main motivation:

- tell one clear story per flow
- keep pacing deliberate
- remove presenter shakiness
- regenerate same demo after UI changes
- reuse same framework across many apps

## What's included

- mobile-first demo config
- slow motion capture
- fake on-screen cursor
- cinematic caption overlays
- HQ `.webm` → `.mp4` render script
- starter demo spec template

## Install

```bash
npm install
npx playwright install chromium
```

## Adopt in existing app

1. copy `playwright.demo.config.ts`
2. copy `tests/demo/helpers.ts`
3. copy `scripts/render-demo-video.mjs`
4. add package scripts from this repo
5. set `PLAYWRIGHT_BASE_URL`
6. optionally set `PLAYWRIGHT_DEMO_WEB_SERVER_COMMAND`
7. replace `tests/demo/example.demo.spec.ts` with app flow
8. run `npm run demo:test -- --list`

## Wire app

Set one or both env vars:

```bash
export PLAYWRIGHT_BASE_URL="http://127.0.0.1:3000"
export PLAYWRIGHT_DEMO_WEB_SERVER_COMMAND="npm run dev -- --hostname 127.0.0.1 --port 3000"
```

If `PLAYWRIGHT_DEMO_WEB_SERVER_COMMAND` set, Playwright starts app for demo run.

## Run

```bash
npm run demo:test
npm run demo:render
```

Or both:

```bash
npm run demo:flow
```

## Files to copy into another app

- `playwright.demo.config.ts`
- `tests/demo/helpers.ts`
- `scripts/render-demo-video.mjs`

Then replace `tests/demo/example.demo.spec.ts` with app-specific walkthrough.

## Verification

```bash
npm run typecheck
npm run demo:test -- --list
```

GitHub Actions runs same checks on push and pull request.

## Desktop apps and dashboards

Default capture is a tall mobile frame. For wide apps (dashboards, admin UIs) set:

```bash
export DEMO_DEVICE=desktop   # null viewport + maximized window, 1440x900 video
export DEMO_SLOWMO=120       # optional, ms of slow motion
```

## Hiding dev-server error overlays

Create React App / webpack-dev-server / Vite show a full-screen error overlay
(e.g. "Uncaught runtime errors") that will dominate a demo. Kill it before the
app loads:

```ts
import { dismissDevOverlays } from "./helpers";
await dismissDevOverlays(page); // call before page.goto
```

It uses `!important` CSS (to beat the overlay's inline `display:block`) plus a
short interval (because webpack-dev-server re-shows the overlay via a style flip
that a childList MutationObserver misses). If you control the dev server, also
consider disabling it at the source (`devServer.client.overlay = false`).

## Skipping login (auth injection)

Seed `localStorage` before load so the demo starts authenticated. Read secrets
from env, never hardcode them:

```ts
import { injectLocalStorage } from "./helpers";
await injectLocalStorage(page, {
  TOKEN: process.env.DEMO_TOKEN ?? "",
  CURRENT_LOCATION: process.env.DEMO_LOCATION ?? "",
});
```

## Safety gate

Stop a demo from firing against the wrong environment:

```ts
import { isSafeDemoTarget } from "./helpers";
test.beforeEach(() => test.skip(!isSafeDemoTarget(), "set DEMO_CONFIRM=1 or use a localhost base URL"));
```

Safe when `DEMO_CONFIRM=1` or `PLAYWRIGHT_BASE_URL` is localhost. It only checks
the frontend URL, not which database the backend points at, so still confirm the
backend target yourself.

## Caption vs locator collisions

Captions render real text into the page, so `page.getByText("…")` can match a
caption as well as the element you meant. Prefer role/`exact` locators
(`getByRole("button", { name: "Save" })`, `getByText("Save", { exact: true })`)
in steps that run while a caption is visible.

## Demo pattern

1. open page
2. wait for load + breathing room
3. show caption with one idea
4. move demo cursor to next target
5. click or type slowly
6. pause long enough for viewer to understand
7. repeat until story complete

## Notes

- Default capture tuned for tall mobile demos.
- `ffmpeg` required for HQ mp4 render.
- Template spec intentionally skipped until customized.
- Repo intended to be used as GitHub template or copy source for other apps.
