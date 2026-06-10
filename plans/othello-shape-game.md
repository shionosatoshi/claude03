# Shape Othello Plan

## Goal

Create a browser-playable Othello variant where the standard flipping rules remain intact, but the board shape changes the value of corners and familiar opening strategy.

## Approach

- Add `app09` as a static game with separate desktop/mobile entry points and shared assets.
- Use a shaped board with invalid cells, legal move detection, pass handling, score counting, and endgame detection.
- Provide two-player and simple CPU play so the game is immediately playable on PC and phone.
- Keep new rules visible near the board. If shape-specific rules are needed, describe them briefly in Japanese.

## Review Notes

- `codex-review` skill was requested by repository guidance for Markdown plan changes, but it is not available in the current environment.
- I will perform a careful self-review after plan creation, after implementation, and before final delivery.

## Tasks

- [x] Confirm repo structure and planning constraints.
- [x] Incorporate sub-agent A/B design feedback.
- [x] Implement the shaped Othello game.
- [x] Verify desktop and mobile layouts.
- [x] Update project documentation.
