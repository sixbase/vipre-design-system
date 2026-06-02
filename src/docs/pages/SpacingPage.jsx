import { DocPage } from '../DocPage.jsx'
import { Section } from '../primitives.jsx'
import { SPACING } from '../tokens.js'

export function SpacingPage() {
  return (
    <DocPage
      title="Spacing"
      description="A single 4px-based scale for all component internals — padding, gaps, and stacks. Use spacing tokens, never raw pixel values."
    >
      <Section title="Scale" note="Bar length is the actual token value.">
        <div className="vds-type-table">
          {SPACING.map((s) => (
            <div key={s.token} className="vds-scale-row">
              <div className="vds-scale-meta">
                <span className="vds-scale-token">{s.token}</span>
                <span className="vds-scale-size">{s.px}</span>
                <span className="vds-scale-usage">{s.usage}</span>
              </div>
              <div className="vds-scale-preview">
                <span className="vds-space-bar" style={{ width: `var(${s.token})` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </DocPage>
  )
}
