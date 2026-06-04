import { Shield, Monitor, TriangleAlert, Activity } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { StatTile, Badge } from '../../components/index.js'

const GRID = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', width: '100%', maxWidth: 520 }

export function StatTilePage() {
  return (
    <ComponentPage
      title="StatTile"
      description="A KPI tile — a big tabular value with a label, an optional icon, an optional delta, and tone coloring for threshold states. The dashboard workhorse, composed from Surface + Icon. Pass onClick to make it a drill-in button."
      installCode={`import { StatTile } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string | number' }, '—', 'The metric (rendered tabular-nums)'],
            [{ code: 'label' }, { code: 'string' }, '—', 'The metric name'],
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'Optional leading icon in a tinted box'],
            [{ code: 'tone' }, { code: "'default' | 'primary' | 'success' | 'warning' | 'danger'" }, { code: "'default'" }, 'Colors the value + icon'],
            [{ code: 'delta' }, { code: 'ReactNode' }, '—', 'Right-aligned slot, e.g. a Badge'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the tile an interactive button'],
            [{ code: '…props' }, { code: 'Surface props' }, '—', 'padding, elevation, radius…'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>onClick</IC> it renders a real <IC>{'<button>'}</IC> — keyboard + focus ring included.</>,
        <>The icon is decorative (<IC>aria-hidden</IC>); meaning lives in the value + label.</>,
        <>Tone colors meet AA contrast on the surface in both themes.</>,
      ]}
    >
      <Section title="Tones" note="Default plus the four status tones for threshold coloring.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} value="1,284" label="Total devices" />
              <StatTile icon={Shield} value="1,192" label="Protected" tone="success" />
              <StatTile icon={Activity} value="64%" label="Avg utilization" tone="warning" />
              <StatTile icon={TriangleAlert} value="17" label="At risk" tone="danger" />
            </div>
          }
          code={`<StatTile icon={Monitor} value="1,284" label="Total devices" />
<StatTile icon={Shield} value="1,192" label="Protected" tone="success" />
<StatTile icon={Activity} value="64%" label="Avg utilization" tone="warning" />
<StatTile icon={TriangleAlert} value="17" label="At risk" tone="danger" />`}
        />
      </Section>

      <Section title="With a delta" note="Drop a Badge into the delta slot for period-over-period change.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile value="92%" label="Uptime" delta={<Badge tone="success" dot>+1.2%</Badge>} />
              <StatTile value="318" label="New devices" delta={<Badge tone="danger" dot>-8%</Badge>} />
            </div>
          }
          code={`<StatTile value="92%" label="Uptime" delta={<Badge tone="success" dot>+1.2%</Badge>} />`}
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
