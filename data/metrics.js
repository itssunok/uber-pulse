/**
 * METRICS_BASE — the top-level KPI tiles shown on the Home screen (filtered to `featuredOnHome`)
 * and the full set browsable in the Data & Pipeline Catalog's Metrics Log tab.
 *
 * @typedef {Object} VerticalBreakdownEntry
 * @property {string} label  Vertical name (e.g. 'Food delivery').
 * @property {number} value  Trailing-7-day volume for this vertical (millions, or $M for GTV).
 * @property {number} pct    Share of the tile's total, 0-100. Only used for population-additive
 *                           metrics where segments genuinely sum to the tile's total (e.g. Trips by
 *                           vehicle tier) — see `segmentStats` for non-additive ratio/average metrics.
 *
 * @typedef {Object} WeeklyCategorySeries
 * @property {string} label     Category name — matches a VerticalBreakdownEntry.label.
 * @property {number[]} values  4 trailing weekly values, oldest to newest, ending at the value
 *                              implied by the tile's current verticalBreakdown entry for this label.
 *
 * @typedef {Object} SegmentStat
 * @property {string} label  Segment name (e.g. 'Ridesharing').
 * @property {string} value  The segment's own formatted value (e.g. '23.1%') — independent of the
 *                            other segments, does NOT sum to the tile's total. Used for ratio/average
 *                            metrics (Take Rate, Cancellation Rate, AOV) where a per-total-share
 *                            breakdown (verticalBreakdown) would misrepresent the data, since e.g.
 *                            "Ridesharing take rate + Eats take rate" isn't a meaningful sum.
 *
 * @typedef {Object} MetricChangelogEntry
 * @property {string} version  Version label (e.g. 'v2.0').
 * @property {string} date     ISO date string (YYYY-MM-DD).
 * @property {string} change   Short description of what changed in this version.
 *
 * @typedef {Object} MetricTile
 * @property {string} id           Stable id, e.g. 'gtv'.
 * @property {string} label        KPI display name.
 * @property {string} value        Formatted current value (e.g. '$3.85B').
 * @property {string} delta        Formatted week-over-week change (e.g. '+4.2% WoW').
 * @property {boolean} positive    Whether the delta should render as a status-positive (green) change.
 * @property {number[]} points     Trailing 8-point sparkline series (oldest to newest), fed to sparkPoints().
 * @property {string} iconBg       Hex color for the KPI's circular icon-badge background (pastel).
 * @property {string} iconColor    Hex color for the KPI's icon glyph/text.
 * @property {string} tooltip      Definition text shown in the KPI's info tooltip and sidesheet.
 * @property {boolean} [featuredOnHome]  Whether this tile shows in the Home screen's curated KPI strip.
 *                                     All metrics are always browsable in the Metrics Log catalog tab
 *                                     regardless of this flag — it only controls Home's curated subset,
 *                                     so Home doesn't dilute into a second events log as more metrics
 *                                     are added over time.
 * @property {string} [sourceEventId]  Foreign key into CATALOG[].id — the event this metric is sourced
 *                                     from, linked from the sidesheet. Omitted for composite/derived
 *                                     metrics that aren't backed by a single raw event.
 * @property {string[]} [compositeSourceMetricIds]  For metrics with no sourceEventId that are genuinely
 *                                     derived across multiple lines of business (e.g. GTV, Take Rate,
 *                                     MAPCs, Frequency) — ids into this same array, used only to inherit
 *                                     a pipeline-health rollup for the sidesheet's health section. Omitted
 *                                     for metrics with no well-defined underlying pipeline (e.g. Uber One
 *                                     Members, Active Drivers & Couriers) — those simply show no health
 *                                     section rather than a fabricated one.
 * @property {string} implementingTeam  Engineering team that produces the underlying data for this metric.
 * @property {string} definitionOwner   Person/team who owns the metric definition's accuracy.
 * @property {string[]} downstreamConsumers  Teams or dashboards that depend on this metric.
 * @property {VerticalBreakdownEntry[]} [verticalBreakdown]  Sub-vertical/category split for the trailing
 *                                     7 days. Only present for population-additive metrics.
 * @property {WeeklyCategorySeries[]} [weeklyByCategory]  4-week trailing series per category in
 *                                     verticalBreakdown, derived from this tile's own `points` sparkline
 *                                     distributed by category share, not independently fabricated. Only
 *                                     present alongside verticalBreakdown.
 * @property {SegmentStat[]} [segmentStats]  Per-segment independent values for non-additive ratio/average
 *                                     metrics. Mutually exclusive with verticalBreakdown/weeklyByCategory.
 * @property {MetricChangelogEntry[]} changelog  Version history of the metric's own definition/scope, oldest
 *                                     listed first — distinct from sourceEventId's own changelog, since a
 *                                     metric's calculation can change independent of the raw event.
 *
 * @type {MetricTile[]}
 */
const METRICS_BASE = [
  { id:'gtv', label:'Gross Trip Value (GTV)', value:'$3.85B', delta:'+4.2% WoW', positive:true, points:[3280,3320,3380,3410,3460,3600,3720,3850], iconBg:'#DFF3E6', iconColor:'#067A3E', featuredOnHome:true,
    tooltip:'Total value of completed trips, deliveries, and B2B/Freight transactions across all lines of business in the trailing 7 days, before deductions.',
    compositeSourceMetricIds:['trips','eats','b2b'],
    implementingTeam:'Web Data Engineering', definitionOwner:'Finance Reconciliation', downstreamConsumers:['Executive Dashboards', 'Finance Reconciliation'],
    verticalBreakdown:[{label:'Ridesharing', value:2118, pct:55.0}, {label:'Eats', value:1348, pct:35.0}, {label:'B2B/Freight', value:385, pct:10.0}],
    weeklyByCategory:[
      {label:'Ridesharing', values:[1903, 1980, 2046, 2118]},
      {label:'Eats', values:[1211, 1260, 1302, 1348]},
      {label:'B2B/Freight', values:[346, 360, 372, 385]}],
    changelog:[
      {version:'v1.0', date:'2025-09-01', change:'Initial release, aggregating Ridesharing and Eats gross trip/order value.'},
      {version:'v2.0', date:'2026-03-15', change:'Added B2B/Freight transactions into the GTV calculation to reflect full platform value.'}] },
  { id:'trips', label:'Weekly Trips', value:'196.0M', delta:'+2.8% WoW', positive:true, points:[177.0,180.2,183.2,186.2,189.2,191.6,193.8,196.0], iconBg:'#DCEBF7', iconColor:'#1D6FA5', featuredOnHome:true,
    tooltip:'A trip counts as completed when the rider is dropped off at the confirmed destination and payment is captured successfully, sourced from the completed_trip event.', sourceEventId:'completed_trip',
    implementingTeam:'Rides Platform Engineering', definitionOwner:'Maya Chen (Data Science)', downstreamConsumers:['Finance Reconciliation', 'Rides Growth Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'UberX', value:133.3, pct:68.0}, {label:'Comfort', value:33.3, pct:17.0}, {label:'Black', value:17.6, pct:9.0}, {label:'Pool/Share', value:11.8, pct:6.0}],
    weeklyByCategory:[
      {label:'UberX', values:[128.7, 130.3, 131.8, 133.3]},
      {label:'Comfort', values:[32.2, 32.6, 32.9, 33.3]},
      {label:'Black', values:[17.0, 17.2, 17.4, 17.6]},
      {label:'Pool/Share', values:[11.4, 11.5, 11.6, 11.8]}],
    changelog:[
      {version:'v1.0', date:'2025-09-01', change:'Initial release, counting all completed_trip events.'},
      {version:'v1.1', date:'2026-05-20', change:'Aligned trip completion with payment-capture confirmation, matching the completed_trip pipeline update.'}] },
  { id:'eats', label:'Eats Deliveries', value:'35.0M', delta:'+6.1% WoW', positive:true, points:[30.2,31.2,32.1,32.8,33.5,34.0,34.5,35.0], iconBg:'#FBE8D8', iconColor:'#B45F06', featuredOnHome:true,
    tooltip:'An Eats delivery counts as completed when the order — restaurant food, grocery, or another Eats vertical — is successfully submitted and confirmed by the fulfilling merchant or store, sourced from the eats_order_placed event.', sourceEventId:'eats_order_placed',
    implementingTeam:'Eats Checkout Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Finance Reconciliation', 'Eats Growth Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'Food delivery', value:25.1, pct:71.7}, {label:'Grocery', value:6.7, pct:19.1}, {label:'Other Eats verticals', value:3.2, pct:9.1}],
    weeklyByCategory:[
      {label:'Food delivery', values:[24.0, 24.4, 24.7, 25.1]},
      {label:'Grocery', values:[6.4, 6.5, 6.6, 6.7]},
      {label:'Other Eats verticals', values:[3.0, 3.1, 3.1, 3.2]}],
    changelog:[
      {version:'v1.0', date:'2025-09-01', change:'Initial release, counting restaurant food orders only.'},
      {version:'v1.1', date:'2026-07-30', change:'Corrected scope to include grocery and other Eats verticals, matching the eats_order_placed v1.7 definition update.'}] },
  { id:'b2b', label:'B2B Transactions', value:'3.42M', delta:'-1.3% WoW', positive:false, points:[3.6,3.58,3.55,3.5,3.48,3.45,3.43,3.42], iconBg:'#EDE3F7', iconColor:'#6B3FA0', featuredOnHome:true,
    tooltip:'Confirmed B2B/Freight shipment transactions in the trailing 7 days, sourced from the b2b_shipment_confirmed event.', sourceEventId:'b2b_shipment_confirmed',
    implementingTeam:'Freight Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['B2B Finance Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'Business Travel', value:1.881, pct:55.0}, {label:'Uber Central', value:1.026, pct:30.0}, {label:'Freight', value:0.513, pct:15.0}],
    weeklyByCategory:[
      {label:'Business Travel', values:[1.914, 1.898, 1.887, 1.881]},
      {label:'Uber Central', values:[1.044, 1.035, 1.029, 1.026]},
      {label:'Freight', values:[0.522, 0.518, 0.515, 0.513]}],
    changelog:[
      {version:'v1.0', date:'2025-09-01', change:'Initial release, counting confirmed freight shipments only.'},
      {version:'v1.2', date:'2026-05-22', change:'Aligned counting logic with the b2b_shipment_confirmed v1.2 definition update.'}] },
  { id:'mapc', label:'Monthly Active Platform Consumers (MAPCs)', value:'171.0M', delta:'+3.1% MoM', positive:true, points:[158.2,160.5,162.8,164.9,166.8,168.5,169.9,171.0], iconBg:'#D6F0EC', iconColor:'#0B7A6D', featuredOnHome:true,
    tooltip:'Unique consumers — riders, eaters, and business accounts — who completed at least one trip, order, or shipment in the trailing 30 days, counted once even if they used multiple lines of business. Reported monthly rather than weekly like the other tiles above, since a 7-day window undercounts less-frequent users.',
    compositeSourceMetricIds:['trips','eats','b2b'],
    implementingTeam:'Web Data Engineering', definitionOwner:'Growth Analytics', downstreamConsumers:['Executive Dashboards', 'Growth Analytics', 'Finance Reconciliation'],
    verticalBreakdown:[{label:'New MAPCs', value:18.5, pct:10.8}, {label:'Existing MAPCs', value:152.5, pct:89.2}],
    weeklyByCategory:[
      {label:'New MAPCs', values:[16.7, 17.3, 17.9, 18.5]},
      {label:'Existing MAPCs', values:[147.9, 149.6, 150.9, 152.5]}],
    changelog:[
      {version:'v1.0', date:'2025-11-10', change:'Initial release, deduplicating consumers across Ridesharing, Eats, and B2B in the trailing 30 days.'}] },
  { id:'take_rate', label:'Take Rate', value:'21.4%', delta:'+0.3pp WoW', positive:true, points:[20.6,20.7,20.8,20.9,21.0,21.1,21.3,21.4], iconBg:'#FCEFD2', iconColor:'#A9660A', featuredOnHome:false,
    tooltip:'Revenue as a percentage of Gross Trip Value (GTV) in the trailing 7 days — the share of platform transaction value retained as revenue after paying out drivers, couriers, and merchants.',
    compositeSourceMetricIds:['trips','eats','b2b'],
    implementingTeam:'Finance Data Engineering', definitionOwner:'Finance Reconciliation', downstreamConsumers:['Executive Dashboards', 'Finance Reconciliation'],
    segmentStats:[{label:'Ridesharing', value:'23.1%'}, {label:'Eats', value:'18.6%'}, {label:'B2B/Freight', value:'15.2%'}],
    changelog:[
      {version:'v1.0', date:'2025-12-01', change:'Initial release, computed as Revenue ÷ GTV across all lines of business.'}] },
  { id:'cancellation_rate', label:'Trip Cancellation Rate', value:'4.8%', delta:'-0.2pp WoW', positive:true, points:[5.6,5.5,5.4,5.3,5.1,5.0,4.9,4.8], iconBg:'#FBE3E0', iconColor:'#A93327', featuredOnHome:false,
    tooltip:'Share of Ridesharing trip requests cancelled by either the rider or the driver before completion, in the trailing 7 days.', sourceEventId:'completed_trip',
    implementingTeam:'Rides Platform Engineering', definitionOwner:'Rides Analytics', downstreamConsumers:['Rides Growth Engineering', 'Executive Dashboards'],
    segmentStats:[{label:'Rider-initiated', value:'3.1%'}, {label:'Driver-initiated', value:'1.7%'}],
    changelog:[
      {version:'v1.0', date:'2026-01-15', change:'Initial release, tracking cancellations by initiator for Ridesharing trip requests.'}] },
  { id:'on_time_pickup_rate', label:'On-Time Pickup Rate', value:'91.6%', delta:'+0.4pp WoW', positive:true, points:[90.1,90.4,90.7,91.0,91.2,91.3,91.5,91.6], iconBg:'#E6E9FB', iconColor:'#3E4FA6', featuredOnHome:false,
    tooltip:'Share of Ridesharing trips where the driver arrived at pickup within the ETA window shown to the rider, in the trailing 7 days.', sourceEventId:'completed_trip',
    implementingTeam:'Rides Platform Engineering', definitionOwner:'Rides Analytics', downstreamConsumers:['Rides Growth Engineering', 'Executive Dashboards'],
    segmentStats:[{label:'UberX', value:'92.4%'}, {label:'Comfort', value:'90.8%'}, {label:'Black', value:'93.1%'}, {label:'Pool/Share', value:'86.9%'}],
    changelog:[
      {version:'v1.0', date:'2026-01-15', change:'Initial release, measured against the rider-facing ETA window at request time.'}] },
  { id:'frequency', label:'Frequency (Trips per MAPC)', value:'5.2 / mo', delta:'+1.9% MoM', positive:true, points:[4.9,4.95,5.0,5.05,5.1,5.13,5.17,5.2], iconBg:'#FBE6F0', iconColor:'#A3316F', featuredOnHome:false,
    tooltip:'Average number of trips and orders per Monthly Active Platform Consumer in the trailing 30 days — a measure of usage depth, independent of platform growth.',
    compositeSourceMetricIds:['trips','eats','b2b'],
    implementingTeam:'Web Data Engineering', definitionOwner:'Growth Analytics', downstreamConsumers:['Growth Analytics', 'Executive Dashboards'],
    segmentStats:[{label:'Ridesharing', value:'3.1 trips/mo'}, {label:'Eats', value:'2.6 orders/mo'}],
    changelog:[
      {version:'v1.0', date:'2025-11-10', change:'Initial release, computed as Trips ÷ MAPCs across the trailing 30 days.'}] },
  { id:'uber_one_members', label:'Uber One Members', value:'30.2M', delta:'+5.4% WoW', positive:true, points:[26.8,27.4,28.0,28.6,29.1,29.6,29.9,30.2], iconBg:'#E1ECF7', iconColor:'#35618F', featuredOnHome:false,
    tooltip:'Active Uber One subscription members in the trailing 7 days, across Ridesharing and Eats membership benefits.',
    implementingTeam:'Membership Engineering', definitionOwner:'Membership Analytics', downstreamConsumers:['Executive Dashboards', 'Growth Analytics'],
    verticalBreakdown:[{label:'New members', value:1.6, pct:5.3}, {label:'Renewing members', value:28.6, pct:94.7}],
    weeklyByCategory:[
      {label:'New members', values:[1.3, 1.4, 1.5, 1.6]},
      {label:'Renewing members', values:[25.5, 26.6, 27.6, 28.6]}],
    changelog:[
      {version:'v1.0', date:'2026-02-01', change:'Initial release, counting active subscriptions with a successful billing cycle in the trailing 7 days.'}] },
  { id:'active_drivers_couriers', label:'Active Drivers & Couriers', value:'7.85M', delta:'+2.6% WoW', positive:true, points:[7.42,7.52,7.61,7.68,7.74,7.79,7.82,7.85], iconBg:'#E7EAF0', iconColor:'#3D4B63', featuredOnHome:false,
    tooltip:'Unique drivers and couriers who completed at least one trip or delivery in the trailing 7 days. Rides drivers and Eats couriers are reported separately below; the small population that does both is not de-duplicated between them, a known simplification.',
    implementingTeam:'Driver Platform Engineering', definitionOwner:'Driver Analytics', downstreamConsumers:['Driver Growth Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'Rides drivers', value:4.35, pct:55.4}, {label:'Eats couriers', value:3.50, pct:44.6}],
    weeklyByCategory:[
      {label:'Rides drivers', values:[4.29, 4.32, 4.33, 4.35]},
      {label:'Eats couriers', values:[3.45, 3.47, 3.49, 3.50]}],
    changelog:[
      {version:'v1.0', date:'2026-02-15', change:'Initial release, counting unique drivers and couriers with at least one completed trip or delivery.'}] },
  { id:'aov_eats', label:'Average Order Value (Eats)', value:'$27.40', delta:'+1.1% WoW', positive:true, points:[26.9,27.0,27.05,27.1,27.2,27.25,27.3,27.4], iconBg:'#F3ECD9', iconColor:'#7A5C1E', featuredOnHome:false,
    tooltip:'Average order subtotal across all Eats orders — food delivery and grocery — in the trailing 7 days, before fees and tips.', sourceEventId:'eats_order_placed',
    implementingTeam:'Eats Checkout Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Eats Growth Engineering', 'Executive Dashboards'],
    segmentStats:[{label:'Food delivery', value:'$24.80'}, {label:'Grocery', value:'$41.20'}],
    changelog:[
      {version:'v1.0', date:'2026-03-01', change:'Initial release, computed as order subtotal before fees, tips, and taxes.'}] }
];
