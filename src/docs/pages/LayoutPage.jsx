import { DocPage } from '../DocPage.jsx'
import { Section, PropsTable } from '../primitives.jsx'
import { LAYOUT } from '../tokens.js'

export function LayoutPage() {
  return (
    <DocPage
      title="Layout"
      description="The structural rhythm for screens: a centered max-width container, a 12-column grid with a consistent gutter, and a fixed vertical section rhythm. Page composition uses these tokens; it never invents new layout values."
    >
      <Section title="Tokens">
        <PropsTable
          headers={['Token', 'Value', 'Use for']}
          rows={LAYOUT.map((l) => [{ code: l.token }, l.value, l.usage])}
        />
      </Section>

      <Section title="12-column grid" note="Columns split into common ratios — halves (6+6), thirds (4+4+4), wide+narrow (8+4). Gutter is --vds-gutter (24px).">
        <div className="vds-grid-demo">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </Section>
    </DocPage>
  )
}
