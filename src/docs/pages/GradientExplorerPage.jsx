import { useState, useLayoutEffect, useRef } from 'react'
import { DocPage } from '../DocPage.jsx'
import { Section, IC } from '../primitives.jsx'
import { Text } from '../../components/index.js'
import { SegmentedControl } from '../../components/SegmentedControl/index.js'
import { PRIMITIVES } from '../tokens.js'

/* ============================================================================
   Gradient Explorer — a scratchpad for previewing vertical color gradients on
   the real MSP product-tile glyphs. Every family gets the same five ramp spreads
   so you can eyeball which pairing reads best as a product tile. Colors come from
   the primitive ramps (var(--vds-{family}-{step})); the glyphs are lifted verbatim
   from the scope-navigator prototype's shell/productGlyphs.js.
   ========================================================================== */

/* 32×32 product-tile glyphs, straight from the MSP v2 prototype. */
const PRODUCT_GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
  sat: 'M17 26.2115L8.25 21.3558V11.6443L17 6.7885L25.75 11.6443V21.3558L17 26.2115ZM14.148 14.0578C14.5122 13.6449 14.941 13.3238 15.4345 13.0943C15.9282 12.8648 16.45 12.75 17 12.75C17.55 12.75 18.0718 12.8648 18.5655 13.0943C19.059 13.3238 19.4878 13.6449 19.852 14.0578L23.4098 12.075L17 8.5115L10.5903 12.075L14.148 14.0578ZM16.25 24.073V20.1828C15.3692 19.9878 14.649 19.548 14.0895 18.8635C13.5298 18.1788 13.25 17.391 13.25 16.5C13.25 16.2975 13.2632 16.1074 13.2895 15.9298C13.3157 15.7523 13.3602 15.5705 13.423 15.3845L9.75 13.327V20.4693L16.25 24.073ZM18.5953 18.0953C19.0318 17.6588 19.25 17.127 19.25 16.5C19.25 15.873 19.0318 15.3413 18.5953 14.9048C18.1588 14.4683 17.627 14.25 17 14.25C16.373 14.25 15.8413 14.4683 15.4048 14.9048C14.9683 15.3413 14.75 15.873 14.75 16.5C14.75 17.127 14.9683 17.6588 15.4048 18.0953C15.8413 18.5318 16.373 18.75 17 18.75C17.627 18.75 18.1588 18.5318 18.5953 18.0953ZM17.75 24.073L24.25 20.4693V13.327L20.577 15.3845C20.6398 15.5705 20.6843 15.7523 20.7105 15.9298C20.7368 16.1074 20.75 16.2975 20.75 16.5C20.75 17.391 20.4702 18.1788 19.9105 18.8635C19.351 19.548 18.6308 19.9878 17.75 20.1828V24.073Z',
  archive: 'M13.3125 25.251C12.1567 24.7517 11.1487 24.0718 10.2885 23.2115C9.42817 22.3513 8.74833 21.3433 8.249 20.1875C7.74967 19.0317 7.5 17.7999 7.5 16.4923C7.5 15.1846 7.74967 13.9554 8.249 12.8048C8.74833 11.6541 9.42817 10.6487 10.2885 9.7885C11.1487 8.92817 12.1567 8.24833 13.3125 7.749C14.4683 7.24967 15.7001 7 17.0078 7C18.3154 7 19.5446 7.24967 20.6953 7.749C21.8459 8.24833 22.8513 8.92817 23.7115 9.7885C24.5718 10.6487 25.2517 11.6541 25.751 12.8048C26.2503 13.9554 26.5 15.1846 26.5 16.4923C26.5 17.7999 26.2503 19.0317 25.751 20.1875C25.2517 21.3433 24.5718 22.3513 23.7115 23.2115C22.8513 24.0718 21.8459 24.7517 20.6953 25.251C19.5446 25.7503 18.3154 26 17.0078 26C15.7001 26 14.4683 25.7503 13.3125 25.251ZM17 24.4788C17.5103 23.8019 17.9398 23.1192 18.2885 22.4307C18.6372 21.7422 18.9212 20.9897 19.1405 20.173H14.8595C15.0917 21.0153 15.3789 21.7808 15.7213 22.4693C16.0634 23.1578 16.4897 23.8276 17 24.4788ZM15.0635 24.2038C14.6802 23.6538 14.3359 23.0285 14.0308 22.328C13.7256 21.6273 13.4884 20.909 13.3192 20.173H9.927C10.4552 21.2115 11.1635 22.084 12.052 22.7905C12.9405 23.4968 13.9443 23.9679 15.0635 24.2038ZM18.9365 24.2038C20.0557 23.9679 21.0595 23.4968 21.948 22.7905C22.8365 22.084 23.5448 21.2115 24.073 20.173H20.6807C20.4794 20.9153 20.2262 21.6368 19.921 22.3375C19.616 23.0382 19.2878 23.6603 18.9365 24.2038ZM9.298 18.673H13.0155C12.9527 18.3013 12.9071 17.9369 12.8787 17.5798C12.8506 17.2228 12.8365 16.8628 12.8365 16.5C12.8365 16.1372 12.8506 15.7773 12.8787 15.4203C12.9071 15.0631 12.9527 14.6987 13.0155 14.327H9.298C9.20183 14.6667 9.12817 15.0198 9.077 15.3865C9.02567 15.7532 9 16.1243 9 16.5C9 16.8757 9.02567 17.2468 9.077 17.6135C9.12817 17.9802 9.20183 18.3333 9.298 18.673ZM14.5152 18.673H19.4848C19.5474 18.3013 19.5929 17.9402 19.6212 17.5895C19.6494 17.2388 19.6635 16.8757 19.6635 16.5C19.6635 16.1243 19.6494 15.7612 19.6212 15.4105C19.5929 15.0598 19.5474 14.6987 19.4848 14.327H14.5152C14.4526 14.6987 14.4071 15.0598 14.3787 15.4105C14.3506 15.7612 14.3365 16.1243 14.3365 16.5C14.3365 16.8757 14.3506 17.2388 14.3787 17.5895C14.4071 17.9402 14.4526 18.3013 14.5152 18.673ZM20.9845 18.673H24.702C24.7982 18.3333 24.8718 17.9802 24.923 17.6135C24.9743 17.2468 25 16.8757 25 16.5C25 16.1243 24.9743 15.7532 24.923 15.3865C24.8718 15.0198 24.7982 14.6667 24.702 14.327H20.9845C21.0473 14.6987 21.0929 15.0631 21.1212 15.4203C21.1494 15.7773 21.1635 16.1372 21.1635 16.5C21.1635 16.8628 21.1494 17.2228 21.1212 17.5798C21.0929 17.9369 21.0473 18.3013 20.9845 18.673ZM20.6807 12.827H24.073C23.5385 11.7757 22.835 10.9032 21.9625 10.2095C21.09 9.516 20.0813 9.04167 18.9365 8.7865C19.3198 9.3685 19.6608 10.0051 19.9595 10.6962C20.2583 11.3872 20.4987 12.0975 20.6807 12.827ZM14.8595 12.827H19.1405C18.9083 11.991 18.6163 11.2208 18.2645 10.5163C17.9125 9.81175 17.491 9.14675 17 8.52125C16.509 9.14675 16.0875 9.81175 15.7355 10.5163C15.3837 11.2208 15.0917 11.991 14.8595 12.827ZM9.927 12.827H13.3192C13.5012 12.0975 13.7417 11.3872 14.0405 10.6962C14.3392 10.0051 14.6802 9.3685 15.0635 8.7865C13.9122 9.04167 12.9019 9.51767 12.0328 10.2145C11.1634 10.9112 10.4615 11.782 9.927 12.827Z',
}

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
