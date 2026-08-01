/**
 * METRICS_BASE — the top-level KPI tiles shown on the Home screen.
 *
 * @typedef {Object} VerticalBreakdownEntry
 * @property {string} label  Vertical name (e.g. 'Food delivery').
 * @property {number} value  Trailing-7-day volume in millions for this vertical.
 * @property {number} pct    Share of the tile's total, 0-100.
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
 * @property {VerticalBreakdownEntry[]} [verticalBreakdown]  Optional sub-vertical split shown in the
 *                                     sidesheet, only present where a metric spans multiple verticals.
 *
 * @type {MetricTile[]}
 */
const METRICS_BASE = [
  { id:'gtv', label:'Gross Trip Value (GTV)', value:'$3.85B', delta:'+4.2% WoW', positive:true, points:[3280,3320,3380,3410,3460,3600,3720,3850], iconBg:'#DFF3E6', iconColor:'#067A3E',
    tooltip:'Total value of completed trips, deliveries, and B2B/Freight transactions across all lines of business in the trailing 7 days, before deductions.' },
  { id:'trips', label:'Weekly Trips', value:'196.0M', delta:'+2.8% WoW', positive:true, points:[177.0,180.2,183.2,186.2,189.2,191.6,193.8,196.0], iconBg:'#DCEBF7', iconColor:'#1D6FA5',
    tooltip:'A trip counts as completed when the rider is dropped off at the confirmed destination and payment is captured successfully, sourced from the completed_trip event.', sourceEventId:'completed_trip' },
  { id:'eats', label:'Eats Deliveries', value:'35.0M', delta:'+6.1% WoW', positive:true, points:[30.2,31.2,32.1,32.8,33.5,34.0,34.5,35.0], iconBg:'#FBE8D8', iconColor:'#B45F06',
    tooltip:'An Eats delivery counts as completed when the order — restaurant food, grocery, or another Eats vertical — is successfully submitted and confirmed by the fulfilling merchant or store, sourced from the eats_order_placed event.', sourceEventId:'eats_order_placed',
    verticalBreakdown:[{label:'Food delivery', value:25.1, pct:71.7}, {label:'Grocery', value:6.7, pct:19.1}, {label:'Other Eats verticals', value:3.2, pct:9.1}] },
  { id:'b2b', label:'B2B Transactions', value:'3.42M', delta:'-1.3% WoW', positive:false, points:[3.6,3.58,3.55,3.5,3.48,3.45,3.43,3.42], iconBg:'#EDE3F7', iconColor:'#6B3FA0',
    tooltip:'Confirmed B2B/Freight shipment transactions in the trailing 7 days, sourced from the b2b_shipment_confirmed event.', sourceEventId:'b2b_shipment_confirmed' }
];

