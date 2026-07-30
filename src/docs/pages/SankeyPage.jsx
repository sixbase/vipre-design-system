import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from '../colorUsage.js'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Sankey } from '../../components/index.js'

// A realistic scope-navigator flow: managed assets → coverage state → outcome.
const SCOPE_FLOW = {
  nodes: [
    { name: 'Endpoints' },
    { name: 'Servers' },
    { name: 'Cloud' },
    { name: 'Monitored' },
    { name: 'Unmonitored' },
    { name: 'Healthy' },
    { name: 'At risk' },
    { name: 'Critical' },
  ],
  links: [
    { source: 'Endpoints', target: 'Monitored', value: 1840 },
    { source: 'Endpoints', target: 'Unmonitored', value: 260 },
    { source: 'Servers', target: 'Monitored', value: 520 },
    { source: 'Servers', target: 'Unmonitored', value: 40 },
    { source: 'Cloud', target: 'Monitored', value: 610 },
    { source: 'Cloud', target: 'Unmonitored', value: 90 },
    { source: 'Monitored', target: 'Healthy', value: 2380 },
    { source: 'Monitored', target: 'At risk', value: 470 },
    { source: 'Monitored', target: 'Critical', value: 120 },
    { source: 'Unmonitored', target: 'At risk', value: 250 },
    { source: 'Unmonitored', target: 'Critical', value: 140 },
  ],
}

// Email threat triage: everything Detected is graded Suspicious or Malicious,
// then routed to a delivery outcome. Values are illustrative — swap in real
// counts; the link widths scale to them automatically.
const THREAT_TRIAGE = {
  // Per-node `color` uses a semantic tone so hue tracks status, not category:
  // neutral → caution (amber) → threat (red), with green for a neutralized threat.
  nodes: [
    { name: 'Detected', color: 'muted' },
    { name: 'Suspicious', color: 'warning' },
    { name: 'Malicious', color: 'danger' },
    { name: 'Junk', color: 'warning' },
    { name: 'Blocked', color: 'success' },
    { name: 'Delivered', color: 'danger' },
    { name: 'User Inbox', color: 'danger' },
    { name: 'Hidden', color: 'warning' },
  ],
  links: [
    { source: 'Detected', target: 'Suspicious', value: 820 },
    { source: 'Detected', target: 'Malicious', value: 300 },
    { source: 'Suspicious', target: 'Junk', value: 210 },
    { source: 'Suspicious', target: 'Blocked', value: 180 },
    { source: 'Suspicious', target: 'Delivered', value: 150 },
    { source: 'Suspicious', target: 'User Inbox', value: 130 },
    { source: 'Suspicious', target: 'Hidden', value: 150 },
    { source: 'Malicious', target: 'Blocked', value: 120 },
    { source: 'Malicious', target: 'Delivered', value: 70 },
    { source: 'Malicious', target: 'Hidden', value: 110 },
  ],
}

const BUDGET_FLOW = {
  nodes: [
    { name: 'MRR' },
    { name: 'Tooling' },
    { name: 'Labor' },
    { name: 'Margin' },
    { name: 'EDR' },
    { name: 'Backup' },
    { name: 'Tier 1' },
    { name: 'Tier 2' },
  ],
  links: [
    { source: 'MRR', target: 'Tooling', value: 42 },
    { source: 'MRR', target: 'Labor', value: 38 },
    { source: 'MRR', target: 'Margin', value: 20 },
    { source: 'Tooling', target: 'EDR', value: 26 },
    { source: 'Tooling', target: 'Backup', value: 16 },
    { source: 'Labor', target: 'Tier 1', value: 22 },
    { source: 'Labor', target: 'Tier 2', value: 16 },
  ],
}

export function SankeyPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Sankey}
      title="Sankey"
      description="A flow diagram for showing how a total splits and moves between stages — assets into coverage states, budget into line items, traffic into outcomes. Built on Apache ECharts and themed entirely from tokens, so it stays on-brand and flips with light/dark on its own."
      installCode={`import { Sankey } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'data' }, { code: '{ nodes, links }' }, '—', 'The flow: nodes are { name }, links are { source, target, value } by node name'],
            [{ code: 'height' }, { code: 'number' }, { code: '420' }, 'How tall the chart is (px)'],
            [{ code: 'orient' }, { code: "'horizontal' | 'vertical'" }, { code: "'horizontal'" }, 'Which way the flow runs'],
            [{ code: 'nodeAlign' }, { code: "'justify' | 'left' | 'right'" }, { code: "'justify'" }, 'How the end columns line up'],
            [{ code: 'curveness' }, { code: 'number' }, { code: '0.5' }, 'How much the links bend (0–1)'],
            [{ code: 'palette' }, { code: 'string[]' }, '—', 'Node colors — token names, tones, or accent names (e.g. "azure")'],
            [{ code: 'valueFormatter' }, { code: '(value, name) => string' }, '—', 'Format the number in the tooltip'],
            [{ code: 'label' }, { code: 'string' }, '—', 'Accessible name for the whole chart (please set it)'],
          ],
        },
      ]}
      accessibility={[
        <>The chart is a <IC>canvas</IC>, so it carries <IC>role="img"</IC> with your <IC>label</IC> as its accessible name — always pass a <IC>label</IC>.</>,
        <>A canvas can't be read by a screen reader beyond that label — for anything a user must be able to read exactly, pair the chart with a table or description list of the same numbers.</>,
        <>Colors come from the categorical accent palette (no good/bad meaning) and never encode a value by hue alone; the flow width carries the quantity.</>,
        <>Animation is skipped when <IC>prefers-reduced-motion</IC> is set.</>,
      ]}
    >
      <Section title="Threat triage" note="Detected mail graded Suspicious or Malicious, then routed to a delivery outcome. Each node carries a semantic color prop so hue tracks status (neutral → amber → red, green = neutralized) — hover a node to trace its full path.">
        <Preview
          canvas={<Sankey label="Detected email by verdict and delivery outcome" data={THREAT_TRIAGE} height={360} />}
          code={`// color is a tone ('warning'|'danger'|'success'|'muted') or accent name
const data = {
  nodes: [
    { name: 'Detected',   color: 'muted' },
    { name: 'Suspicious', color: 'warning' },
    { name: 'Malicious',  color: 'danger' },
    { name: 'Junk',       color: 'warning' },
    { name: 'Blocked',    color: 'success' },
    { name: 'Delivered',  color: 'danger' },
    { name: 'User Inbox', color: 'danger' },
    { name: 'Hidden',     color: 'warning' },
  ],
  links: [
    { source: 'Detected',   target: 'Suspicious', value: 820 },
    { source: 'Detected',   target: 'Malicious',   value: 300 },
    { source: 'Suspicious', target: 'Junk',        value: 210 },
    { source: 'Suspicious', target: 'Blocked',     value: 180 },
    { source: 'Suspicious', target: 'Delivered',   value: 150 },
    { source: 'Suspicious', target: 'User Inbox',  value: 130 },
    { source: 'Suspicious', target: 'Hidden',      value: 150 },
    { source: 'Malicious',  target: 'Blocked',     value: 120 },
    { source: 'Malicious',  target: 'Delivered',   value: 70 },
    { source: 'Malicious',  target: 'Hidden',      value: 110 },
  ],
}

<Sankey label="Detected email by verdict and delivery outcome" data={data} height={360} />`}
        />
      </Section>

      <Section title="Asset coverage" note="Managed assets flowing through monitoring into a health outcome — the everyday scope-navigator view.">
        <Preview
          canvas={<Sankey label="Managed assets by coverage and health" data={SCOPE_FLOW} height={440} />}
          code={`<Sankey
  label="Managed assets by coverage and health"
  height={440}
  data={{
    nodes: [{ name: 'Endpoints' }, { name: 'Monitored' }, { name: 'Healthy' }, …],
    links: [
      { source: 'Endpoints', target: 'Monitored', value: 1840 },
      { source: 'Monitored',  target: 'Healthy',   value: 2380 },
      …
    ],
  }}
/>`}
        />
      </Section>

      <Section title="Vertical flow" note="Set orient=&quot;vertical&quot; to run the flow top-to-bottom — good in a narrow column.">
        <Preview
          canvas={
            <Sankey
              label="Monthly revenue allocation"
              data={BUDGET_FLOW}
              orient="vertical"
              height={480}
              valueFormatter={(v) => `${v}%`}
            />
          }
          code={`<Sankey
  label="Monthly revenue allocation"
  data={budget}
  orient="vertical"
  valueFormatter={(v) => \`\${v}%\`}
/>`}
        />
      </Section>

      <Section title="Straighter links" note="Lower curveness flattens the S-bend toward straight diagonal ribbons. curveness={0} is the straightest; the default is 0.5.">
        <Preview
          canvas={<Sankey label="Threat triage, straight links" data={THREAT_TRIAGE} height={360} curveness={0} />}
          code={`<Sankey data={data} curveness={0} />   // straight ribbons
<Sankey data={data} curveness={0.5} /> // default, curved`}
        />
      </Section>

      <Section title="Custom palette" note="Pass token names, tones ('primary', 'success'…), or accent names ('azure', 'emerald'…) to recolor the nodes.">
        <Preview
          canvas={
            <Sankey
              label="Managed assets, harbor palette"
              data={SCOPE_FLOW}
              height={440}
              palette={['harbor', 'azure', 'cobalt', 'emerald', 'purple']}
            />
          }
          code={`<Sankey data={flow} palette={['harbor', 'azure', 'cobalt', 'emerald', 'purple']} />`}
        />
      </Section>
    </ComponentPage>
  )
}
