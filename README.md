# Smart Campus Room Availability Checker

Smart Campus is a single-page room availability checker for a fictional
campus. A user picks a room, enters a start and end time, and the app
reports whether the room is free for that slot, with a specific reason
when it is not.

Baseline commit: `05a48ca0780cfc7b93e8ce5126502bc679723699`.

## Fictional-data scope

All rooms and bookings are hard-coded fictional samples. There is no
login, no backend, no database, and no booking creation. Availability
checks read the fixtures and never modify them.

The **Current Time** field on the form is editable fiction: it models
"now" so that the past-time rule can be demonstrated at any hour. It
defaults to 08:00 and is not the real system clock. Bookings must start
strictly after it.

Manual check: set Current Time to 08:00, pick room A-101, enter
15:00–16:00, and press Check Availability — the result should be
AVAILABLE. Set Current Time to 16:00 and change the end time to 16:30 —
the stale result must clear immediately, and re-checking must now be
rejected as a past-time request.

## Repository structure

```
src/
  lib/
    availability.ts        Availability rules (pure functions and types)
    availability.test.ts   Unit tests for the rules (11 tests)
  App.tsx                  UI, sample rooms, sample bookings, handlers
  main.tsx                 React entry point
  index.css                Tailwind directives
index.html                 Page shell
vite.config.ts             Vite config with the @/ path alias
AGENTS.md                  Agent operating boundaries and acceptance criteria
```

## Requirements

- Node.js 22 (verified on v22.23.1; any Node 22.x is supported)
- npm 10 (verified on 10.9.8)

## Setup

```bash
npm ci        # clean install from package-lock.json
```

`npm ci` is preferred over `npm install` because it reproduces the exact
locked dependency versions.

## Startup

```bash
npm run dev    # Vite dev server
npm run build  # production build to dist/
npm run preview
```

## Verification scripts

```bash
npm test              # vitest run — 11 unit tests
npm run typecheck     # tsc --noEmit -p tsconfig.app.json
npm run lint          # eslint .
npm run build         # vite build
```

## What was actually verified

On this baseline (Node v22.23.1, npm 10.9.8) all four verification
scripts were executed and exited with code 0: `npm test` (11 passed,
0 failed, 0 skipped), `npm run typecheck`, `npm run lint`, and
`npm run build`. The only warning was a build-time "caniuse-lite is
outdated" Browserslist notice, which is informational. `npm ci` was not
re-run on a clean checkout as part of this documentation task. The
manual Current Time check above describes expected behavior and has not
been executed in a browser as part of this task.

## Acceptance criteria (Assignment #05)

The detailed booking contract is defined by AC1–AC6 in `AGENTS.md`.
The five assignment-level criteria map onto it as follows:

| # | Criterion | Covered by |
|---|-----------|------------|
| A1 | Reject invalid or past intervals and durations over 120 minutes. Exactly 120 minutes satisfies the duration rule when the other conditions are valid. | AC1, AC2 |
| A2 | Reject blocked rooms. For an otherwise valid request, identify the blocked room in the feedback. | AC3 |
| A3 | Reject overlaps with bookings for the selected room. Allow touching endpoints and ignore other rooms' bookings. | AC4 |
| A4 | Availability checks must preserve room and booking data. | AC5 |
| A5 | Clear outdated results when the room or a time input changes. Reselecting the same room preserves the result. Keep feedback readable on desktop and narrow screens. | AC6 |

## Task #03 decision — no additional design pattern

The Task #03 decision is that **no additional design pattern is
warranted**. The checker has exactly one availability policy, and the
codebase already separates pure rules (`src/lib/availability.ts`) from
the UI (`src/App.tsx`), which is the separation a pattern would provide.

Introducing **Strategy** (pluggable check policies) would add an
interface, one implementation per rule, and wiring in the caller. With a
single fixed policy, that is indirection without a second
implementation to justify it, and it spreads one policy across several
files, making the current single-function contract harder to follow.

Introducing **Adapter** (normalizing external booking sources) has no
adaptation job to do: the only input is in-repo fixtures, so an adapter
would be a pass-through wrapper around existing objects.

The cost in both cases is churn in working, fully tested code and a
risk of regressing AC1–AC6, for no behavioral gain. If a second real
policy or an external booking feed ever appears, revisit this decision.
