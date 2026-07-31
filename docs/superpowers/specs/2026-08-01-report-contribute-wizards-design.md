# Report an Issue / Contribute a Schema — wizard redesign + Roadmap "Newly Submitted" column

## Context

`Report an issue` and `Contribute a schema` were recently converted from centered
modal popovers into full sidebar pages (`appScreen: 'report'` / `'contribute'`),
but the content inside them is still the same cramped modal-sized form dropped
into a much larger page — it reads as a copy-pasted popup rather than an
experience designed for the space. The forms also don't collect information a
real internal reporting/contribution tool would need (owning team, links to
Jira/GitHub, categorization, ability to point at an existing catalog entry).

Separately, the Roadmap page currently blends the user's own submissions
(`extraSubmissions`) into the "Currently Being Defined" column alongside
pre-existing catalog items, making it hard to tell "what did I just submit"
from "what's already in flight."

## Goals

1. Redesign both pages as multi-step wizards that use the available page width
   and collect fuller, more realistic information.
2. Add a dedicated "Newly Submitted" column to the Roadmap so a user's own
   Contribute / AI-assisted-plan submissions are visually distinct from
   pre-existing roadmap items.

## Non-goals

- No real backend/validation — this stays a frontend-only prototype per
  `CLAUDE.md`. All new fields are optional except what was already required
  (name/title/description), and submission always "succeeds."
- No changes to the AI Assistant's `submitPlanForReview` flow beyond its items
  landing in the new Roadmap column.

## Report an Issue — 3-step wizard

**Step 1 · What's wrong**
- Data point picker: type-ahead search input over existing catalog entries
  (`CATALOG`) and pipelines (`PIPELINES`) by name; selecting one attaches it
  to the report. A toggle/checkbox "This isn't about a specific data point"
  skips the picker (general/platform issue).
- Category dropdown: `Data Quality`, `Scalability`, `Definition / Documentation`, `Missing Data`.
- Severity: `Low` / `Medium` / `High` (unchanged from today).

**Step 2 · Details**
- Title (required, unchanged).
- Description (required, unchanged).
- Related Jira ticket — optional URL.
- Related PR (GitHub/GitLab) — optional URL.

**Step 3 · Review & submit**
- Read-only summary of every field, including the resolved data-point name
  (or "General / platform issue") and category.
- Submit button — same toast behavior (`Issue reported — tracked as PULSE-####.`),
  returns to Home, resets form state.

## Contribute a Schema — 3-step wizard

**Step 1 · Basics**
- Event/schema name (required, unchanged).
- LOB dropdown (unchanged: Ridesharing / Eats / B2B / Platform).
- Owning team dropdown — options sourced from the distinct `owningTeam`
  values already present in `PIPELINES`, plus an `Other` option.
- Description (required, unchanged).

**Step 2 · Technical details**
- Source repo link — optional URL (GitHub/GitLab).
- Related Jira epic link — optional URL.
- Expected weekly volume — number input, formatted with the same
  thousands-separator style used elsewhere (e.g. `weeklyVolumeLabel`).
- Sample payload builder — repeatable field/value row list (add row / remove
  row), same shape as the `payload` array already used on catalog entry
  detail sidesheets (`{field, value}`).

**Step 3 · Review & submit**
- Read-only summary of all fields from steps 1–2, including a compact table
  of the payload rows.
- Submit button — unchanged behavior: adds to `extraSubmissions`, routes to
  Roadmap (now landing in "Newly Submitted"), same toast.

## Shared wizard mechanics

- Step indicator at the top of the page: "Step 2 of 3 · Technical details".
  Steps already visited are clickable to jump back; steps not yet reached are
  dimmed/disabled.
- Back / Next buttons bottom-right of each step. Cancel (step 1 only) returns
  to Home. Navigating away via the sidebar mid-wizard resets the wizard state
  (consistent with today's `goHome`/`goReport`/`goContribute` behavior, which
  already reset `reportForm`/`contributeForm`/`contributeStep` on entry).
- The step card widens to ~640–720px (single column) instead of the current
  480–520px modal-sized box, so the page reads as intentionally designed for
  the space rather than a shrink-wrapped popup. Page header (`<h1>` + subtitle)
  stays consistent with Home/Catalog/Roadmap.
- New state needed:
  - `reportForm`: add `category`, `linkedDataPointId` (nullable), `linkedDataPointType`
    (`'catalog' | 'pipeline' | null`), `jiraLink`, `prLink`. Add `reportStep` (1–3)
    and `reportDataPointQuery` (search input state for the picker).
  - `contributeForm`: add `owningTeam`, `repoLink`, `jiraLink`, `expectedVolume`,
    `payloadRows` (array of `{field, value}`, starts with one empty row).
    `contributeStep` already exists but now spans 1–3 instead of 1–2.

## Roadmap "Newly Submitted" column

- `roadmapColumns` becomes 4 columns instead of 3:
  `Newly Submitted → Currently Being Defined → Coming Next → Recently Shipped`.
- `Newly Submitted` is populated solely from `s.extraSubmissions` (both
  Contribute submissions and AI Assistant "submit plan for review" items).
  `Currently Being Defined` reverts to showing only `ROADMAP_BASE.defining`
  (no longer merged with `extraSubmissions`).
- Grid layout changes from `repeat(3,1fr)` to `repeat(4,1fr)`; column cards
  keep their existing visual style (`isNew` green border, etc.).
- If `extraSubmissions` is empty, the "Newly Submitted" column still renders
  with a `0` count and no cards (consistent with how other empty states are
  handled elsewhere in the app — no special empty-state copy needed here
  since it's a common/expected state, not an error).

## Data model additions (mock, in-memory only)

No changes to `PIPELINES` or `CATALOG` base data. All new fields live in
component state (`reportForm`, `contributeForm`) and are ephemeral — nothing
persists beyond the session, matching current behavior for `extraSubmissions`.

## Testing / verification

This is a static HTML/JS prototype with no test suite. Verification is manual:
launch the app (`run` skill / opening the file), exercise both wizards
end-to-end (all steps, back/forward navigation, submit), confirm Roadmap shows
4 columns with submissions landing in "Newly Submitted", and check the login →
Home → other screens still work unaffected.
