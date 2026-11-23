# Project

Smart Campus is a room availability checker that uses fictional data.
Availability rules live in `src/lib/availability.ts` (pure functions:
`checkAvailability`, `minutesToLabel`, and the `Room`, `Booking`, and
`CheckResult` types). `src/App.tsx` holds the sample rooms, sample
bookings, and the UI, and imports the rules from `src/lib/availability`.
Regression tests live in `src/lib/availability.test.ts`. See
`README.md` for purpose, setup, and what has been verified.

Baseline commit: `05a48ca0780cfc7b93e8ce5126502bc679723699`.

# Architecture

- `src/lib/availability.ts` — pure availability rules, no imports, no
  side effects. This is the only place booking policy lives.
- `src/App.tsx` — fictional fixtures and all UI state. Handlers clear
  stale results when the room or a time input changes.
- `src/lib/availability.test.ts` — unit tests for the rules. There is
  no UI/DOM test harness; UI behavior is checked manually (README).

# Setup

- Node.js 22, npm 10.
- `npm ci` for a clean install from the lockfile.
- Permitted commands: `npm run dev`, `npm run build`, `npm run preview`,
  `npm test`, `npm run typecheck`, `npm run lint`.

# Acceptance criteria

Detailed booking contract (AC1–AC6):

- AC1: Reject requests in the past and intervals where start is at or after end.
- AC2: Reject requests longer than 120 minutes.
- AC3: Reject requests for blocked rooms.
- AC4: Reject overlapping bookings and allow intervals that only touch at an endpoint.
- AC5: Availability checks must not modify the booking fixtures.
- AC6: Availability feedback must remain clear on desktop and narrow mobile screens.

Assignment #05 criteria map onto AC1–AC6 as follows (rationale in README):

- A1 → AC1, AC2 (invalid/past intervals; >120 min rejected, exactly 120 allowed)
- A2 → AC3 (blocked rooms identified in the feedback)
- A3 → AC4 (same-room overlaps; touching endpoints allowed; other rooms ignored)
- A4 → AC5 (room and booking data preserved)
- A5 → AC6 (stale results cleared on room/time change; same-room reselect
  preserves the result; readable feedback on desktop and narrow screens)

# Coding conventions

- Keep availability rules as pure functions in
  `src/lib/availability.ts`; the UI must not duplicate policy logic.
- Make small, targeted changes. Prefer a pure function that can be
  tested directly. Use at most two patterns and justify each one.
- For Assignment #05 Task #03: allow **at most one focused
  refactoring**, and only when justified. The recorded Task #03
  decision is that no additional design pattern is warranted (README).
- Preserve the current room list, time inputs, booking fixtures, and UI
  behavior.

# Test expectations

- Preserve regression coverage for past time, reversed intervals,
  121-minute duration, blocked rooms, overlapping bookings, touching
  endpoints, and unchanged fixtures.
- New or changed rule behavior requires a matching test in
  `src/lib/availability.test.ts`.
- UI interactions (result clearing, room reselect) are verified by the
  manual check in README and reported in the evidence report.

# Verification

Run all four checks before declaring work done:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Keep execution results (exact commands, exit codes, pass/fail counts)
in the evidence report, not in this file or in README.md.

# Prohibited actions

- Do not add login, a backend, a database, or booking creation.
- Do not change the room list, time inputs, booking fixtures, or UI
  behavior in ways that break AC1–AC6.
- Do not enter or commit secrets, credentials, or real personal data.
- Do not deploy to production.
- Do not run destructive commands (deleting files or data, dropping
  tables, removing or downgrading dependencies) without explicit approval.
- Do not add, remove, or upgrade dependencies without prior review.

# Review before merge or deployment

- A human reviewer must read the diff and the test evidence (exact
  command and pass/fail counts) before any merge or deployment.
- Proposed mitigation diffs must be reviewed before they are
  implemented.
- Explicit approval is required before merging or deploying.
- Verify desktop and narrow mobile feedback before and after any UI
  change (AC6).
