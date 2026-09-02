import { useState } from 'react'
import { ChevronRight, ArrowRight, Plus, Boxes } from 'lucide-react'
import { DocPage } from '../DocPage.jsx'
import { Section, Preview, RefTable, IC } from '../primitives.jsx'
import { Button, Icon, ProductTile, Stack, Text } from '../../components/index.js'
import { GLYPHS } from '../templateData.js'

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

/* Accounts are not products: no mark to draw, so `--plain` collapses the column
   rather than leaving a hole where a glyph would have been. */
const ACCOUNTS = [
  ['Sunbelt Brewing Services', 299], ['Atlas Agriculture Co', 298],
  ['Metro Environmental Group', 298], ['Sunrise Automotive LLC', 297],
  ['Quantum Consulting Ltd', 297],
]

function ConcentrationDemo() {
  const top = ACCOUNTS[0][1]
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
        {ACCOUNTS.map(([name, seats]) => (
          <BizRow key={name} name={name} share={seats / top} value={seats} sub="1%" />
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
        title="Without a mark"
        note="An account is not a product, so there is nothing to draw and --plain collapses the column rather than leaving a hole. Inventing a glyph for a row that has no product says the row is one."
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
        title="What the prototype does today"
        note="Four implementations of this one row, measured off the running MSP shell. None is wrong on its own; together they are four answers to the same question, and the differences are invisible until two tiles sit side by side."
      >
        <RefTable
          headers={['', 'Gap', 'Padding', 'Corner', 'Hover']}
          rows={[
            ['.msp-biz-row — the one above', '12', '8', '6', '4% of ink'],
            ['.msp-act-row', '10', '9 0', 'none', '--vds-surface-hover'],
            ['.msp-lc-row', '12', '7 0', 'none', '--vds-surface-sunken'],
            ['.msp-sell-row', '12', '8', '9', '--vds-surface-sunken'],
          ]}
        />
        <Stack gap={3} style={{ marginTop: '1.25rem' }}>
          <Text variant="body">
            <strong>Three hover treatments across four rows</strong>, two of them absolute surface
            steps. That is the one difference here that is a defect rather than a preference:{' '}
            <IC>--vds-surface-hover</IC> and <IC>--vds-surface-sunken</IC> are each correct against
            exactly one ground, and these rows sit on three.
          </Text>
          <Text variant="body">
            <strong>The corners disagree three ways</strong> — 6, 9, and none. A row with no corner
            cannot show a fill that reaches its own edge, so <IC>.msp-act-row</IC> and{' '}
            <IC>.msp-lc-row</IC> have no hover shape at all; theirs paints a bare rectangle.{' '}
            <IC>.msp-sell-row</IC>&rsquo;s 9 is off both radius scales.
          </Text>
          <Text variant="body">
            <strong>Only <IC>.msp-biz-row</IC> has been brought to this spec</strong> — it is the one
            on this page. The other three are the work: same gap, same padding, the 6px pill, the
            ink-mix hover. Their columns need nothing; every difference that a reader notices when
            two tiles sit next to each other is in the chrome.
          </Text>
        </Stack>
      </Section>
    </DocPage>
  )
}
