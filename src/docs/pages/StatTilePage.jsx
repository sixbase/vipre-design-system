import { Shield, Monitor, TriangleAlert, Activity, Users, Mail, Paperclip } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { StatTile, Grid } from '../../components/index.js'

// Responsive auto-fit grid (matches the Grid primitive) — wraps to fewer
// columns and stacks to one on small screens.
const GRID = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))', gap: '0.75rem', width: '100%', maxWidth: 520 }
const ROW = { display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 360 }
const TREND = [4, 6, 5, 8, 7, 9, 8, 11]

export function StatTilePage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.StatTile}
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
            [{ code: 'iconVariant' }, { code: "'soft' | 'outline'" }, { code: "'soft'" }, 'Filled tinted chip (family standard) vs ringed (transparent)'],
            [{ code: 'tone' }, { code: "'default' | 'primary' | 'success' | 'warning' | 'danger'" }, { code: "'default'" }, 'Colors the icon (value stays ink)'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Value size'],
            [{ code: 'layout' }, { code: "'row' | 'stacked'" }, { code: "'row'" }, 'Compact row (default) vs stacked card'],
            [{ code: 'trend' }, { code: 'number[]' }, '—', 'Sparkline (colored by tone / trendTone)'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Skeleton placeholder'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the tile a button (hover lift + focus ring)'],
            [{ code: 'interactive' }, { code: 'boolean' }, { code: 'false' }, 'Force the hover affordance without onClick'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>onClick</IC> it renders a real <IC>{'<button>'}</IC> — keyboard + focus ring included.</>,
        <>Icon and trend are decorative (<IC>aria-hidden</IC>); the value + label carry the meaning.</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC>; tone colors meet AA contrast in both themes.</>,
      ]}
    >
      <Section title="Row (default)" note="The dense one-line layout Vipre uses most — icon, label over value, optional trend on the right. These tiles are clickable (most are) — hover to feel the drill-in lift. This is the default; no layout prop needed.">
        <Preview
          canvas={
            <div style={ROW}>
              <StatTile icon={Monitor} value={1284} label="Total devices" trend={TREND} onClick={() => {}} />
              <StatTile icon={Shield} value={1192} label="Protected" tone="success" trend={TREND} onClick={() => {}} />
              <StatTile icon={Activity} value={64} suffix="%" label="Avg utilization" tone="warning" onClick={() => {}} />
              <StatTile icon={TriangleAlert} value={17} label="At risk" tone="danger" onClick={() => {}} />
            </div>
          }
          code={`<StatTile icon={Monitor} value={1284} label="Total devices" trend={[…]} onClick={openDevices} />
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

      <Section title="Icon variant" note="'soft' (default) fills the chip with the tone tint — the metrics-family standard shared with Metric Card; 'outline' is a quieter ring. Same icon, two treatments.">
        <Preview
          canvas={
            <div style={GRID}>
              <StatTile icon={Mail} value={175} label="Soft (default)" tone="primary" />
              <StatTile icon={Mail} value={175} label="Outline" tone="primary" iconVariant="outline" />
            </div>
          }
          code={`<StatTile icon={Mail} … />                        {/* soft — default */}
<StatTile icon={Mail} … iconVariant="outline" />  {/* ringed */}`}
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

      <Section title="Responsive grid" note="A row of clickable KPI tiles in <Grid> — auto-fit columns that stack to one on small screens. Hover any tile to feel the drill-in lift. No media queries; never overflows. (Resize the preview / your window to see it reflow.)">
        <Preview
          canvas={
            <Grid min="14rem" gap={3} style={{ maxWidth: 520 }}>
              <StatTile icon={Users} value={42} label="Distributors" tone="primary" onClick={() => {}} />
              <StatTile icon={Shield} value={47} label="Resellers" tone="success" onClick={() => {}} />
              <StatTile icon={Mail} value={324} label="Customers" tone="primary" onClick={() => {}} />
            </Grid>
          }
          code={`import { Grid, StatTile } from 'vipre-design-system'

<Grid min="14rem" gap={3}>
  <StatTile icon={Users} value={42} label="Distributors" onClick={openDistributors} />
  <StatTile icon={Shield} value={47} label="Resellers" onClick={openResellers} />
  <StatTile icon={Mail} value={324} label="Customers" onClick={openCustomers} />
</Grid>`}
        />
      </Section>

      <Section title="Interactive (drill-in)" note="Most tiles are clickable. Pass onClick (or interactive) and the tile becomes a button with the shared metrics-family states: hover lifts it (shadow grows, nudges up 2px, border strengthens), press settles it back down, and keyboard focus shows a ring. Static tiles stay flat — no false affordance.">
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
