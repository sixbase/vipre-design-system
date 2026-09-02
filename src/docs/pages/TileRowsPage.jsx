import { useState } from 'react'
import { DocPage } from '../DocPage.jsx'
import { Section, Preview, RefTable, IC } from '../primitives.jsx'
import { Inline, ProductTile, Progress, Stack, Text } from '../../components/index.js'
import { GLYPHS } from '../templateData.js'

/* The real rows off the MSP dashboard's "Seats by product" tile, figures included —
   a pattern page argued on invented data is a pattern page nobody can check against
   the thing it documents. */
const PRODUCTS = [
  { id: 'email-cloud', name: 'Email Cloud', glyph: GLYPHS.ies, seats: 3525, accounts: 53 },
  { id: 'edge-nordics', name: 'Edge Defense Nordics', glyph: GLYPHS.ies, seats: 3317, accounts: 42 },
  { id: 'atp', name: 'Advanced Threat Protection', glyph: GLYPHS.ies, seats: 3139, accounts: 47 },
  { id: 'exchange', name: 'ExchangeSMART Suite', glyph: GLYPHS.ies, seats: 3073, accounts: 45 },
  { id: 'ep-email', name: 'Endpoint+Email', glyph: GLYPHS.edr, seats: 2791, accounts: 52 },
  { id: 'edge', name: 'Edge Defense', glyph: GLYPHS.safesend, seats: 2784, accounts: 35 },
]

const TOP = PRODUCTS[0].seats

/* ---- the row ---------------------------------------------------------------------
   Five cells, and every one of them optional except the name. The mark and the name
   are ONE unit (8px apart, tighter than the row's own 12) because a mark that sits at
   the column gap reads as its own column and stops belonging to the word beside it. */
function TileRow({ product, current, onPick }) {
  const Tag = onPick ? 'button' : 'div'
  return (
    <Tag
      {...(onPick ? { type: 'button', onClick: onPick } : {})}
      className={['vds-tile-row', onPick && 'vds-tile-row--btn', current && 'vds-tile-row--current']
        .filter(Boolean).join(' ')}
    >
      <span className="vds-tile-row__mark" aria-hidden="true">
        <ProductTile glyph={product.glyph} tonal size={24} />
      </span>
      <span className="vds-tile-row__name">{product.name}</span>
      <span className="vds-tile-row__meter" aria-hidden="true">
        <Progress value={Math.round((product.seats / TOP) * 100)} size="sm" />
      </span>
      <span className="vds-tile-row__value">{product.seats.toLocaleString()}</span>
      <span className="vds-tile-row__sub">{product.accounts} accts</span>
    </Tag>
  )
}

function TileDemo() {
  const [picked, setPicked] = useState(null)
  return (
    <div className="vds-tile-rows">
      <header className="vds-tile-rows__head">
        <Inline gap={2} align="baseline">
          <Text as="h3" variant="title-xs">Seats by product</Text>
          <Text as="span" variant="detail" tone="subtle">Under contract</Text>
        </Inline>
        <button type="button" className="vds-tile-rows__action">Package Insights</button>
      </header>

      <div className="vds-tile-rows__body">
        {PRODUCTS.map((p) => (
          <TileRow
            key={p.id}
            product={p}
            current={picked === p.id}
            onPick={() => setPicked(picked === p.id ? null : p.id)}
          />
        ))}
      </div>

      {/* THE REMAINDER LINE, not a sixth row. It answers "and the rest?", which is the
          question a top-six always raises, and it must not look like something you can
          rank against the rows above it — so no mark, no meter, and a rule above. */}
      <footer className="vds-tile-rows__foot">
        <span>14 other products</span>
        <span className="vds-tile-row__value">32.2K</span>
      </footer>
    </div>
  )
}

/* The same row without a mark and without a meter — an account list, where nothing is a
   product and the figure is the whole point. The columns collapse rather than standing
   empty. */
const ACCOUNTS = [
  ['Sunbelt Brewing Services', 299], ['Atlas Agriculture Co', 298],
  ['Metro Environmental Group', 298], ['Sunrise Automotive LLC', 297],
]

function PlainDemo() {
  return (
    <div className="vds-tile-rows">
      <header className="vds-tile-rows__head">
        <Inline gap={2} align="baseline">
          <Text as="h3" variant="title-xs">Your biggest accounts</Text>
          <Text as="span" variant="detail" tone="subtle">Top 5 of 324</Text>
        </Inline>
      </header>
      <div className="vds-tile-rows__body">
        {ACCOUNTS.map(([name, seats]) => (
          <div key={name} className="vds-tile-row vds-tile-row--plain">
            <span className="vds-tile-row__name">{name}</span>
            <span className="vds-tile-row__meter" aria-hidden="true">
              <Progress value={Math.round((seats / 299) * 100)} size="sm" />
            </span>
            <span className="vds-tile-row__value">{seats}</span>
            <span className="vds-tile-row__sub">1%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TileRowsPage() {
  return (
    <DocPage
      title="Tile rows"
      description="A KPI tile whose body is a short ranked list — six products by seats, five accounts by size. Not a table: there is no sorting, no paging and no column you can choose, because the ranking IS the content. The tile answers one question and the rows show the shape of the answer."
    >
      <Section
        title="Anatomy"
        note="A head that names the cut, six rows at most, and a remainder line. Pick a row — the current one takes the same solid fill the page filter's current row takes, because it is the same claim: this is the one you are reading."
      >
        <Preview
          canvas={<TileDemo />}
          code={`<div className="vds-tile-rows">
  <header className="vds-tile-rows__head">…title, sub, action…</header>
  <div className="vds-tile-rows__body">
    <button className="vds-tile-row vds-tile-row--btn">
      <span className="vds-tile-row__mark"><ProductTile tonal size={24} /></span>
      <span className="vds-tile-row__name">Email Cloud</span>
      <span className="vds-tile-row__meter"><Progress value={100} size="sm" /></span>
      <span className="vds-tile-row__value">3,525</span>
      <span className="vds-tile-row__sub">53 accts</span>
    </button>
  </div>
  <footer className="vds-tile-rows__foot">…remainder…</footer>
</div>`}
        />
      </Section>

      <Section
        title="Without a mark"
        note="Accounts are not products, so there is no mark to draw and the column collapses rather than standing empty. An invented glyph on a row that has no product says the row is one."
      >
        <Preview canvas={<PlainDemo />} code={`<div className="vds-tile-row vds-tile-row--plain">…`} />
      </Section>

      <Section title="The rules">
        <RefTable
          headers={['', 'Value', 'Why']}
          rows={[
            ['Column gap', '12px', 'The row’s own rhythm, matching the dashboard’s other lists.'],
            ['Mark to name', '8px', 'Tighter than the rest on purpose — a mark belongs to the name beside it. One grid cannot vary its column gap, so the name pulls the 4px back.'],
            ['Row padding', '8px, with -8px margin', 'The fill reaches the tile’s inner edge while the text still stands off it. Padding alone leaves the hover floating in a box.'],
            ['Row corner', '6px', 'The row pill — the same shape the nav rows and the docs column use.'],
            ['Hover', '4% of --vds-ink', 'Translucent, never a surface step. These rows sit on a card, inside a tile, on the canvas; an absolute fill is only right against one of the three.'],
            ['Current row', '--vds-primary, solid', 'Same as the page filter. Exactly one row is ever current and it has to be findable without hunting.'],
            ['Figures', 'tabular-nums, right, fixed track', 'A ranked list is read down the numbers. Proportional digits and an elastic column both stop it being a column.'],
            ['The mark', 'optically centred', 'A line box reserves descender space the name does not use, so a box-centred mark rides high against the word.'],
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
            ['20', 'The row carries a name and one figure.', 'The package rail’s filter list.'],
            ['24', 'The row carries a meter, a figure AND a qualifier.', 'Seats by product, above — the mark steps up so it holds its own without leading.'],
            ['32', 'The row is a thing you are choosing, with a sentence about it.', 'The provisioning shelf.'],
          ]}
        />
      </Section>

      <Section
        title="What the prototype does today"
        note="Four implementations of this one row, measured off the running MSP shell. None of them is wrong on its own; together they are four answers to the same question, and the differences are invisible until two tiles sit side by side."
      >
        <RefTable
          headers={['', 'Gap', 'Padding', 'Corner', 'Hover']}
          rows={[
            ['.msp-biz-row', '12', '8', '6', '4% of ink — matches'],
            ['.msp-act-row', '10', '9 0', 'none', '--vds-surface-hover'],
            ['.msp-lc-row', '12', '7 0', 'none', '--vds-surface-sunken'],
            ['.msp-sell-row', '12', '8', '9', '--vds-surface-sunken'],
          ]}
        />
        <Stack gap={3} style={{ marginTop: '1.25rem' }}>
          <Text variant="body">
            <strong>Three hover treatments across four rows</strong>, and two of them are absolute
            surface steps. That is the one difference here that is a defect rather than a
            preference: <IC>--vds-surface-hover</IC> and <IC>--vds-surface-sunken</IC> are each
            correct against exactly one ground, and these rows sit on three.
          </Text>
          <Text variant="body">
            <strong>The corners disagree three ways</strong> — 6, 9, and none. A row with no corner
            cannot show a fill that reaches its own edge, so <IC>.msp-act-row</IC> and{' '}
            <IC>.msp-lc-row</IC> have no hover shape at all; their hover paints a rectangle the width
            of the tile. <IC>.msp-sell-row</IC>&rsquo;s 9 is off both radius scales.
          </Text>
          <Text variant="body">
            <strong>Only <IC>.msp-biz-row</IC> has been brought to this spec.</strong> The other three
            are the work: same gap, same padding, the 6px pill, and the ink-mix hover. Nothing about
            their columns needs to change — the differences that matter are the ones a reader notices
            when two tiles sit next to each other, and those are all in the chrome.
          </Text>
        </Stack>
      </Section>
    </DocPage>
  )
}
