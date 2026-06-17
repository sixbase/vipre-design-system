import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Card, Button, Text, StatTile } from '../../components/index.js'
import { Monitor, Shield } from '@icons'

export function CardPage() {
  return (
    <ComponentPage
      title="Card"
      description="A titled container built on Surface — an optional header (title + actions) above a body. Use Surface directly for a bare panel; use Card when the content needs a labelled header."
      installCode={`import { Card } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'title' }, { code: 'ReactNode' }, '—', 'Header text (rendered as a subheading)'],
            [{ code: 'actions' }, { code: 'ReactNode' }, '—', 'Right-aligned header slot (button, menu…)'],
            [{ code: 'padding' }, { code: '0–8' }, { code: '5' }, 'Surface padding step (20px)'],
            [{ code: '…props' }, { code: 'Surface props' }, '—', 'radius, elevation, bordered, raised, as…'],
          ],
        },
      ]}
      accessibility={[
        <>The title renders as an <IC>{'<h3>'}</IC> — keep the surrounding heading order logical.</>,
        <>Card composes Surface, so all visual decisions come from the Surface tokens.</>,
      ]}
    >
      <Section title="With header + actions">
        <Preview
          canvas={
            <Card
              title="Package adoption"
              actions={<Button size="sm" variant="ghost">View all</Button>}
              style={{ maxWidth: 420 }}
            >
              <Text variant="body" tone="muted">
                Card composes Surface for the box, and adds the header row. The body is whatever
                you put inside.
              </Text>
            </Card>
          }
          code={`<Card title="Package adoption" actions={<Button size="sm" variant="ghost">View all</Button>}>
  …body…
</Card>`}
        />
      </Section>

      <Section title="Composing tiles" note="A common dashboard pattern: a Card wrapping a grid of StatTiles.">
        <Preview
          canvas={
            <Card title="Fleet" style={{ maxWidth: 420 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <StatTile icon={Monitor} value="1,284" label="Devices" />
                <StatTile icon={Shield} value="1,192" label="Protected" tone="success" />
              </div>
            </Card>
          }
          code={`<Card title="Fleet">
  <StatTile icon={Monitor} value="1,284" label="Devices" />
  <StatTile icon={Shield} value="1,192" label="Protected" tone="success" />
</Card>`}
        />
      </Section>
    </ComponentPage>
  )
}
