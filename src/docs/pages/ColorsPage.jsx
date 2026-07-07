import { Copy } from '@icons'
import { DocPage } from '../DocPage.jsx'
import { Section } from '../primitives.jsx'
import { Text, Icon } from '../../components/index.js'
import { PRIMITIVES, SEMANTIC_GROUPS } from '../tokens.js'
import { useRef, useState } from 'react'

/* The copy affordance shown on swatch hover/focus — a chip that floats over
   any color (opaque surface) with a copy glyph. */
function CopyHint() {
  return (
    <span className="vds-swatch-copy" aria-hidden="true">
      <Icon as={Copy} size="xs" />
    </span>
  )
}

/* Turn a computed `rgb(r, g, b)` string into #rrggbb (for semantic swatches,
   whose displayed value is a resolved CSS custom property, not a literal hex). */
function rgbToHex(value) {
  const m = String(value).match(/\d+(?:\.\d+)?/g)
  if (!m || m.length < 3) return value
  return '#' + m.slice(0, 3).map((n) => Math.round(Number(n)).toString(16).padStart(2, '0')).join('')
}

/* Click-to-copy with a single transient toast showing the copied hex. */
function useCopy() {
  const [copied, setCopied] = useState(null)
  const timer = useRef(0)
  const copy = (value) => {
    const hex = String(value).startsWith('#') ? value : rgbToHex(value)
    navigator.clipboard?.writeText(hex)
    setCopied(hex)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(null), 1300)
  }
  return [copied, copy]
}

function SemanticTable({ rows, copy }) {
  return (
    <div className="vds-color-table">
      {rows.map((row) => (
        <div key={row.token} className="vds-color-row">
          <button
            type="button"
            className="vds-color-sample vds-swatch-btn"
            style={{ backgroundColor: `var(${row.token})` }}
            onClick={(e) => copy(getComputedStyle(e.currentTarget).backgroundColor)}
            aria-label={`Copy resolved hex for ${row.token}`}
            title="Click to copy hex"
          >
            <CopyHint />
          </button>
          <div className="vds-color-info">
            <code>{row.token}</code>
            <span className="vds-color-ref">{row.ref}</span>
            <span className="vds-color-usage">{row.usage}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ColorsPage() {
  const [copied, copy] = useCopy()
  return (
    <DocPage
      title="Colors"
      description="Colors come in three layers: raw color ramps → named tokens → components. Components always use the named tokens, never the raw colors. That's the trick that makes light and dark mode work: the names stay the same, only the colors behind them change. Every token is a plain CSS variable (--vds-…), so it works in any framework. Tip: click any swatch to copy its hex."
    >
      <Section title={<>Semantic tokens <span className="vds-scale-badge vds-scale-badge--primary">Use these</span></>}>
        <Text variant="body" tone="muted" className="vds-section-desc">
          These are the named tokens you use in components. Each one picks the right
          color for light or dark mode on its own. If you're building UI, this is the
          only section you need.
        </Text>
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.title}>
            <Text variant="subheading" as="h3" style={{ margin: '1.25rem 0 0' }}>
              {group.title}
            </Text>
            <SemanticTable rows={group.rows} copy={copy} />
          </div>
        ))}
      </Section>

      <Section title={<>Primitive ramps <span className="vds-scale-badge vds-scale-badge--secondary">Reference only</span></>}>
        <Text variant="body" tone="muted" className="vds-section-desc">
          The raw colors, sorted by hue. Components should never use these straight —
          always go through a named token. There are two greys — graphite (a cool grey)
          and midnight (the Vipre navy) — plus one set of bright colors. All the bright
          colors are built the same way, so they look like a matched family and keep
          the same readability.
        </Text>
        {PRIMITIVES.map((ramp) => (
          <div key={ramp.name}>
            <Text variant="subheading" as="h3" style={{ margin: '1.25rem 0 0' }}>
              {ramp.name}
            </Text>
            <div className="vds-palette-grid">
              {Object.entries(ramp.shades).map(([shade, hex]) => (
                <div key={shade} className="vds-palette-swatch">
                  <button
                    type="button"
                    className="vds-palette-sample vds-swatch-btn"
                    style={{ backgroundColor: hex }}
                    onClick={() => copy(hex)}
                    aria-label={`Copy ${hex}`}
                    title="Click to copy hex"
                  >
                    <CopyHint />
                  </button>
                  <span className="vds-palette-name">{shade}</span>
                  <span className="vds-palette-hex">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {copied && (
        <div className="vds-copy-toast" role="status" aria-live="polite">
          Copied {copied}
        </div>
      )}
    </DocPage>
  )
}
