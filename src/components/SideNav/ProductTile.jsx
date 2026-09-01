import { forwardRef, useId, useLayoutEffect, useRef, useState } from 'react'
import { cx } from '../../lib/cx.js'

/* Optically center a glyph on the 32×32 grid.

   Consumer glyphs are drawn to their OWN bounds — most Material Symbols sit a
   fraction off the tile's true center, and each by a different amount (measured:
   some land dead-on, some off by ~1px in x or y). Hand-nudging per glyph would be
   a magic number per product and would break the moment someone passes a new one.

   Instead we measure the rendered path box once and translate it so its center
   lands at (16,16). getBBox reports the ink's geometry in local coordinates and
   ignores the element's own transform, so this is stable — a re-measure returns
   the same box, never chasing its own tail. Below a quarter-px we leave it alone,
   so an already-centered glyph (like IES) takes an identity transform, not churn.
   Geometric center is the pragmatic read of "optical center" here; these product
   marks are visually balanced, so their ink center is their optical center. */
function CenteredGlyph({ glyph, fill, style }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState(undefined)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let b
    try {
      b = el.getBBox()
    } catch {
      return // not rendered (e.g. display:none) — leave it uncentered
    }
    if (!b.width && !b.height) return
    const dx = 16 - (b.x + b.width / 2)
    const dy = 16 - (b.y + b.height / 2)
    setTransform(Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25 ? undefined : `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
  }, [glyph])
  return <path ref={ref} d={glyph} transform={transform} fill={fill} style={style} />
}

/**
 * ProductTile
 *
 * The 32px rounded gradient tile that fronts a product in the SideNav. One
 * glyph drives two states: a vibrant brand-gradient tile when the product is
 * subscribed, and a muted flat-navy tile when it isn't (`muted`).
 *
 * TOKEN-BOUND GRADIENTS: every stop is a CSS custom property, so a reseller
 * re-brand re-tints the tiles along with the rest of the chrome —
 *   --vds-tile-accent (defaults to --vds-nav-accent) — gradient top + edge base
 *   --vds-tile-edge   (defaults to --vds-azure-400)  — the bright border highlight
 *   --vds-tile-tonal  (defaults to --vds-accent-cobalt) — the tonal wash + glyph
 * The tile bottoms out on the fixed midnight ramp, matching the navy rail.
 *
 * Props:
 * - glyph:    string — an SVG path `d` drawn on the 32×32 grid (see the SideNav
 *             docs for ready-made product glyphs). Optically centered for you —
 *             draw it to its own bounds and the tile lands it on center. Ignored
 *             when children given (center those yourself).
 * - children: custom SVG content (e.g. a <path>/<g>) rendered on the same
 *             32×32 grid instead of `glyph`. Muted tint is NOT applied to
 *             children — style them yourself.
 * - muted:    boolean — the locked / not-subscribed treatment (default false)
 * - tonal:    boolean — the LIGHT-SURFACE treatment: a 15% wash of the accent with
 *             the glyph in that accent at full strength. Use it on any white or
 *             near-white ground — a table row, a card, a drawer, a modal. The other
 *             two treatments are drawn for the navy rail and read as a heavy block
 *             on a light surface. One tone, not a per-product palette; see the note
 *             on the branch below. (default false)
 * - size:     number — rendered px size (default 32)
 * - label:    accessible name; without it the tile is decorative (aria-hidden)
 * - all native SVG attributes
 *
 * @example
 * <ProductTile glyph={IES_GLYPH} />
 * <ProductTile glyph={SAT_GLYPH} muted />   // locked product
 * <ProductTile glyph={IES_GLYPH} size={24} />
 * <ProductTile glyph={IES_GLYPH} tonal size={20} />  // in a table row
 */
export const ProductTile = forwardRef(function ProductTile(
  { glyph, muted = false, tonal = false, size = 32, label, className, children, style, ...props },
  ref,
) {
  // Gradient defs need document-unique ids — useId keeps repeated tiles apart.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }

  /* TONAL — the light-surface treatment, and the only one of the three that is not
     built for the navy rail.

     The other two assume a dark ground and say so in their values: the gradient runs
     accent → midnight-1000, and `muted` IS midnight-900. Put either on a white table
     row and you get a heavy block in every row — measured on this docs site before
     this variant existed, sixteen cobalt-to-near-black squares on a #ffffff table.

     ONE TONE, NOT A PALETTE. The face is a 15% wash of the accent and the glyph is
     that same accent at full strength, so the tile reads as one object tinted once
     rather than as a mark inside a coloured box. Per-product hues were considered and
     are not here: twenty SKUs share five glyphs, so colour would be the only thing
     telling four of them apart, and a palette that carries meaning has to survive
     colour blindness, dark mode and a reseller re-brand. One blue survives all three.

     The 15% is the same in both grounds. Against white it is a wash you can read a
     glyph out of; against the dark surface the accent role has already stepped to
     cobalt-400, so the mix lands brighter on its own without a second number. */
  const tonalGl = `vds-pttg-${uid}`

  if (tonal) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={cx('vds-product-tile', 'vds-product-tile--tonal', className)}
        style={{ display: 'block', ...style }}
        {...a11y}
        {...props}
      >
        <rect
          width="32" height="32" rx="8"
          style={{ fill: 'color-mix(in srgb, var(--vds-tile-tonal, var(--vds-accent-cobalt)) 15%, transparent)' }}
        />
        {/* THE RIM, which the gradient variant has always had and this one was missing.
            Inset half a pixel on the 32-grid so the 1px stroke sits INSIDE the tile's
            edge rather than straddling it — the same geometry the gradient tile uses, and
            why its radius is 7.5 against the fill's 8.

            It is not decoration. A 15% wash is within about 1.07 of white, so on a
            hovered row, a selected row or a zebra stripe the tile loses its shape exactly
            the way the Badge and Tag chips did before they took an edge. This is the same
            fix a third time: a fill answers one ground, an edge answers all of them.

            30%, not the gradient variant's 0.25 stroke opacity — that rim is a bright
            highlight on a saturated block and only has to catch the light. This one is
            the only thing holding the shape. */}
        <rect
          x="0.5" y="0.5" width="31" height="31" rx="7.5"
          style={{ stroke: 'color-mix(in srgb, var(--vds-tile-tonal, var(--vds-accent-cobalt)) 30%, transparent)' }}
        />
        {/* THE MARK RUNS MIDNIGHT, THE TILE KEEPS THE PRODUCT'S COLOUR. Drawn in the
            product's own accent, a shelf of these was twenty differently-coloured glyphs
            whose only shared trait was the shape of the box. One ink makes them read as a
            set, and the tile behind still carries the identity.

            Both grounds converge on midnight-400 from the far end of the ramp that ground
            allows — see --vds-tile-glyph-from. On the dark surface it starts at 200 rather
            than 900 because midnight-900 IS that surface, and half the glyph would be
            drawn in the background colour. */}
        {children ?? (glyph && (
          <CenteredGlyph glyph={glyph} fill={`url(#${tonalGl})`} />
        ))}
        <defs>
          <linearGradient id={tonalGl} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--vds-tile-glyph-from, var(--vds-midnight-900))" />
            <stop offset="1" stopColor="var(--vds-tile-glyph-to, var(--vds-midnight-400))" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (muted) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={cx('vds-product-tile', 'vds-product-tile--muted', className)}
        style={{ display: 'block', ...style }}
        {...a11y}
        {...props}
      >
        <rect width="32" height="32" rx="8" style={{ fill: 'var(--vds-midnight-900)' }} />
        {children ?? (glyph && <CenteredGlyph glyph={glyph} style={{ fill: 'var(--vds-midnight-400)' }} />)}
      </svg>
    )
  }

  const bg = `vds-ptbg-${uid}`
  const bd = `vds-ptbd-${uid}`
  const gl = `vds-ptgl-${uid}`
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cx('vds-product-tile', className)}
      style={{ display: 'block', ...style }}
      {...a11y}
      {...props}
    >
      <rect width="32" height="32" rx="8" fill={`url(#${bg})`} />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke={`url(#${bd})`} strokeOpacity="0.25" />
      {children ?? (glyph && <CenteredGlyph glyph={glyph} fill={`url(#${gl})`} />)}
      <defs>
        {/* Tile face: accent → deepest navy, top-lit. */}
        <linearGradient id={bg} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--vds-tile-accent, var(--vds-nav-accent))' }} />
          <stop offset="1" style={{ stopColor: 'var(--vds-midnight-1000)' }} />
        </linearGradient>
        {/* Edge highlight: bright azure catching the top edge, fading to accent. */}
        <linearGradient id={bd} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--vds-tile-edge, var(--vds-azure-400))' }} />
          <stop offset="1" style={{ stopColor: 'var(--vds-tile-accent, var(--vds-nav-accent))' }} />
        </linearGradient>
        {/* Glyph: white → soft navy, so the mark reads lit from above. */}
        <linearGradient id={gl} x1="16" y1="8" x2="16" y2="24" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--vds-white)' }} />
          <stop offset="1" style={{ stopColor: 'var(--vds-midnight-400)' }} />
        </linearGradient>
      </defs>
    </svg>
  )
})

ProductTile.displayName = 'ProductTile'
