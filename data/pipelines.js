/**
 * PIPELINES — the list of data pipelines shown on the Pipelines screen and
 * referenced (via `pipelineId`) from CATALOG entries and roadmap items.
 *
 * @typedef {Object} QualitySnapshot
 * @property {string} date    ISO date string (YYYY-MM-DD) the snapshot was checked.
 * @property {number} quality Data quality score at that check, 0-100.
 * @property {'green'|'amber'|'red'} health  Health/status at that check.
 *
 * @typedef {Object} PipelineChangelogEntry
 * @property {string} version  Version label (e.g. 'v1.1').
 * @property {string} date     ISO date string (YYYY-MM-DD).
 * @property {string} change   Short description of what changed in this version.
 *
 * @typedef {Object} Pipeline
 * @property {string} id            Stable short id, e.g. 'p1'. Referenced by CATALOG[].pipelineId
 *                                   and ROADMAP_BASE[...][].pipelineId.
 * @property {string} name          Human-readable pipeline name shown in the UI.
 * @property {'Ridesharing'|'Eats'|'B2B'|'Platform'} lob  Line of business, keys into LOB_COLORS.
 * @property {'green'|'amber'|'red'} health  Current health/status used by statusChipStyle().
 * @property {string} slaTarget     Target SLA, display string (e.g. '99.9%').
 * @property {string} slaActual     Actual measured SLA, display string (e.g. '99.94%').
 * @property {string} freshness     Human-readable data freshness/lag (e.g. '4 min ago').
 * @property {number} quality       Data quality score, 0-100.
 * @property {string} owningTeam    Team that owns this pipeline. Feeds OWNING_TEAMS.
 * @property {string} implementingTeam  Engineering team that builds/operates the pipeline (mirrors owningTeam
 *                                      today, kept as a separate field for parity with CatalogEntry).
 * @property {string} definitionOwner   Person/team who owns the pipeline's SLA/quality definition accuracy.
 * @property {string[]} downstreamConsumers  Teams or dashboards that depend on this pipeline's output.
 * @property {string} description   One-sentence description of what the pipeline ingests.
 * @property {string} [warningText]  Present only for amber/red pipelines — explains the root cause behind
 *                                   the current SLA/quality miss, shown as a red banner on the detail page.
 * @property {PipelineChangelogEntry[]} changelog  Version history, oldest listed first as authored.
 * @property {QualitySnapshot[]} history  Past timestamped quality/health checks, oldest first,
 *                                        ending at a snapshot matching the current quality/health.
 *
 * @type {Pipeline[]}
 */
const PIPELINES = [
  { id:'p1', name:'Trip Completion Events', lob:'Ridesharing', health:'green', slaTarget:'99.9%', slaActual:'99.94%', freshness:'4 min ago', quality:98,
    owningTeam:'Rides Platform Engineering', implementingTeam:'Rides Platform Engineering', definitionOwner:'Maya Chen (Data Science)', downstreamConsumers:['Finance Reconciliation', 'Rides Growth Engineering', 'Executive Dashboards'],
    description:'Ingests the full trip lifecycle from reservation through completion and receipt.',
    changelog:[{version:'v1.0',date:'2025-12-01',change:'Initial pipeline stood up covering trip lifecycle ingestion.'}, {version:'v1.1',date:'2026-05-20',change:'Required payment-capture confirmation for trip completion, aligning with Finance reconciliation.'}],
    history:[{date:'2026-06-27', quality:92, health:'green'}, {date:'2026-07-04', quality:96, health:'green'}, {date:'2026-07-11', quality:98, health:'green'}, {date:'2026-07-18', quality:96, health:'green'}, {date:'2026-07-25', quality:98, health:'green'}] },
  { id:'p2', name:'Marketing Attribution', lob:'Eats', health:'amber', slaTarget:'99.5%', slaActual:'97.1%', freshness:'22 min ago', quality:84,
    owningTeam:'Eats Growth Engineering', implementingTeam:'Eats Growth Engineering', definitionOwner:'Marketing Analytics', downstreamConsumers:['Marketing Analytics', 'Executive Dashboards'],
    description:'Processes ad touches and campaign conversions for marketing measurement.',
    changelog:[{version:'v1.0',date:'2026-02-10',change:'Initial release covering ad impression and click ingestion.'}, {version:'v1.1',date:'2026-07-22',change:'Migrated to campaign_started, replacing the deprecated attribution_touch definition.'}],
    warningText:'SLA is still recovering post-migration to campaign_started — residual legacy attribution_touch traffic is being backfilled through August.',
    history:[{date:'2026-06-27', quality:98, health:'green'}, {date:'2026-07-04', quality:95, health:'green'}, {date:'2026-07-11', quality:91, health:'green'}, {date:'2026-07-18', quality:88, health:'amber'}, {date:'2026-07-25', quality:84, health:'amber'}] },
  { id:'p3', name:'Surge Pricing Events', lob:'Ridesharing', health:'green', slaTarget:'99.9%', slaActual:'99.97%', freshness:'2 min ago', quality:99,
    owningTeam:'Pricing Engineering', implementingTeam:'Pricing Engineering', definitionOwner:'Pricing Data Science', downstreamConsumers:['Rides Growth Engineering', 'Executive Dashboards'],
    description:'Streams surge zone activation, multiplier, and expiry events used for dynamic pricing analysis.',
    changelog:[{version:'v1.0',date:'2025-11-15',change:'Initial release.'}, {version:'v1.1',date:'2026-06-30',change:'Added zone_id granularity to support geographic surge analysis.'}],
    history:[{date:'2026-06-27', quality:95, health:'green'}, {date:'2026-07-04', quality:96, health:'green'}, {date:'2026-07-11', quality:97, health:'green'}, {date:'2026-07-18', quality:99, health:'green'}, {date:'2026-07-25', quality:99, health:'green'}] },
  { id:'p4', name:'Eats Order Completion', lob:'Eats', health:'green', slaTarget:'99.5%', slaActual:'99.8%', freshness:'6 min ago', quality:95,
    owningTeam:'Eats Checkout Engineering', implementingTeam:'Eats Checkout Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Finance Reconciliation', 'Eats Growth Engineering', 'Executive Dashboards'],
    description:'Tracks the full Eats checkout funnel from start through order placement or error.',
    changelog:[{version:'v1.0',date:'2026-01-10',change:'Initial release covering the Eats checkout funnel.'}, {version:'v1.1',date:'2026-07-30',change:'Corrected eats_order_placed scope to cover all Eats verticals, not just restaurant orders.'}],
    history:[{date:'2026-06-27', quality:92, health:'green'}, {date:'2026-07-04', quality:92, health:'green'}, {date:'2026-07-11', quality:92, health:'green'}, {date:'2026-07-18', quality:92, health:'green'}, {date:'2026-07-25', quality:95, health:'green'}] },
  { id:'p5', name:'B2B Freight Transactions', lob:'B2B', health:'green', slaTarget:'99.0%', slaActual:'99.4%', freshness:'12 min ago', quality:91,
    owningTeam:'Freight Engineering', implementingTeam:'Freight Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['B2B Finance Engineering', 'Executive Dashboards'],
    description:'Processes freight shipment requests, confirmations, and deliveries for enterprise billing and reporting.',
    changelog:[{version:'v1.0',date:'2025-10-05',change:'Initial release.'}, {version:'v1.1',date:'2026-05-22',change:'Added delayed-shipment tracking via freight_shipment_delayed.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:90, health:'green'}, {date:'2026-07-25', quality:91, health:'green'}] },
  { id:'p6', name:'Driver Supply Events', lob:'Ridesharing', health:'red', slaTarget:'99.9%', slaActual:'94.2%', freshness:'3 hrs ago', quality:61,
    owningTeam:'Rides Platform Engineering', implementingTeam:'Rides Platform Engineering', definitionOwner:'Rides Analytics', downstreamConsumers:['Pricing Engineering', 'Rides Growth Engineering'],
    description:'Streams real-time driver availability signals used for supply/demand balancing. Currently degraded.',
    changelog:[{version:'v1.0',date:'2025-09-20',change:'Initial release on driver_supply_available.'}, {version:'v1.1',date:'2026-07-26',change:'Began limited rollout of driver_supply_v2 to resolve the EU duplicate-event issue; full migration in progress (DATA-397).'}],
    warningText:'Legacy driver_supply_available is still the primary source pending the driver_supply_v2 migration (DATA-397) — duplicate availability pings from a known race condition are the root cause of this SLA miss.',
    history:[{date:'2026-06-27', quality:91, health:'green'}, {date:'2026-07-04', quality:84, health:'green'}, {date:'2026-07-11', quality:76, health:'amber'}, {date:'2026-07-18', quality:69, health:'amber'}, {date:'2026-07-25', quality:61, health:'red'}] },
  { id:'p7', name:'Session & Auth Events', lob:'Platform', health:'green', slaTarget:'99.9%', slaActual:'99.95%', freshness:'1 min ago', quality:97,
    owningTeam:'Web Infrastructure', implementingTeam:'Web Infrastructure', definitionOwner:'Web Data Engineering', downstreamConsumers:['Reliability Engineering', 'Growth Engineering'],
    description:'Ingests session start, logout, timeout, and login-failure events across all web surfaces.',
    changelog:[{version:'v1.0',date:'2025-08-01',change:'Initial release.'}, {version:'v4.1',date:'2026-07-10',change:'Consolidated legacy per-surface session events into a single session_started v4 definition.'}],
    history:[{date:'2026-06-27', quality:95, health:'green'}, {date:'2026-07-04', quality:95, health:'green'}, {date:'2026-07-11', quality:94, health:'green'}, {date:'2026-07-18', quality:96, health:'green'}, {date:'2026-07-25', quality:97, health:'green'}] },
  { id:'p8', name:'Payments & Refunds', lob:'Platform', health:'amber', slaTarget:'99.5%', slaActual:'98.0%', freshness:'18 min ago', quality:88,
    owningTeam:'Payments Engineering', implementingTeam:'Payments Engineering', definitionOwner:'Payments Analytics', downstreamConsumers:['Finance Reconciliation', 'Executive Dashboards'],
    description:'Processes payment captures, failures, refunds, and discounts across Mobility, Eats, and B2B.',
    changelog:[{version:'v1.0',date:'2025-09-01',change:'Initial release.'}, {version:'v2.0',date:'2026-07-14',change:'Root-causing SLA slip — refund events batching under load during peak Eats hours (DATA-455).'}],
    warningText:'Refund events batch under load during peak Eats hours, delaying processing past SLA — fix tracked under DATA-455.',
    history:[{date:'2026-06-27', quality:99, health:'green'}, {date:'2026-07-04', quality:96, health:'green'}, {date:'2026-07-11', quality:94, health:'green'}, {date:'2026-07-18', quality:91, health:'amber'}, {date:'2026-07-25', quality:88, health:'amber'}] },
  { id:'p9', name:'Eats Delivery Tracking', lob:'Eats', health:'green', slaTarget:'99.0%', slaActual:'99.3%', freshness:'5 min ago', quality:93,
    owningTeam:'Eats Logistics Engineering', implementingTeam:'Eats Logistics Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Eats Growth Engineering', 'Executive Dashboards'],
    description:'Streams real-time delivery tracking and courier handoff events for in-progress Eats orders.',
    changelog:[{version:'v1.0',date:'2026-03-01',change:'Initial release.'}, {version:'v1.3',date:'2026-07-01',change:'Moved courier handoff events to a dedicated low-latency topic, cutting freshness from ~9 min to under 5 min.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:93, health:'green'}, {date:'2026-07-25', quality:93, health:'green'}] },
  { id:'p10', name:'Fare Estimate Requests', lob:'Ridesharing', health:'green', slaTarget:'99.5%', slaActual:'99.7%', freshness:'3 min ago', quality:96,
    owningTeam:'Pricing Engineering', implementingTeam:'Pricing Engineering', definitionOwner:'Pricing Data Science', downstreamConsumers:['Rides Growth Engineering'],
    description:'Streams fare preview, expiry, and price-lock events generated before a rider books a trip.',
    changelog:[{version:'v1.0',date:'2026-02-20',change:'Initial release.'}, {version:'v1.1',date:'2026-06-05',change:'Added price-lock expiry tracking.'}],
    history:[{date:'2026-06-27', quality:94, health:'green'}, {date:'2026-07-04', quality:95, health:'green'}, {date:'2026-07-11', quality:93, health:'green'}, {date:'2026-07-18', quality:94, health:'green'}, {date:'2026-07-25', quality:96, health:'green'}] },
  { id:'p11', name:'ETA & Routing Events', lob:'Ridesharing', health:'amber', slaTarget:'99.5%', slaActual:'97.8%', freshness:'15 min ago', quality:85,
    owningTeam:'Rides Platform Engineering', implementingTeam:'Rides Platform Engineering', definitionOwner:'Rides Analytics', downstreamConsumers:['Rides Growth Engineering', 'Reliability Engineering'],
    description:'Processes live ETA calculation and route recalculation events used for dispatch and rider display.',
    changelog:[{version:'v1.0',date:'2025-12-15',change:'Initial release.'}, {version:'v1.1',date:'2026-06-30',change:'Flagged rising ETA-miss volume correlating with this pipeline\'s SLA degradation; under investigation.'}],
    warningText:'Elevated ETA-miss events this week are inflating processing load; root cause under active investigation.',
    history:[{date:'2026-06-27', quality:99, health:'green'}, {date:'2026-07-04', quality:96, health:'green'}, {date:'2026-07-11', quality:92, health:'green'}, {date:'2026-07-18', quality:89, health:'amber'}, {date:'2026-07-25', quality:85, health:'amber'}] },
  { id:'p12', name:'Rider Ratings & Feedback', lob:'Ridesharing', health:'green', slaTarget:'99.0%', slaActual:'99.3%', freshness:'8 min ago', quality:92,
    owningTeam:'Rides Growth Engineering', implementingTeam:'Rides Growth Engineering', definitionOwner:'Rides Analytics', downstreamConsumers:['Trust & Safety', 'Executive Dashboards'],
    description:'Ingests post-trip ratings, feedback comments, and low-rating review flags.',
    changelog:[{version:'v1.0',date:'2026-01-05',change:'Initial release.'}, {version:'v1.1',date:'2026-04-22',change:'Added low-rating trust & safety review flagging.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:90, health:'green'}, {date:'2026-07-25', quality:92, health:'green'}] },
  { id:'p13', name:'Ride Cancellation Events', lob:'Ridesharing', health:'green', slaTarget:'99.5%', slaActual:'99.6%', freshness:'4 min ago', quality:95,
    owningTeam:'Rides Platform Engineering', implementingTeam:'Rides Platform Engineering', definitionOwner:'Rides Analytics', downstreamConsumers:['Rides Growth Engineering', 'Executive Dashboards'],
    description:'Streams trip cancellations by reason and initiator for cancellation-rate monitoring.',
    changelog:[{version:'v1.0',date:'2025-11-01',change:'Initial release.'}, {version:'v1.1',date:'2026-06-28',change:'Added cancellation_stage to distinguish pre-pickup from post-pickup cancellations.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:91, health:'green'}, {date:'2026-07-11', quality:92, health:'green'}, {date:'2026-07-18', quality:96, health:'green'}, {date:'2026-07-25', quality:95, health:'green'}] },
  { id:'p14', name:'Restaurant Menu Views', lob:'Eats', health:'green', slaTarget:'99.5%', slaActual:'99.8%', freshness:'2 min ago', quality:97,
    owningTeam:'Eats Discovery Engineering', implementingTeam:'Eats Discovery Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Eats Growth Engineering'],
    description:'Ingests menu views, search clicks, and filter events — the top of the Eats browsing funnel.',
    changelog:[{version:'v1.0',date:'2026-01-20',change:'Initial release.'}, {version:'v1.1',date:'2026-06-25',change:'Added search-result-click and filter-applied events to the browsing funnel.'}],
    history:[{date:'2026-06-27', quality:95, health:'green'}, {date:'2026-07-04', quality:96, health:'green'}, {date:'2026-07-11', quality:96, health:'green'}, {date:'2026-07-18', quality:97, health:'green'}, {date:'2026-07-25', quality:97, health:'green'}] },
  { id:'p15', name:'Restaurant Rating Events', lob:'Eats', health:'green', slaTarget:'99.0%', slaActual:'99.2%', freshness:'10 min ago', quality:90,
    owningTeam:'Eats Growth Engineering', implementingTeam:'Eats Growth Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Trust & Safety', 'Eats Discovery Engineering'],
    description:'Processes restaurant rating submissions, photo attachments, and flagged reviews.',
    changelog:[{version:'v1.0',date:'2026-01-15',change:'Initial release.'}, {version:'v1.1',date:'2026-04-30',change:'Added photo-attachment and suspected-fake-review flagging.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:90, health:'green'}, {date:'2026-07-25', quality:90, health:'green'}] },
  { id:'p16', name:'Cart Abandonment Events', lob:'Eats', health:'amber', slaTarget:'99.0%', slaActual:'96.5%', freshness:'25 min ago', quality:79,
    owningTeam:'Eats Checkout Engineering', implementingTeam:'Eats Checkout Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Marketing Analytics', 'Eats Growth Engineering'],
    description:'Streams cart abandonment, recovery-email, and cart-recovery events.',
    changelog:[{version:'v1.0',date:'2026-02-01',change:'Initial release.'}, {version:'v1.1',date:'2026-06-20',change:'Added cart-recovery email and recovery-conversion tracking.'}],
    warningText:'Cart-recovery email volume has grown faster than processing capacity, pushing some abandonment events past the freshness SLA.',
    history:[{date:'2026-06-27', quality:93, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:86, health:'green'}, {date:'2026-07-18', quality:83, health:'amber'}, {date:'2026-07-25', quality:79, health:'amber'}] },
  { id:'p17', name:'Eats Refund Events', lob:'Eats', health:'green', slaTarget:'99.5%', slaActual:'99.6%', freshness:'9 min ago', quality:94,
    owningTeam:'Payments Engineering', implementingTeam:'Payments Engineering', definitionOwner:'Payments Analytics', downstreamConsumers:['Finance Reconciliation', 'Eats Growth Engineering'],
    description:'Processes refund requests, issuances, and disputes for Eats orders.',
    changelog:[{version:'v1.0',date:'2025-12-10',change:'Initial release.'}, {version:'v1.1',date:'2026-06-01',change:'Added dispute tracking for restaurant-contested refunds.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:93, health:'green'}, {date:'2026-07-11', quality:92, health:'green'}, {date:'2026-07-18', quality:95, health:'green'}, {date:'2026-07-25', quality:94, health:'green'}] },
  { id:'p18', name:'B2B Invoice Generation', lob:'B2B', health:'green', slaTarget:'99.0%', slaActual:'99.1%', freshness:'20 min ago', quality:90,
    owningTeam:'B2B Finance Engineering', implementingTeam:'B2B Finance Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['Finance Reconciliation', 'Executive Dashboards'],
    description:'Streams invoice generation, payment, and dispute events for enterprise billing reconciliation.',
    changelog:[{version:'v1.0',date:'2025-10-20',change:'Initial release.'}, {version:'v1.1',date:'2026-06-08',change:'Added invoice dispute events for contested line items.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:91, health:'green'}, {date:'2026-07-25', quality:90, health:'green'}] },
  { id:'p19', name:'Uber for Business Trip Bookings', lob:'B2B', health:'green', slaTarget:'99.0%', slaActual:'99.3%', freshness:'11 min ago', quality:93,
    owningTeam:'Uber for Business Engineering', implementingTeam:'Uber for Business Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['B2B Finance Engineering', 'Executive Dashboards'],
    description:'Processes enterprise-managed trip bookings, policy-violation flags, and expensing events.',
    changelog:[{version:'v1.0',date:'2026-01-10',change:'Initial release.'}, {version:'v1.1',date:'2026-05-27',change:'Added policy-violation flagging for out-of-policy bookings.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:93, health:'green'}, {date:'2026-07-25', quality:93, health:'green'}] },
  { id:'p20', name:'B2B Expense Report Submissions', lob:'B2B', health:'amber', slaTarget:'98.5%', slaActual:'96.0%', freshness:'35 min ago', quality:80,
    owningTeam:'B2B Finance Engineering', implementingTeam:'B2B Finance Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['Uber for Business Engineering'],
    description:'Ingests expense report submission, approval, and rejection events from the newly launched workflow.',
    changelog:[{version:'v0.1',date:'2026-06-01',change:'Initial pilot release.'}, {version:'v0.4',date:'2026-07-21',change:'Expanded to approval/rejection events; approval routing logic still being finalized, driving the current SLA miss.'}],
    warningText:'Approval routing logic for the new expense workflow is still being finalized — this is the primary driver of the current SLA miss.',
    history:[{date:'2026-06-27', quality:94, health:'green'}, {date:'2026-07-04', quality:91, health:'green'}, {date:'2026-07-11', quality:87, health:'green'}, {date:'2026-07-18', quality:84, health:'amber'}, {date:'2026-07-25', quality:80, health:'amber'}] },
  { id:'p21', name:'Freight Carrier Bidding Events', lob:'B2B', health:'green', slaTarget:'98.5%', slaActual:'98.7%', freshness:'19 min ago', quality:88,
    owningTeam:'Freight Engineering', implementingTeam:'Freight Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['B2B Finance Engineering'],
    description:'Streams carrier bid submission, acceptance, and withdrawal events from the marketplace pilot.',
    changelog:[{version:'v0.1',date:'2026-06-10',change:'Initial pilot release for the carrier marketplace.'}, {version:'v0.3',date:'2026-07-25',change:'Added bid-withdrawal tracking; dedup logic for repeat bids not yet finalized.'}],
    history:[{date:'2026-06-27', quality:90, health:'green'}, {date:'2026-07-04', quality:90, health:'green'}, {date:'2026-07-11', quality:90, health:'green'}, {date:'2026-07-18', quality:90, health:'green'}, {date:'2026-07-25', quality:88, health:'green'}] },
  { id:'p23', name:'Push Notification Delivery', lob:'Platform', health:'amber', slaTarget:'99.5%', slaActual:'97.9%', freshness:'14 min ago', quality:86,
    owningTeam:'Growth Engineering', implementingTeam:'Growth Engineering', definitionOwner:'Marketing Analytics', downstreamConsumers:['Marketing Analytics', 'Executive Dashboards'],
    description:'Processes notification delivery, failure, and open events for engagement measurement.',
    changelog:[{version:'v1.0',date:'2025-11-05',change:'Initial release.'}, {version:'v1.1',date:'2026-06-16',change:'Added open-tracking to measure post-delivery engagement.'}],
    warningText:'Elevated notification failure rates from stale device tokens are delaying delivery confirmation past SLA.',
    history:[{date:'2026-06-27', quality:99, health:'green'}, {date:'2026-07-04', quality:96, health:'green'}, {date:'2026-07-11', quality:93, health:'green'}, {date:'2026-07-18', quality:89, health:'amber'}, {date:'2026-07-25', quality:86, health:'amber'}] },
  { id:'p24', name:'Search & Autocomplete Events', lob:'Platform', health:'green', slaTarget:'99.5%', slaActual:'99.6%', freshness:'3 min ago', quality:94,
    owningTeam:'Web Infrastructure', implementingTeam:'Web Infrastructure', definitionOwner:'Web Data Engineering', downstreamConsumers:['Eats Discovery Engineering', 'Rides Platform Engineering'],
    description:'Streams search queries, autocomplete suggestions shown, and zero-result events.',
    changelog:[{version:'v1.0',date:'2026-01-25',change:'Initial release.'}, {version:'v1.1',date:'2026-05-11',change:'Added zero-result tracking for search quality monitoring.'}],
    history:[{date:'2026-06-27', quality:92, health:'green'}, {date:'2026-07-04', quality:91, health:'green'}, {date:'2026-07-11', quality:92, health:'green'}, {date:'2026-07-18', quality:93, health:'green'}, {date:'2026-07-25', quality:94, health:'green'}] },
  { id:'p25', name:'App Crash & Error Events', lob:'Platform', health:'red', slaTarget:'99.9%', slaActual:'91.5%', freshness:'2 hrs ago', quality:58,
    owningTeam:'Reliability Engineering', implementingTeam:'Reliability Engineering', definitionOwner:'Web Data Engineering', downstreamConsumers:['Web Infrastructure', 'Executive Dashboards'],
    description:'Ingests client error, crash, and recovery events. Currently degraded.',
    changelog:[{version:'v1.0',date:'2025-10-15',change:'Initial release.'}, {version:'v1.1',date:'2026-06-22',change:'Added auto-recovery tracking distinct from full crashes; elevated crash volume under active investigation.'}],
    warningText:'Client error volume has spiked, correlating with the Driver Supply Events degradation — clients are retrying failed availability calls, amplifying crash/error volume (DATA-397).',
    history:[{date:'2026-06-27', quality:88, health:'green'}, {date:'2026-07-04', quality:81, health:'green'}, {date:'2026-07-11', quality:73, health:'amber'}, {date:'2026-07-18', quality:66, health:'amber'}, {date:'2026-07-25', quality:58, health:'red'}] }
];

