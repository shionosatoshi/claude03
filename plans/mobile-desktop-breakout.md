# ExecPlan: Mobile/Desktop Breakout

## Goal

Create a browser-playable block breaking game that works well on phones and desktops, and can be deployed with separate public URLs for each device class.

## Review Gate

AGENTS.md asks for the `codex-review` skill after creating or updating files in `plans/`. That skill is not available in the current skill list, and tool discovery did not expose a callable replacement, so this review gate is recorded as unavailable for this run.

## Scope

- Add a new static app under `app08/`.
- Provide two entry URLs:
  - `app08/mobile/` for touch-first phone play.
  - `app08/desktop/` for keyboard and pointer play.
- Share the core game logic, rendering, audio, and state through common assets.
- Make the game installable/offline-ready with a manifest and service worker.
- Document GitHub Pages URL examples and local usage.

## Design

The game is a canvas-based vanilla JavaScript app. `mobile/index.html` and `desktop/index.html` load the same shared CSS and JS, then pass a mode flag through `data-platform`. The JavaScript reads that flag to tune controls, copy, layout, and difficulty hints while keeping the physics and scoring consistent.

The play field uses a stable virtual coordinate system, then scales to fit the available viewport. This keeps collision behavior predictable across phone and desktop screens. Touch input maps finger movement to paddle position on mobile; desktop supports arrow keys, A/D, mouse, and pointer dragging.

## Implementation Steps

1. Create `app08/shared/` with `styles.css`, `game.js`, `manifest.webmanifest`, and `sw.js`.
2. Create `app08/mobile/index.html` and `app08/desktop/index.html`.
3. Implement canvas rendering, brick layout, score/lives/level state, pause/restart, and local best score.
4. Add deployment docs in `app08/README.md`.
5. Run local static serving and browser smoke tests for both URLs.

## Validation

- Open `app08/mobile/` at a phone-sized viewport and confirm the canvas renders, touch controls are present, and gameplay starts.
- Open `app08/desktop/` at a desktop viewport and confirm keyboard/pointer controls are present and gameplay starts.
- Confirm no console errors during initial load.
- Confirm service worker registration is guarded so local file usage does not fail loudly.

