/**
 * ROADMAP_BASE — seed data for the Roadmap screen, grouped by stage column.
 * Keys map to UI columns via roadmapStageChipStyle()/roadmapTypeChipStyle():
 *   defining -> 'Currently Being Defined', next -> 'Coming Next', shipped -> 'Recently Shipped'
 * ('Newly Submitted' is a 4th UI stage populated at runtime from user-submitted items, not seeded here.)
 *
 * @typedef {Object} RoadmapStatusHistoryEntry
 * @property {string} stage  Short label for a status the item passed through (e.g. 'Proposed').
 * @property {string} date   Display date string (e.g. 'Jul 14').
 *
 * @typedef {Object} RoadmapComment
 * @property {string} author  Comment author, typically 'Name (Team)'.
 * @property {string} date    Display date string.
 * @property {string} text    Comment body.
 *
 * @typedef {Object} RoadmapDoc
 * @property {string} label  Document title shown as a link.
 * @property {'PRD'|'Doc'|'Notes'} type  Document type badge.
 *
 * @typedef {Object} RoadmapItem
 * @property {string} id                     Stable id, e.g. 'r1'.
 * @property {string} name                   Item title.
 * @property {'data'|'pipeline'} type         Whether this is a new/changed data point or a pipeline change.
 * @property {string} [pipelineId]            Present when type === 'pipeline' — FK into PIPELINES[].id.
 * @property {'Ridesharing'|'Eats'|'B2B'|'Platform'} lob  Line of business, keys into LOB_COLORS.
 * @property {string} team                   Owning engineering team.
 * @property {string} owner                  Individual owner's name.
 * @property {string} dateLabel              Display date/ETA string (e.g. 'Est. Aug 22', 'Shipped Jul 20').
 * @property {'P0'|'P1'|'P2'|null} priority   Priority; null once shipped (priority no longer relevant).
 * @property {string} ticketId               Mock Jira-style ticket id (e.g. 'DATA-482').
 * @property {string} description            Longer description of the roadmap item and its motivation.
 * @property {RoadmapStatusHistoryEntry[]} statusHistory  Ordered history of stages the item has moved through.
 * @property {RoadmapComment[]} comments     Discussion thread shown in the item's detail view.
 * @property {RoadmapDoc[]} docs             Linked reference documents shown in the item's detail view.
 *
 * @typedef {Object} RoadmapBase
 * @property {RoadmapItem[]} defining  Items in the 'Currently Being Defined' column.
 * @property {RoadmapItem[]} next      Items in the 'Coming Next' column.
 * @property {RoadmapItem[]} shipped   Items in the 'Recently Shipped' column.
 *
 * @type {RoadmapBase}
 */
const ROADMAP_BASE = {
  defining:[
    { id:'r1', name:'b2b_bulk_shipment_event', type:'data', lob:'B2B', team:'Freight Engineering', owner:'Priya Nair', dateLabel:'Est. Aug 22', priority:'P1', ticketId:'DATA-482',
      description:'New event to capture bulk/multi-shipment freight bookings in a single transaction, replacing the current one-event-per-shipment model that undercounts enterprise freight volume.',
      statusHistory:[{stage:'Proposed',date:'Jul 14'},{stage:'Under review',date:'Jul 22'},{stage:'In definition',date:'Aug 1'}],
      comments:[
        {author:'Priya Nair (Freight Eng)',date:'Jul 24',text:'Confirmed the payload needs a shipment_count field — single-shipment bookings will just set it to 1.'},
        {author:'Alex (Web Data PM)',date:'Jul 29',text:'Aligned with Finance on billing implications; moving to definition this week.'}
      ],
      docs:[{label:'PRD — Bulk Freight Booking',type:'PRD'},{label:'Data model brainstorm doc',type:'Doc'},{label:'Freight billing sync notes',type:'Notes'}] },
    { id:'r6', name:'Payments & Refunds pipeline SLA fix', type:'pipeline', pipelineId:'p8', lob:'Platform', team:'Payments Engineering', owner:'Diego Alvarez', dateLabel:'Est. Aug 18', priority:'P1', ticketId:'DATA-455',
      description:'Root-causing the SLA slip on the Payments & Refunds pipeline (98.0% actual vs. 99.5% target) — refund events are batching under load during peak Eats hours.',
      statusHistory:[{stage:'Proposed',date:'Jul 10'},{stage:'Root cause identified',date:'Jul 26'},{stage:'Fix in progress',date:'Aug 2'}],
      comments:[{author:'Diego Alvarez (Payments Eng)',date:'Jul 26',text:'Batching kicks in above 40k refund events/min — raising the batch threshold should clear it.'}],
      docs:[{label:'Payments pipeline incident notes',type:'Notes'},{label:'SLA remediation runbook',type:'Notes'}] }
  ],
  next:[
    { id:'r2', name:'eats_group_order_conversion', type:'data', lob:'Eats', team:'Eats Growth', owner:'Jordan Lee', dateLabel:'Est. Sep 5', priority:'P2', ticketId:'DATA-511',
      description:"Tracks conversion rate from a group order invite to a completed group checkout — currently invisible since group orders emit the same event as solo orders.",
      statusHistory:[{stage:'Proposed',date:'Jul 18'},{stage:'Prioritized for Sep',date:'Jul 30'}],
      comments:[{author:'Jordan Lee (Eats Growth)',date:'Jul 25',text:'Group orders are up 40% QoQ — need this before the September push.'}],
      docs:[{label:'Group Ordering brainstorm doc',type:'Doc'},{label:'Growth metrics PRD',type:'PRD'}] },
    { id:'r3', name:'driver_supply_v2 migration', type:'pipeline', pipelineId:'p6', lob:'Ridesharing', team:'Platform Engineering', owner:'Sam Osei', dateLabel:'Est. Sep 12', priority:'P0', ticketId:'DATA-397',
      description:'Migrates the Driver Supply Events pipeline off the legacy v1 schema onto v2, fixing the duplicate-event issue currently degrading it (94.2% SLA actual vs. 99.9% target).',
      statusHistory:[{stage:'Proposed',date:'Jun 30'},{stage:'Scoped',date:'Jul 15'},{stage:'Scheduled for Sep',date:'Jul 28'}],
      comments:[
        {author:'Sam Osei (Rides Platform)',date:'Jul 20',text:'v2 schema removes the race condition causing duplicate availability pings.'},
        {author:'Alex (Web Data PM)',date:'Jul 28',text:'This is the fix for the Driver Supply Events degradation — prioritizing above eats_group_order_conversion.'}
      ],
      docs:[{label:'driver_supply_v2 design doc',type:'Doc'},{label:'Migration runbook',type:'Notes'}] }
  ],
  shipped:[
    { id:'r4', name:'campaign_started_v1', type:'data', lob:'Eats', team:'Marketing Analytics', owner:'Dana Cole', dateLabel:'Shipped Jul 20', priority:null, ticketId:'DATA-402',
      description:'Replaced the deprecated attribution_touch definition with a single, consistent campaign_started event across paid social, display, and in-app placements.',
      statusHistory:[{stage:'Proposed',date:'Jun 1'},{stage:'In definition',date:'Jun 20'},{stage:'Shipped',date:'Jul 20'}],
      comments:[{author:'Dana Cole (Marketing Analytics)',date:'Jul 20',text:'Live in production — campaign_started is now the source of truth, attribution_touch is deprecated.'}],
      docs:[{label:'campaign_started_v1 PRD',type:'PRD'},{label:'Attribution deprecation notes',type:'Notes'}] },
    { id:'r5', name:'session_started_v4', type:'data', lob:'Platform', team:'Web Infrastructure', owner:'Leo Martins', dateLabel:'Shipped Jul 10', priority:null, ticketId:'DATA-388',
      description:'Consolidated session start tracking across all web surfaces into one v4 event, replacing three legacy per-surface session events.',
      statusHistory:[{stage:'Proposed',date:'May 20'},{stage:'In definition',date:'Jun 12'},{stage:'Shipped',date:'Jul 10'}],
      comments:[{author:'Leo Martins (Web Infrastructure)',date:'Jul 10',text:'session_started v4 is live across web; legacy per-surface events are now deprecated.'}],
      docs:[{label:'session_started_v4 design doc',type:'Doc'}] },
    { id:'r7', name:'Eats Delivery Tracking latency optimization', type:'pipeline', pipelineId:'p9', lob:'Eats', team:'Eats Logistics Engineering', owner:'Nina Kowalski', dateLabel:'Shipped Jul 15', priority:null, ticketId:'DATA-431',
      description:'Cut end-to-end latency on the Eats Delivery Tracking pipeline from ~9 min to under 5 min freshness by moving courier handoff events to a dedicated low-latency topic.',
      statusHistory:[{stage:'Proposed',date:'Jun 15'},{stage:'In progress',date:'Jul 1'},{stage:'Shipped',date:'Jul 15'}],
      comments:[{author:'Nina Kowalski (Eats Logistics Eng)',date:'Jul 15',text:'Freshness is holding steady around 5 min in production — closing this out.'}],
      docs:[{label:'Delivery tracking latency design doc',type:'Doc'}] }
  ]
};

