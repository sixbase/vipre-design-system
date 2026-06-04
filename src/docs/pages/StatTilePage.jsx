import { Shield, Monitor, TriangleAlert, Activity, Users, Mail, Paperclip } from 'lucide-react'
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
      description="A KPI tile — a prominent value with a label, an optional icon, a caption, and a trend sparkline, plus loading and empty states. Two layouts (row / stacked) and three sizes. Composes Surface + Icon + Sparkline."
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
            [{ code: 'tone' }, { code: "'default' | 'primary' | 'success' | 'warning' | 'danger'" }, { code: "'default'" }, 'Colors the icon (value stays ink)'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Value size'],
            [{ code: 'layout' }, { code: "'row' | 'stacked'" }, { code: "'row'" }, 'Compact row (default) vs stacked card'],
            [{ code: 'trend' }, { code: 'number[]' }, '—', 'Sparkline (colored by tone / trendTone)'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Skeleton placeholder'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the tile a button'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>onClick</IC> it renders a real <IC>{'<button>'}</IC> — keyboard + focus ring included.</>,
        <>Icon and trend are decorative (<IC>aria-hidden</IC>); the value + label carry the meaning.</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC>; tone colors meet AA contrast in both themes.</>,
      ]}
    >
      <Section title="Row (default)" note="The dense one-line layout Vipre uses most — icon, label over value, optional trend on the right. This is the default; no layout prop needed.">
        <Preview
          canvas={
            <div style={ROW}>
              <StatTile icon={Monitor} value={1284} label="Total devices" trend={TREND} />
              <StatTile icon={Shield} value={1192} label="Protected" tone="success" trend={TREND} />
              <StatTile icon={Activity} value={64} suffix="%" label="Avg utilization" tone="warning" />
              <StatTile icon={TriangleAlert} value={17} label="At risk" tone="danger" />
            </div>
          }
          code={`<StatTile icon={Monitor} value={1284} label="Total devices" trend={[…]} />
{/* layout="row" is the default */}`}
        />
      </Section>

      <Section title="Icons" note="Pick an icon that matches the metric. The ring is neutral; the glyph carries the tone (green / blue / red).">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Users} value={4} label="Users" tone="success" />
              <StatTile icon={Mail} value={175} label="Emails" tone="primary" />
              <StatTile icon={TriangleAlert} value={60} label="Threats" tone="danger" />
              <StatTile icon={Paperclip} value={52} label="Attachments" tone="primary" />
            </div>
          }
          code={`<StatTile icon={Users} value={4} label="Users" tone="success" />
<StatTile icon={Mail} value={175} label="Emails" tone="primary" />
<StatTile icon={Paperclip} value={52} label="Attachments" tone="primary" />`}
        />
      </Section>

      <Section title="Icon variant" note="'outline' (default) is a ring; 'soft' fills the chip with the tone tint. Same icon, two treatments.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Mail} value={175} label="Outline (default)" tone="primary" />
              <StatTile icon={Mail} value={175} label="Soft" tone="primary" iconVariant="soft" />
            </div>
          }
          code={`<StatTile icon={Mail} … />                     {/* outline — default */}
<StatTile icon={Mail} … iconVariant="soft" />  {/* filled chip */}`}
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

      <Section title="Stacked (card)" note="The card form — number as the hero, icon on top. Opt in with layout=&quot;stacked&quot;.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile layout="stacked" icon={Shield} value={1192} label="Protected" tone="success" trend={TREND} />
              <StatTile layout="stacked" icon={Activity} value={64} suffix="%" label="Avg utilization" tone="warning" />
            </div>
          }
          code={`<StatTile layout="stacked" icon={Shield} value={1192} label="Protected" trend={[…]} />`}
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
