import { useState, useLayoutEffect, useRef } from 'react'
import { DocPage } from '../DocPage.jsx'
import { Section, IC } from '../primitives.jsx'
import { Text } from '../../components/index.js'
import { SegmentedControl } from '../../components/SegmentedControl/index.js'
import { PRIMITIVES } from '../tokens.js'
import { GLYPHS } from '../templateData.js'

/* ============================================================================
   Gradient Explorer — a scratchpad for previewing vertical color gradients on
   the real MSP product-tile glyphs. Every family gets the same five ramp spreads
   so you can eyeball which pairing reads best as a product tile. Colors come from
   the primitive ramps (var(--vds-{family}-{step})); the glyphs are lifted verbatim
   from the scope-navigator prototype's shell/productGlyphs.js.
   ========================================================================== */

/* The same four marks every other page draws, under this page's own name — it reads
   them as "product glyphs" while the rest read them as "glyphs". Aliased rather than
   renamed throughout, so the ramp tables below keep the vocabulary they were written
   in. Was a fourth verbatim copy of the paths. */
const PRODUCT_GLYPHS = GLYPHS

const GLYPH_OPTIONS = [
  { value: 'ies', label: 'IES' },
  { value: 'safesend', label: 'SafeSend' },
  { value: 'edr', label: 'EDR' },
  { value: 'sat', label: 'SAT' },
  { value: 'archive', label: 'Archive' },
]

/* Five ramp spreads — [lighter step, darker step]. Tight pairs stay in the mids;
   wide pairs stretch the whole family. */
const PAIRS = [
  [100, 600],
  [200, 700],
  [300, 800],
  [400, 900],
  [500, 950],
]

const FAMILIES = PRIMITIVES.map((p) => ({ name: p.name, key: p.name.toLowerCase() }))

/* Ramp positions, light → dark. `lighten(step, n)` walks n positions toward 50,
   clamped. The prototype's product tile drew its outline from --tile-edge (azure-400)
   down to --nav-accent (cobalt-600) — a 2-step ramp distance, a bright rim fading into
   the fill's top color. We recreate that per family: EDGE_DISTANCE steps lighter than
   the fill's top, at the same 0.25 stroke opacity. */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000]
const EDGE_DISTANCE = 2
const lighten = (step, n) => STEPS[Math.max(0, STEPS.indexOf(step) - n)]

/* One 64px tile: a vertical gradient of `family` between two ramp steps, with the
   product glyph on top. Direction flips which step sits at the top. `offset`
   optically centers the glyph on the 32-grid (glyphs aren't all drawn on 16,16). */
function GradientTile({ family, light, dark, direction, glyph, mode, offset, id }) {
  const top = direction === 'light-dark' ? light : dark
  const bottom = direction === 'light-dark' ? dark : light
  const edge = lighten(top, EDGE_DISTANCE) // outline rim: 2 steps lighter than the fill's top
  const gradId = `grad-${id}`
  const edgeId = `edge-${id}`
  const tileFill = mode === 'tile' ? `url(#${gradId})` : `var(--vds-${family}-50)`
  const glyphFill = mode === 'glyph' ? `url(#${gradId})` : '#fff'
  return (
    <svg width="64" height="64" viewBox="0 0 32 32" fill="none" style={{ display: 'block' }} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={tileFill} />
      {/* Gradient outline — mirrors the prototype's tile-edge → accent rim. */}
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke={`url(#${edgeId})`} strokeOpacity="0.25" />
      <path d={PRODUCT_GLYPHS[glyph]} fill={glyphFill} transform={`translate(${offset.dx} ${offset.dy})`} />
      <defs>
        <linearGradient id={gradId} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor={`var(--vds-${family}-${top})`} />
          <stop offset="1" stopColor={`var(--vds-${family}-${bottom})`} />
        </linearGradient>
        <linearGradient id={edgeId} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor={`var(--vds-${family}-${edge})`} />
          <stop offset="1" stopColor={`var(--vds-${family}-${top})`} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function GradientExplorerPage() {
  const [glyph, setGlyph] = useState('ies')
  // Default to dark → light so the saturated/dark step sits at the top, matching the
  // prototype tile — this puts the fill's top at a dark step, so the 2-step-lighter
  // gradient outline reads (a pale top would swallow it).
  const [direction, setDirection] = useState('dark-light')
  const [mode, setMode] = useState('tile')

  // Optically center the glyph: measure its real bounding box and translate so the
  // bbox center lands on (16,16). The source glyphs aren't all drawn on-center
  // (sat/archive sit ~1px right), so a fixed viewBox leaves them visibly off.
  const measureRef = useRef(null)
  const [offset, setOffset] = useState({ dx: 0, dy: 0 })
  useLayoutEffect(() => {
    const p = measureRef.current
    if (!p) return
    const b = p.getBBox()
    setOffset({ dx: 16 - (b.x + b.width / 2), dy: 16 - (b.y + b.height / 2) })
  }, [glyph])

  return (
    <DocPage
      title="Gradient Explorer"
      description="A scratchpad for previewing vertical color gradients on the real MSP product-tile glyphs. Pick a glyph, a direction, and where the gradient lands, then scan every color family across five ramp spreads — from tight mid-tone pairs to full-range stretches. Colors are the primitive ramps; the glyphs come straight from the scope-navigator prototype."
    >
      {/* Hidden probe: measured for optical centering (see offset above). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        style={{ position: 'absolute', left: -9999, top: -9999, width: 32, height: 32 }}
      >
        <path ref={measureRef} d={PRODUCT_GLYPHS[glyph]} />
      </svg>
      <Section title="Controls" note="Everything below updates live.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--vds-space-6)' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vds-space-2)' }}>
            <Text variant="eyebrow" tone="muted">Product glyph</Text>
            <SegmentedControl options={GLYPH_OPTIONS} value={glyph} onChange={setGlyph} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vds-space-2)' }}>
            <Text variant="eyebrow" tone="muted">Direction</Text>
            <SegmentedControl
              options={[
                { value: 'light-dark', label: 'Light → Dark' },
                { value: 'dark-light', label: 'Dark → Light' },
              ]}
              value={direction}
              onChange={setDirection}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vds-space-2)' }}>
            <Text variant="eyebrow" tone="muted">Gradient on</Text>
            <SegmentedControl
              options={[
                { value: 'tile', label: 'Tile' },
                { value: 'glyph', label: 'Glyph' },
              ]}
              value={mode}
              onChange={setMode}
            />
          </label>
        </div>
        <Text variant="caption" tone="muted" style={{ marginTop: 'var(--vds-space-3)', display: 'block' }}>
          <strong>Tile</strong> paints the gradient behind a white glyph (the real product-tile look);{' '}
          <strong>Glyph</strong> fills the glyph itself over a faint <IC>--vds-{'{family}'}-50</IC> tile.
        </Text>
      </Section>

      <Section
        title="Every family × five ramp spreads"
        note="Rows are the 12 primitive families; columns step from a tight mid-tone pair (100 · 600) to a full-range stretch (500 · 950)."
      >
        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `minmax(6rem, max-content) repeat(${PAIRS.length}, 1fr)`,
              gap: 'var(--vds-space-4)',
              alignItems: 'center',
              minWidth: 'max-content',
            }}
          >
            {/* header row */}
            <span />
            {PAIRS.map(([l, d]) => (
              <Text key={`${l}-${d}`} variant="detail" tone="muted" className="vds-mono" style={{ textAlign: 'center' }}>
                {l} · {d}
              </Text>
            ))}
            {/* family rows */}
            {FAMILIES.map((fam) => (
              <FamilyRow key={fam.key} fam={fam} glyph={glyph} direction={direction} mode={mode} offset={offset} />
            ))}
          </div>
        </div>
      </Section>
    </DocPage>
  )
}

/* A wrapper so React keys stay stable per family without a Fragment key warning. */
function FamilyRow({ fam, glyph, direction, mode, offset }) {
  return (
    <>
      <Text variant="caption" style={{ fontWeight: 'var(--vds-weight-medium)' }}>{fam.name}</Text>
      {PAIRS.map(([light, dark]) => (
        <div key={`${fam.key}-${light}-${dark}`} style={{ display: 'flex', justifyContent: 'center' }}>
          <GradientTile
            family={fam.key}
            light={light}
            dark={dark}
            direction={direction}
            glyph={glyph}
            mode={mode}
            offset={offset}
            id={`${fam.key}-${light}-${dark}`}
          />
        </div>
      ))}
    </>
  )
}
