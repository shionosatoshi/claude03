# Codex Settings

This file gives repository-level guidance to coding agents working in this project.

## Plans

- When creating or updating a Markdown file in `./plans`, run the `codex-review` skill if it is available in the current environment.
- If `codex-review` is not available, record that limitation and continue with a careful self-review.
- For complex features or significant refactors, use an ExecPlan when the local planning guide exists. If `.agent/PLANS.md` is not present, create a concise plan in `plans/` and keep it updated as work proceeds.

## Review Gate

At key milestones, review the work before moving on:

- after updating specs or plans
- after major implementation steps, especially changes touching 5 or more files, public APIs, or infrastructure/configuration
- before commit, pull request, release, or deployment

Prefer an explicit review/fix/re-review loop when the relevant review tooling is available.

## Task Management

When implementing features or making code changes, track progress with clear tasks. Break work into concrete steps and update task status as each step is completed.

## Decision Making

When a decision needs user input, use `AskUserQuestion` if that tool is available. If it is not available, ask a concise direct question in chat.

## Git Hygiene

- Do not include unrelated local files in commits.
- Keep `AGENTS.md` changes intentional and separate from feature work when possible.
- Before pushing, verify the staged files with `git diff --cached --name-only`.
