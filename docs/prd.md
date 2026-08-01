# PRD: Uber Pulse

**Status:** Draft
**Author:** Alex (Web Data PM, Web Infrastructure & Intelligence)
**Last Updated:** July 2026
**Version:** 1.0
**Stakeholders:** Web Data Engineering, Data Scientists, Marketing Analytics, Product Teams (Ridesharing, Eats, B2B), BI & Analytics, Front-End Engineering Leads

---

## 1. Problem Statement

The Web Infrastructure & Intelligence team at Uber owns the source of truth analytics platform for web across all lines of business — Ridesharing, Eats, and B2B/Freight. The platform processes hundreds of millions of events weekly, serves 1,000+ data consumers, and supports 24+ app teams.

Despite this scale, consumers — data scientists, marketing analysts, product managers, BI engineers, and front-end engineers — have no single place to understand what data exists, whether it can be trusted, and how to use it correctly. Today:

- Metric definitions live in stale Confluence docs, people's heads, or nowhere at all. The same word — "conversion," "session," "active user" — means different things across LOBs with no authoritative source.
- Data quality issues are discovered reactively, when a consumer notices something looks wrong, not proactively before decisions are made on bad data.
- Onboarding a new app team onto the pipeline requires weeks of manual back-and-forth between my team and theirs — agreeing on events, reviewing logging implementations, validating payloads.
- The platform's health, SLA status, and roadmap are invisible to consumers unless they directly ping my team on Slack.
- There is no self-serve path for a consumer to answer basic questions about data without filing a request or waiting for a response.

The cost of not solving this is significant: bad data influencing pricing models, attribution spend optimised against incorrect signals, product teams measuring the wrong things, and my team spending the majority of its time on reactive support rather than foundational platform work.

Evidence:

- 24+ app teams onboarded manually with no standardised process — average onboarding takes 3–6 weeks
- Data definition disputes between LOBs escalated to my team weekly with no formal resolution body
- Consumer-reported data quality issues represent the majority of inbound tickets — reactive, not proactive
- No documented SLAs for any core platform service — consumers have no reliability commitment to plan against
- Shadow pipelines and duplicate dashboards proliferating across LOBs because consumers cannot find or trust platform-provided data

---

## 2. Goals & Success Metrics

| Goal | Metric | Current Baseline | Target | Measurement Window |
|---|---|---|---|---|
| Reduce reactive data support load | Inbound data quality tickets per week | ~40 tickets/week | <15 tickets/week | 90 days post-launch |
| Increase data discoverability | % of consumers who can locate a metric definition without pinging the data team | ~20% (estimated) | >80% | 60 days post-launch |
| Reduce onboarding time | Average days to onboard a new app team | 21–42 days | <7 days | Per cohort, 6 months post-launch |
| Improve data trust | % of consumers who rate platform data as "reliable" in quarterly survey | ~45% (estimated) | >75% | Q4 survey |
| Increase self-serve measurement planning | % of new feature measurement plans drafted via AI assistant | 0% | >60% | 90 days post-launch |
| SLA visibility | % of core pipelines with published and monitored SLAs | 0% | 100% | 30 days post-launch |

---

## 3. Non-Goals

- Uber Pulse is not a replacement for Tableau, Looker, or Google Data Studio. It surfaces data health and definitions — it does not replace BI tooling for deep analysis.
- Uber Pulse is not an external-facing product. It is an internal platform tool for Uber employees only.
- Uber Pulse is not a data warehouse or storage layer. It reads from and references existing pipelines and tables — it does not store raw event data.
- We are not building custom authentication in v1 — SSO via Uber's existing internal identity provider will be used.
- We are not building a full Jira integration in v1 — the roadmap page will link out to Jira rather than embed it.
- **Mobile support is out of scope for v1. This is a desktop web product used in a work context.**

---

## 4. User Personas & Stories

**Locked primary personas (updated Aug 2026):** Of the five personas below, four are locked as business-critical — Maya, James, Priya, and Tom. Each was tested against one question: does this person's job depend on trusting this platform's data or acting on a decision tied to it, where failure has real business cost?

- **Priya was re-evaluated and reinstated.** Originally her dependency read as workflow speed (measurement plan generation vs. waiting weeks) rather than a live trust dependency. On reconsideration: if a PM has to wait weeks for a measurement plan before a feature like a ride-booking change ships, the business genuinely cannot see that feature's impact promptly — that's an organizational cost, not a convenience. An AI-generated measurement plan also standardizes tracking at the platform level from day one instead of ad hoc per team, which is core fidelity/standardization work for this platform. That's business-critical by the same test the other three pass.
- **Carlos remains out of the locked set.** His dependency is onboarding friction and status visibility on his own contribution — real, but nothing breaks for the business if this workflow is clunky; it costs Carlos and the data team time, not a decision made on bad data. His persona and story are kept below for completeness and may be reconsidered if Contribute-flow adoption becomes a bottleneck.

All design and prioritization work on this repo should evaluate against the four locked personas unless a change specifically concerns Carlos's contribution workflow.

### Persona 1: Maya — Data Scientist, Ridesharing

Maya builds churn prediction and demand forecasting models. She needs clean, reliable, well-defined event data as model inputs. Today she spends hours reverse-engineering what a field means or whether she can trust a metric before writing a single line of model code.

**Story 1:** As Maya, I want to search for any event or metric and immediately understand its definition, who owns it, and how fresh it is, so that I can trust the data I'm feeding into my models.

- Given I search for "completed_trip," I see its official definition, the implementing team, the definition owner, version history, and last updated timestamp
- Given the event has known quality issues, I see an active warning flag on its catalog entry
- Given I want to explore the data, I can download a sample CSV directly from the catalog entry

**Story 2:** As Maya, I want to ask the AI assistant a plain English question about data availability, so I don't have to ping the data team on Slack and wait hours for a response.

- Given I ask "how many rides did we complete last week in the Netherlands," I receive an answer with the underlying metric sourced and a downloadable CSV
- Given I ask "where do I find surge pricing event data," the assistant points me to the correct catalog entry and table location

### Persona 2: James — Marketing Analyst, Eats

James needs to know which campaigns are driving orders and where to allocate budget. He depends on attribution data being correct and consistent. Today he has three different attribution numbers from three different tools and no way to know which one to trust.

**Story 1:** As James, I want to see the agreed definition of "conversion" for Eats campaigns, so that I can align my reporting with what the business officially recognises.

- Given I navigate to the catalog and filter by LOB: Eats, I see all conversion-related events with their official definitions and the date they were last reviewed
- Given a definition has changed in the last 30 days, I see a change log showing what changed and why

**Story 2:** As James, I want to see on the home page whether the attribution pipeline is healthy today, so that I know whether to trust today's campaign numbers before making a budget decision.

- Given I land on the home page, I see a pipeline health tile for "Marketing Attribution" showing green, amber, or red status and last updated timestamp
- Given the pipeline is degraded, I see an alert with estimated resolution time

### Persona 3: Priya — Product Manager, Ridesharing Growth (locked, reinstated Aug 2026)

Priya is launching a new scheduled rides feature and needs to define what to track before engineering starts building. Today this requires scheduling meetings with the data team, waiting for a measurement plan to be written, and going through multiple review rounds — often weeks before engineering can start building against a spec.

**Why she's locked as business-critical:** every week a measurement plan takes to produce is a week the business can't see whether a shipped feature is actually working. A self-serve, AI-generated measurement plan doesn't just save Priya time — it standardizes how tracking gets defined across the platform from day one, instead of each team inventing its own ad hoc approach. That's the same platform-fidelity mandate the rest of this PRD is built around, applied at the point where new tracking is born rather than after the fact.

**Story 1:** As Priya, I want to describe my new feature to the AI assistant and receive a draft measurement plan, so that I can start the logging spec review process without waiting for the data team.

- Given I describe "a feature that lets users book a ride up to 30 days in advance," the assistant generates a draft measurement plan with suggested event names, payload structures, and success metrics aligned to GTV and trip volume
- Given the draft is generated, I can submit it for review directly from the assistant interface, triggering a contribution workflow
- Given similar events already exist in the catalog, the assistant surfaces them and suggests I align with existing naming conventions rather than create new events

### Persona 4: Tom — BI Engineer, Eats Analytics

Tom builds and maintains dashboards in Looker for the Eats leadership team. He needs to know when data sources are stale or degraded before his dashboards serve wrong numbers to a VP in a Monday morning review.

**Story 1:** As Tom, I want to see daily, weekly, and monthly data quality scores for every pipeline I depend on, so that I can proactively flag issues before they surface in dashboards.

- Given I navigate to the home page monitoring table, I see a quality score, SLA status, and freshness timestamp for each pipeline
- Given a pipeline's quality score drops below threshold, I receive a notification (Slack or email, based on my preference)

### Persona 5: Carlos — Front-End Engineer, Rides App (kept, not in locked set)

Carlos is onboarding a new feature onto the data pipeline. Today this means back-and-forth with the data team over Slack, manual spec review, and no clear visibility into where his submission stands.

**Story 1:** As Carlos, I want to submit a new schema through a guided contribution flow and see its review status in real time, so that I don't have to chase the data team for updates.

- Given I click Contribute in the navigation, I am guided through a structured schema submission form
- Given I submit, my schema appears on the roadmap page under "Under Review" with an estimated review date
- Given my schema is approved, I receive a notification and it appears in the catalog automatically

---

## 5. Solution Overview

Uber Pulse is an internal web platform that serves as the single source of truth for Uber's web data platform. It combines a data catalog, real-time pipeline monitoring, an AI-powered data assistant, and a contribution and roadmap layer into one cohesive product.

The platform is built around four pages, each answering a different question a consumer would have:

**Home** — "Is the platform healthy and how is the business doing?" The home page surfaces Uber's headline metrics — GTV, weekly trips, Eats deliveries, B2B transactions — as cards at the top, with trend charts showing week-over-week movement. Below this sits the monitoring table: every core pipeline listed with its current health status (green, amber, red), SLA target versus actual performance, data freshness timestamp, and a quality score based on automated daily, weekly, and monthly validation checks. An alert banner at the top of the page activates when any critical pipeline is degraded. This page is the first thing a consumer sees and answers the most important question before they do anything else: can I trust the data today?

**Data Catalog** — "What data exists, what does it mean, and who owns it?" The catalog is a searchable, filterable library of every metric, event, and dataset on the platform. Each entry shows its official definition, the team that implemented it, the team that owns the definition, the LOB it belongs to, its current version, a full version history with change logs, and a sample payload. Consumers can filter by LOB, by owner, by status (active, deprecated, under review), and by last updated date. This replaces the current state of tribal knowledge, stale Confluence docs, and Slack pings. Every entry is the authoritative record — not a reference to somewhere else.

**AI Assistant** — "I have a question and I need an answer now." The assistant is a conversational interface embedded in the platform. It handles four types of requests: answering plain English questions about data ("what is a completed trip," "where do I find Eats order data"), querying the platform and returning a downloadable CSV ("how many rides did we have last week in Amsterdam"), generating a draft measurement plan from a feature description ("we're launching scheduled rides, what should we track"), and surfacing relevant catalog entries in response to any query. The measurement plan generator is the highest-value feature for onboarding — it turns a weeks-long manual process into a same-day self-serve workflow, with the output feeding directly into the contribution and approval flow.

**Roadmap** — "What is the data team working on and what's coming next?" The roadmap page shows three columns: currently being defined, coming next, and recently shipped. Each item shows the event or metric name, the LOB it belongs to, the submitting team, the current status, and an estimated completion date. This page gives consumers visibility into the platform's direction so they can plan their own work accordingly. A link to Jira sits at the top for consumers who need full detail. New submissions from the contribution flow appear here automatically under "Under Review."

**Navigation** — persistent across all pages. Two buttons sit in the navigation bar on every page: Report Issue (opens a structured feedback form that creates a tracked issue visible to the data team) and Contribute (opens the schema and measurement plan submission flow). Both are always one click away regardless of where a consumer is in the product.

**Login Page** — "Pulse. Know your data." The login page is the first thing any user sees. It carries the Uber Pulse brand — dark background, Uber-style typography, the Pulse name and a single line tagline. The form has two fields: email and password. Below the form, demo credentials are displayed visibly so anyone evaluating the product can get in immediately without friction.

**Demo account:**

- Email: pulse-demo@uber.com
- Password: Pulse2026
- Role: Data Consumer — general access to home, catalog, AI assistant, and roadmap. Cannot approve contributions or manage definitions.

**Key Design Decisions:**

- We chose to combine the home page and monitoring into one page rather than separating them, because the most valuable thing a consumer can know when they land is whether the data is healthy — separating metrics and monitoring creates unnecessary friction.
- We are embedding the AI assistant as a dedicated page rather than a floating widget, because the measurement plan generator and CSV export require enough screen real estate to be genuinely useful, not a chat bubble.
- We are deferring a native data serving API to v2 — the concept is validated and valuable, but v1 needs to establish the catalog and trust layer before we expose programmatic access to a broader consumer surface.
- Named ownership has two fields per catalog entry — implementing team and definition owner — because these are different responsibilities with different contacts, and conflating them creates confusion when something goes wrong.

---

## 6. Technical Considerations

**Dependencies:**

- Uber internal SSO / identity provider — for authentication — owner: Infrastructure — timeline risk: Low (existing integration)
- Existing pipeline metadata — catalog entries need to be seeded from current pipeline definitions — owner: Web Data Engineering — timeline risk: Medium (data quality of existing metadata is inconsistent)
- Slack integration — for degradation alerts and contribution notifications — owner: Web Data Engineering — timeline risk: Low
- Jira — roadmap page links out to existing Jira board — owner: None (link only in v1) — timeline risk: Low

**Known Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Catalog seeding quality is poor — existing definitions are incomplete or inconsistent | High | High | Manual curation sprint before launch; alpha with limited catalog entries |
| AI assistant hallucinating incorrect definitions or data | Medium | High | Assistant responses cite catalog sources; consumers can flag incorrect answers via Report Issue |
| Low consumer adoption — consumers default to Slack instead of self-serving | Medium | High | Closed beta with 3–5 high-volume consumer teams; drive habit change with weekly home page share in data Slack channel |
| Schema contribution flow creates review bottleneck for data team | Medium | Medium | Automated validation catches structural issues before human review; SLA committed for review turnaround |
| SLA commitments expose performance gaps we haven't measured before | Low | Medium | Baseline measurement sprint before publishing SLAs publicly |

**Open Questions (must resolve before dev start):**

- Which pipelines are included in the v1 monitoring table — all 24+ apps or a prioritised subset? — Owner: Alex — Deadline: Sprint 1
- What is the AI assistant's data access scope in v1 — catalog metadata only, or live query capability? — Owner: Alex + Data Engineering — Deadline: Sprint 1
- What is the review SLA commitment for schema contributions? — Owner: Alex — Deadline: Sprint 2
- Which teams participate in the closed beta? — Owner: Alex — Deadline: Pre-launch

---

## 7. Launch Plan

| Phase | Date | Audience | Success Gate |
|---|---|---|---|
| Internal alpha | Week 6 | Web Data team + 2 design partners (1 data scientist, 1 PM) | Core flows complete, no P0 bugs, catalog seeded with 50+ entries |
| Closed beta | Week 10 | 3–5 high-volume consumer teams across LOBs | <5% error rate, >70% of beta users rate catalog as "useful," at least 5 measurement plans generated via AI assistant |
| GA rollout | Week 14 | All internal consumers, phased 25% → 100% over 2 weeks | Inbound Slack data questions drop measurably, monitoring table SLA compliance visible for all core pipelines |

**Rollback Criteria:** If error rate exceeds 5% or the AI assistant produces more than 3 confirmed incorrect responses in the first week, freeze the assistant feature and revert to catalog-only mode. Page on-call via Slack.

---

## 8. Appendix

- Tracking technologies analysis: Uber Cookie Notice (July 2026)
- Problem identification session: People, Process, Data, Technology, Product dimensions
- Consumer personas: Data Scientists, Marketing, Product Teams, BI & Analytics, Engineering
- Cross-category impact matrix: 12 ideas scored across problem dimensions and consumer groups
- Uber scale reference: ~25–30M trips and deliveries per day globally, 175–200M weekly
- Competing tools in current stack: Tableau, Looker, Google Data Studio, Amplitude, Mixpanel, Kibana, Splunk, Grafana, DataDog, Tealium
- Data serving API: deferred to v2 — concept validated, dependency on v1 catalog trust layer
