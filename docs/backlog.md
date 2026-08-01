# Uber Pulse — Backlog

**Format:** `[status] Title — notes`
**Status values:** `open`, `in progress`, `done`

Prioritized MoSCoW-style following the full UX/UI/Brand design audit (Aug 2026), evaluated by Alex (PM) against the 4 locked personas: Maya, James, Priya, Tom.

---

## High Priority (Must)

- `[open]` Add confidence/live-vs-cached signals — scope to the AI assistant's 4 canned responses plus the catalog entries they reference, not all 85+ catalog entries. Make the assistant cite sources consistently (currently only half do) and visually separate live data-quality warnings from confident prose (e.g. the EU duplicate-events caveat). Directly addresses the PRD's own named top risk for the AI assistant. Rescoped down from a full-catalog pass. Small-medium effort.
- `[open]` Add pipeline/quality-score history — rescoped down from a real time-series data model to a modest static array of 5-10 past timestamped snapshots per pipeline, rendered as a simple list. Enough for James and Tom to see a pipeline was checked and degraded on a specific date, without engineering real searchable history tracking. Medium effort (down from Large).
- `[open]` Rewrite AI Assistant landing headline — currently ChatGPT's unmodified default greeting ("How can I help you today?"), on the PRD's own highest-value differentiator feature. Small effort.
- `[open]` Fix elevation inconsistency — side-sheets, dropdowns, toast, and the AI Assistant composer mix box-shadow with no border, violating "hairline borders over drop shadows." Replace side-sheet shadows with borders; standardize dropdowns/toast to one lighter "floating" shadow level. Small effort.
- `[open]` Move AI Assistant to its own icon in the mobile bottom nav — currently buried inside a generic "More" menu despite being the PRD's named highest-value onboarding feature. Small effort.
- `[open]` Add a "Canonical" badge to the one true definition per LOB in the Data Catalog — directly addresses James's #1 documented pain point (three different attribution numbers with no arbiter). Small effort.
- `[open]` Add an explicit "not pipeline-monitored" label to catalog entries with no pipeline reference (~15 entries) — currently a silent dead end. Small effort.

---

## Medium Priority (Should)

- `[open]` Add Today/Yesterday/Last 7/30/90 day filters to Home and other relevant pages — split out from the Must-tier "real-time" copy fix above, since the false claim doesn't require this to be resolved. A genuinely separate, larger feature. Medium effort.
- `[open]` Fix green misuse across ~7 components (Contribute/AI Assistant/Dev Tools submit buttons, Roadmap "NEW" badge, Documentation topic badges) — green is reserved for status-positive/logo/Contribute per CLAUDE.md, currently used as a generic accent. Small effort. Tokens now exist (`--color-green` in `styles/tokens.css`) — this is now a value swap on the specific inline-styled buttons, not a hex hunt.
- `[open]` Merge remaining `#9B9B9B` occurrences into `#6B6B6B` — ~54 occurrences remain in inline `style=""` attributes (the shared functions/base style block are already done as part of the token extraction). Small effort, mechanical find-and-replace against `styles/tokens.css`'s `--color-gray-600`.
- `[open]` Add empty-state messaging to Data Catalog and Pipeline Log tables — filtering to zero matches currently shows a floating header over blank space; Documentation and Chat search already handle this correctly elsewhere in the same file. Small effort.
- `[open]` Apply typography/spacing/radius tokens (already defined in `styles/tokens.css`) to the remaining ~539 inline `style=""` attributes opportunistically, whenever a screen is touched for another reason — not a dedicated sweep. Finishing all 539 in one pass isn't cheap and most are one-off values a reviewer won't scrutinize individually; this rescopes from a Medium-effort dedicated pass down to ongoing incidental cleanup.
- `[open]` Add loading states ("Submitting…") to the 4 actual async actions: CSV download, API key creation, chat send, schema submission. Cheap and high-signal — a submit button with zero feedback reads unfinished. Small effort.
- `[open]` Add error/validation states to the Contribute and Report Issue wizards specifically (the two most visible multi-step flows) — scoped down from "chat, API key creation, everywhere" to these two. Small-medium effort.
- `[open]` Naming & voice pass — restore or confirm dropping the PRD's login tagline ("Pulse. Know your data."), rewrite the login heading ("What's your work email?" reads as generic consumer SaaS onboarding), switch Google/Apple auth buttons to monochrome marks. Small effort.
- `[open]` Share the same underlying chat session data between the topbar "Ask Pulse" side-sheet and the full AI Assistant page, so starting a conversation in one doesn't lose it in the other — scoped down from a full state-architecture unification to just sharing the data source. Small-medium effort.

---

## Low Priority (Could)

- `[open]` Accessibility backlog: aria-labels on icon-only/dismiss buttons, role+tabindex on div-based rows (Report Issue picker, Documentation topic cards) to match the pattern already used elsewhere, dropdown/toast ARIA semantics (`role="menu"`, `aria-expanded`, `aria-live`), touch target sizing on Dev Tools icon buttons and "✕" dismiss buttons. Medium effort, narrower impact.
- `[open]` Add a Dev Tools → pipeline jump link for developers debugging an API response. Small effort — deprioritized since this serves Carlos's workflow, and Carlos was assessed as not business-critical for this platform's core decisions.
- `[open]` Micro-interactions / motion pass (hover states, panel transitions) once core visual direction is validated
- `[open]` Enable login — currently bypassed intentionally during active development so cookies/session clearing doesn't force a re-login on every update. Re-enable once active iteration on login-adjacent screens settles down, or before the repo is shared/demoed. Not stale, deliberately deferred.

---

## Won't This Round (deferred, not dropped)

- `[open]` Clean up stray one-off hex values (`#04562B`, `#5A5A5A`, `#FAFAFA`) and reassign the GTV KPI badge away from its coincidental green — cosmetic, no traced business/user impact. Revisit if it can be bundled for free during the green-misuse fix above.
