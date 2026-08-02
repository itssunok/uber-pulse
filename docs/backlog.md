# Uber Pulse — Backlog

**Format:** `[status] Title — notes`
**Status values:** `open`, `in progress`, `done`

Prioritized MoSCoW-style following the full UX/UI/Brand design audit (Aug 2026), evaluated by Alex (PM) against the 4 locked personas: Maya, James, Priya, Tom.

---

## High Priority (Must)

- `[open]` Move AI Assistant to its own icon in the mobile bottom nav — currently buried inside a generic "More" menu despite being the PRD's named highest-value onboarding feature. Small effort.

---

## Medium Priority (Should)

- `[open]` Add Today/Yesterday/Last 7/30/90 day filters to Home and other relevant pages — split out from the Must-tier "real-time" copy fix above, since the false claim doesn't require this to be resolved. A genuinely separate, larger feature. Medium effort.
- `[open]` Add empty-state messaging to Data Catalog and Pipeline Log tables — filtering to zero matches currently shows a floating header over blank space; Documentation and Chat search already handle this correctly elsewhere in the same file. Small effort.
- `[open]` Apply typography (font-size/weight)/spacing/radius tokens (all now defined in `styles/tokens.css`, including the font-weight scale added Aug 2026) to the remaining ~800 inline `style=""` attributes opportunistically, whenever a screen is touched for another reason — not a dedicated sweep. Finishing all of them in one pass isn't cheap (17 distinct font-size values and 5 font-weight values currently coexist inline) and most are one-off values a reviewer won't scrutinize individually; this rescopes from a Medium-effort dedicated pass down to ongoing incidental cleanup.
- `[open]` Add loading states ("Submitting…") to the 4 actual async actions: CSV download, API key creation, chat send, schema submission. Cheap and high-signal — a submit button with zero feedback reads unfinished. Small effort.
- `[open]` Add error/validation states to the Contribute and Report Issue wizards specifically (the two most visible multi-step flows) — scoped down from "chat, API key creation, everywhere" to these two. Small-medium effort.
- `[open]` Naming & voice pass — restore or confirm dropping the PRD's login tagline ("Pulse. Know your data."), rewrite the login heading ("What's your work email?" reads as generic consumer SaaS onboarding), switch Google/Apple auth buttons to monochrome marks. Small effort.
- `[open]` Share the same underlying chat session data between the topbar "Ask Pulse" side-sheet and the full AI Assistant page, so starting a conversation in one doesn't lose it in the other — scoped down from a full state-architecture unification to just sharing the data source. Small-medium effort.
- `[open]` Roadmap banner on detail pages opens the same full sidesheet as clicking a roadmap card elsewhere — should show a shorter snippet (name, stage, ETA, short description) with a "View full roadmap item →" link out to the sidesheet/detail, so the entry point stays consistent with how roadmap items open everywhere else in the product rather than becoming a special case. Small effort.
- `[open]` Revisit GTV/GMV/revenue metric definitions — GTV is currently a derived composite of the Ridesharing/Eats/B2B pipelines with no independent monetary metric of its own; clarify whether GMV and/or a distinct revenue metric should exist alongside it, and whether GTV's definition still matches real-world usage (ref: Uber's Q4/FY2025 investor results press release). Not scoped or built yet — just captured so it isn't lost.

---

## Low Priority (Could)

- `[open]` Accessibility backlog: aria-labels on icon-only/dismiss buttons, role+tabindex on div-based rows (Report Issue picker, Documentation topic cards) to match the pattern already used elsewhere, dropdown/toast ARIA semantics (`role="menu"`, `aria-expanded`, `aria-live`), touch target sizing on Dev Tools icon buttons and "✕" dismiss buttons. Medium effort, narrower impact.
- `[open]` Add a Dev Tools → pipeline jump link for developers debugging an API response. Small effort — deprioritized since this serves Carlos's workflow, and Carlos was assessed as not business-critical for this platform's core decisions.
- `[open]` Micro-interactions / motion pass (hover states, panel transitions) once core visual direction is validated
- `[open]` Enable login — currently bypassed intentionally during active development so cookies/session clearing doesn't force a re-login on every update. Re-enable once active iteration on login-adjacent screens settles down, or before the repo is shared/demoed. Not stale, deliberately deferred.

---

## Won't This Round (deferred, not dropped)

- `[open]` Clean up stray one-off hex values (`#04562B`, `#5A5A5A`, `#FAFAFA`) and reassign the GTV KPI badge away from its coincidental green — cosmetic, no traced business/user impact. Revisit if it can be bundled for free during the green-misuse fix above.
