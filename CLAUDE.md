# Uber Pulse — instructions for Claude

## Workflow
- Never commit or push automatically. Make the requested edits, stop, and let the user review the files locally before anything is committed. Only commit/push when explicitly told to.
- If a request is vague or open to more than one reasonable interpretation, don't guess — ask multiple-choice clarifying questions one at a time until it's resolved, rather than picking an interpretation and running with it.
- Preserve existing functionality when restyling or refactoring. A visual/design pass should not silently drop working behavior (e.g. the demo account login flow) — carry it forward even as markup and styles change.
- The PRD is the source of truth for product requirements and scope. Check it before adding or changing functionality.
- It's fine to add non-functional/decorative elements for visual completeness (e.g. extra auth provider buttons) when the user explicitly scopes them that way — don't wire them up unless asked.

## Visual identity
Uber Pulse must look cohesive with Uber's real internal product ecosystem (Base from Uber) (Uber Direct, Uber for Business, Uber Central) — not like a generic/templated AI-generated dashboard. Concretely:
- Layout: persistent left sidebar navigation with icon + label per item (not top nav, not icon-only)
- Color: true black/white/green tokens — black (`#0A0A0A`) is the default primary action color; green (`#06C167`) is reserved for status-positive states, the logo mark, and the Contribute action, not used as a general-purpose accent
- Components: pill-shaped buttons (full border-radius), pastel circular icon-badge cards for KPI tiles, hairline borders over drop shadows
- Type: Figtree (geometric grotesk), not Inter or a generic system stack
- Product naming: this surface is called "Pulse for Uber" (mirrors the "Uber for Business" naming pattern) on user-facing chrome such as the login top bar
