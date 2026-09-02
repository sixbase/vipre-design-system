import { useState } from 'react'
import { ChevronRight, ArrowRight, Plus, Boxes } from 'lucide-react'
import { DocPage } from '../DocPage.jsx'
import { Section, Preview, RefTable, IC } from '../primitives.jsx'
import { AreaTrend, Badge, Button, EntityTile, Icon, ProductTile, Stack, Text } from '../../components/index.js'
import { GLYPHS, CUSTOMER_TYPE } from '../templateData.js'

/* ============================================================================
   PORTED VERBATIM from the MSP shell — DashHead, BizRow and FootLink, with the
   `msp-` prefix swapped for `vds-` and nothing else changed. Every element, every
   modifier, the share-of-the-TOP-ROW meter and the flag/sub swap are the running
   component's, not a reconstruction of it: a pattern page that reimplements the
   thing it documents is a second implementation, which is the problem this page
   exists to describe.
   ========================================================================== */

/* Head: title and sub on one baseline, and the tile's one link out. The action is
   the DS Button — ghost/neutral/sm, the house's quiet action. It was a bare
   <button> carrying its own padding, radius, type size, hover fill and focus ring:
   six decisions the system had already made, made again slightly differently. */
function DashHead({ title, sub, action }) {
  return (
    <div className="vds-dash-head">
      <span className="vds-dash-head__lead">
        <span className="vds-dash-head__title">{title}</span>
        {sub && <span className="vds-dash-head__sub">{sub}</span>}
      </span>
      {action && (
        <Button
          variant="ghost" tone="neutral" size="sm"
          trailing={<Icon as={ChevronRight} size="sm" />}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

/* One row for every ranked list on the view. `share` drives the bar and is a share
   OF THE TOP ROW, not of the total — a share of the total flattens six rows into
   six identical stubs. `flag` is the optional right-hand alarm cell (days to
   renewal, invoice state) and takes the place of `sub` when present. */
function BizRow({ mark, name, share, value, sub, flag, flagTone, onClick, title, current }) {
  const cls = [
    'vds-biz-row',
    mark ? '' : (sub || flag ? 'vds-biz-row--plain' : 'vds-biz-row--tight'),
    onClick ? 'vds-biz-row--btn' : '',
    current ? 'vds-biz-row--current' : '',
  ].filter(Boolean).join(' ')
  const body = (
    <>
      {mark && <span className="vds-biz-row__tile" aria-hidden>{mark}</span>}
      <span className="vds-biz-row__name">{name}</span>
      <span className="vds-biz-row__track" aria-hidden>
        {/* A floor of 2%, so the smallest row still draws a mark rather than an
            empty track that reads as missing data. */}
        <span className="vds-biz-row__fill" style={{ width: `${Math.max(2, Math.round(share * 100))}%` }} />
      </span>
      <span className="vds-biz-row__val">{value}</span>
      {flag != null
        ? <span className={`vds-biz-row__flag${flagTone ? ` vds-biz-row__flag--${flagTone}` : ''}`}>{flag}</span>
        : sub != null && <span className="vds-biz-row__sub">{sub}</span>}
    </>
  )
  return onClick
    ? <button type="button" className={cls} onClick={onClick} title={title}>{body}</button>
    : <div className={cls} title={title}>{body}</div>
}

/* The remainder line. It names the population the list above it left out, and it is
   deliberately NOT restyled into a button: it keeps the hairline, the size and the
   subtle ink it had as text, because its job on the card hasn't changed. What it
   gains is a hover, a focus ring and an arrow that appears on approach — the
   smallest vocabulary that says "this goes somewhere" without turning a footnote
   into a call to action. */
function FootLink({ label, value, onClick }) {
  if (!onClick) {
    return (
      <div className="vds-biz-foot">
        <span>{label}</span>
        <span className="vds-biz-foot__val">{value}</span>
      </div>
    )
  }
  return (
    <button type="button" className="vds-biz-foot vds-biz-foot--btn" onClick={onClick}>
      <span>{label}</span>
      <span className="vds-biz-foot__val">
        {value}
        <Icon as={ArrowRight} size="sm" className="vds-biz-foot__go" aria-hidden />
      </span>
    </button>
  )
}

/* ---- the real rows off "Seats by product", figures included ---------------- */
const PRODUCTS = [
  { id: 'email-cloud', name: 'Email Cloud', glyph: GLYPHS.ies, seats: 3525, accounts: 53 },
  { id: 'edge-nordics', name: 'Edge Defense Nordics', glyph: GLYPHS.ies, seats: 3317, accounts: 42 },
  { id: 'atp', name: 'Advanced Threat Protection', glyph: GLYPHS.ies, seats: 3139, accounts: 47 },
  { id: 'exchange', name: 'ExchangeSMART Suite', glyph: GLYPHS.ies, seats: 3073, accounts: 45 },
  { id: 'ep-email', name: 'Endpoint+Email', glyph: GLYPHS.edr, seats: 2791, accounts: 52 },
  { id: 'edge', name: 'Edge Defense', glyph: GLYPHS.safesend, seats: 2784, accounts: 35 },
]

function SeatsByProductDemo() {
  const [picked, setPicked] = useState(null)
  const top = PRODUCTS[0].seats
  return (
    <div className="vds-tile-demo">
    <div className="vds-tile">
      <DashHead title="Seats by product" sub="Under contract" action={{ label: 'Package Insights' }} />
      <div className="vds-biz-rows vds-biz-rows--grow">
        {PRODUCTS.map((p) => (
          <BizRow
            key={p.id}
            mark={<ProductTile glyph={p.glyph} tonal size={24} />}
            name={p.name}
            share={p.seats / top}
            value={p.seats.toLocaleString()}
            sub={`${p.accounts} accts`}
            current={picked === p.id}
            onClick={() => setPicked(picked === p.id ? null : p.id)}
            title={`${p.name} — ${p.seats.toLocaleString()} seats across ${p.accounts} accounts`}
          />
        ))}
      </div>
      <FootLink label="14 other products" value="32.2K" onClick={() => {}} />
    </div>
    </div>
  )
}

/* An account's mark is its TYPE — distributor, reseller or customer — which is the
   one thing about an account that changes what a row means. A product row's mark
   says which product; an account row's says what kind of account, and a book of
   five resellers is a different book from five direct customers at the same seat
   count. The three glyphs are the same set the Customers table tags with. */
const ACCOUNTS = [
  { name: 'Sunbelt Brewing Services', seats: 299, type: 'customer' },
  { name: 'Atlas Agriculture Co', seats: 298, type: 'reseller' },
  { name: 'Metro Environmental Group', seats: 298, type: 'customer' },
  { name: 'Sunrise Automotive LLC', seats: 297, type: 'distributor' },
  { name: 'Quantum Consulting Ltd', seats: 297, type: 'reseller' },
]

/* THE TWO VOCABULARIES DO NOT AGREE, and this is the seam. The data calls the
   middle type `reseller` (so does CUSTOMER_TYPE, and so does the Customers table's
   Tag); EntityTile's colour map calls it `partner`. Mapped here rather than
   renamed on either side, because renaming one breaks every consumer of the other
   — but it is a rename worth doing once somebody owns both. */
const TILE_TYPE = { distributor: 'distributor', reseller: 'partner', customer: 'customer' }

function ConcentrationDemo() {
  const top = ACCOUNTS[0].seats
  return (
    <div className="vds-tile-demo">
    <div className="vds-tile">
      <DashHead title="Your biggest accounts" sub="Top 5 of 324" />
      {/* THE HERO, AND ITS BASELINE. "3%" is alarming or trivial depending only on
          how many accounts are in the scope: across 324 an even book already puts
          1.5% in any five, so 3% is a mild lean; across 12 accounts an even book is
          42% and the same 3% could not happen. The reader cannot do that division
          at a glance, so the card does it. */}
      <div className="vds-status-lead">
        <span className="vds-status-lead__value">3%</span>
        <span className="vds-status-lead__caption">
          of seats sit with 5 accounts
          <span className="vds-status-lead__share"> · 1.5% if the book were even</span>
        </span>
      </div>
      <div className="vds-biz-rows vds-biz-rows--grow">
        {ACCOUNTS.map((a) => (
          <BizRow key={a.name}
            mark={<EntityTile type={TILE_TYPE[a.type]} glyph={GLYPHS[a.type]} size={24} />}
            name={a.name} share={a.seats / top} value={a.seats} sub="1%"
            title={`${a.name} — ${CUSTOMER_TYPE[a.type].label}, ${a.seats} seats`} />
        ))}
      </div>
      <FootLink label="The other 319 accounts" value="49.4K" />
      <span className="vds-biz-note">
        Weighted by seats. Two accounts of the same size count the same here, whatever each pays for them.
      </span>
    </div>
    </div>
  )
}

/* ============================================================================
   THE LINE CARD — "Package insights"
   Ported from PackageLines. A wider row than BizRow: it carries three figures
   and a two-part meter, so it takes a header row, and the key lives IN that
   header's name column — directly beside the thing it explains, where a key band
   of its own would have cost a line of card height to say six words.
   ========================================================================== */
const LC_MIN_SHARE = 0.05

/* Seat utilisation on the account drawer's thresholds, so the same package reads
   the same way in both places. */
function utilTone(util) {
  if (util >= 70) return 'var(--vds-success)'
  if (util >= 40) return 'var(--vds-warning)'
  return 'var(--vds-danger)'
}

const PACKAGES = [
  { id: 'atp', name: 'Advanced Threat Protection', glyph: GLYPHS.ies, bought: 16835, util: 66, customers: 57 },
  { id: 'email-cloud', name: 'Email Cloud', glyph: GLYPHS.ies, bought: 15445, util: 66, customers: 58 },
  { id: 'exchange', name: 'ExchangeSMART', glyph: GLYPHS.ies, bought: 14353, util: 74, customers: 52 },
  { id: 'safesend-ai', name: 'SafeSend + AI', glyph: GLYPHS.safesend, bought: 14217, util: 46, customers: 48 },
  { id: 'complete-nordics', name: 'Complete Defense Nordics', glyph: GLYPHS.ies, bought: 14166, util: 57, customers: 51 },
  { id: 'ies', name: 'IES', glyph: GLYPHS.ies, bought: 14052, util: 77, customers: 51 },
  { id: 'ep-email', name: 'Endpoint+Email', glyph: GLYPHS.edr, bought: 13460, util: 85, customers: 55 },
  { id: 'exchange-suite', name: 'ExchangeSMART Suite', glyph: GLYPHS.ies, bought: 13449, util: 45, customers: 52 },
]

function PackageLinesDemo() {
  const ranked = [...PACKAGES].sort((a, b) => b.bought - a.bought)
  const top = ranked[0].bought
  return (
    <div className="vds-tile-demo vds-tile-demo--wide">
    <div className="vds-tile">
      <DashHead title="Package insights" sub="across 324 accounts" action={{ label: 'All 20' }} />
      <div className="vds-lc">
        <div className="vds-lc-row vds-lc-row--head" aria-hidden>
          {/* The mark column's cell. No heading — nothing to sort by, nothing to call
              it — but the cell is not optional: without it every heading below sits a
              mark-width left of the column it names. */}
          <span className="vds-lc-tile" />
          <span className="vds-lc-legend">
            <span className="vds-lc-legend__meter"><i /></span>
            in use, of bought
          </span>
          <span />
          <span className="vds-lc-lead">Seats bought</span>
          <span className="vds-lc-util">Seats used</span>
          <span className="vds-lc-cust">Customers</span>
          <span />
        </div>
        {ranked.map((p) => {
          const share = Math.max(LC_MIN_SHARE, p.bought / top)
          /* Clamped: a package whose accounts are collectively over licence reads
             above 100, and a bar cannot be more full than full. The figure beside
             it still says 104%. */
          const fill = Math.min(100, p.util)
          return (
            <button
              key={p.id}
              type="button"
              className="vds-lc-row vds-lc-row--btn"
              title={`${p.name} — ${p.util}% of ${p.bought.toLocaleString()} seats in use, across ${p.customers} customers`}
            >
              <ProductTile glyph={p.glyph} tonal size={20} />
              <span className="vds-lc-name">{p.name}</span>
              <span className="vds-lc-meter" aria-hidden>
                <span className={`vds-lc-meter__line${p.util > 100 ? ' is-over' : ''}`} style={{ width: `${share * 100}%` }}>
                  <span className="vds-lc-meter__use" style={{ width: `${fill}%` }} />
                </span>
              </span>
              <span className="vds-lc-num vds-lc-lead">{p.bought.toLocaleString()}</span>
              {/* Tone, not weight. The one figure here that can be BAD, on the same
                  thresholds as the drawer and the account tables. Never colour alone —
                  the % is always there. */}
              <span className="vds-lc-num vds-lc-util" style={{ color: utilTone(p.util) }}>{p.util}%</span>
              <span className="vds-lc-num vds-lc-cust">{p.customers}</span>
              <ChevronRight size={14} className="vds-lc-chev" aria-hidden />
            </button>
          )
        })}
      </div>
    </div>
    </div>
  )
}

/* ============================================================================
   THE PLAY LIST — "Where to sell next"
   Ported from SellNextCard. Not a ranking: three sentences, each with ONE number
   in it, one supporting line and one action. The card ran two section headings,
   two row shapes and a footnote to present three items, each carrying four or
   five figures; measured against the question it answers — "who do I call this
   week?" — almost none of that earned its ink.
   ========================================================================== */
const OPP_TONE = {
  warning: { fg: 'var(--vds-warning)', soft: 'var(--vds-warning-soft)' },
  emerald: { fg: 'var(--vds-accent-emerald)', soft: 'var(--vds-accent-emerald-soft)' },
  primary: { fg: 'var(--vds-primary)', soft: 'color-mix(in srgb, var(--vds-primary) 12%, transparent)' },
}

const PLAYS = [
  { key: 'bundle', tone: 'emerald', icon: Boxes,
    lead: <>Upgrade <strong>22</strong> customers to a package</>,
    sub: 'They already buy the parts separately — a package is the better deal.',
    cta: 'See who' },
  { key: 'ies', tone: 'primary', glyph: GLYPHS.ies,
    lead: <>Sell <strong>IES</strong> to <strong>273</strong> accounts that don&rsquo;t have it</>,
    sub: 'Worth about 58,422 seats.', cta: 'Build call list' },
  { key: 'edr', tone: 'primary', glyph: GLYPHS.edr,
    lead: <>Sell <strong>Endpoint+Email</strong> to <strong>269</strong> accounts that don&rsquo;t have it</>,
    sub: 'Worth about 56,221 seats.', cta: 'Build call list' },
]

function SellNextDemo() {
  return (
    <div className="vds-tile-demo vds-tile-demo--wide">
    <div className="vds-tile">
      <DashHead title="Where to sell next" sub="3 plays, easiest first" />
      <div className="vds-sell-list">
        {PLAYS.map((r) => {
          const tone = OPP_TONE[r.tone] || OPP_TONE.primary
          const RowIcon = r.icon || Plus
          return (
            <button
              key={r.key}
              type="button"
              className="vds-sell-row vds-sell-row--play"
              style={{ '--opp-fg': tone.fg, '--opp-soft': tone.soft }}
            >
              {r.glyph ? (
                <span className="vds-sell-row__tile" aria-hidden>
                  <ProductTile glyph={r.glyph} tonal size={32} />
                </span>
              ) : (
                <span className="vds-sell-row__icon" aria-hidden><RowIcon size={15} strokeWidth={1.75} /></span>
              )}
              <span className="vds-sell-row__text">
                <span className="vds-sell-row__label">{r.lead}</span>
                <span className="vds-sell-row__detail">{r.sub}</span>
              </span>
              <span className="vds-sell-row__cta">
                {r.cta}
                <Icon as={ArrowRight} size="sm" aria-hidden />
              </span>
            </button>
          )
        })}
      </div>
    </div>
    </div>
  )
}

/* ============================================================================
   TRIALS — a chart, a hero, a call list and a ranked sub-list, in one tile.
   Ported from TrialsCard. The plot takes `height="100%"` so it absorbs whatever
   slack the row has: a chart is the one element here with no natural height, so
   it takes the surplus and the tiles beside it come out level at any width
   without either being measured against the other.
   ========================================================================== */
/* Twelve months of accounts on trial. */
const TRIAL_TREND = [
  { label: 'Oct', value: 74 }, { label: 'Nov', value: 96 }, { label: 'Dec', value: 92 },
  { label: 'Jan', value: 118 }, { label: 'Feb', value: 63 }, { label: 'Mar', value: 84 },
  { label: 'Apr', value: 90 }, { label: 'May', value: 97 }, { label: 'Jun', value: 78 },
  { label: 'Jul', value: 104 }, { label: 'Aug', value: 88 }, { label: 'Sep', value: 108 },
]

const TRIALED = [
  { id: 'complete', name: 'Complete Defense', glyph: GLYPHS.ies, accounts: 14 },
  { id: 'essentials', name: 'Essentials', glyph: GLYPHS.ies, accounts: 12 },
  { id: 'vault', name: 'VaultCritical Suite', glyph: GLYPHS.edr, accounts: 10 },
]

function TrialsDemo() {
  const tone = OPP_TONE.primary
  const topTrial = TRIALED[0].accounts
  return (
    <div className="vds-tile-demo vds-tile-demo--wide vds-tile-demo--tall">
    <div className="vds-tile" style={{ '--opp-fg': tone.fg, '--opp-soft': tone.soft }}>
      <DashHead title="Trials" sub="20 products in trial" />

      <div className="vds-sell-spark">
        <span className="vds-sell-spark__cap">Accounts on trial, 12 months</span>
        <AreaTrend bare data={TRIAL_TREND} colorVar="--opp-fg" height="100%" valueLabel="on trial" />
      </div>

      <div className="vds-trials-lead">
        {/* The unit is the SENTENCE, not a label. "112 accounts" states a quantity
            and leaves you to work out what to do with it; "112 accounts could start
            paying" is the whole point of the tile, in the same number. */}
        <span className="vds-sell-hero__figs">
          <span className="vds-sell-hero__count">112</span>
          <span className="vds-sell-hero__unit">accounts could start paying</span>
        </span>
        {/* Expiring is the only division of this population that still means
            something: same work, less time. */}
        <span className="vds-sell-hero__split">
          <span className="vds-sell-hero__legend">
            <span className="vds-sell-hero__leg">
              <span className="vds-sell-hero__urgent">32 inside 7 days</span>
            </span>
          </span>
        </span>
        <span className="vds-sell-hero__detail">already in the product, not yet paying · 20 packages</span>
      </div>

      {/* The proof AND the way in — naming three of the accounts is what turns the
          figure above from a statistic into a call list. */}
      <button type="button" className="vds-trials-who">
        <span className="vds-sell-hero__names">
          Meridian Healthcare Group, Coastal Manufacturing Inc, Quantum Logistics Ltd
          <span className="vds-sell-hero__more"> +109 more</span>
        </span>
        <Icon as={ArrowRight} size="sm" className="vds-sell-hero__go" aria-hidden />
      </button>

      <div className="vds-sell-trials">
        <div className="vds-sell-group__head">
          What they&rsquo;re trying
          <span className="vds-sell-trials__rest">top 3 of 20</span>
        </div>
        {TRIALED.map((p) => (
          <div key={p.id} className="vds-sell-trial">
            <ProductTile glyph={p.glyph} tonal size={24} />
            <span className="vds-sell-trial__name">{p.name}</span>
            <span className="vds-sell-trial__bar" aria-hidden>
              <span className="vds-sell-trial__open" style={{ width: `${(p.accounts / topTrial) * 100}%` }} />
            </span>
            <span className="vds-sell-trial__fig">{p.accounts}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

/* ============================================================================
   THE SEGMENT TILE — a count, its share, and a bar split into named parts.
   Ported from the package panel's audience strip (KpiMeter + .vds-pkg-aud__seg).
   The key under the bar is a list of ROWS, and it is the last list on this page
   that was still drawn its own way — it now carries the same inset, pill,
   hairline and hover as every other row.
   ========================================================================== */
const SEGMENTS = [
  { label: 'Paying', value: 52, pct: 90, color: 'var(--vds-primary)' },
  { label: 'Trying', value: 6, pct: 10, color: 'var(--vds-accent-orchid, #c9a6e0)' },
]

function KpiMeter({ segments, onSegmentClick }) {
  return (
    <div className="vds-kpi-meter vds-kpi-meter--plain">
      {/* aria-hidden: the bar is a redraw of the legend beneath it, which is real
          text in a description list. A screen reader gets the numbers, not a
          second copy of them. */}
      <div className="vds-kpi-meter__bar" aria-hidden>
        {segments.map((p) => (
          <span key={p.label} className="vds-kpi-meter__seg"
            style={{ flexGrow: p.value, background: p.color }} />
        ))}
      </div>
      <dl className="vds-kpi-meter__key">
        {segments.map((p) => {
          const live = !!onSegmentClick && p.value > 0
          return (
            <div key={p.label}
              className={`vds-kpi-meter__row${live ? ' vds-kpi-meter__row--live' : ''}`}
              role={live ? 'button' : undefined}
              tabIndex={live ? 0 : undefined}
              aria-label={live ? `View ${p.value} ${p.label.toLowerCase()} accounts` : undefined}
              onClick={live ? () => onSegmentClick(p) : undefined}>
              <dt className="vds-kpi-meter__name">
                <span className="vds-kpi-meter__dot" style={{ background: p.color }} aria-hidden />
                <span className="vds-kpi-meter__label">{p.label}</span>
              </dt>
              <dd className="vds-kpi-meter__val">{p.value}</dd>
              <dd className="vds-kpi-meter__pct">{p.pct}%</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

function SegmentTileDemo() {
  return (
    <div className="vds-tile-demo">
    <div className="vds-tile">
      <div className="vds-pkg-aud__seg vds-pkg-aud__seg--solo">
        {/* THE FIGURE AND ITS SHARE ON ONE LINE. "58" and "18% of all accounts"
            are the same fact told twice — a count, and that count as a proportion
            — so the share belongs to the FIGURE rather than to the label under it.
            A line down, next to the label, it reads as a second caption and leaves
            the reader working out which of the two it measures. */}
        <span className="vds-pkg-aud__figure">
          <span className="vds-pkg-aud__val">58</span>
          <span className="vds-pkg-aud__stat">18% of all accounts</span>
        </span>
        <span className="vds-pkg-aud__label">Accounts with this bundle</span>
        <KpiMeter segments={SEGMENTS} onSegmentClick={() => {}} />
      </div>
    </div>
    </div>
  )
}

export function TileRowsPage() {
  return (
    <DocPage
      title="Tile rows"
      description="A KPI tile whose body is a short ranked list — six products by seats, five accounts by size. Not a table: no sorting, no paging, no column you can choose, because the ranking IS the content. The tile answers one question and the rows show the shape of the answer. Ported from the MSP shell as it runs, not rebuilt."
    >
      <Section
        title="Anatomy"
        note="A head that names the cut, six rows at most, and a remainder line that names what the six left out. Pick a row — the current one takes the same solid fill the page filter's current row takes, because it is the same claim: this is the one you are reading."
      >
        <Preview
          canvas={<SeatsByProductDemo />}
          code={`<div className="vds-tile">
  <DashHead title="Seats by product" sub="Under contract"
            action={{ label: 'Package Insights', onClick }} />

  <div className="vds-biz-rows vds-biz-rows--grow">
    <BizRow
      mark={<ProductTile glyph={p.glyph} tonal size={24} />}
      name={p.name}
      share={p.seats / top}      // share of the TOP ROW, never of the total
      value={p.seats.toLocaleString()}
      sub={\`\${p.accounts} accts\`}
      onClick={…}
    />
  </div>

  <FootLink label="14 other products" value="32.2K" onClick={…} />
</div>`}
        />
      </Section>

      <Section
        title="An account's mark"
        note="The mark is the account's TYPE, and in this one the colour carries it: purple for a distributor, amber for a partner, teal for a customer. That is EntityTile, ported from the shell — a different tile from ProductTile on purpose, because a product's mark identifies one product out of twenty while an account's sorts a book into three kinds, and three colours do that at a glance where twenty could not. The colours stay literal: they are the tile's identity, not theme chrome, and a distributor is the same purple in every product that draws one."
      >
        <Preview
          canvas={<ConcentrationDemo />}
          code={`<BizRow name={name} share={seats / top} value={seats} sub="1%" />
// no mark  → --plain (sub or flag present) or --tight (neither)
// no onClick → renders a <div>, not a <button>`}
        />
      </Section>

      <Section
        title="The line card"
        note="A wider row, for when the tile carries three figures and a two-part meter. It earns a header, and the key lives IN that header's name column — beside the thing it explains, where a key band of its own would cost a line of card height to say six words. The meter is two lengths: the outer bar is the package's size against the biggest, the inner one is how much of it is in use."
      >
        <Preview canvas={<PackageLinesDemo />} code={`<div className="vds-lc">
  <div className="vds-lc-row vds-lc-row--head" aria-hidden>
    <span className="vds-lc-tile" />        {/* the mark column's cell, unlabelled */}
    <span className="vds-lc-legend">…</span> {/* the key, in the name column */}
    …
  </div>
  <button className="vds-lc-row vds-lc-row--btn">
    <ProductTile glyph={p.glyph} tonal size={20} />
    <span className="vds-lc-name">{p.name}</span>
    <span className="vds-lc-meter"><span className="vds-lc-meter__line" style={{width: share}}>
      <span className="vds-lc-meter__use" style={{width: Math.min(100, p.util)}} />
    </span></span>
    …
  </button>
</div>`} />
      </Section>

      <Section
        title="The play list"
        note="Not a ranking — three sentences, each with one number in it, one supporting line and one action. A row here is a thing to do, so it leads with a verb and ends with the control that does it. The mark is 32: this row is two lines and a choice, not an entry in a league table."
      >
        <Preview canvas={<SellNextDemo />} code={`<button className="vds-sell-row vds-sell-row--play"
        style={{ '--opp-fg': tone.fg, '--opp-soft': tone.soft }}>
  <span className="vds-sell-row__tile"><ProductTile tonal size={32} /></span>
  <span className="vds-sell-row__text">
    <span className="vds-sell-row__label">Sell <strong>IES</strong> to <strong>273</strong> accounts…</span>
    <span className="vds-sell-row__detail">Worth about 58,422 seats.</span>
  </span>
  <span className="vds-sell-row__cta">Build call list <Icon as={ArrowRight} size="sm" /></span>
</button>`} />
      </Section>

      <Section
        title="A tile that is more than rows"
        note="Trials carries a chart, a hero figure, a call list and a ranked sub-list — and the rows at its foot are still the same row. The plot takes height=100% so it absorbs the row's slack: a chart is the one element here with no natural height, so it takes the surplus and the tiles beside it come out level at any width without either being measured against the other."
      >
        <Preview canvas={<TrialsDemo />} code={`<div className="vds-tile" style={{ '--opp-fg': tone.fg, '--opp-soft': tone.soft }}>
  <DashHead title="Trials" sub="20 products in trial" />
  <div className="vds-sell-spark">
    <span className="vds-sell-spark__cap">Accounts on trial, 12 months</span>
    <AreaTrend bare data={trend} colorVar="--opp-fg" height="100%" valueLabel="on trial" />
  </div>
  <div className="vds-trials-lead">…hero, expiring flag, caption…</div>
  <button className="vds-trials-who">…three names, +109 more…</button>
  <div className="vds-sell-trials">…what they're trying…</div>
</div>`} />
      </Section>

      <Section
        title="The segment tile"
        note="A count, that count as a share, and a bar split into named parts. The key under the bar is a list of rows — a mark, a name, a figure, a qualifier — and it was the last list here still drawn its own way. It now carries the same 8px inset, 6px pill, hairline and ink-mix hover as every other row, so a segment in this tile and a product in Seats by product are read the same way. Its vertical padding stays at 4: these two entries are reading the bar directly above them, and the ranked rows' 8 would push the key far enough off it to stop belonging to it."
      >
        <Preview canvas={<SegmentTileDemo />} code={`<span className="vds-pkg-aud__figure">
  <span className="vds-pkg-aud__val">58</span>
  <span className="vds-pkg-aud__stat">18% of all accounts</span>
</span>
<span className="vds-pkg-aud__label">Accounts with this bundle</span>
<KpiMeter segments={segments} onSegmentClick={…} />`} />
      </Section>

      <Section title="The rules">
        <RefTable
          headers={['', 'Value', 'Why']}
          rows={[
            ['Columns', 'auto · 1.8fr · 1fr · 74px · 58px', 'The NAME takes the surplus. An even split puts account names in a 110px cell, so the column that identifies the row is the first one squeezed. A meter is a proportion — it says the same thing at 60px as at 140.'],
            ['Column gap', '12px', 'The row’s own rhythm.'],
            ['Mark to name', '8px', 'Tighter than the rest — a mark belongs to the name beside it. One grid cannot vary its column gap, so the name pulls the 4px back.'],
            ['Row padding', '8px, with -8px margin', 'The fill reaches the tile’s inner edge while the text still stands off it. Padding alone leaves the hover floating in a box.'],
            ['Row corner', '6px', 'The row pill — the shape the nav rows and the docs column use.'],
            ['Hover', '4% of --vds-ink', 'Translucent, never a surface step. These rows sit on a card, inside a tile, on the canvas; an absolute fill is right against one of the three.'],
            ['Current row', '--vds-primary, solid', 'Same as the page filter. One row at a time, and it has to be findable without hunting.'],
            ['Meter', 'share of the TOP ROW', 'A share of the total flattens six rows into six identical stubs. Floored at 2% so the smallest still draws.'],
            ['Figures', 'tabular-nums, right, fixed track', 'A ranked list is read down the numbers. Proportional digits and an elastic column both stop it being a column.'],
            ['Rows', 'six at most', 'Past six the tile stops showing a shape and starts being a table in a card — at which point use Table, on a page.'],
          ]}
        />
      </Section>

      <Section
        title="Sizing the mark"
        note="Off the Product Tile scale, chosen by what else the row carries rather than by the tile’s width."
      >
        <RefTable
          headers={['Size', 'When', 'Example']}
          rows={[
            ['20', 'A name and one figure.', 'The package rail’s filter list.'],
            ['24', 'A meter, a figure AND a qualifier.', 'Seats by product, above — the mark steps up so it holds its own without leading.'],
            ['32', 'A thing you are choosing, with a sentence about it.', 'The provisioning shelf.'],
          ]}
        />
      </Section>

      <Section
        title="What alignment changed"
        note="Four row families came over from the shell, and every difference between them was in the chrome — which is the set a reader notices when two tiles sit side by side. They are one row now. The columns were never the problem and none of them moved."
      >
        <RefTable
          headers={['', 'Was', 'Now']}
          rows={[
            ['Separating rows', 'One list used hairlines and 9px outer corners; the other three used 2px gaps and no line at all', 'A hairline between every row, in every list — drawn as a pseudo-element, because a border on a 6px-radius row curves at both ends'],
            ['Hover, four ways', '--vds-surface-hover · --vds-surface-sunken · a 7% tint of the tile’s tone · 4% of the ink', '4% of the ink, everywhere. The tone lives in the mark and the CTA, not in the hover'],
            ['Corners', '6 · 9 · 4 · none', '6 — now only visible under the pointer, which is the one place it has a job'],
            ['The account rows', 'A name and figures, no mark', 'The entity glyph in the same tile at the same size — a row should not stop identifying its subject because the subject is an account rather than a product'],
            ['Trial rows', 'A 6px inset with a 4px corner — a third hover shape', 'The 8px inset and 6px corner every other row draws'],
            ['Section rules', 'One footer stopped at the rows’ edge, the other bled to the card border and tinted its hairline with the tile’s accent', 'Both on the rows’ edge, both --vds-line'],
            ['Focus rings', '2px/-2px literals against --nav-accent or --opp-fg', '--vds-control-ring-w on --vds-focus-ring'],
          ]}
        />
        <Stack gap={3} style={{ marginTop: '1.25rem' }}>
          <Text variant="body">
            <strong>Vertical padding was left alone</strong> — 7, 8, 12 and 4 across the four. A
            play row is two lines where a trial row is one, and matching the <em>air</em> would make
            three short rows as tall as three tall ones. What has to agree is the horizontal inset
            and the corner, because those are what the hover draws.
          </Text>
          <Text variant="body">
            <strong>An earlier version of this page had the line card wrong.</strong> It listed
            <IC>.msp-lc-row</IC> as 7&nbsp;0 with no corner, read off the first rule block — later
            blocks in the same stylesheet had already given it the 8px inset and the 6px pill. Worth
            saying because it is the same failure mode the page is about: a row defined in more than
            one place, where reading one of them tells you something untrue.
          </Text>
          <Text variant="body">
            <strong>None of this is back in the shell yet.</strong> The changes live here; porting
            them is a diff against <IC>shell.css</IC>, and the largest single piece is the play
            list, which loses its dividers.
          </Text>
        </Stack>
      </Section>
    </DocPage>
  )
}
