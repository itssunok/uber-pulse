# Uber Pulse — Backlog

**Format:** `[status] Title — notes`
**Status values:** `open`, `in progress`, `done`

Prioritized MoSCoW-style following the full UX/UI/Brand design audit (Aug 2026), evaluated by Alex (PM) against the 4 locked personas: Maya, James, Priya, Tom.

---

## High Priority (Must)

---

## Medium Priority (Should)

- `[open]` Add error/validation states to the Contribute and Report Issue wizards specifically (the two most visible multi-step flows) — scoped down from "chat, API key creation, everywhere" to these two. Small-medium effort.
- `[open]` Naming & voice pass — restore or confirm dropping the PRD's login tagline ("Pulse. Know your data."), rewrite the login heading ("What's your work email?" reads as generic consumer SaaS onboarding). Small effort.
- `[open]` Share the same underlying chat session data between the topbar "Ask Pulse" side-sheet and the full AI Assistant page, so starting a conversation in one doesn't lose it in the other — scoped down from a full state-architecture unification to just sharing the data source. Small-medium effort.
- `[open]` Roadmap card sidesheet must be similar to the detail page with less information, links to pipelines events proper detail pages, the current version is outdated and doesn't match, this should be almost a consolidated version of the detail page —  Small effort.
- `[open]` Revisit GTV/GMV/revenue metric definitions — GTV is currently a derived composite of the Ridesharing/Eats/B2B pipelines with no independent monetary metric of its own; clarify whether GMV and/or a distinct revenue metric should exist alongside it, and whether GTV's definition still matches real-world usage (ref: Uber's Q4/FY2025 investor results press release). Not scoped or built yet — just captured so it isn't lost. Scoped separately from the Metrics Log tab work (done) since this is a product-definition question, not a UI gap.

---

## Low Priority (Could)
- `[open]` Micro-interactions / motion pass (hover states, panel transitions) once core visual direction is validated
- `[open]` Enable login — currently bypassed intentionally during active development so cookies/session clearing doesn't force a re-login on every update. Re-enable once active iteration on login-adjacent screens settles down, or before the repo is shared/demoed. Not stale, deliberately deferred.

---

## Won't This Round (deferred, not dropped)

