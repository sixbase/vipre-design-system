import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Progress } from '../../components/Progress/index.js'

export function ProgressPage() {
  return (
    <ComponentPage
      title="Progress"
      description="A bar that shows how far along something is. Give it a value and it fills up to match. Leave the value out and it plays a moving sweep — that means 'working, but we don't know how long'. The bar uses the same shape as the one inside MetricCard, so they look like family."
      installCode={`import { Progress } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'number' }, '—', 'How full the bar is (0 to max). Leave it out for the busy sweep'],
            [{ code: 'max' }, { code: 'number' }, { code: '100' }, 'The top of the scale'],
            [{ code: 'tone' }, { code: "'primary' | 'success' | 'warning' | 'danger' | 'azure' | 'harbor' | 'emerald' | 'amber' | 'rose' | 'orchid' | 'clay'" }, { code: "'primary'" }, 'Fill color — status tones or a chart family'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Track height: 4 / 8 / 12px'],
            [{ code: 'label' }, { code: 'node' }, '—', 'Words above the bar (also names it for screen readers)'],
            [{ code: 'showValue' }, { code: 'boolean' }, { code: 'false' }, 'Show the percent next to the label'],
            [{ code: '…props' }, { code: 'HTMLAttributes<div>' }, '—', 'Passed to the root <div>; aria-label lands on the bar'],
          ],
        },
      ]}
      accessibility={[
        <>The bar is a real <IC>role="progressbar"</IC> with <IC>aria-valuemin</IC>, <IC>aria-valuemax</IC>, and <IC>aria-valuenow</IC>.</>,
        <>No value? It drops <IC>aria-valuenow</IC> and sets <IC>aria-busy</IC> instead.</>,
        <>A visible <IC>label</IC> names the bar. Without one, pass <IC>aria-label</IC> so it isn't nameless.</>,
        <>With <IC>prefers-reduced-motion</IC>, the fill snaps instead of sliding, and the sweep becomes a soft fade in place.</>,
      ]}
    >
      <Section title="Basic" note="A label, a value, and the percent on the right.">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 420 }}>
              <Progress value={64} label="Agent rollout" showValue />
            </div>
          }
          code={`<Progress value={64} label="Agent rollout" showValue />`}
        />
      </Section>

      <Section title="Tones" note="Status tones say good or bad. Chart families (azure, harbor…) are just colors — no meaning.">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 420 }}>
              <Progress value={64} label="Primary" showValue />
              <Progress value={100} tone="success" label="Success" showValue />
              <Progress value={78} tone="warning" label="Warning" showValue />
              <Progress value={92} tone="danger" label="Danger" showValue />
              <Progress value={45} tone="azure" label="Azure" showValue />
              <Progress value={30} tone="orchid" label="Orchid" showValue />
            </div>
          }
          code={`<Progress value={92} tone="danger" label="Disk usage" showValue />
<Progress value={45} tone="azure" label="Series A" showValue />`}
        />
      </Section>

      <Section title="Sizes" note="Three track heights. Small for tight table rows, large when the bar is the star.">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 420 }}>
              <Progress value={64} size="sm" aria-label="Small" />
              <Progress value={64} size="md" aria-label="Medium" />
              <Progress value={64} size="lg" aria-label="Large" />
            </div>
          }
          code={`<Progress value={64} size="sm" aria-label="Rollout" />
<Progress value={64} size="md" aria-label="Rollout" />
<Progress value={64} size="lg" aria-label="Rollout" />`}
        />
      </Section>

      <Section title="Indeterminate" note="No value = a moving sweep. Use it while you don't know how long the work takes.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 420 }}>
              <Progress label="Scanning devices…" />
            </div>
          }
          code={`<Progress label="Scanning devices…" />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Set the fill width inline; no JS needed for a static bar."
      >
        <Code>{`<div class="vds-progress vds-progress--md vds-progress--primary">
  <div class="vds-progress__head">
    <span class="vds-progress__label" id="p1-label">Agent rollout</span>
    <span class="vds-progress__value">64%</span>
  </div>
  <div class="vds-progress__track" role="progressbar"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="64"
       aria-labelledby="p1-label">
    <div class="vds-progress__fill" style="width: 64%"></div>
  </div>
</div>

<!-- Indeterminate: add vds-progress--indeterminate to the root,
     drop aria-valuenow, add aria-busy="true", omit the inline width. -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
