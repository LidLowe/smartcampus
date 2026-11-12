# Project

Smart Campus is a room availability checker that uses fictional data.
Availability rules live in `src/lib/availability.ts` (pure functions:
`checkAvailability`, `minutesToLabel`, and the `Room`, `Booking`, and
`CheckResult` types). `src/App.tsx` holds the sample rooms, sample
bookings, and the UI, and imports the rules from `src/lib/availability`.
Regression tests live in `src/lib/availability.test.ts`.

# Acceptance criteria

- AC1: Reject requests in the past and intervals where start is at or after end.
- AC2: Reject requests longer than 120 minutes.
- AC3: Reject requests for blocked rooms.
- AC4: Reject overlapping bookings and allow intervals that only touch at an endpoint.
- AC5: Availability checks must not modify the booking fixtures.
- AC6: Availability feedback must remain clear on desktop and narrow mobile screens.

# Scope

- Fictional sample data only. There is no login, backend, database, or
  booking creation, and none may be added.
- Make small, targeted changes. Prefer a pure function that can be
  tested directly. Use at most two patterns and justify each one.
- Preserve the current room list, time inputs, booking fixtures, and UI
  behavior.
- Preserve regression coverage for past time, reversed intervals,
  121-minute duration, blocked rooms, overlapping bookings, touching
  endpoints, and unchanged fixtures.

# Permitted commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run test` — run the Vitest unit suite
- `npm run typecheck` — `tsc --noEmit -p tsconfig.app.json`
- `npm run lint` — ESLint

# Prohibited actions

- Do not add login, a backend, a database, or booking creation.
- Do not change the room list, time inputs, booking fixtures, or UI
  behavior in ways that break AC1–AC6.
- Do not enter real personal data, secrets, or credentials.
- Do not connect to external production services.

# Verification

Run all four checks before declaring work done:

- `npm run test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Keep current test results (pass/fail counts) in the evidence report, not
in this file.

# Review before merge or deployment

- A human reviewer must read the diff and the test evidence (exact
  command and pass/fail counts) before any merge or deployment.
- Explicit approval is required before merging or deploying.
- Verify desktop and narrow mobile feedback before and after any UI
  change (AC6).
