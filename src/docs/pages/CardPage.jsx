import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Card, Button, Text, StatTile } from '../../components/index.js'
import { Monitor, Shield } from '@icons'

export function CardPage() {
  return (
    <ComponentPage
      title="Card"
      description="A box with a title. It's built on Surface and adds an optional header (a title and some buttons) above the body. Want a plain box? Use Surface. Want a box with a labelled top? Use Card."
      installCode={`import { Card } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'title' }, { code: 'ReactNode' }, '—', 'The title at the top of the card'],
            [{ code: 'actions' }, { code: 'ReactNode' }, '—', 'Buttons or menus, placed on the right of the header'],
            [{ code: 'padding' }, { code: '0–8' }, { code: '5' }, 'How much space inside the card (each step is 20px)'],
            [{ code: '…props' }, { code: 'Surface props' }, '—', 'radius, elevation, bordered, raised, as…'],
          ],
        },
      ]}
      accessibility={[
        <>The title is an <IC>{'<h3>'}</IC>, so make sure the headings around it still go in order.</>,
        <>Card is built on Surface, so the way it looks comes from the Surface tokens.</>
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
                Card uses Surface for the box and adds the header row on top. The body is whatever
                you put inside.
              </Text>
            </Card>
          }
          code={`<Card title="Package adoption" actions={<Button size="sm" variant="ghost">View all</Button>}>
  …body…
</Card>`}
        />
      </Section>

      <Section title="Composing tiles" note="A common dashboard pattern: a Card wrapped around a grid of StatTiles.">
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

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. A Card is a Surface with an optional header row. No JS needed."
      >
        <Code>{`<!-- padding steps: vds-surface--pad-0 … --pad-8 (default 5 → 20px) -->
<div class="vds-surface vds-surface--pad-5 vds-surface--radius-lg vds-surface--bordered
            vds-surface--elev-resting vds-card">
  <div class="vds-card__header">
    <h3 class="vds-text vds-heading vds-text--subheading vds-card__title">Package adoption</h3>
    <div class="vds-card__actions">
      <button class="vds-button vds-button--ghost vds-button--primary vds-button--sm">View all</button>
    </div>
  </div>
  <!-- body: anything -->
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
