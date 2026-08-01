/**
 * PIPELINES — the list of data pipelines shown on the Pipelines screen and
 * referenced (via `pipelineId`) from CATALOG entries and roadmap items.
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
 * @property {string} description   One-sentence description of what the pipeline ingests.
 *
 * @type {Pipeline[]}
 */
const PIPELINES = [
  { id:'p1', name:'Trip Completion Events', lob:'Ridesharing', health:'green', slaTarget:'99.9%', slaActual:'99.94%', freshness:'4 min ago', quality:98,
    owningTeam:'Rides Platform Engineering', description:'Ingests the full trip lifecycle from reservation through completion and receipt.' },
  { id:'p2', name:'Marketing Attribution', lob:'Eats', health:'amber', slaTarget:'99.5%', slaActual:'97.1%', freshness:'22 min ago', quality:84,
    owningTeam:'Eats Growth Engineering', description:'Processes ad touches and campaign conversions for marketing measurement.' },
  { id:'p3', name:'Surge Pricing Events', lob:'Ridesharing', health:'green', slaTarget:'99.9%', slaActual:'99.97%', freshness:'2 min ago', quality:99,
    owningTeam:'Pricing Engineering', description:'Streams surge zone activation, multiplier, and expiry events used for dynamic pricing analysis.' },
  { id:'p4', name:'Eats Order Completion', lob:'Eats', health:'green', slaTarget:'99.5%', slaActual:'99.8%', freshness:'6 min ago', quality:95,
    owningTeam:'Eats Checkout Engineering', description:'Tracks the full Eats checkout funnel from start through order placement or error.' },
  { id:'p5', name:'B2B Freight Transactions', lob:'B2B', health:'green', slaTarget:'99.0%', slaActual:'99.4%', freshness:'12 min ago', quality:91,
    owningTeam:'Freight Engineering', description:'Processes freight shipment requests, confirmations, and deliveries for enterprise billing and reporting.' },
  { id:'p6', name:'Driver Supply Events', lob:'Ridesharing', health:'red', slaTarget:'99.9%', slaActual:'94.2%', freshness:'3 hrs ago', quality:61,
    owningTeam:'Rides Platform Engineering', description:'Streams real-time driver availability signals used for supply/demand balancing. Currently degraded.' },
  { id:'p7', name:'Session & Auth Events', lob:'Platform', health:'green', slaTarget:'99.9%', slaActual:'99.95%', freshness:'1 min ago', quality:97,
    owningTeam:'Web Infrastructure', description:'Ingests session start, logout, timeout, and login-failure events across all web surfaces.' },
  { id:'p8', name:'Payments & Refunds', lob:'Platform', health:'amber', slaTarget:'99.5%', slaActual:'98.0%', freshness:'18 min ago', quality:88,
    owningTeam:'Payments Engineering', description:'Processes payment captures, failures, refunds, and discounts across Mobility, Eats, and B2B.' },
  { id:'p9', name:'Eats Delivery Tracking', lob:'Eats', health:'green', slaTarget:'99.0%', slaActual:'99.3%', freshness:'5 min ago', quality:93,
    owningTeam:'Eats Logistics Engineering', description:'Streams real-time delivery tracking and courier handoff events for in-progress Eats orders.' },
  { id:'p10', name:'Fare Estimate Requests', lob:'Ridesharing', health:'green', slaTarget:'99.5%', slaActual:'99.7%', freshness:'3 min ago', quality:96,
    owningTeam:'Pricing Engineering', description:'Streams fare preview, expiry, and price-lock events generated before a rider books a trip.' },
  { id:'p11', name:'ETA & Routing Events', lob:'Ridesharing', health:'amber', slaTarget:'99.5%', slaActual:'97.8%', freshness:'15 min ago', quality:85,
    owningTeam:'Rides Platform Engineering', description:'Processes live ETA calculation and route recalculation events used for dispatch and rider display.' },
  { id:'p12', name:'Rider Ratings & Feedback', lob:'Ridesharing', health:'green', slaTarget:'99.0%', slaActual:'99.3%', freshness:'8 min ago', quality:92,
    owningTeam:'Rides Growth Engineering', description:'Ingests post-trip ratings, feedback comments, and low-rating review flags.' },
  { id:'p13', name:'Ride Cancellation Events', lob:'Ridesharing', health:'green', slaTarget:'99.5%', slaActual:'99.6%', freshness:'4 min ago', quality:95,
    owningTeam:'Rides Platform Engineering', description:'Streams trip cancellations by reason and initiator for cancellation-rate monitoring.' },
  { id:'p14', name:'Restaurant Menu Views', lob:'Eats', health:'green', slaTarget:'99.5%', slaActual:'99.8%', freshness:'2 min ago', quality:97,
    owningTeam:'Eats Discovery Engineering', description:'Ingests menu views, search clicks, and filter events — the top of the Eats browsing funnel.' },
  { id:'p15', name:'Restaurant Rating Events', lob:'Eats', health:'green', slaTarget:'99.0%', slaActual:'99.2%', freshness:'10 min ago', quality:90,
    owningTeam:'Eats Growth Engineering', description:'Processes restaurant rating submissions, photo attachments, and flagged reviews.' },
  { id:'p16', name:'Cart Abandonment Events', lob:'Eats', health:'amber', slaTarget:'99.0%', slaActual:'96.5%', freshness:'25 min ago', quality:79,
    owningTeam:'Eats Checkout Engineering', description:'Streams cart abandonment, recovery-email, and cart-recovery events.' },
  { id:'p17', name:'Eats Refund Events', lob:'Eats', health:'green', slaTarget:'99.5%', slaActual:'99.6%', freshness:'9 min ago', quality:94,
    owningTeam:'Payments Engineering', description:'Processes refund requests, issuances, and disputes for Eats orders.' },
  { id:'p18', name:'B2B Invoice Generation', lob:'B2B', health:'green', slaTarget:'99.0%', slaActual:'99.1%', freshness:'20 min ago', quality:90,
    owningTeam:'B2B Finance Engineering', description:'Streams invoice generation, payment, and dispute events for enterprise billing reconciliation.' },
  { id:'p19', name:'Uber for Business Trip Bookings', lob:'B2B', health:'green', slaTarget:'99.0%', slaActual:'99.3%', freshness:'11 min ago', quality:93,
    owningTeam:'Uber for Business Engineering', description:'Processes enterprise-managed trip bookings, policy-violation flags, and expensing events.' },
  { id:'p20', name:'B2B Expense Report Submissions', lob:'B2B', health:'amber', slaTarget:'98.5%', slaActual:'96.0%', freshness:'35 min ago', quality:80,
    owningTeam:'B2B Finance Engineering', description:'Ingests expense report submission, approval, and rejection events from the newly launched workflow.' },
  { id:'p21', name:'Freight Carrier Bidding Events', lob:'B2B', health:'green', slaTarget:'98.5%', slaActual:'98.7%', freshness:'19 min ago', quality:88,
    owningTeam:'Freight Engineering', description:'Streams carrier bid submission, acceptance, and withdrawal events from the marketplace pilot.' },
  { id:'p23', name:'Push Notification Delivery', lob:'Platform', health:'amber', slaTarget:'99.5%', slaActual:'97.9%', freshness:'14 min ago', quality:86,
    owningTeam:'Growth Engineering', description:'Processes notification delivery, failure, and open events for engagement measurement.' },
  { id:'p24', name:'Search & Autocomplete Events', lob:'Platform', health:'green', slaTarget:'99.5%', slaActual:'99.6%', freshness:'3 min ago', quality:94,
    owningTeam:'Web Infrastructure', description:'Streams search queries, autocomplete suggestions shown, and zero-result events.' },
  { id:'p25', name:'App Crash & Error Events', lob:'Platform', health:'red', slaTarget:'99.9%', slaActual:'91.5%', freshness:'2 hrs ago', quality:58,
    owningTeam:'Reliability Engineering', description:'Ingests client error, crash, and recovery events. Currently degraded.' }
];

