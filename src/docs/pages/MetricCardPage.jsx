import { DollarSign, Users, ShieldCheck, TrendingDown } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { MetricCard, Grid } from '../../components/index.js'

const ONE = { width: '100%', maxWidth: 380 }

const REVENUE_BREAKDOWN = [
  { label: 'Gross margin', value: '42.8%' },
  { label: 'Recurring revenue', value: '$1.62M' },
  { label: 'Average deal size', value: '$34.2K' },
]

export function MetricCardPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.MetricCard}
      title="Metric Card"
      description="A big, detailed number card — the fancy cousin of Stat Tile. Top to bottom it has a header (an icon chip, a title, and a time period), one big number with a badge showing how much it went up or down, an optional bar showing progress toward a goal, and an optional list of extra numbers. Use it when one number is the star of the panel and needs some backstory; use Stat Tile for quick one-line numbers. Built from Surface + Icon + Badge + Divider."
      installCode={`import { MetricCard } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'The icon shown in a soft chip'],
            [{ code: 'iconTone' }, { code: "'primary' | 'success' | … | chromatic" }, { code: "'primary'" }, 'The chip color (a named tone or a color family)'],
            [{ code: 'title' }, { code: 'string' }, '—', 'The name of the number'],
            [{ code: 'period' }, { code: 'string' }, '—', 'A small line under the title'],
            [{ code: 'value' }, { code: 'string | number' }, '—', 'The big number; plain numbers get commas added'],
            [{ code: 'prefix / suffix' }, { code: 'string' }, '—', 'Text before or after the number (e.g. "£", "%")'],
            [{ code: 'delta' }, { code: "string | number | { value, direction } | node" }, '—', 'The change; picks the arrow and color for you'],
            [{ code: 'invertDelta' }, { code: 'boolean' }, { code: 'false' }, 'Treats "down" as good news (e.g. error counts)'],
            [{ code: 'deltaCaption' }, { code: 'string' }, '—', 'Quiet text after the change (e.g. "vs last quarter")'],
            [{ code: 'progress' }, { code: '{ value, label?, caption? }' }, '—', 'A bar showing how close you are to a goal (0–100)'],
            [{ code: 'progressTone' }, { code: "'azure' | 'primary' | 'success' | 'danger' | 'match'" }, { code: "'azure'" }, "The bar color; 'match' copies the change color"],
            [{ code: 'breakdown' }, { code: '{ label, value }[]' }, '—', 'A list of extra numbers at the bottom'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Turns the whole card into a button (lifts on hover, shows a focus ring)'],
            [{ code: 'interactive' }, { code: 'boolean' }, { code: 'false' }, 'Adds the hover lift even without onClick'],
          ],
        },
      ]}
      accessibility={[
        <>The icon chip is just for looks (<IC>aria-hidden</IC>); the title and number carry the meaning.</>,
        <>The progress bar is a real <IC>role="progressbar"</IC> with <IC>aria-valuenow/min/max</IC>.</>,
        <>The extra numbers are a <IC>{'<dl>'}</IC> (name and value pairs). The change always has a + or − sign, so it never relies on color alone.</>
      ]}
    >
      <Section title="Anatomy" note="The whole card: header (icon chip, title, period), the big number, a change badge with a caption, a goal bar, and a list of extra numbers. It's clickable (most cards are) — hover to feel it lift.">
        <Preview
          canvas={
            <div style={ONE}>
              <MetricCard
                icon={DollarSign}
                iconTone="orchid"
                title="Total Revenue"
                period="Q1 2026 (Jan – Mar)"
                value="$2.45M"
                delta="+12.5%"
                deltaCaption="vs last quarter"
                progress={{ value: 87, label: 'Quarterly target: $2.8M' }}
                breakdown={REVENUE_BREAKDOWN}
                onClick={() => {}}
              />
            </div>
          }
          code={`<MetricCard
  icon={DollarSign}
  iconTone="orchid"
  title="Total Revenue"
  period="Q1 2026 (Jan – Mar)"
  value="$2.45M"
  delta="+12.5%"
  deltaCaption="vs last quarter"
  progress={{ value: 87, label: 'Quarterly target: $2.8M' }}
  breakdown={[
    { label: 'Gross margin', value: '42.8%' },
    { label: 'Recurring revenue', value: '$1.62M' },
    { label: 'Average deal size', value: '$34.2K' },
  ]}
  onClick={openRevenue}
/>`}
        />
      </Section>

      <Section title="Progress color" note="The bar is azure (a bright brand blue) by default. Set progressTone=&quot;match&quot; to make it follow the number — green when the change is good, red when it's not.">
        <Preview
          canvas={
            <Grid min="17rem" gap={4}>
              <MetricCard
                icon={ShieldCheck}
                iconTone="emerald"
                title="Protected devices"
                period="Live"
                value="1,192"
                delta="+3.4%"
                deltaCaption="this week"
                progress={{ value: 92, label: 'Coverage target: 1,300' }}
                progressTone="match"
              />
              <MetricCard
                icon={TrendingDown}
                iconTone="rose"
                title="Active threats"
                period="Last 24h"
                value={17}
                delta="+5"
                invertDelta
                deltaCaption="vs yesterday"
                progress={{ value: 34, label: 'Within SLA budget' }}
                progressTone="match"
              />
            </Grid>
          }
          code={`<MetricCard … delta="+3.4%" progressTone="match" />              {/* good → green bar */}
<MetricCard … delta="+5" invertDelta progressTone="match" />   {/* up is bad → red bar */}`}
        />
      </Section>

      <Section title="Minimal" note="Everything after the number is optional. Leave off the bar and the extra numbers for a small card — just header, number, and change.">
        <Preview
          canvas={
            <div style={ONE}>
              <MetricCard
                icon={Users}
                iconTone="primary"
                title="Active customers"
                period="All accounts"
                value={3248}
                delta="+8.2%"
                deltaCaption="vs last month"
              />
            </div>
          }
          code={`<MetricCard
  icon={Users}
  title="Active customers"
  period="All accounts"
  value={3248}
  delta="+8.2%"
  deltaCaption="vs last month"
/>`}
        />
      </Section>

      <Section title="Interactive (drill-in)" note="Most cards are clickable. Pass onClick (or interactive) and the card becomes a button that acts like the rest of the number family: hover lifts it (bigger shadow, moves up 2px, darker border), pressing puts it back down, and keyboard focus shows a ring. Cards that don't do anything stay flat, so they never look clickable when they aren't.">
        <Preview
          canvas={
            <div style={ONE}>
              <MetricCard
                icon={DollarSign}
                iconTone="orchid"
                title="Total Revenue"
                period="Q1 2026 (Jan – Mar)"
                value="$2.45M"
                delta="+12.5%"
                deltaCaption="vs last quarter"
                progress={{ value: 87, label: 'Quarterly target: $2.8M' }}
                breakdown={REVENUE_BREAKDOWN}
                onClick={() => {}}
              />
            </div>
          }
          code={`<MetricCard … onClick={openRevenuePanel} />  {/* hover lift + focus ring */}`}
        />
      </Section>

      <Section title="In a grid" note="A real dashboard: clickable cards in a <Grid> — columns that fit themselves and stack into one on small screens. Hover any card to feel it lift; no media queries, and it never spills over.">
        <Preview
          canvas={
            <Grid min="18rem" gap={4}>
              <MetricCard
                icon={DollarSign}
                iconTone="orchid"
                title="Total Revenue"
                period="Q1 2026"
                value="$2.45M"
                delta="+12.5%"
                deltaCaption="vs last quarter"
                progress={{ value: 87, label: 'Target: $2.8M' }}
                onClick={() => {}}
              />
              <MetricCard
                icon={Users}
                iconTone="harbor"
                title="New customers"
                period="Q1 2026"
                value={412}
                delta="+18%"
                deltaCaption="vs last quarter"
                progress={{ value: 64, label: 'Target: 640' }}
                onClick={() => {}}
              />
            </Grid>
          }
          code={`<Grid min="18rem" gap={4}>
  <MetricCard … onClick={openRevenue} />
  <MetricCard … onClick={openCustomers} />
</Grid>`}
        />
      </Section>
    </ComponentPage>
  )
}
