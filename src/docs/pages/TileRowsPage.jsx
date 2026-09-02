import { useMemo, useState } from 'react'
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

/* ============================================================================
   Rows — the list owns the columns, a row is a subgrid of them.
   `cols` is a grid template; `columns` describes the cells once and both the
   header and the rows read it, so a label cannot end up over the wrong figure.
   ========================================================================== */
/* The remainder line. It names the population the list above it left out, and it is
   deliberately NOT restyled into a button: it keeps the hairline, the size and the
   subtle ink it had as text, because its job on the card hasn't changed. What it
   gains is a hover, a focus ring and an arrow that appears on approach — the
   smallest vocabulary that says "this goes somewhere" without turning a footnote
   into a call to action. It sits INSIDE the list now, spanning the grid, so it takes
   the list's own bleed and lines up with everything above it. */
function FootLink({ label, value, onClick }) {
  const body = (
    <>
      <span>{label}</span>
      <span className="vds-biz-foot__val">
        {value}
        {onClick && <Icon as={ArrowRight} size="sm" className="vds-biz-foot__go" aria-hidden />}
      </span>
    </>
  )
  return onClick
    ? <button type="button" className="vds-biz-foot vds-biz-foot--btn" onClick={onClick}>{body}</button>
    : <div className="vds-biz-foot">{body}</div>
}

function SortArrow({ direction }) {
  /* .vds-table__sort, so the Table's own glyph styling drives it — the colour, the
     hidden-until-hovered opacity and the 180° flip for descending all come from
     Table.scss. A second arrow that merely agrees today is what this page is about. */
  return (
    <span className={`vds-table__sort${direction ? ` vds-table__sort--${direction}` : ''}`} aria-hidden="true">
      <svg width="9" height="8" viewBox="0 0 9 8" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 7.25V0.75M1.5 3.75L4.5 0.75L7.5 3.75" />
      </svg>
    </span>
  )
}

/* INTERACTIVE BY DEFAULT. Nearly every row in a KPI tile goes somewhere — a product
   to its drawer, an account to its page — and the handful that do not are the
   exception. Defaulting the other way meant each list opted IN and one of the two
   ranked lists had quietly not, so identical-looking rows behaved differently between
   two cards sitting side by side. Pass interactive={false} for a list that really is
   just a readout; the DS Table made the same call for the same reason. */
function Rows({ cols, columns, data, getKey, sort, onSort, current, onPick, interactive = true, children }) {
  /* Columns with no heading fold into the heading that follows them. */
  const headCells = []
  let pending = 0
  for (const c of columns) {
    if (!c.header) { pending += 1; continue }
    headCells.push({ c, span: pending + 1 })
    pending = 0
  }
  if (pending) headCells.push({ c: null, span: pending })

  const renderHead = (c, span) => {
    const active = sort?.key === c.key
    const arrow = <SortArrow direction={active ? sort.direction : undefined} />
    const cell = c.sortable && onSort ? (
      <button type="button"
        className={`vds-rowsort${c.align === 'right' ? ' vds-rowsort--right' : ''}`}
        onClick={() => onSort({ key: c.key, direction: active && sort.direction === 'desc' ? 'asc' : 'desc' })}
        aria-label={`Sort by ${c.header}`}>
        {c.align === 'right' && arrow}
        {c.header}
        {c.align !== 'right' && arrow}
      </button>
    ) : c.header
    return (
      /* THE SORTED COLUMN'S LABEL GOES TO FULL INK. Only its arrow changed before, so
         the one column carrying the ordering looked exactly like the four that were
         not — a 9px mark doing all the work. .vds-table__th--active is the Table's own
         rule for this (--vds-ink-subtle to --vds-ink, colour only, no weight change),
         reused rather than restated so the two headers keep saying it the same way. */
      /* The header cell does NOT take the body cell's class. Doing so dragged
         .vds-rowlist__sub's 12px and its colour into the header, which then needed a
         reset rule to undo — and that reset set `color: inherit` at a specificity
         that beat the Table's --active, so the sorted heading could never darken.
         Alignment is all a header cell needs, and it says so itself. */
      <span key={c.key}
        className={[c.align === 'right' && 'is-right', active && 'vds-table__th--active'].filter(Boolean).join(' ')}
        style={span > 1 ? { gridColumn: `span ${span}` } : undefined}
        aria-sort={c.sortable ? (active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}>
        {cell}
      </span>
    )
  }

  return (
    <div className="vds-rowlist" style={{ '--cols': cols }}>
      <div className="is-head" role="row">
        {/* AN UNLABELLED COLUMN MERGES INTO THE NEXT ONE'S HEADING. The mark column
            has no heading — there is nothing to call it and nothing to sort it by —
            but it still holds a cell, and an empty cell pushed "Account" 32px right
            of the marks, so the header started a third of an inch inside the visual
            left edge of every row under it. Letting the heading span both tracks puts
            it over the block it names, which is what the Table does with its leading
            product cell: mark and name are one cell there, and the header sits over
            both. Same idea, expressed in a grid. */}
        {headCells.map(({ c, span }, i) => {
          if (!c) return <span key={`gap-${i}`} style={{ gridColumn: `span ${span}` }} />
          return renderHead(c, span)
        })}
      </div>
      {data.map((row, i) => {
        const key = getKey(row)
        const live = interactive && !!onPick
        return (
          <div key={key} role="row"
            className={[live && 'is-interactive', current === key && 'is-current'].filter(Boolean).join(' ')}
            tabIndex={live ? 0 : undefined}
            onClick={live ? () => onPick(key) : undefined}
            onKeyDown={live ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(key) } } : undefined}>
            {columns.map((c) => <span key={c.key} className={c.cellClass}>{c.render(row, i)}</span>)}
          </div>
        )
      })}
      {children}
    </div>
  )
}

/* ---- the real rows off "Seats by product", figures included ---------------- */
const PRODUCTS = [
  { id: 'edge-nordics', name: 'Edge Defense Nordics', glyph: GLYPHS.edr, seats: 4444, accounts: 42 },
  { id: 'exchange-suite', name: 'ExchangeSMART Suite', glyph: GLYPHS.ies, seats: 3559, accounts: 44 },
  { id: 'complete-nordics', name: 'Complete Defense Nordics', glyph: GLYPHS.ies, seats: 3410, accounts: 45 },
  { id: 'essentials-in', name: 'Essentials Inbound Only', glyph: GLYPHS.ies, seats: 3181, accounts: 39 },
  { id: 'edge', name: 'Edge Defense', glyph: GLYPHS.edr, seats: 3070, accounts: 34 },
  { id: 'exchange', name: 'ExchangeSMART', glyph: GLYPHS.safesend, seats: 3054, accounts: 45 },
]

function SeatsByProductDemo() {
  const [picked, setPicked] = useState(null)
  const [sort, setSort] = useState({ key: 'seats', direction: 'desc' })
  const rows = useMemo(() => {
    const v = [...PRODUCTS]
    const get = { name: (p) => p.name, seats: (p) => p.seats, accounts: (p) => p.accounts,
                  per: (p) => p.seats / p.accounts }[sort.key]
    v.sort((a, b) => {
      const x = get(a), y = get(b)
      const c = typeof x === 'number' ? x - y : String(x).localeCompare(String(y))
      return sort.direction === 'asc' ? c : -c
    })
    return v
  }, [sort])
  return (
    <div className="vds-tile-demo">
    <div className="vds-tile">
      <DashHead title="Seats by product" sub="Under contract" action={{ label: 'Package Insights' }} />
      <Rows
        cols="24px minmax(0, 1fr) 76px 68px 68px"
        data={rows} getKey={(p) => p.id}
        sort={sort} onSort={setSort}
        current={picked} onPick={(k) => setPicked(picked === k ? null : k)}
        columns={[
          { key: 'mark', header: '', cellClass: 'vds-rowlist__mark', render: (p) => <ProductTile glyph={p.glyph} tonal size={24} /> },
          { key: 'name', header: 'Product', sortable: true, cellClass: 'vds-rowlist__name', render: (p) => p.name },
          { key: 'seats', header: 'Seats', sortable: true, align: 'right', cellClass: 'vds-rowlist__val', render: (p) => p.seats.toLocaleString() },
          { key: 'accounts', header: 'Accounts', sortable: true, align: 'right', cellClass: 'vds-rowlist__sub', render: (p) => p.accounts },
          { key: 'per', header: 'Per acct', sortable: true, align: 'right', cellClass: 'vds-rowlist__sub', render: (p) => Math.round(p.seats / p.accounts) },
        ]}
      >
        <FootLink label="14 other products" value="29.5K" onClick={() => {}} />
      </Rows>
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
  { name: 'Sunbelt Brewing Services', seats: 3240, type: 'customer' },
  { name: 'Atlas Agriculture Co', seats: 1967, type: 'reseller' },
  { name: 'Metro Environmental Group', seats: 1858, type: 'customer' },
  { name: 'Sunrise Automotive LLC', seats: 1563, type: 'distributor' },
  { name: 'Quantum Consulting Ltd', seats: 1259, type: 'reseller' },
]

/* THE TWO VOCABULARIES DO NOT AGREE, and this is the seam. The data calls the
   middle type `reseller` (so does CUSTOMER_TYPE, and so does the Customers table's
   Tag); EntityTile's colour map calls it `partner`. Mapped here rather than
   renamed on either side, because renaming one breaks every consumer of the other
   — but it is a rename worth doing once somebody owns both. */
const TILE_TYPE = { distributor: 'distributor', reseller: 'partner', customer: 'customer' }

function ConcentrationDemo() {
  const [picked, setPicked] = useState(null)
  const [sort, setSort] = useState({ key: 'seats', direction: 'desc' })
  const rows = useMemo(() => {
    const get = { name: (a) => a.name, seats: (a) => a.seats, share: (a) => a.seats }[sort.key]
    return [...ACCOUNTS].sort((a, b) => {
      const x = get(a), y = get(b)
      const c = typeof x === 'number' ? x - y : String(x).localeCompare(String(y))
      return sort.direction === 'asc' ? c : -c
    })
  }, [sort])
  const total = 50190
  return (
    <div className="vds-tile-demo">
    <div className="vds-tile">
      <DashHead title="Your biggest accounts" sub="Top 5 of 324" />
      <div className="vds-status-lead">
        <span className="vds-status-lead__figs">
          <span className="vds-status-lead__value">20%</span>
          <span className="vds-status-lead__share">an even split would be 1.5%</span>
        </span>
        <span className="vds-status-lead__caption">Seats held by the 5 biggest accounts</span>
      </div>
      <Rows
        cols="24px minmax(0, 1fr) 76px 68px"
        data={rows} getKey={(a) => a.name}
        sort={sort} onSort={setSort}
        current={picked} onPick={(k) => setPicked(picked === k ? null : k)}
        columns={[
          { key: 'mark', header: '', cellClass: 'vds-rowlist__mark', render: (a) => <EntityTile type={TILE_TYPE[a.type]} glyph={GLYPHS[a.type]} size={24} /> },
          { key: 'name', header: 'Account', sortable: true, cellClass: 'vds-rowlist__name', render: (a) => a.name },
          { key: 'seats', header: 'Seats', sortable: true, align: 'right', cellClass: 'vds-rowlist__val', render: (a) => a.seats.toLocaleString() },
          { key: 'share', header: 'Share', sortable: true, align: 'right', cellClass: 'vds-rowlist__sub', render: (a) => `${(a.seats / total * 100).toFixed(1)}%` },
        ]}
      >
        <FootLink label="The other 319 accounts" value="40.2K" />
      </Rows>
      {/* THE CAVEAT, SAID PLAINLY. It read "Weighted by seats. Two accounts of the
          same size count the same here, whatever each pays for them." — which takes
          three clauses and a double negative to reach one fact, and gets there by a
          route the reader has to retrace. "Weighted" is also wrong: nothing is
          weighted, the tile simply counts seats.

          The fact is that this is a seats view and not a money view, and the thing
          that follows from it — a big cheap account outranking a small expensive one
          — is the reason anyone needs telling. Both, in that order, in two short
          sentences. */}
      <span className="vds-biz-note">
        Ranked by seats, not revenue. A large low-margin account outranks a small premium one.
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
        {/* Already this shape — figure, the same fact in words beside it, label
            below — but at its own sizes (30px / 12.5 / 11.5). On the shared head now. */}
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
        <div className="vds-sell-trial vds-sell-trial--head" aria-hidden>
          <span />
          <span className="vds-sell-trial__name">Package</span>
          <span className="vds-sell-trial__fig">Accounts</span>
        </div>
        {/* Buttons, like every other row on the page — these were the last inert list,
            and an inert row among interactive ones is the difference a reader notices
            by pointing at it and getting nothing. */}
        {TRIALED.map((p) => (
          <button type="button" key={p.id} className="vds-sell-trial vds-sell-trial--btn">
            <ProductTile glyph={p.glyph} tonal size={24} />
            <span className="vds-sell-trial__name">{p.name}</span>
            <span className="vds-sell-trial__fig">{p.accounts}</span>
          </button>
        ))}
      </div>
    </div>
    </div>
  )
}

/* ============================================================================
   THE SEGMENT TILE — a count, its share, and a bar split into named parts.
   Ported from the package panel's audience strip (KpiMeter + .vds-pkg-aud__seg).
   The key under the bar LOOKS like a list of rows and is not one. It is a legend:
   two entries naming the parts of the bar above them, read together with it. It
   shares the head and the figures' alignment and none of the row chrome.
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

/* NO .vds-tile WRAPPER. .vds-pkg-aud__seg is its own card in the shell — it carries
   the padding, the border and the corner — and putting it inside one made a box in a
   box, which I then "fixed" by stripping the seg's own chrome. The tile was the thing
   that did not belong. */
function SegmentTileDemo() {
  return (
    <div className="vds-tile-demo">
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
        note="A head that names the cut, six rows at most, and a remainder line that names what the six left out. Three figure columns: the ranked figure, its reach, and the ratio between them — see below for why the ratio earns a column of its own. Every row is interactive; the current one takes the same solid fill the page filter's current row takes, because it is the same claim: this is the one you are reading. Sort by any column."
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
      per={\`\${Math.round(p.seats / p.accounts)}/acct\`}   // adds the 6th column
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
        note="A count, that count as a share, and a bar split into named parts. The key under the bar looks like a list of rows and is not one — it is a LEGEND: two entries naming the parts of the bar directly above them, read as a pair with it rather than scanned as a table. It takes the head and the figures' alignment from everything else here, and none of the row chrome: no inset, no pill, no hairline, no header. A legend given column headings is a table nobody asked for."
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
            ['Interactive', 'the default', 'Nearly every row in a KPI tile goes somewhere. A list that is genuinely a readout opts out; the DS Table made the same call.'],
            ['Hover', '4% of --vds-ink', 'Translucent, never a surface step. These rows sit on a card, inside a tile, on the canvas; an absolute fill is right against one of the three.'],
            ['Current row', '--vds-primary, solid', 'Same as the page filter. One row at a time, and it has to be findable without hunting.'],
            ['No meter', 'figures only', 'A bar per row carrying one value drew six near-identical lengths and invited a comparison the data could not support. The figures carry the magnitude exactly. The line card keeps its meter — that one is TWO lengths, bought against in-use, and says something no column repeats.'],
            ['Figures', 'tabular-nums, right, fixed track', 'A ranked list is read down the numbers. Proportional digits and an elastic column both stop it being a column.'],
            ['The ratio column', 'self-labelled', 'A sixth cell for the figure divided by its reach. It carries no header — these lists have none — so it labels itself: “106/acct”, not “106”.'],
            ['Rows', 'six at most', 'Past six the tile stops showing a shape and starts being a table in a card — at which point use Table, on a page.'],
          ]}
        />
      </Section>

      <Section
        title="Rank by the number that has shape"
        note="Seats by product ranked six products whose totals differ by 1.45x, and put the figure that differs by 1.56x in the muted grey qualifier. The sixth column is that ratio, promoted."
      >
        <Stack gap={3}>
          <Text variant="body">
            The tile exists to be read against Package Insights: that one ranks by how many
            ACCOUNTS hold a package, this one by how many SEATS ride on it. A package sold to
            a handful of large accounts outranks one sold everywhere in small blocks, and the
            gap between the two orderings is the sales conversation. <strong>That gap is
            seats-per-account</strong>, and until now it was the one figure on the card the
            reader had to compute — six times, in their head.
          </Text>
          <Text variant="body">
            <IC>Edge Defense</IC> reaches 34 accounts at 90 seats each; <IC>ExchangeSMART</IC>{' '}
            reaches 45 at 68. Same card, opposite motions — one is a big-account product, the
            other a volume product — and neither the bar nor the seat total says so.
          </Text>
          <Text variant="body">
            <strong>The general rule this is an instance of:</strong> when a ranked list comes
            out flat, the ranking dimension is the wrong one. It is worth checking before
            reaching for the data. This card was flat under a uniform seat generator AND it
            stayed flat after that generator was given a realistic heavy tail — because a
            product&rsquo;s total sums ~40 accounts, and summing averages the skew away. The
            accounts tile went from a 3% top-five share to 20% on the same change; this one
            moved from 1.27x to 1.45x. The data was never this tile&rsquo;s problem.
          </Text>
        </Stack>
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
