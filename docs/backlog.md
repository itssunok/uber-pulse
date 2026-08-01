# Uber Pulse — Backlog

**Format:** `[status] Title — notes`
**Status values:** `open`, `in progress`, `done`

Prioritized MoSCoW-style following the full UX/UI/Brand design audit (Aug 2026), evaluated by Alex (PM) against the 4 locked personas: Maya, James, Priya, Tom.

---

## Foundation (done, Aug 2026)

- `[done]` Design tokens extracted to `styles/tokens.css` (colors, 8px spacing scale, type scale, radius) and wired into the base `<style>` block + shared style-builder functions. Includes the `#9B9B9B`→`#6B6B6B` contrast merge for everywhere those functions/block touch. Scoped as a demo-appropriate token extraction, not a full design-system/component migration — the 539 individual inline `style=""` attributes on markup were explicitly left untouched, so some old hex/pixel values still exist there (see notes on Should-tier items below).
- `[done]` Mock data (`PIPELINES`, `CATALOG`, `ROADMAP_BASE`, `METRICS_BASE`) moved out of `Uber Pulse.dc.html` into `data/pipelines.js`, `data/catalog.js`, `data/roadmap.js`, `data/metrics.js` — plain JS globals, no build step, loaded via `<script src>` before `scripts/support.js`. Each file has a JSDoc header documenting field shape/types. Values preserved exactly, no new fields added.
- `[done]` Project folder structure organized — `favicon.png` moved to `assets/favicon.png`, `support.js` moved to `scripts/support.js`, both reference paths updated in `Uber Pulse.dc.html` (including the duplicate `<link rel="icon">` inside the `<helmet>` block). Renaming `Uber Pulse.dc.html` itself to something conventional like `index.html` remains open — not done here, flagging separately below.
- `[open]` Full production foundation (Vite + React + TypeScript migration, real schema validation, component-level restructure) — scoped out for now, this is a demo project not a production build. Written plan exists (see conversation history) if this ever becomes real. ~3-4 weeks effort, do not start piecemeal.

---

## High Priority (Must)

- `[open]` Drop "real-time" claim on Pipeline Log; add Today/Yesterday/Last 7/30/90 day filters to Home and other relevant pages — subhead currently claims real-time status while validation is daily/weekly/monthly; date filters make actual freshness explicit instead of overclaiming. Medium effort.
- `[open]` Fix broken catalog changelogs for versioned entries (v2+) — entries like `completed_trip` v3.2 show only "Initial release," which reads as fabricated. Add real prior changelog lines for every entry above v1.0. Medium effort.
- `[open]` Add confidence/live-vs-cached signals to catalog entries and AI assistant responses; make the assistant cite sources consistently (currently only half do) and visually separate live data-quality warnings from confident prose (e.g. the EU duplicate-events caveat). Directly addresses the PRD's own named top risk for the AI assistant. Medium effort.
- `[open]` Add pipeline/quality-score history — timestamped past SLA/health states, searchable, so James and Tom can check whether a pipeline was degraded when a business decision was made. Requires a data model change, not just UI. Large effort — sequence last within this batch.
- `[open]` Add a global `:focus-visible` style — every interactive element is currently keyboard-invisible (`outline:none` set with no replacement). Blocks keyboard-only users from the entire product. Small effort, single global CSS fix.
- `[open]` Rewrite AI Assistant landing headline — currently ChatGPT's unmodified default greeting ("How can I help you today?"), on the PRD's own highest-value differentiator feature. Small effort.
- `[open]` Fix elevation inconsistency — side-sheets, dropdowns, toast, and the AI Assistant composer mix box-shadow with no border, violating "hairline borders over drop shadows." Replace side-sheet shadows with borders; standardize dropdowns/toast to one lighter "floating" shadow level. Small effort.
- `[open]` Move AI Assistant to its own icon in the mobile bottom nav — currently buried inside a generic "More" menu despite being the PRD's named highest-value onboarding feature. Small effort.
- `[open]` Add a "Canonical" badge to the one true definition per LOB in the Data Catalog — directly addresses James's #1 documented pain point (three different attribution numbers with no arbiter). Small effort.
- `[open]` Add an explicit "not pipeline-monitored" label to catalog entries with no pipeline reference (~15 entries) — currently a silent dead end. Small effort.

---

## Medium Priority (Should)

- `[open]` Fix green misuse across ~7 components (Contribute/AI Assistant/Dev Tools submit buttons, Roadmap "NEW" badge, Documentation topic badges) — green is reserved for status-positive/logo/Contribute per CLAUDE.md, currently used as a generic accent. Small effort. Tokens now exist (`--color-green` in `styles/tokens.css`) — this is now a value swap on the specific inline-styled buttons, not a hex hunt.
- `[open]` Merge remaining `#9B9B9B` occurrences into `#6B6B6B` — ~54 occurrences remain in inline `style=""` attributes (the shared functions/base style block are already done as part of the token extraction). Small effort, mechanical find-and-replace against `styles/tokens.css`'s `--color-gray-600`.
- `[open]` Add empty-state messaging to Data Catalog and Pipeline Log tables — filtering to zero matches currently shows a floating header over blank space; Documentation and Chat search already handle this correctly elsewhere in the same file. Small effort.
- `[open]` Standardize typography scale and spacing rhythm on the remaining inline `style=""` attributes — the base style block and shared functions already reference `styles/tokens.css`'s type/spacing scale; ~539 inline attributes still carry old ad-hoc values. Medium effort, many touchpoints.
- `[open]` Apply `--radius-page`/`--radius-inline` tokens (already defined in `styles/tokens.css`) to remaining inline-styled cards/components; add loading states ("Submitting…") to CSV download/API key creation/chat send/schema submission, add error/validation states to Contribute/Report wizards, chat, and API key creation beyond the login-only error treatment today. Medium effort.
- `[open]` Naming & voice pass — restore or confirm dropping the PRD's login tagline ("Pulse. Know your data."), rewrite the login heading ("What's your work email?" reads as generic consumer SaaS onboarding), switch Google/Apple auth buttons to monochrome marks. Small effort.
- `[open]` Unify the two separate chat UIs (topbar "Ask Pulse" side-sheet and full AI Assistant page) into one shared state — starting a conversation in one currently loses it when navigating to the other. Medium effort.

---

## Low Priority (Could)

- `[open]` Accessibility backlog: aria-labels on icon-only/dismiss buttons, role+tabindex on div-based rows (Report Issue picker, Documentation topic cards) to match the pattern already used elsewhere, dropdown/toast ARIA semantics (`role="menu"`, `aria-expanded`, `aria-live`), touch target sizing on Dev Tools icon buttons and "✕" dismiss buttons. Medium effort, narrower impact.
- `[open]` Add a Dev Tools → pipeline jump link for developers debugging an API response. Small effort — deprioritized since this serves Carlos's workflow, and Carlos was assessed as not business-critical for this platform's core decisions.
- `[open]` Rename `Uber Pulse.dc.html` (odd filename, spaces + a stray `.dc` segment) to something conventional like `index.html`. Favicon/scripts folder organization already done (see Foundation section above) — this is the one remaining piece. Cosmetic/hygiene, not business-critical, but cheap. Small effort — note this touches whatever process opens/serves the file today, confirm it's safe to rename before doing it.
- `[open]` Micro-interactions / motion pass (hover states, panel transitions) once core visual direction is validated
- `[open]` Enable login

---

## Won't This Round (deferred, not dropped)

- `[open]` Clean up stray one-off hex values (`#04562B`, `#5A5A5A`, `#FAFAFA`) and reassign the GTV KPI badge away from its coincidental green — cosmetic, no traced business/user impact. Revisit if it can be bundled for free during the green-misuse fix above.
