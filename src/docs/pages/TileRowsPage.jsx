import { useState } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
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
      <div className="vds-biz-rows vds-biz-rows--grow">
        {ACCOUNTS.map(([name, seats]) => (
          <BizRow key={name} name={name} share={seats / top} value={seats} sub="1%" />
        ))}
      </div>
      <FootLink label="The other 319 accounts" value="49.4K" />
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
