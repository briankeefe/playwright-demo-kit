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
