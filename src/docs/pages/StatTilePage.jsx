import { Shield, Monitor, TriangleAlert, Activity } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { StatTile, Badge } from '../../components/index.js'

const GRID = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', width: '100%', maxWidth: 520 }
const ROW = { display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 360 }
const TREND = [4, 6, 5, 8, 7, 9, 8, 11]

export function StatTilePage() {
  return (
    <ComponentPage
      title="Stat Tile"
      description="A KPI tile — a prominent tabular value with a label, an optional icon, an optional delta and trend sparkline, plus tone coloring for thresholds. Two layouts (stacked / row) and three value sizes. Composes Surface + Icon + Sparkline; pass onClick for a drill-in button."
      installCode={`import { StatTile } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string | number' }, '—', 'The metric (tabular-nums)'],
            [{ code: 'label' }, { code: 'string' }, '—', 'The metric name'],
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'Optional leading icon in a tinted box'],
            [{ code: 'tone' }, { code: "'default' | 'primary' | 'success' | 'warning' | 'danger'" }, { code: "'default'" }, 'Colors value / icon / trend'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Value size (heading / title / display)'],
            [{ code: 'layout' }, { code: "'stacked' | 'row'" }, { code: "'stacked'" }, 'Card (number hero) vs compact row'],
            [{ code: 'delta' }, { code: 'ReactNode' }, '—', 'e.g. a Badge with the change'],
            [{ code: 'trend' }, { code: 'number[]' }, '—', 'Renders a tone-tinted Sparkline'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the tile a button'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>onClick</IC> it renders a real <IC>{'<button>'}</IC> — keyboard + focus ring included.</>,
        <>Icon and trend are decorative (<IC>aria-hidden</IC>); meaning lives in the value + label.</>,
        <>Tone colors meet AA contrast on the surface in both themes.</>,
      ]}
    >
      <Section title="Stacked (default)" note="The number is the hero: icon + delta on top, big value, label, optional trend below.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} value="1,284" label="Total devices" delta={<Badge tone="success" dot>+3%</Badge>} trend={TREND} />
              <StatTile icon={Shield} value="1,192" label="Protected" tone="success" trend={TREND} />
              <StatTile icon={Activity} value="64%" label="Avg utilization" tone="warning" />
              <StatTile icon={TriangleAlert} value="17" label="At risk" tone="danger" delta={<Badge tone="danger" dot>+5</Badge>} />
            </div>
          }
          code={`<StatTile icon={Monitor} value="1,284" label="Total devices"
  delta={<Badge tone="success" dot>+3%</Badge>} trend={[4,6,5,8,7,9,8,11]} />`}
        />
      </Section>

      <Section title="Sizes" note="sm / md / lg scale the value (heading → title → display).">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile size="sm" value="1,284" label="Small" />
              <StatTile size="md" value="1,284" label="Medium" />
              <StatTile size="lg" value="1,284" label="Large" tone="primary" />
            </div>
          }
          code={`<StatTile size="sm" value="1,284" label="Devices" />
<StatTile size="md" value="1,284" label="Devices" />
<StatTile size="lg" value="1,284" label="Devices" tone="primary" />`}
        />
      </Section>

      <Section title="Row (compact)" note="A dense one-line layout for tight grids and lists — trend / delta sit on the right.">
        <Preview
          canvas={
            <div style={ROW}>
              <StatTile layout="row" icon={Shield} value="1,192" label="Protected" tone="success" trend={TREND} />
              <StatTile layout="row" size="sm" icon={Activity} value="64%" label="Avg utilization" tone="warning" delta={<Badge tone="warning" dot>-4%</Badge>} />
            </div>
          }
          code={`<StatTile layout="row" icon={Shield} value="1,192" label="Protected" tone="success" trend={[…]} />`}
        />
      </Section>

      <Section title="Interactive (drill-in)" note="Pass onClick to make the whole tile a button.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} value="42" label="Distributors" onClick={() => {}} />
              <StatTile icon={Shield} value="1,284" label="Customers" tone="primary" onClick={() => {}} />
            </div>
          }
          code={`<StatTile icon={Monitor} value="42" label="Distributors" onClick={openPanel} />`}
        />
      </Section>
    </ComponentPage>
  )
}
