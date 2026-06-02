import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable } from '../primitives.jsx'
import { Heading, Text } from '../../components/index.js'
import { TYPE_SCALE, WEIGHTS } from '../tokens.js'

export function TypographyPage() {
  return (
    <DocPage
      title="Typography"
      description="Rubik, 11 steps weighted toward the small end for dense product UI. Weight, line-height and tracking are baked into each step. Never hardcode a font size — always go through the Text or Heading component."
    >
      <Section title="Font family">
        <div className="vds-type-table">
          <div className="vds-type-row">
            <span className="vds-type-name">
              <code>--vds-font-sans</code>
            </span>
            <span className="vds-type-preview" style={{ fontSize: '1.25rem' }}>
              The quick brown fox
            </span>
            <span className="vds-type-value">Rubik</span>
          </div>
        </div>
      </Section>

      <Section title={<>Type scale <span className="vds-scale-badge vds-scale-badge--primary">Use this</span></>}>
        <Text variant="body" tone="muted" className="vds-section-desc">
          One scale for all product UI. When in doubt, use <code className="vds-inline-code">body</code> for
          copy and <code className="vds-inline-code">detail</code> for dense data.
        </Text>
        <div className="vds-type-table">
          {TYPE_SCALE.map((s) => (
            <div key={s.token} className="vds-scale-row">
              <div className="vds-scale-meta">
                <span className="vds-scale-token">{s.token}</span>
                <span className="vds-scale-size">{s.size}</span>
                <span className="vds-scale-usage">{s.usage}</span>
              </div>
              <div className="vds-scale-preview">
                {s.kind === 'h' ? (
                  <Heading level={s.level} as="div">
                    Aa
                  </Heading>
                ) : (
                  <Text variant={s.variant} as="div">
                    Aa
                  </Text>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Font weights">
        <div className="vds-type-table">
          {WEIGHTS.map((w) => (
            <div key={w.name} className="vds-type-row">
              <span className="vds-type-name">
                <code>{w.name}</code>
              </span>
              <span className="vds-type-preview" style={{ fontSize: '1.125rem', fontWeight: w.value }}>
                Design System
              </span>
              <span className="vds-type-value">{w.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Semantic mapping" note="How the Text and Heading components map to the scale. Use this when building custom text outside the components.">
        <PropsTable
          headers={['Component', 'Prop value', 'Token', 'Size · weight']}
          rows={[
            [{ code: 'Heading' }, { code: 'display' }, { code: 'text--display' }, '30 / 36 · 600'],
            [{ code: 'Heading' }, { code: 'title' }, { code: 'text--title' }, '24 / 32 · 600'],
            [{ code: 'Heading' }, { code: 'heading' }, { code: 'text--heading' }, '20 / 28 · 600'],
            [{ code: 'Heading' }, { code: 'subheading' }, { code: 'text--subheading' }, '16 / 24 · 500'],
            [{ code: 'Text' }, { code: 'body' }, { code: 'text--body' }, '14 / 20 · 400'],
            [{ code: 'Text' }, { code: 'detail' }, { code: 'text--detail' }, '12 / 16 · 400'],
            [{ code: 'Text' }, { code: 'eyebrow' }, { code: 'text--eyebrow' }, '11 · 600 · upper'],
          ]}
        />
      </Section>

      <Section title="Usage" note="Set visual size with level/variant; set the HTML tag with as.">
        <Code>{`<Heading level="title" as="h1">Customer Management</Heading>
<Text variant="body" tone="muted">Secondary copy</Text>
<Text variant="eyebrow" tone="primary">Overview</Text>`}</Code>
      </Section>
    </DocPage>
  )
}
