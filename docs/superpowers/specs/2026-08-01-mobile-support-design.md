# Mobile Support — Design

**Date:** 2026-08-01
**Backlog item:** `[open] Mobile support — make sure the site is mobile compatible`

## PRD amendment

The PRD (`docs/prd.md`, Section 3, Non-Goals) states:

> Mobile support is out of scope for v1. This is a desktop web product used in a work context.

This is amended, effective 2026-08-01, to:

> Mobile web support is in scope for v1 as a responsive layer over the existing desktop experience (not a native app or a dedicated mobile information architecture). The driver is general accessibility — the product should not look or feel broken when opened on a phone or tablet — rather than a specific on-call/urgent workflow need.

The original non-goal line is preserved in this doc (above) for history; `docs/prd.md` reflects the amended version.

## Scope

Full parity: every page and flow — including multi-step wizards (Contribute, Report Issue) and the Ask Pulse assistant — must be fully usable on mobile, not just readable. This is a CSS/layout responsive pass over the existing single-file app (`Uber Pulse.dc.html`); it does not change any existing desktop behavior, state, or the demo login flow.

## Breakpoint

Single breakpoint at **900px**.

- `> 900px`: today's desktop layout, unchanged (persistent left sidebar, icon + label per item, top bar).
- `<= 900px`: mobile layout described below. This covers both phone and tablet widths — there is no separate tablet-only treatment; the tablet width gets the same bottom-tab layout as phone, just with more breathing room in the content column.

## Navigation shell (mobile, <= 900px)

- The persistent left sidebar is removed entirely below the breakpoint (it does not collapse to icon-only — that would violate the CLAUDE.md identity rule that sidebar nav is icon + label, not icon-only; instead it's replaced by a different nav pattern suited to the width).
- **Bottom tab bar**, fixed to the viewport bottom, icon + label per tab: **Home, Catalog, Roadmap, More**.
- **More** opens a bottom sheet listing: Pipeline Log, Docs, Developer Tools / API, Ask Pulse, Report Issue, Contribute, account/logout.
- A slim top bar replaces the desktop top bar: logo mark + current page title. No hamburger — primary nav lives in the bottom bar.
- Minimum touch target height of 44px for interactive elements at this breakpoint (some desktop pill buttons are shorter and need a mobile size bump).

## Content patterns (mobile, <= 900px)

- **KPI/stat cards** (Home): 4-across grid collapses to a single column, full width.
- **Tables** (monitoring table, Data Catalog, Pipeline Log): each row becomes a stacked card of label/value pairs instead of a horizontally-scrolling `<table>`.
- **Wizards/modals** (Contribute, Report Issue, roadmap ticket detail): become full-screen (100vh) views instead of centered dialogs.
- **Ask Pulse side sheet**: becomes a full-screen view instead of a right-hand sheet.
- **Login page**: stays single-column (already close to mobile-friendly at max-width 420px); adjust top bar height/padding and ensure the demo-credential block doesn't overflow.

## Execution sequencing

Each step is independently shippable and reviewable, implemented in this order:

1. **Breakpoint infrastructure + nav shell** — `@media (max-width:900px)` scaffold, bottom tab bar, top bar, More sheet. *(this session)*
2. Home page (KPI cards + monitoring table)
3. Data Catalog + Pipeline Log (tables → cards, filters)
4. Roadmap (columns → stacked list) + ticket detail modal → full-screen
5. Ask Pulse side sheet → full-screen
6. Contribute / Report Issue wizards → full-screen steps
7. Docs, Developer Tools/API pages
8. Login page polish

## Out of scope

- Native app / app-store distribution.
- Offline support, push notifications, or any mobile-specific new functionality beyond making existing flows usable at narrow widths.
- Changing desktop layout, behavior, or the demo login flow — this is additive, not a replacement of existing markup/logic.
