# Uber Pulse — instructions for Claude

## Workflow
- Never commit or push automatically. Make the requested edits, stop, and let the user review the files locally before anything is committed. Only commit/push when explicitly told to.
- If a request is vague or open to more than one reasonable interpretation, don't guess — ask multiple-choice clarifying questions one at a time until it's resolved, rather than picking an interpretation and running with it.
- Preserve existing functionality when restyling or refactoring. A visual/design pass should not silently drop working behavior (e.g. the demo account login flow) — carry it forward even as markup and styles change.
- The PRD is the source of truth for product requirements and scope. Check it before adding or changing functionality.
- It's fine to add non-functional/decorative elements for visual completeness (e.g. extra auth provider buttons) when the user explicitly scopes them that way — don't wire them up unless asked.
- If a task from the docs/backlog.md file is done, remove it from the list. 
- If asked "why" something is a certain way, answer the why question directly first — don't jump straight to implementing a fix. Only make a change afterward if the user then asks for one.

## Visual identity
Uber Pulse must look cohesive with Uber's real internal product ecosystem (Base from Uber) (Uber Direct, Uber for Business, Uber Central) — not like a generic/templated AI-generated dashboard. Concretely:
- Layout: persistent left sidebar navigation with icon + label per item (not top nav, not icon-only)
- Color: true black/white/green tokens — black (`#0A0A0A`) is the default primary action color; green (`#06C167`) is reserved for status-positive states, the logo mark, and the Contribute action, not used as a general-purpose accent
- Components: pill-shaped buttons (full border-radius), pastel circular icon-badge cards for KPI tiles, hairline borders over drop shadows
- Type: Figtree (geometric grotesk), not Inter or a generic system stack
- Product naming: this surface is called "Pulse for Uber" (mirrors the "Uber for Business" naming pattern) on user-facing chrome such as the login top bar

## Prototype philosophy
Uber Pulse is a vibe-coded, frontend-only prototype — there is no real backend, auth, or third-party integration behind it.
- When a feature idea sounds like it needs real infra (an API, Jira, Slack, SSO, live data access), don't drop it from scope — reframe it as a convincing mocked/static experience instead. E.g. a "fake API" landing page with a get-API-key flow, a roadmap card that opens rich mock ticket detail on click, a chat history list backed by local state. The goal is that it *feels* like a real, deep product, not that it's stripped down to only what's technically wired up.
- Only exclude something entirely if faking it wouldn't read as credible or would take disproportionate effort for the illusion it buys — use judgment, don't default to cutting.
- Before changing any mock dataset (metrics, catalog entries, roadmap items), first write out per screen what data points are shown, why each is valuable to show, and whether the values are realistic/meaningful — don't jump straight to adjusting numbers.
- When the user supplies a reference product for a specific pattern (e.g. Claude.ai's project page for a chat-history layout), treat it as a first-class design reference for that feature, same as the Uber Base screenshots are for overall visual identity.
- If a change deviates from something the PRD explicitly states (e.g. mobile support is called out as a v1 non-goal), flag the deviation explicitly rather than silently overriding it — confirm whether it's an intentional override or whether the PRD itself should be amended.
- Uber Pulse may be shown to an actual Uber team as part of a job application — the audience includes a reviewing engineer judging craft, not just end users judging utility. This shapes how much to invest in engineering-quality work specifically: don't use "it's a prototype" as license for a bad foundation (hardcoded data with no schema, no design tokens, everything hex-literal) — an engineer reviewing this will judge it the same way they'd judge production code. But don't swing to a full production build either (real framework, TypeScript, schema validation, multi-week migration) — a half-finished attempt reads worse than a well-organized single-file prototype. Default test for any engineering-quality proposal: is it cheap (a couple hours) AND does it read as strong judgment to a reviewer? If yes, do it now. If it's a real time investment, write the plan into docs/backlog.md as explicitly deferred — don't silently skip it, and don't execute it piecemeal.

## Code organization
Uber Pulse is still zero-build (no bundler, no framework) — this section documents conventions added on top of that, not a departure from it:
- **Design tokens** live in `styles/tokens.css` as CSS custom properties (colors, 8px spacing scale, type scale, radius). Reference `var(--token-name)` in shared style-builder functions and the base `<style>` block rather than hardcoding hex/pixel values. Inline `style=""` attributes on markup are a known, accepted gap for now — see docs/backlog.md.
- **Mock data** (`PIPELINES`, `CATALOG`, `ROADMAP_BASE`, `METRICS_BASE`) lives in plain JS files under `data/`, loaded via `<script src>` before `support.js` in `index.html`'s `<head>` — no TypeScript, no runtime validation library. Each file has a JSDoc header documenting field shape; treat that as the schema. Preserve this pattern when adding new mock datasets rather than inlining new arrays back into the HTML.
- A full production foundation (real framework, TypeScript, schema validation, component-level restructure) has a written migration plan but is explicitly out of scope for this demo — see the "Full production foundation" line in docs/backlog.md. Don't start it piecemeal.

## Product decisions
For product-facing work on this repo (PRD critique, roadmap/backlog prioritization, scoping new features, writing user stories) — reason like Alex, the Web Data PM who owns this platform. The full role context, stakeholder map, domain expertise, and operating principles for Alex live in `.claude/agents/product-manager.md` — that file is the source of truth; use it whether or not the subagent is explicitly invoked.
