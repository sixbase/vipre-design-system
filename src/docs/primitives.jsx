import { useEffect, useRef, useState } from 'react'
import { Heading, Text } from '../components/index.js'

/* ----------------------------------------------------------------------------
   Docs primitives — the shared building blocks every page composes from,
   mirroring the Mason ComponentPage anatomy: section headings, live preview
   boxes (canvas + code), props tables, and accessibility lists.
   -------------------------------------------------------------------------- */

/** A titled section with a border-top separator. */
export function Section({ title, note, children }) {
  return (
    <section>
      <Heading level="heading" as="h2" className="vds-section-h">
        {title}
      </Heading>
      {note && (
        <Text variant="body" tone="muted" className="vds-section-note">
          {note}
        </Text>
      )}
      {children}
    </section>
  )
}

/**
 * Live demo canvas with an optional code strip beneath it.
 * - popover: let absolutely-positioned overlays (dropdowns, menus) escape the
 *   box instead of being clipped. Top-aligns the canvas so they have room.
 * - reserve: min-height (px) for the canvas, so an open overlay has vertical room.
 */
export function Preview({ canvas, code, popover = false, reserve }) {
  return (
    <div className={popover ? 'vds-preview vds-preview--popover' : 'vds-preview'}>
      <div className="vds-preview__canvas" style={reserve ? { minHeight: reserve } : undefined}>
        {canvas}
      </div>
      {code && <pre className="vds-preview__code">{code}</pre>}
    </div>
  )
}

/** Standalone code block (e.g. an import line). */
export function Code({ children }) {
  return <pre className="vds-code">{children}</pre>
}

/**
 * Props / reference table.
 * headers: string[]; rows: cell[][] where a cell is a string or {code:string}.
 */
export function PropsTable({ headers, rows }) {
  return (
    <div className="vds-ref-table-wrap">
      <table className="vds-ref-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                cell && typeof cell === 'object' ? (
                  <td key={j}>
                    <code>{cell.code}</code>
                  </td>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Accessibility bullet list. Items may contain pre-built React nodes. */
export function A11yList({ items }) {
  return (
    <ul className="vds-a11y">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export const Kbd = ({ children }) => <kbd className="vds-kbd">{children}</kbd>
export const IC = ({ children }) => <code className="vds-inline-code">{children}</code>

/* Normalise ANY CSS color string to #rrggbb(aa). color-mix() resolves to
   oklab() in computed style, and a canvas `fillStyle` getter keeps oklab as-is
   (no sRGB conversion) — so we PAINT one pixel and read it back, which forces
   the real sRGB value the browser would render. */
let _ctx = null
function toHex(input) {
  if (!input || input === 'rgba(0, 0, 0, 0)' || input === 'transparent') return '—'
  if (!_ctx) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    _ctx = c.getContext('2d', { willReadFrequently: true })
  }
  _ctx.clearRect(0, 0, 1, 1)
  try {
    _ctx.fillStyle = input
  } catch {
    return input
  }
  _ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = _ctx.getImageData(0, 0, 1, 1).data
  if (a === 0) return '—'
  const hex = [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')
  return '#' + hex + (a < 255 ? a.toString(16).padStart(2, '0') : '')
}

/**
 * ColorUsage — a table of the color tokens a component paints with, each shown
 * as a live swatch + its resolved hex (for the current theme) + a role note.
 *
 * Values are resolved by painting each token onto a hidden probe that carries
 * the component's root class (`scope`), so component-local custom properties
 * (e.g. --vds-input-fill) and `.dark .vds-x` overrides resolve correctly. The
 * hexes re-resolve whenever the <html> theme class flips, so they stay live.
 *
 * Props:
 * - scope: the component's root BEM class (e.g. 'vds-select')
 * - rows:  [{ token: '--vds-…', role: 'what it paints' }]
 */
export function ColorUsage({ scope, rows }) {
  const probeRef = useRef(null)
  const [values, setValues] = useState({})

  useEffect(() => {
    const probe = probeRef.current
    const swatch = probe?.firstChild
    if (!swatch) return
    const resolve = () => {
      const next = {}
      for (const { token } of rows) {
        swatch.style.backgroundColor = 'transparent'
        swatch.style.backgroundColor = `var(${token})`
        next[token] = toHex(getComputedStyle(swatch).backgroundColor)
      }
      setValues(next)
    }
    resolve()
    const mo = new MutationObserver(resolve)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [scope, rows])

  return (
    <>
      {/* hidden probe: carries the component's custom-property context */}
      <div
        ref={probeRef}
        className={scope}
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, padding: 0, border: 0, overflow: 'hidden', background: 'none', pointerEvents: 'none' }}
      >
        <span style={{ display: 'block', width: 0, height: 0 }} />
      </div>
      <div className="vds-color-table">
        {rows.map(({ token, role }) => (
          <div key={token} className="vds-color-row">
            <span className="vds-color-sample" style={{ backgroundColor: values[token] && values[token] !== '—' ? values[token] : `var(${token})` }} />
            <div className="vds-color-info">
              <code>{token}</code>
              <span className="vds-color-ref">{values[token] || '…'}</span>
              <span className="vds-color-usage">{role}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
