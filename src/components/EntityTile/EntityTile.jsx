import { useId } from 'react'

const TILE_BOX = { display: 'block', flexShrink: 0 }

/**
 * EntityTile — the coloured square that marks an ACCOUNT by what kind it is.
 *
 * Ported verbatim from the MSP shell (shell/ProductTile.jsx). Where ProductTile
 * marks a product, this marks the entity type, and the colour IS the type:
 * purple = distributor, amber = partner, teal = customer.
 *
 * Colours stay literal rather than tokenised. They are the tile's identity, not
 * theme chrome — the reseller-theme swap deliberately does not re-tint them, and
 * a distributor is the same purple in every product that draws one. Lifted from
 * the SVGs they replace.
 *
 * The face and edge hang off `--pt-face` exactly like ProductTile, so a row hover
 * can drop the square and leave the glyph standing on the row's own fill. A plain
 * CSS `fill:` rule could not — the inline style would outrank it.
 *
 * Props
 * - type:   'distributor' | 'partner' | 'customer'   (unknown falls back to distributor)
 * - glyph:  SVG path string, drawn on the 24 viewBox — see GLYPHS in templateData
 * - size:   px (default 32)
 * - radius: viewBox units, NOT pixels (default 4.5)
 */
const ENTITY_TILE_COLORS = {
  distributor: { top: '#5e4890', bottom: '#493770', edgeTop: '#DDD3FF', edgeBottom: '#775CB1', glyph: '#ddd3ff' },
  partner: { top: '#874201', bottom: '#693200', edgeTop: '#FFCFB0', edgeBottom: '#A85504', glyph: '#ffcfb0' },
  customer: { top: '#00665e', bottom: '#044f48', edgeTop: '#9EEBE1', edgeBottom: '#068076', glyph: '#9eebe1' },
}

export function EntityTile({ type, glyph, size = 32, radius = 4.5, style }) {
  const uid = useId().replace(/:/g, '')
  const c = ENTITY_TILE_COLORS[type] ?? ENTITY_TILE_COLORS.distributor
  const face = `etf-${uid}`, edge = `ete-${uid}`, gl = `etg-${uid}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ ...TILE_BOX, ...style }} aria-hidden="true">
      <rect className="pt-face" width="24" height="24" rx={radius} style={{ fill: `var(--pt-face, url(#${face}))` }} />
      {/* Inset by 0.5 to sit ON the edge, so its radius is half a px tighter than the fill's. */}
      <rect className="pt-face" x="0.5" y="0.5" width="23" height="23" rx={radius - 0.5} fill="none" strokeOpacity="0.25"
        style={{ stroke: `var(--pt-face, url(#${edge}))` }} />
      <path d={glyph} fill={`url(#${gl})`} />
      <defs>
        <linearGradient id={face} x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor={c.top} /><stop offset="1" stopColor={c.bottom} /></linearGradient>
        <linearGradient id={edge} x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor={c.edgeTop} /><stop offset="1" stopColor={c.edgeBottom} /></linearGradient>
        {/* Glyph ramp: white → the tile's own tint. Kept even when the face is dropped — it's
            what stops the bare glyph reading as a flat white sticker on the hover fill. */}
        <linearGradient id={gl} x1="12" y1="5.4375" x2="12" y2="18.5625" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor={c.glyph} /></linearGradient>
      </defs>
    </svg>
  )
}
