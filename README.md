# Playwright Demo Kit

Human-paced Playwright harness for polished product demos.

## What included

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
