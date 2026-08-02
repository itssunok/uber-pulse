# Pulse for Uber

**A vision prototype for what Uber's web data platform could feel like as a trusted product — not just a pipeline.**

Uber processes hundreds of millions of web events a week across Ridesharing, Eats, and B2B, serving 1,000+ data consumers and 24+ app teams. Despite that scale, there's no single place to answer "what does this metric mean, can I trust it, and who owns it?" Pulse is a frontend prototype of that place — designed the way I'd approach it as a PM: starting from the problem and the people who feel it, not from a feature list.

This is a **product vision prototype, frontend-only** — no real backend, auth, or data pipeline behind it. Every screen is built to feel like a real, deep product, backed by realistic mock data, so the interaction model and the product thinking can be evaluated on their own terms.

---

## Why this exists

Uber has already lived this failure mode once — before mobile analytics was standardized, 40%+ of events were ad-hoc, undocumented custom logs. Web data is on the same trajectory: every LOB has its own implicit definition of "conversion" or "active session," data quality issues surface reactively instead of proactively, and onboarding a new app team takes 3–6 weeks of manual back-and-forth.

That fragmentation isn't just a hygiene problem — it compounds. As Uber layers AI-driven and agentic capability on top of web data (assistants, automated pricing, measurement plans), an AI system without a shared, trusted definition underneath it doesn't correct the inconsistency, it launders it: a confident answer built on whichever team's undocumented convention happened to be in the query path. Pulse's catalog and monitoring layer is the precondition for that AI layer to be trustworthy at all — get it right once, and every subsequent build inherits it for free.

Full reasoning lives in [`docs/prd.md`](docs/prd.md), which I treat as the source of truth for scope and prioritization on this repo.

---

## Who it's for

Four personas, each locked as business-critical against one test: *does this person's job depend on trusting this platform's data, where failure has real business cost?*

| Persona | Role | Depends on Pulse for |
|---|---|---|
| **Maya** | Data Scientist, Ridesharing | Trusting event/metric definitions before they become model inputs |
| **James** | Marketing Analyst, Eats | Knowing which "conversion" number is the real one before allocating budget |
| **Priya** | PM, Ridesharing Growth | Self-serve measurement plans instead of weeks waiting on the data team |
| **Tom** | BI Engineer, Eats Analytics | Catching degraded pipelines before they surface in a VP's dashboard |

(A fifth persona, Carlos — a front-end engineer onboarding a schema — is documented but deliberately not in the locked set: his pain is workflow friction, not a live trust dependency.)

---

## What's in the product

- **Home** — the first question any consumer has: *is the data healthy today?* Headline KPI cards with trendlines, a pipeline monitoring table (health, SLA target vs. actual, freshness, quality score), and an alert banner when something critical is degraded.
- **Data & Pipeline Catalog** — a searchable, filterable system of record for every event, metric, and pipeline: official definition, implementing team, definition owner, version history with change logs, and a downloadable sample payload. No more tribal knowledge or stale Confluence docs.
- **AI Assistant ("Ask Pulse")** — answers plain-English questions about data availability, returns downloadable query results, and — its highest-leverage feature — drafts a measurement plan from a feature description, feeding straight into the contribution/review flow.
- **Roadmap** — three columns (being defined / coming next / recently shipped) so consumers can see what the data team is building without pinging Slack, deep-linking into the real catalog/pipeline detail pages where they exist.
- **Contribute & Report Issue** — always one click away in the nav: a guided schema/measurement-plan submission flow, and a structured issue report that creates a tracked ticket instead of a Slack message into the void.
- **Developer Tools** — a mocked API-key management surface, because "give me programmatic access" is a real ask even in v1.

---

## Success metrics (from the PRD)

### The 30-second version

| | Current | Goal |
|---|---|---|
| Onboarding a new app team | 21–42 days | <7 days |
| Metrics with a documented, owned definition | ~20% | >80% |
| Inbound data questions handled via Slack | ~40/week | 60% reduction |

Full metric set, baselines, and measurement windows below.

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Reduce reactive support load | Data quality tickets/week | ~40 | <15 |
| Increase discoverability | Consumers who can self-serve a metric definition | ~20% | >80% |
| Reduce onboarding time | Days to onboard a new app team | 21–42 | <7 |
| Improve data trust | Consumers rating platform data "reliable" | ~45% | >75% |
| Increase self-serve measurement planning | Measurement plans drafted via AI assistant | 0% | >60% |
| SLA visibility | Core pipelines with published, monitored SLAs | 0% | 100% |

These are the metrics I'd actually hold v1 accountable to — they're instrumentable from day one and don't depend on a study we haven't run. What they don't show is *why* they matter beyond the data team's own workload, so here's that case made explicit:

### Why this matters beyond the data team

*Directional reasoning below, not measured figures — the honest version of a business case at this stage, not a fabricated one.*

Every one of these metrics is really a proxy for one underlying chain: **trustworthy events → better decisions → better outcomes**, whether that decision is made by a person or by a model. Pulse doesn't make decisions itself — it's the trust layer that everything downstream of it either inherits or is corrupted by.

- **Engineering leverage, internal.** 40→15 tickets/week at ~2–3 hours of senior IC time each is 60–75 hours/week clawed back from reactive firefighting into platform work — the real cost of today's state isn't the ticket count, it's what that team isn't building instead.
- **Faster, better-informed decisions, internal.** Cutting onboarding from weeks to under 7 days means a growth feature tied to GTV gets a real measurement read that much sooner — every week a feature's impact is invisible is a week a scaling decision gets made on instinct instead of evidence.
- **Safer automation, internal and external.** This is the thesis for why v1 exists at all. As Uber layers AI-driven decisioning on top of web data — automated pricing, attribution optimization, assistant-generated measurement plans — an AI system built on inconsistent, undocumented definitions doesn't correct that inconsistency, it launders it with false confidence. A rider sees a price; a driver sees a demand signal; an eater sees a recommendation — each is the visible end of a decision chain that started with a metric definition someone had to trust. Get that definition layer right once and every automated decision built on it inherits the trust. Get it wrong, and the person who feels it last is an actual rider or eater, not the analyst who mis-defined "conversion" three teams upstream.

I'd stand behind the six metrics above as the real success bar and pair them with this framing to make the case for *why the platform matters*, not just that it's up and running.

---

## Design system

Built to sit believably alongside Uber's real internal product ecosystem (Base, Uber Direct, Uber for Business, Uber Central) rather than read as a generic AI-generated dashboard:

- Persistent left sidebar navigation (icon + label), not a top nav
- True black/white/green — black is the default primary action color, green (`#06C167`) is reserved for status-positive states, the logo, and Contribute
- Pill-shaped buttons, pastel circular icon-badge KPI tiles, hairline borders over drop shadows
- Figtree (geometric grotesk) typography
- Design tokens live in [`styles/tokens.css`](styles/tokens.css); mock datasets live under [`data/`](data) with a JSDoc-documented schema per file

---

## Running it locally

This is a zero-build, zero-dependency static site — no `npm install`, no bundler.

```bash
git clone <this-repo-url>
cd uber-pulse
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

(Any static file server works — `npx serve`, VS Code's Live Server, etc. Opening `index.html` directly via `file://` will also mostly work, but a local server avoids any browser restrictions on script loading.)

**Demo login:**

- Email: `pulse-demo@uber.com`
- Password: `Pulse2026`

Credentials are also shown directly on the login screen so anyone evaluating the product can get in without friction.

---

## Project structure

```
index.html          Single-file app shell — layout, styles, and all screen markup/logic
data/                Mock datasets (pipelines, catalog, roadmap, metrics) with JSDoc schemas
styles/tokens.css    Design tokens — colors, spacing, type scale, radius
scripts/support.js   Shared support logic
docs/prd.md          Product requirements doc — source of truth for scope
docs/backlog.md      Deferred work, explicitly scoped out for now
```
