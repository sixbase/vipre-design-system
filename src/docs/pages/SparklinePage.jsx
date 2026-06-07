import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Sparkline } from '../../components/index.js'

const ROW = { display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }
const UP = [3, 5, 4, 6, 8, 7, 9, 11]
const DOWN = [11, 9, 10, 7, 8, 5, 4, 3]

export function SparklinePage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Sparkline}
      title="Sparkline"
      description="A tiny inline trend chart drawn as a single SVG — no charting dependency. Inherits a tone color (line + soft area fill). Designed to sit inside a Stat Tile, a table cell, or next to a metric."
      installCode={`import { Sparkline } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'data' }, { code: 'number[]' }, '—', 'The series (2+ points)'],
            [{ code: 'tone' }, { code: "'primary' | 'success' | 'warning' | 'danger' | 'muted'" }, { code: "'primary'" }, 'Line + area color'],
            [{ code: 'width' }, { code: 'number' }, { code: '96' }, 'Drawing width (px)'],
            [{ code: 'height' }, { code: 'number' }, { code: '28' }, 'Drawing height (px)'],
            [{ code: 'area' }, { code: 'boolean' }, { code: 'true' }, 'Fill under the line'],
            [{ code: 'label' }, { code: 'string' }, '—', 'Accessible name; omit for decorative'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>label</IC> it's exposed as <IC>role="img"</IC>; without, it's <IC>aria-hidden</IC> (decorative).</>,
        <>It's a trend hint — pair it with the actual value in text, never as the only source of a number.</>,
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

      <Section title="Line only" note="Set area={false} for just the stroke.">
        <Preview
          canvas={
            <div style={ROW}>
              <Sparkline data={UP} tone="primary" area={false} width={120} height={32} />
            </div>
          }
          code={`<Sparkline data={[…]} area={false} width={120} height={32} />`}
        />
      </Section>
    </ComponentPage>
  )
}
