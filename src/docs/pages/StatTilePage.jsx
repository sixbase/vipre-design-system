import { Shield, Monitor, TriangleAlert, Activity } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { StatTile } from '../../components/index.js'

const GRID = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', width: '100%', maxWidth: 520 }
const ROW = { display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 360 }
const TREND = [4, 6, 5, 8, 7, 9, 8, 11]

export function StatTilePage() {
  return (
    <ComponentPage
      title="Stat Tile"
      description="A KPI tile — a prominent value with a label, optional icon, a structured delta (auto ▲/▼ + color), an optional caption and trend sparkline, plus loading and empty states. Two layouts (stacked / row) and three sizes. Composes Surface + Icon + Sparkline."
      installCode={`import { StatTile } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string | number' }, '—', 'Numbers are locale-formatted; empty → "—"'],
            [{ code: 'prefix / suffix' }, { code: 'string' }, '—', 'Wrap the value (e.g. "$", "%")'],
            [{ code: 'label' }, { code: 'string' }, '—', 'The metric name'],
            [{ code: 'caption' }, { code: 'ReactNode' }, '—', 'Small secondary line (context)'],
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'Leading icon'],
            [{ code: 'iconVariant' }, { code: "'outline' | 'soft'" }, { code: "'outline'" }, 'Ringed (transparent) vs filled chip'],
            [{ code: 'tone' }, { code: "'default' | 'primary' | 'success' | 'warning' | 'danger'" }, { code: "'default'" }, 'Colors value + icon'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Value size'],
            [{ code: 'layout' }, { code: "'stacked' | 'row'" }, { code: "'stacked'" }, 'Card vs compact row'],
            [{ code: 'delta' }, { code: "'+3%' | number | { value, direction } | node" }, '—', 'Auto arrow + color'],
            [{ code: 'invertDelta' }, { code: 'boolean' }, { code: 'false' }, '"Down" is good (e.g. error counts)'],
            [{ code: 'trend' }, { code: 'number[]' }, '—', 'Sparkline, colored by the delta'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Skeleton placeholder'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the tile a button'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>onClick</IC> it renders a real <IC>{'<button>'}</IC> — keyboard + focus ring included.</>,
        <>Icon, arrow and trend are decorative (<IC>aria-hidden</IC>); the sign in the delta text still conveys direction.</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC>; tone colors meet AA contrast in both themes.</>,
      ]}
    >
      <Section title="Stacked (default)" note="Number is the hero: icon + delta on top, value, label, optional caption + trend.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} value={1284} label="Total devices" caption="of 1,400 seats" delta="+3%" trend={TREND} />
              <StatTile icon={Shield} value={1192} label="Protected" tone="success" delta="+1.2%" trend={TREND} />
              <StatTile icon={Activity} value={64} suffix="%" label="Avg utilization" tone="warning" delta="-4%" />
              <StatTile icon={TriangleAlert} value={17} label="At risk" tone="danger" delta="+5" invertDelta />
            </div>
          }
          code={`<StatTile icon={Monitor} value={1284} label="Total devices"
  caption="of 1,400 seats" delta="+3%" trend={[…]} />`}
        />
      </Section>

      <Section title="Icon treatment" note="Default 'outline' (a thin ring, transparent center, tone-colored glyph — Vipre's style). 'soft' fills the chip with the tone tint.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} value={4} label="Users" tone="success" />
              <StatTile icon={Shield} value={175} label="Emails" tone="primary" />
              <StatTile icon={TriangleAlert} value={60} label="Threats" tone="danger" />
              <StatTile icon={Activity} value={52} label="Attachments" tone="primary" iconVariant="soft" />
            </div>
          }
          code={`<StatTile icon={Monitor} value={4} label="Users" tone="success" />        {/* outline (default) */}
<StatTile icon={Activity} value={52} label="Attachments" iconVariant="soft" />`}
        />
      </Section>

      <Section title="Delta" note="A string/number auto-derives the arrow + color. Use invertDelta where down is good — note 'At risk +5' reads red.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile value={92} suffix="%" label="Uptime" delta="+1.2%" />
              <StatTile value={318} label="New devices" delta="-8%" />
              <StatTile value={17} label="At risk" delta="+5" invertDelta />
              <StatTile value={4} label="Incidents" delta="-2" invertDelta />
            </div>
          }
          code={`<StatTile value={92} suffix="%" label="Uptime" delta="+1.2%" />   {/* up = green */}
<StatTile value={318} label="New devices" delta="-8%" />          {/* down = red */}
<StatTile value={17} label="At risk" delta="+5" invertDelta />    {/* up but BAD = red */}`}
        />
      </Section>

      <Section title="Value formatting" note="Pass a raw number; it's locale-formatted. prefix / suffix wrap it.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile value={1284000} label="Seats" />
              <StatTile value={48250} prefix="$" label="MRR" tone="success" />
              <StatTile value={64} suffix="%" label="Utilization" />
              <StatTile value={null} label="No data yet" />
            </div>
          }
          code={`<StatTile value={1284000} label="Seats" />        {/* 1,284,000 */}
<StatTile value={48250} prefix="$" label="MRR" />  {/* $48,250 */}
<StatTile value={64} suffix="%" label="Utilization" />
<StatTile value={null} label="No data yet" />     {/* — */}`}
        />
      </Section>

      <Section title="Loading" note="Skeleton while data resolves (sets aria-busy; respects reduced-motion).">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} loading />
              <StatTile icon={Shield} loading />
            </div>
          }
          code={`<StatTile icon={Monitor} loading />`}
        />
      </Section>

      <Section title="Sizes" note="sm / md / lg scale the value (heading → title → display).">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile size="sm" value={1284} label="Small" />
              <StatTile size="md" value={1284} label="Medium" />
              <StatTile size="lg" value={1284} label="Large" tone="primary" />
            </div>
          }
          code={`<StatTile size="lg" value={1284} label="Devices" />`}
        />
      </Section>

      <Section title="Row (compact)" note="Dense one-line layout — trend / delta on the right.">
        <Preview
          canvas={
            <div style={ROW}>
              <StatTile layout="row" icon={Shield} value={1192} label="Protected" tone="success" trend={TREND} />
              <StatTile layout="row" size="sm" icon={Activity} value={64} suffix="%" label="Avg utilization" delta="-4%" />
            </div>
          }
          code={`<StatTile layout="row" icon={Shield} value={1192} label="Protected" tone="success" trend={[…]} />`}
        />
      </Section>

      <Section title="Interactive (drill-in)" note="Pass onClick to make the whole tile a button.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Monitor} value={42} label="Distributors" onClick={() => {}} />
              <StatTile icon={Shield} value={1284} label="Customers" tone="primary" onClick={() => {}} />
            </div>
          }
          code={`<StatTile icon={Monitor} value={42} label="Distributors" onClick={openPanel} />`}
        />
      </Section>
    </ComponentPage>
  )
}
