import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, RefTable, IC } from '../primitives.jsx'
import { ProductTile } from '../../components/SideNav/index.js'
import { GLYPHS } from '../templateData.js'


/* The four sizes, and the job each one does. Plain numbers rather than named steps:
   the number already says what it means, and four names would be four more things to
   remember about a 32px square. */
const SIZES = [
  { size: 20, use: 'Inside a row',
    detail: 'The tile identifies; the name beside it does the talking. Small enough that a row of them does not become a column of colour.',
    where: 'Table cells, cart lines, add-on lists' },
  { size: 24, use: 'A denser card',
    detail: 'A row that carries more than a name — a figure, a status — and needs the mark to hold its own without leading.',
    where: 'Review lines, seats-by-product, a selection cart' },
  { size: 32, use: 'The default',
    detail: 'Reach for this one unless the context argues otherwise. It is the size the glyphs were drawn at, so it is the one that needs no scaling.',
    where: 'Card headers, catalogue rows, the nav rail' },
  { size: 40, use: 'A hero',
    detail: 'The product is the subject of the surface rather than an item on it. One per view — a second 40 competing with the first is how a page loses its subject.',
    where: 'Detail headers, manage drawers, the tile you pick off a shelf' },
]

const ROW = { display: 'flex', alignItems: 'center', gap: 'var(--vds-space-4)' }
const NAVY = {
  display: 'flex', alignItems: 'center', gap: 'var(--vds-space-3)',
  background: 'var(--vds-midnight-1000, #00132e)',
  padding: 'var(--vds-space-4)', borderRadius: 'var(--vds-radius-md)',
}
const LIST = { display: 'flex', flexDirection: 'column', gap: 'var(--vds-space-3)', width: '100%', maxWidth: 340 }

/* A table row, built the way the guidance below describes: a fixed track for the mark,
   a flexible one for the name, the figures sized by their headings. The 12px gap is the
   table's; the name cell pulls 4px back so the mark reads as belonging to it. */
const TROW = {
  display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr) 88px',
  alignItems: 'center', gap: 12, padding: '7px 12px',
}
const TNAME = { marginLeft: -4, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const TNUM = { textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--vds-ink-muted)' }
const THEAD = {
  ...TROW, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase',
  color: 'var(--vds-ink-subtle)', borderBottom: '1px solid var(--vds-line)',
}
const TWRAP = { width: '100%', maxWidth: 360, fontSize: 13, color: 'var(--vds-ink)' }

export function ProductTilePage() {
  return (
    <ComponentPage
      title="Product Tile"
      description="The rounded square that fronts a product — a glyph on a brand-gradient tile when the product is subscribed, and a flat navy one when it isn't. It began as a Side Nav part and is used far more often outside it: in tables, cards, pickers, drawers and toasts."
      installCode={"import { ProductTile } from 'vipre-design-system'"}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'glyph' }, { code: 'string' }, '—', 'An SVG path drawn on the 32×32 grid — the tile optically centers it for you'],
            [{ code: 'children' }, { code: 'node' }, '—', 'Custom SVG content instead of a glyph (center it yourself)'],
            [{ code: 'muted' }, { code: 'boolean' }, { code: 'false' }, 'The flat navy “not subscribed” treatment'],
            [{ code: 'tonal' }, { code: 'boolean' }, { code: 'false' }, 'The light-surface treatment — a 15% wash of the accent, glyph in that accent. Use on any white ground'],
            [{ code: 'size' }, { code: 'number' }, { code: '32' }, 'Rendered size in px — 20, 24, 32 or 40'],
            [{ code: 'label' }, { code: 'string' }, '—', 'Accessible name; without it the tile is decorative'],
          ],
        },
      ]}
      accessibility={[
        <>Give it a <IC>label</IC> when the tile is the only thing naming the product. Beside a written name it is decoration, and stays <IC>aria-hidden</IC> — which is the default.</>,
        <>The glyph is optically centered by measuring its rendered box, not by hand-tuned offsets, so a new product mark lands on center without anyone nudging it.</>,
      ]}
    >
      <Section
        title="Three treatments"
        note="One glyph drives both. The gradient says the account has this product; the flat navy says it does not."
      >
        <Preview
          canvas={
            <div style={NAVY}>
              <ProductTile glyph={GLYPHS.ies} size={40} />
              <ProductTile glyph={GLYPHS.safesend} size={40} />
              <ProductTile glyph={GLYPHS.edr} size={40} muted />
            </div>
          }
          code={'<ProductTile glyph={IES} />\n<ProductTile glyph={EDR} muted />   // not subscribed'}
        />
        <p>
          Both are built for a dark ground. The gradient bottoms out on the midnight ramp and{' '}
          <IC>muted</IC> is midnight-900, so on a white card the muted tile reads as a hole rather
          than as a product the account has not bought. On light surfaces, prefer the gradient tile
          or leave the product unmarked.
        </p>
      </Section>

      <Section
        title="On a light surface"
        note="The two treatments above are drawn for the navy rail — the gradient runs accent to midnight-1000, and muted IS midnight-900. On a white table row either one reads as a heavy block. This is the third, and every table, card, drawer and modal in the product wants it."
      >
        <Preview
          canvas={
            <div style={{ ...ROW, background: 'var(--vds-surface)', padding: 'var(--vds-space-4)', borderRadius: 'var(--vds-radius-md)', border: '1px solid var(--vds-line)' }}>
              <ProductTile glyph={GLYPHS.ies} tonal size={20} />
              <ProductTile glyph={GLYPHS.safesend} tonal size={24} />
              <ProductTile glyph={GLYPHS.edr} tonal size={32} />
              <ProductTile glyph={GLYPHS.ies} tonal size={40} />
            </div>
          }
          code={'<ProductTile glyph={IES} tonal size={20} />   // a table row\n<ProductTile glyph={IES} tonal size={24} />   // a denser card\n<ProductTile glyph={IES} tonal />             // 32, the default\n<ProductTile glyph={IES} tonal size={40} />   // a hero'}
        />
        <p>
          <strong>One tone, not a palette.</strong> The face is a 15% wash of the accent and the glyph
          is that same accent at full strength, so the tile reads as one object tinted once rather than
          a mark inside a coloured box. Per-product hues are deliberately not here: twenty SKUs share
          five glyphs, so colour would be the only thing separating four of them — and a palette that
          carries meaning has to survive colour blindness, dark mode and a reseller re-brand. One blue
          survives all three. It moves with <IC>--vds-tile-tonal</IC> if a brand needs it to.
        </p>
      </Section>

      <Section
        title="Four sizes"
        note="Not a named scale — pass the number. These four cover every use; anything between them is drift. The corner column is not a prop: it is what the fixed rx renders to once the tile is scaled."
      >
        <Preview
          canvas={
            <div style={ROW}>
              {SIZES.map(({ size }) => (
                <ProductTile key={size} glyph={GLYPHS.ies} size={size} />
              ))}
            </div>
          }
          code={'<ProductTile glyph={IES} size={20} />   // inside a row\n<ProductTile glyph={IES} size={24} />   // a denser card\n<ProductTile glyph={IES} />             // 32, the default\n<ProductTile glyph={IES} size={40} />   // a hero'}
        />
        <RefTable
          headers={['', 'Size', 'Corner', 'What it is for', 'Where it appears']}
          rows={SIZES.map(({ size, use, detail, where }) => [
            <ProductTile glyph={GLYPHS.ies} size={size} />,
            <IC>{String(size)}</IC>,
            <span style={{ whiteSpace: 'nowrap' }}>{size / 4}px</span>,
            <><strong>{use}</strong><br />{detail}</>,
            where,
          ])}
        />
      </Section>

      <Section
        title="The corner takes care of itself"
        note="A quarter of the tile, at every size, without anyone asking for it."
      >
        <Preview
          canvas={
            <div style={ROW}>
              {SIZES.map(({ size }) => (
                <ProductTile key={size} glyph={GLYPHS.safesend} size={size} />
              ))}
            </div>
          }
          code={'20px → 5px corner\n24px → 6px\n32px → 8px\n40px → 10px'}
        />
        <p>
          The tile draws on a fixed <IC>0 0 32 32</IC> viewBox and is scaled to <IC>size</IC>, so its{' '}
          <IC>rx</IC> of 8 is <strong>eight viewBox units, not eight pixels</strong>. Scaling carries
          the corner along with everything else, and it lands on a quarter of the tile whatever the
          tile is.
        </p>
        <p>
          Worth stating plainly, because reading <IC>rx</IC> as pixels is an easy mistake and a quiet
          one. Code that “corrects” the corner by passing a radius of <IC>size / 4</IC> gets 3.75px at
          20 and 12.5px at 40 — the two ends drifting in opposite directions away from the default it
          was trying to reproduce. There is no radius prop here, and that is deliberate.
        </p>
      </Section>

      <Section
        title="Off the rail"
        note="Most of this component's use is not in a side nav."
      >
        <Preview
          canvas={
            <div style={LIST}>
              {[['Email Cloud', 58], ['Advanced Threat Protection', 57], ['Endpoint+Email', 55]].map(([name, n]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--vds-space-3)' }}>
                  <ProductTile glyph={GLYPHS.ies} size={20} />
                  <span style={{ flex: 1, minWidth: 0, color: 'var(--vds-ink)' }}>{name}</span>
                  <span style={{ color: 'var(--vds-ink-muted)', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
                </div>
              ))}
            </div>
          }
          code={'<ProductTile glyph={glyphFor(pkg)} size={20} />'}
        />
        <p>
          A product named anywhere should wear its mark: a reader who has learned the SafeSend tile
          should not have to re-learn the SafeSend name in a table. Use the tile wherever a product is
          named — and use it rather than a general-purpose icon, which says “something about email”
          where the tile says “this product”.
        </p>
      </Section>

      <Section
        title="In a table"
        note="The most common place this component appears, and the only one with mechanics worth stating."
      >
        <Preview
          canvas={
            <div style={TWRAP}>
              <div style={THEAD}>
                <span />
                <span style={TNAME}>Package</span>
                <span style={TNUM}>Customers</span>
              </div>
              {[['Email Cloud', 58, GLYPHS.ies], ['SafeSend + AI', 48, GLYPHS.safesend], ['Endpoint+Email', 55, GLYPHS.edr]].map(([name, n, g]) => (
                <div key={name} style={TROW}>
                  <ProductTile glyph={g} size={20} />
                  <span style={TNAME}>{name}</span>
                  <span style={TNUM}>{n}</span>
                </div>
              ))}
              <div style={TROW}>
                <span />
                <span style={TNAME}>All packages</span>
                <span style={TNUM}>324</span>
              </div>
            </div>
          }
          code={'<div className="row">          {/* 20px  minmax(0,1fr)  88px */}\n  <ProductTile glyph={glyphFor(pkg)} size={20} />\n  <span className="name">{pkg.name}</span>\n  <span className="num">{pkg.customers}</span>\n</div>'}
        />
        <RefTable
          headers={['Rule', 'Value', 'Why']}
          rows={[
            ['Tile size', <IC>20</IC>,
              'Big enough to tell two products apart at a glance, small enough that a column of them does not become a stripe of colour down the page.'],
            ['The mark column heading', 'None',
              'There is nothing to sort it by and nothing to call it. It still needs its cell — without one, every heading sits a mark-width left of the column it names.'],
            ['Its track', 'Fixed at the tile size',
              <>Never <IC>auto</IC> or a fraction. The mark must not shrink when a long product name squeezes the row.</>],
            ['Mark to name', <span style={{ whiteSpace: 'nowrap' }}>8px</span>,
              'Tighter than the table\u2019s other gaps, because a mark belongs to the name beside it. An even gap all the way across leaves it adrift between two columns.'],
            ['Every other gap', <span style={{ whiteSpace: 'nowrap' }}>12px</span>,
              <>One grid cannot vary its column gap, so the row runs at 12 and the name cell pulls back the difference with <IC>margin-left: -4px</IC>.</>],
            ['A row with no product', 'Keep the slot, leave it empty',
              'A totals or “all” row is not a product, and inventing a mark for it says that it is. Drop the cell instead and its name lands a mark-width left of every other name in the column.'],
            ['Vertical alignment', 'Optically centred',
              'The tile\u2019s ink fills its box; text sits high in its line box. Centring the two boxes leaves the name looking low.'],
          ]}
        />
        <p>
          One thing to check before adding the column at all: <strong>a tile only identifies a product
          if the products have different glyphs.</strong> A set that falls back to one shared mark for
          most of its rows produces a column that repeats the same square down the page — which reads
          as decoration, costs a column of width, and tells the reader nothing the name did not.
          Draw the marks first, or leave the column out.
        </p>
      </Section>
    </ComponentPage>
  )
}
