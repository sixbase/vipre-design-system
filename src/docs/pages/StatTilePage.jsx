import { Shield, Monitor, TriangleAlert, Activity, Users, Mail, Paperclip } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
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
      description="A small number tile — a big value with a label, plus an optional icon, a caption, and a tiny trend line. It has loading and empty states too. Two layouts (row or stacked) and three sizes. Built from Surface + Icon + Sparkline."
      installCode={`import { StatTile } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string | number' }, '—', 'Plain numbers get commas added; empty shows "—"'],
            [{ code: 'prefix / suffix' }, { code: 'string' }, '—', 'Text before or after the value (e.g. "$", "%")'],
            [{ code: 'label' }, { code: 'string' }, '—', 'The name of the number'],
            [{ code: 'caption' }, { code: 'ReactNode' }, '—', 'A small extra line for context'],
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'The icon at the front'],
            [{ code: 'iconVariant' }, { code: "'soft' | 'outline'" }, { code: "'soft'" }, 'A filled tinted chip (the family standard) or a see-through ring'],
            [{ code: 'tone' }, { code: "'default' | 'primary' | 'success' | 'warning' | 'danger'" }, { code: "'default'" }, 'Colors the icon (the number stays dark)'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'How big the number is'],
            [{ code: 'layout' }, { code: "'row' | 'stacked'" }, { code: "'row'" }, 'A tight one-line row (default) or a stacked card'],
            [{ code: 'trend' }, { code: 'number[]' }, '—', 'A tiny trend line (colored by tone / trendTone)'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Shows a placeholder while data loads'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Turns the tile into a button (lifts on hover, shows a focus ring)'],
            [{ code: 'interactive' }, { code: 'boolean' }, { code: 'false' }, 'Adds the hover lift even without onClick'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>onClick</IC> it becomes a real <IC>{'<button>'}</IC> — keyboard and focus ring come with it.</>,
        <>The icon and trend line are just for looks (<IC>aria-hidden</IC>); the number and label carry the meaning.</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC>; the tone colors pass AA contrast in both light and dark modes.</>
      ]}
    >
      <Section title="Row (default)" note="The tight one-line layout Vipre uses most — icon, label over value, and an optional trend line on the right. These tiles are clickable (most are) — hover to feel it lift. This is the default, so you don't need a layout prop.">
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

      <Section title="Icons" note="Pick an icon that fits the number. The ring stays plain; the icon itself carries the color (green / blue / red).">
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

      <Section title="Icon variant" note="'soft' (default) fills the chip with a light tint — the look these tiles share with Metric Card; 'outline' is a quieter ring. Same icon, two looks.">
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

      <Section title="Value formatting" note="Pass a plain number and it gets commas added. prefix / suffix add text before or after it.">
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

      <Section title="Loading" note="A placeholder while data loads (sets aria-busy; respects reduced-motion).">
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

      <Section title="Sizes" note="sm / md / lg change how big the number is (heading → title → display).">
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

      <Section title="Stacked (card)" note="The card shape — the number is the star, with the icon on top. Turn it on with layout=&quot;stacked&quot;.">
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

      <Section title="Responsive grid" note="A row of clickable tiles in <Grid> — columns that fit themselves and stack into one on small screens. Hover any tile to feel it lift. No media queries, and it never spills over. (Resize the preview or your window to watch it rearrange.)">
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

      <Section title="Interactive (drill-in)" note="Most tiles are clickable. Pass onClick (or interactive) and the tile becomes a button that acts like the rest of the number family: hover lifts it (bigger shadow, moves up 2px, darker border), pressing puts it back down, and keyboard focus shows a ring. Tiles that don't do anything stay flat, so they never look clickable when they aren't.">
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

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. It's a Surface with the stat classes on top. Interactive tiles render as a <button> instead of a <div>. Number formatting (commas) and the sparkline points are computed by the React component — in plain HTML you write them out yourself. The hover lift and focus ring are pure CSS."
      >
        <Code>{`<!-- layout: vds-stat--row | --stacked · size: --size-sm | --size-md | --size-lg
     icon chip: --icon-soft | --icon-outline · tone: --default | --primary | --success | --warning | --danger -->
<button type="button"
        class="vds-surface vds-surface--pad-4 vds-surface--radius-lg vds-surface--bordered
               vds-surface--elev-resting vds-stat vds-stat--row vds-stat--size-md
               vds-stat--icon-soft vds-stat--success vds-stat--interactive">
  <span class="vds-stat__icon" aria-hidden="true">
    <svg class="vds-icon" width="24" height="24" aria-hidden="true">…</svg>
  </span>
  <span class="vds-stat__body">
    <span class="vds-stat__label">Protected</span>
    <span class="vds-stat__value">1,192</span>
    <span class="vds-stat__caption">of 1,400 total</span>
  </span>
  <svg class="vds-sparkline vds-sparkline--success vds-stat__spark" width="72" height="28" aria-hidden="true">…</svg>
  <span class="vds-stat__delta vds-stat__delta--chip vds-stat__delta--good">+3%</span>
</button>

<!-- static tile: use a <div> and drop vds-stat--interactive.
     loading: aria-busy="true" + vds-stat__skeleton--value / --label placeholder spans. -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
