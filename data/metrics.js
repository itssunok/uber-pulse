/**
 * METRICS_BASE — the top-level KPI tiles shown on the Home screen.
 *
 * @typedef {Object} VerticalBreakdownEntry
 * @property {string} label  Vertical name (e.g. 'Food delivery').
 * @property {number} value  Trailing-7-day volume for this vertical (millions, or $M for GTV).
 * @property {number} pct    Share of the tile's total, 0-100.
 *
 * @typedef {Object} WeeklyCategorySeries
 * @property {string} label     Category name — matches a VerticalBreakdownEntry.label.
 * @property {number[]} values  4 trailing weekly values, oldest to newest, ending at the value
 *                              implied by the tile's current verticalBreakdown entry for this label.
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
 * @property {string} [sourceEventId]  Foreign key into CATALOG[].id — the event this metric is sourced
 *                                     from, linked from the sidesheet. Omitted for composite metrics (GTV).
 * @property {string} implementingTeam  Engineering team that produces the underlying data for this metric.
 * @property {string} definitionOwner   Person/team who owns the metric definition's accuracy.
 * @property {string[]} downstreamConsumers  Teams or dashboards that depend on this metric.
 * @property {VerticalBreakdownEntry[]} verticalBreakdown  Sub-vertical/category split for the trailing 7 days.
 * @property {WeeklyCategorySeries[]} weeklyByCategory  4-week trailing series per category in verticalBreakdown,
 *                                     derived from this tile's own `points` sparkline distributed by category
 *                                     share, not independently fabricated.
 *
 * @type {MetricTile[]}
 */
const METRICS_BASE = [
  { id:'gtv', label:'Gross Trip Value (GTV)', value:'$3.85B', delta:'+4.2% WoW', positive:true, points:[3280,3320,3380,3410,3460,3600,3720,3850], iconBg:'#DFF3E6', iconColor:'#067A3E',
    tooltip:'Total value of completed trips, deliveries, and B2B/Freight transactions across all lines of business in the trailing 7 days, before deductions.',
    implementingTeam:'Web Data Engineering', definitionOwner:'Finance Reconciliation', downstreamConsumers:['Executive Dashboards', 'Finance Reconciliation'],
    verticalBreakdown:[{label:'Ridesharing', value:2118, pct:55.0}, {label:'Eats', value:1348, pct:35.0}, {label:'B2B/Freight', value:385, pct:10.0}],
    weeklyByCategory:[
      {label:'Ridesharing', values:[1903, 1980, 2046, 2118]},
      {label:'Eats', values:[1211, 1260, 1302, 1348]},
      {label:'B2B/Freight', values:[346, 360, 372, 385]}] },
  { id:'trips', label:'Weekly Trips', value:'196.0M', delta:'+2.8% WoW', positive:true, points:[177.0,180.2,183.2,186.2,189.2,191.6,193.8,196.0], iconBg:'#DCEBF7', iconColor:'#1D6FA5',
    tooltip:'A trip counts as completed when the rider is dropped off at the confirmed destination and payment is captured successfully, sourced from the completed_trip event.', sourceEventId:'completed_trip',
    implementingTeam:'Rides Platform Engineering', definitionOwner:'Maya Chen (Data Science)', downstreamConsumers:['Finance Reconciliation', 'Rides Growth Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'UberX', value:133.3, pct:68.0}, {label:'Comfort', value:33.3, pct:17.0}, {label:'Black', value:17.6, pct:9.0}, {label:'Pool/Share', value:11.8, pct:6.0}],
    weeklyByCategory:[
      {label:'UberX', values:[128.7, 130.3, 131.8, 133.3]},
      {label:'Comfort', values:[32.2, 32.6, 32.9, 33.3]},
      {label:'Black', values:[17.0, 17.2, 17.4, 17.6]},
      {label:'Pool/Share', values:[11.4, 11.5, 11.6, 11.8]}] },
  { id:'eats', label:'Eats Deliveries', value:'35.0M', delta:'+6.1% WoW', positive:true, points:[30.2,31.2,32.1,32.8,33.5,34.0,34.5,35.0], iconBg:'#FBE8D8', iconColor:'#B45F06',
    tooltip:'An Eats delivery counts as completed when the order — restaurant food, grocery, or another Eats vertical — is successfully submitted and confirmed by the fulfilling merchant or store, sourced from the eats_order_placed event.', sourceEventId:'eats_order_placed',
    implementingTeam:'Eats Checkout Engineering', definitionOwner:'Eats Analytics', downstreamConsumers:['Finance Reconciliation', 'Eats Growth Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'Food delivery', value:25.1, pct:71.7}, {label:'Grocery', value:6.7, pct:19.1}, {label:'Other Eats verticals', value:3.2, pct:9.1}],
    weeklyByCategory:[
      {label:'Food delivery', values:[24.0, 24.4, 24.7, 25.1]},
      {label:'Grocery', values:[6.4, 6.5, 6.6, 6.7]},
      {label:'Other Eats verticals', values:[3.0, 3.1, 3.1, 3.2]}] },
  { id:'b2b', label:'B2B Transactions', value:'3.42M', delta:'-1.3% WoW', positive:false, points:[3.6,3.58,3.55,3.5,3.48,3.45,3.43,3.42], iconBg:'#EDE3F7', iconColor:'#6B3FA0',
    tooltip:'Confirmed B2B/Freight shipment transactions in the trailing 7 days, sourced from the b2b_shipment_confirmed event.', sourceEventId:'b2b_shipment_confirmed',
    implementingTeam:'Freight Engineering', definitionOwner:'B2B Analytics', downstreamConsumers:['B2B Finance Engineering', 'Executive Dashboards'],
    verticalBreakdown:[{label:'Business Travel', value:1.881, pct:55.0}, {label:'Uber Central', value:1.026, pct:30.0}, {label:'Freight', value:0.513, pct:15.0}],
    weeklyByCategory:[
      {label:'Business Travel', values:[1.914, 1.898, 1.887, 1.881]},
      {label:'Uber Central', values:[1.044, 1.035, 1.029, 1.026]},
      {label:'Freight', values:[0.522, 0.518, 0.515, 0.513]}] }
];

