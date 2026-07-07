import { DocPage } from '../DocPage.jsx'
import { Section, PropsTable } from '../primitives.jsx'
import { LAYOUT } from '../tokens.js'

export function LayoutPage() {
  return (
    <DocPage
      title="Layout"
      description="The rules for laying out a screen: a centered box that stops growing at a set width, a 12-column grid with even gaps, and set spacing between sections. Pages use these tokens and never make up new layout sizes. They're plain CSS variables, so any framework can use them."
    >
      <Section title="Tokens">
        <PropsTable
          headers={['Token', 'Value', 'Use for']}
          rows={LAYOUT.map((l) => [{ code: l.token }, l.value, l.usage])}
        />
      </Section>

      <Section title="12-column grid" note="Split the columns into simple splits — halves (6+6), thirds (4+4+4), or wide+narrow (8+4). The gap between columns is --vds-gutter (24px).">
        <div className="vds-grid-demo">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </Section>
    </DocPage>
  )
}
