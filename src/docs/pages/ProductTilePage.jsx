import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, RefTable, IC } from '../primitives.jsx'
import { ProductTile } from '../../components/SideNav/index.js'

/* Product glyphs — SVG path strings drawn on the tile's 32×32 grid, the same three
   the Side Nav page demonstrates with. */
const GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
}

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
        title="Two treatments"
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
    </ComponentPage>
  )
}
