# Project memory

## Product intent & audience

- Smart Campus Room Availability Checker: single-page React app for checking if a fictional campus room is free for a given time slot.
- Audience: coursework/assignment evaluators and human reviewers; not production users.
- Scope: availability checks only — no login, backend, database, or booking creation. All data is hard-coded fictional fixtures.
- Baseline commit: `05a48ca0780cfc7b93e8ce5126502bc679723699`.

## Brand personality & voice

- Instructional/technical documentation tone: precise, contract-oriented, evidence-driven.
- Code and docs favor clarity over cleverness; decisions are stated explicitly with rationale.

## Visual design & UX direction

- Single-page form UI: room selector, Current Time field (editable fiction, defaults 08:00), start/end time inputs, Check Availability button, result/feedback area.
- Feedback must remain readable on desktop and narrow mobile screens (AC6).
- Stale results clear immediately when room or a time input changes; reselecting same room preserves result (AC5/AC6).
- Stack: Vite + React + TypeScript + Tailwind CSS + Lucide React icons. `@/` path alias maps to `src/`.

## Decisions, constraints & rationale

- Architecture: pure availability rules in `src/lib/availability.ts` (no side effects, no imports); UI/fixtures/state in `src/App.tsx`; tests in `src/lib/availability.test.ts` (11 tests). No UI/DOM test harness — UI checked manually.
- Booking contract AC1–AC6 preserved as detailed rules; Assignment #05 five criteria (A1–A5) map onto them.
- Task #03 decision: no additional design pattern warranted — single availability policy, rules already separated from UI. Strategy adds indirection without a second implementation; Adapter is a pass-through for in-repo fixtures. Both risk regressing AC1–AC6 for no behavioral gain.
- Verification commands: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`. All four verified exit 0 on Node v22.23.1, npm 10.9.8.
- Requirements: Node.js 22, npm 10. Install with `npm ci`.
- Prohibited: secrets, real personal data, production deployment, destructive commands without approval, unreviewed dependency changes. Proposed mitigation diffs must be reviewed before implementation. Execution results kept in evidence report, not in docs.
- For Assignment #05: at most one focused refactoring, only when justified.
- Docs-only edits (README.md, AGENTS.md) have no build/test impact.

## Open questions & assumptions

- Manual Current Time check described in README has not been executed in a browser as part of this task.
- `npm ci` was not re-run on a clean checkout during the documentation task.
- Assumption: Browserslist "caniuse-lite is outdated" warning is informational only, not a failure.
- If a second real availability policy or external booking feed appears, Task #03 pattern decision should be revisited.