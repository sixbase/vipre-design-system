import { CircleCheck, TriangleAlert, ShieldCheck } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Badge, Icon } from '../../components/index.js'

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
            [{ code: 'icon' }, { code: 'node' }, '—', 'A small icon in front (e.g. a check for success). Sized and centered for you; wins over the dot'],
            [{ code: 'dot' }, { code: 'boolean' }, { code: 'false' }, 'Show a small dot in front'],
            [{ code: '…props' }, { code: 'HTMLAttributes<span>' }, '—', 'Passed to the <span> around it'],
          ],
        },
      ]}
      accessibility={[
        <>The dot and icon are just for looks — they’re <IC>aria-hidden="true"</IC>; the meaning is in the words.</>,
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

      <Section title="With icon" note="Swap the dot for an icon when you want to name the status, not just color it — a check for success, an alert for warning and danger.">
        <Preview
          canvas={
            <>
              <Badge tone="success" icon={<Icon as={CircleCheck} />}>
                Protected
              </Badge>
              <Badge tone="warning" icon={<Icon as={TriangleAlert} />}>
                At risk
              </Badge>
              <Badge tone="danger" icon={<Icon as={TriangleAlert} />}>
                Threat
              </Badge>
              <Badge tone="info" icon={<Icon as={ShieldCheck} />}>
                Scanned
              </Badge>
            </>
          }
          code={`import { CircleCheck, TriangleAlert } from '@icons'

<Badge tone="success" icon={<Icon as={CircleCheck} />}>Protected</Badge>
<Badge tone="warning" icon={<Icon as={TriangleAlert} />}>At risk</Badge>
<Badge tone="danger" icon={<Icon as={TriangleAlert} />}>Threat</Badge>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. One span, one tone modifier. status tones (success / warning / danger) also get role='status' so changes are announced. No JS needed."
      >
        <Code>{`<!-- tones: vds-badge--neutral | --primary | --success | --warning | --danger | --info -->
<span class="vds-badge vds-badge--info">Info</span>

<!-- status tones add role="status"; the dot is decorative -->
<span class="vds-badge vds-badge--success" role="status">
  <span class="vds-badge__dot" aria-hidden="true"></span> Protected
</span>

<!-- or lead with an icon instead of the dot -->
<span class="vds-badge vds-badge--success" role="status">
  <span class="vds-badge__icon" aria-hidden="true"><svg>…</svg></span> Protected
</span>`}</Code>
      </Section>
    </ComponentPage>
  )
}
