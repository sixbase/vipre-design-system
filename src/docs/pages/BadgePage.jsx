import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Badge } from '../../components/index.js'

export function BadgePage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Badge}
      title="Badge"
      description="A small status pill in six colors, with an optional dot in front. It has a soft tinted background and matching text, and uses small text so it reads like a label."
      installCode={`import { Badge } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'tone' }, { code: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'neutral'" }, 'The pill’s color and what it means'],
            [{ code: 'dot' }, { code: 'boolean' }, { code: 'false' }, 'Show a small dot in front'],
            [{ code: '…props' }, { code: 'HTMLAttributes<span>' }, '—', 'Passed to the <span> around it'],
          ],
        },
      ]}
      accessibility={[
        <>The dot is just for looks — it has <IC>aria-hidden="true"</IC>; the meaning is in the words.</>,
        <>Every color pairing has enough contrast to pass WCAG AA in both light and dark themes.</>,
        <>Don’t lean on color alone — spell out the label (say "At risk", not just amber).</>,
      ]}
    >
      <Section title="Tones" note="Six colors, each standing for a kind of status.">
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

      <Section title="With status dot" note="Add a dot to show live or health states in packed tables.">
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
