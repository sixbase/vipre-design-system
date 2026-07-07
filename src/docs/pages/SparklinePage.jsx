import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Sparkline } from '../../components/index.js'

const ROW = { display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }
const UP = [3, 5, 4, 6, 8, 7, 9, 11]
const DOWN = [11, 9, 10, 7, 8, 5, 4, 3]

export function SparklinePage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Sparkline}
      title="Sparkline"
      description="A tiny trend line drawn as one SVG — no chart library needed. It takes a tone color for the line and the soft fill under it. Made to sit inside a Stat Tile, a table cell, or right next to a number."
      installCode={`import { Sparkline } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'data' }, { code: 'number[]' }, '—', 'The numbers to plot (2 or more)'],
            [{ code: 'tone' }, { code: "'primary' | 'success' | 'warning' | 'danger' | 'muted'" }, { code: "'primary'" }, 'The line and fill color'],
            [{ code: 'width' }, { code: 'number' }, { code: '96' }, 'How wide it is (px)'],
            [{ code: 'height' }, { code: 'number' }, { code: '28' }, 'How tall it is (px)'],
            [{ code: 'area' }, { code: 'boolean' }, { code: 'true' }, 'Fills the space under the line'],
            [{ code: 'label' }, { code: 'string' }, '—', 'A name for screen readers; leave it off if it’s just decoration'],
          ],
        },
      ]}
      accessibility={[
        <>Give it a <IC>label</IC> and it becomes a <IC>role="img"</IC>; leave it off and it's <IC>aria-hidden</IC> (just decoration).</>,
        <>It only hints at a trend — always show the real number in text too, never let the line be the only place a number lives.</>
      ]}
    >
      <Section title="Tones">
        <Preview
          canvas={
            <div style={ROW}>
              <Sparkline data={UP} tone="primary" />
              <Sparkline data={UP} tone="success" />
              <Sparkline data={DOWN} tone="warning" />
              <Sparkline data={DOWN} tone="danger" />
              <Sparkline data={UP} tone="muted" />
            </div>
          }
          code={`<Sparkline data={[3,5,4,6,8,7,9,11]} tone="success" />`}
        />
      </Section>

      <Section title="Line only" note="Set area={false} to show just the line, with no fill.">
        <Preview
          canvas={
            <div style={ROW}>
              <Sparkline data={UP} tone="primary" area={false} width={120} height={32} />
            </div>
          }
          code={`<Sparkline data={[…]} area={false} width={120} height={32} />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. The classes only handle color — the point coordinates are computed from your data (the React component does this for you), so in plain HTML you generate them yourself, server-side or with a few lines of JS."
      >
        <Code>{`<!-- tones: vds-sparkline--primary | --success | --warning | --danger | --muted -->
<svg class="vds-sparkline vds-sparkline--success" width="96" height="28"
     viewBox="0 0 96 28" aria-hidden="true">
  <path class="vds-sparkline__area" d="M2,26 L2,19.5 L15.1,14.6 … L94,26 Z"></path>
  <polyline class="vds-sparkline__line" points="2,19.5 15.1,14.6 …"></polyline>
</svg>

<!-- meaningful chart: swap aria-hidden for role="img" + aria-label -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
