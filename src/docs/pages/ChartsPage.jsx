import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { AreaChart, BarChart, LineChart, Surface } from '../../components/index.js'

const GROWTH = [
  { month: 'Jan', added: 120, churned: 30 },
  { month: 'Feb', added: 148, churned: 26 },
  { month: 'Mar', added: 162, churned: 34 },
  { month: 'Apr', added: 190, churned: 28 },
  { month: 'May', added: 176, churned: 41 },
  { month: 'Jun', added: 214, churned: 33 },
]
const LATENCY = [
  { t: '00:00', p50: 42, p95: 120 },
  { t: '04:00', p50: 38, p95: 98 },
  { t: '08:00', p50: 61, p95: 180 },
  { t: '12:00', p50: 74, p95: 210 },
  { t: '16:00', p50: 58, p95: 165 },
  { t: '20:00', p50: 49, p95: 132 },
]

const Frame = ({ children }) => (
  <Surface padding={4} style={{ width: '100%', maxWidth: 560 }}>
    {children}
  </Surface>
)

export function ChartsPage() {
  return (
    <ComponentPage
      title="Charts"
      description="Token-themed chart components built on recharts (Area, Bar, Line). Series colors come from the brand palette and the axes/grid/tooltip are driven by --vds-* tokens, so charts stay on-brand and flip with light/dark. Each takes data + an xKey + a series list."
      installCode={`import { AreaChart, BarChart, LineChart } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'data' }, { code: 'object[]' }, '—', 'Rows of data'],
            [{ code: 'xKey' }, { code: 'string' }, '—', 'Key on each row for the x axis'],
            [{ code: 'series' }, { code: '{ key, name?, color? }[]' }, '—', 'One area/bar/line per entry'],
            [{ code: 'height' }, { code: 'number' }, { code: '240' }, 'Chart height (px)'],
            [{ code: 'stacked' }, { code: 'boolean' }, { code: 'false' }, 'Stack series (Area/Bar)'],
            [{ code: 'legend' }, { code: 'boolean' }, { code: 'false' }, 'Show the legend'],
          ],
        },
      ]}
      accessibility={[
        <>Charts are visual — always pair them with the underlying numbers (e.g. a <IC>Stat Tile</IC> or a table) for non-visual users.</>,
        <>Series colors come from the palette; pass <IC>color</IC> per series to override for meaning (e.g. churn = rose).</>,
        <>Note: Vipre's product uses Highcharts — these recharts components are for the DS + prototypes and would be re-implemented there.</>,
      ]}
    >
      <Section title="Area" note="Trends over time; pass multiple series or stacked.">
        <Preview
          canvas={
            <Frame>
              <AreaChart data={GROWTH} xKey="month" series={[{ key: 'added', name: 'Added' }]} />
            </Frame>
          }
          code={`<AreaChart data={rows} xKey="month" series={[{ key: 'added', name: 'Added' }]} />`}
        />
      </Section>

      <Section title="Bar" note="Comparisons across categories; grouped or stacked.">
        <Preview
          canvas={
            <Frame>
              <BarChart
                data={GROWTH}
                xKey="month"
                legend
                series={[
                  { key: 'added', name: 'Added' },
                  { key: 'churned', name: 'Churned', color: 'var(--vds-rose-500)' },
                ]}
              />
            </Frame>
          }
          code={`<BarChart data={rows} xKey="month" legend series={[
  { key: 'added', name: 'Added' },
  { key: 'churned', name: 'Churned', color: 'var(--vds-rose-500)' },
]} />`}
        />
      </Section>

      <Section title="Line" note="Multiple metrics over time.">
        <Preview
          canvas={
            <Frame>
              <LineChart
                data={LATENCY}
                xKey="t"
                legend
                series={[
                  { key: 'p50', name: 'p50' },
                  { key: 'p95', name: 'p95' },
                ]}
              />
            </Frame>
          }
          code={`<LineChart data={rows} xKey="t" legend series={[
  { key: 'p50', name: 'p50' },
  { key: 'p95', name: 'p95' },
]} />`}
        />
      </Section>
    </ComponentPage>
  )
}
