import { DocPage } from '../DocPage.jsx'
import { Section } from '../primitives.jsx'
import { Text } from '../../components/Text.jsx'
import { PRIMITIVES, SEMANTIC_GROUPS } from '../tokens.js'

function SemanticTable({ rows }) {
  return (
    <div className="vds-color-table">
      {rows.map((row) => (
        <div key={row.token} className="vds-color-row">
          <div className="vds-color-sample" style={{ backgroundColor: `var(${row.token})` }} />
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
  return (
    <DocPage
      title="Colors"
      description="A 3-tier model: primitive ramps → semantic tokens → components. Components always consume semantic tokens, never primitives directly — that's what makes light/dark work: same token names, different values."
    >
      <Section title={<>Semantic tokens <span className="vds-scale-badge vds-scale-badge--primary">Use these</span></>}>
        <Text variant="body" tone="muted" className="vds-section-desc">
          The tokens you reference in components. They resolve to different values in
          light and dark automatically. If you're building UI, this is the only section
          you need.
        </Text>
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.title}>
            <Text variant="subheading" as="h3" style={{ margin: '1.25rem 0 0' }}>
              {group.title}
            </Text>
            <SemanticTable rows={group.rows} />
          </div>
        ))}
      </Section>

      <Section title={<>Primitive ramps <span className="vds-scale-badge vds-scale-badge--secondary">Reference only</span></>}>
        <Text variant="body" tone="muted" className="vds-section-desc">
          Raw values organized by hue. Components should never reference these directly —
          always go through a semantic token. Named for personality, not function:
          graphite (cool neutral), iris (brand), then conventional status hues.
        </Text>
        {PRIMITIVES.map((ramp) => (
          <div key={ramp.name}>
            <Text variant="subheading" as="h3" style={{ margin: '1.25rem 0 0' }}>
              {ramp.name}
            </Text>
            <div className="vds-palette-grid">
              {Object.entries(ramp.shades).map(([shade, hex]) => (
                <div key={shade} className="vds-palette-swatch">
                  <div className="vds-palette-sample" style={{ backgroundColor: hex }} />
                  <span className="vds-palette-name">{shade}</span>
                  <span className="vds-palette-hex">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>
    </DocPage>
  )
}
