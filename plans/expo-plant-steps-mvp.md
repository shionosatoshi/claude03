# Expo Plant Steps MVP Plan

## Goal

Build a working Expo + React Native + TypeScript MVP in `app10` where a plant grows across 6 stages from 0 to 50,000 mock steps, with persisted progress and a persisted blooming collection.

## Scope

- Scaffold a standalone Expo TypeScript app.
- Add four screens: Home, Plant Detail, Collection, and Settings.
- Use mock/debug step controls: +1,000, +5,000, reset, and bloom.
- Show a progress bar and stage-based plant placeholder when image assets are missing.
- Persist progress and collection through a service layer backed by AsyncStorage.
- Keep storage service replaceable with a future Supabase implementation.
- Document setup and future implementation notes in `app10/README.md`.

## Review Notes

- `codex-review` is not available in this environment, so this plan and implementation will use careful self-review at the specified milestones.
- MVP priority is a runnable app over polish-heavy visuals.
