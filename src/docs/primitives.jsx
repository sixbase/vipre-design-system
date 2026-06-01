import { Heading, Text } from '../components/Text.jsx'

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

/** Live demo canvas with an optional code strip beneath it. */
export function Preview({ canvas, code }) {
  return (
    <div className="vds-preview">
      <div className="vds-preview__canvas">{canvas}</div>
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
    <table className="vds-table">
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
