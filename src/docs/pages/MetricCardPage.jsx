import { DollarSign, Users, ShieldCheck, TrendingDown } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
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
      title="Metric Card"
      description="A flagship KPI card — the rich counterpart to Stat Tile. It stacks a header (soft icon chip + title + period), a hero value with a signed delta badge, an optional target progress bar, and an optional breakdown list. Reach for it when one metric is the hero of a panel and deserves context; use Stat Tile for dense one-line KPIs. Composes Surface + Icon + Badge + Divider."
      installCode={`import { MetricCard } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'Leading icon, rendered in a soft chip'],
            [{ code: 'iconTone' }, { code: "'primary' | 'success' | … | chromatic" }, { code: "'primary'" }, 'Chip color (semantic or a chromatic family)'],
            [{ code: 'title' }, { code: 'string' }, '—', 'Metric name'],
            [{ code: 'period' }, { code: 'string' }, '—', 'Sub-line under the title'],
            [{ code: 'value' }, { code: 'string | number' }, '—', 'Hero value; numbers are locale-formatted'],
            [{ code: 'prefix / suffix' }, { code: 'string' }, '—', 'Wrap the value (e.g. "£", "%")'],
            [{ code: 'delta' }, { code: "string | number | { value, direction } | node" }, '—', 'Signed change → auto arrow + color'],
            [{ code: 'invertDelta' }, { code: 'boolean' }, { code: 'false' }, 'Treat "down" as good (e.g. error counts)'],
            [{ code: 'deltaCaption' }, { code: 'string' }, '—', 'Muted text after the delta (e.g. "vs last quarter")'],
            [{ code: 'progress' }, { code: '{ value, label?, caption? }' }, '—', 'Target attainment bar (value 0–100)'],
            [{ code: 'progressTone' }, { code: "'azure' | 'primary' | 'success' | 'danger' | 'match'" }, { code: "'azure'" }, "Bar fill; 'match' follows the delta color"],
            [{ code: 'breakdown' }, { code: '{ label, value }[]' }, '—', 'Divided footer list of secondary stats'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the whole card a button (hover lift + focus ring)'],
            [{ code: 'interactive' }, { code: 'boolean' }, { code: 'false' }, 'Force the hover affordance without onClick'],
          ],
        },
      ]}
      accessibility={[
        <>The icon chip is decorative (<IC>aria-hidden</IC>); the title + value carry the meaning.</>,
        <>The progress bar is a real <IC>role="progressbar"</IC> with <IC>aria-valuenow/min/max</IC>.</>,
        <>The breakdown is a <IC>{'<dl>'}</IC> (label/value pairs); delta color is paired with a +/− sign, never color alone.</>,
      ]}
    >
      <Section title="Anatomy" note="The full card: header (icon chip + title + period), hero value, delta badge with caption, a target progress bar, and a breakdown list. It's clickable (most cards are) — hover to feel the drill-in lift.">
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

      <Section title="Progress color" note="The bar defaults to azure (a bright brand blue). Set progressTone=&quot;match&quot; to tie it to performance — it turns green when the delta is good, red when it's not.">
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

      <Section title="Minimal" note="Every block past the value is optional. Drop the progress bar and breakdown for a compact hero — header, value, delta.">
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

      <Section title="Interactive (drill-in)" note="Most cards are clickable. Pass onClick (or interactive) and the card becomes a button with the shared metrics-family states: hover lifts it (shadow grows, nudges up 2px, border strengthens), press settles it back down, and keyboard focus shows a ring. Static cards stay flat — no false affordance.">
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

      <Section title="In a grid" note="A real dashboard: clickable KPI cards in a <Grid> — auto-fit columns that stack to one on small screens. Hover any card to feel the drill-in lift; no media queries, never overflows.">
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
