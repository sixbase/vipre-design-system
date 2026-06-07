import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Badge } from '../../components/index.js'

export function BadgePage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Badge}
      title="Badge"
      description="A compact status pill with six tones and an optional leading status dot. Soft-tinted background paired with matching ink, sized off the small end of the typescale so it reads as a label."
      installCode={`import { Badge } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'tone' }, { code: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'neutral'" }, 'Semantic color of the pill'],
            [{ code: 'dot' }, { code: 'boolean' }, { code: 'false' }, 'Show a leading status dot'],
            [{ code: '…props' }, { code: 'HTMLAttributes<span>' }, '—', 'Spread to the root <span>'],
          ],
        },
      ]}
      accessibility={[
        <>The dot is decorative — it carries <IC>aria-hidden="true"</IC>; meaning lives in the text.</>,
        <>All tone pairings meet WCAG AA contrast in both light and dark themes.</>,
        <>Don't rely on color alone — keep the label explicit (e.g. "At risk", not just amber).</>,
      ]}
    >
      <Section title="Tones" note="Six tones mapped to semantic status colors.">
        <Preview
          canvas={
            <>
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
              <Badge tone="info">Info</Badge>
            </>
          }
          code={`<Badge tone="neutral">Neutral</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="danger">Danger</Badge>`}
        />
      </Section>

      <Section title="With status dot" note="Add a dot for live/health states in dense tables.">
        <Preview
          canvas={
            <>
              <Badge tone="success" dot>
                Protected
              </Badge>
              <Badge tone="warning" dot>
                At risk
              </Badge>
              <Badge tone="danger" dot>
                Threat
              </Badge>
            </>
          }
          code={`<Badge tone="success" dot>Protected</Badge>
<Badge tone="warning" dot>At risk</Badge>
<Badge tone="danger" dot>Threat</Badge>`}
        />
      </Section>
    </ComponentPage>
  )
}
