import { DocPage } from '../DocPage.jsx'
import { Section } from '../primitives.jsx'
import { SPACING } from '../tokens.js'

export function SpacingPage() {
  return (
    <DocPage
      title="Spacing"
      description="One set of sizes, all built on 4px, for every gap and bit of padding inside components. Always use a spacing token, never a raw pixel number. Each one is a plain CSS variable (--vds-space-*), so it works in any framework."
    >
      <Section title="Scale" note="The bar's length is the real size of the token.">
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
