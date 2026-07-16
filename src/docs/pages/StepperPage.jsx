import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Stepper } from '../../components/Stepper/index.js'
import { Button } from '../../components/Button/index.js'
import { Inline } from '../../components/Inline/index.js'

const DEPLOY_STEPS = [
  { id: 'select', label: 'Select devices', description: 'Pick the targets' },
  { id: 'policy', label: 'Choose policy', description: 'What to enforce' },
  { id: 'review', label: 'Review', description: 'Double-check' },
  { id: 'deploy', label: 'Deploy', description: 'Ship it' },
]

function WizardExample() {
  const [current, setCurrent] = useState(1)
  return (
    <div style={{ width: '100%', display: 'grid', gap: '1.5rem' }}>
      <Stepper steps={DEPLOY_STEPS} current={current} onStepClick={(_, i) => setCurrent(i)} />
      <Inline gap={2}>
        <Button variant="outline" tone="neutral" size="sm" disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === DEPLOY_STEPS.length - 1}
          onClick={() => setCurrent((c) => c + 1)}>
          Next
        </Button>
      </Inline>
    </div>
  )
}

export function StepperPage() {
  return (
    <ComponentPage
      title="Stepper"
      description="Shows progress through steps in order — a setup wizard, an onboarding flow, a runbook. Done steps get a check, the current step gets a ring, later steps stay muted. Pass onStepClick and finished steps become clickable so people can jump back. Horizontal flips to vertical on small screens by itself."
      installCode={`import { Stepper } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'steps' }, { code: '[{ id, label, description?, status? }]' }, '—', 'The steps, in order. status: \'error\' marks one as failed'],
            [{ code: 'current' }, { code: 'number | string' }, { code: '0' }, 'Where the user is — an index or a step id'],
            [{ code: 'orientation' }, { code: "'horizontal' | 'vertical'" }, { code: "'horizontal'" }, 'Row or column'],
            [{ code: 'onStepClick' }, { code: '(step, index) => void' }, '—', 'When given, completed and error steps become buttons'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Passed to the <ol>'],
          ],
        },
      ]}
      accessibility={[
        <>An ordered list (<IC>&lt;ol&gt;</IC>), so screen readers hear the steps in order with a count.</>,
        <>The current step carries <IC>aria-current="step"</IC>.</>,
        <>Completed and error steps get a hidden text prefix (“Completed:”, “Error:”) so state isn’t color-only — and the check/warning icons back that up.</>,
        <>Clickable steps are real buttons with a <IC>--vds-focus-ring</IC> focus ring and ≥ <IC>--vds-tap-target</IC> height on touch screens.</>,
        <>State-change transitions stop under <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section title="Interactive wizard" note="Click Next/Back — or click a finished step to jump back to it.">
        <Preview
          canvas={<WizardExample />}
          code={`const [current, setCurrent] = useState(1)

<Stepper
  steps={[
    { id: 'select', label: 'Select devices', description: 'Pick the targets' },
    { id: 'policy', label: 'Choose policy', description: 'What to enforce' },
    { id: 'review', label: 'Review', description: 'Double-check' },
    { id: 'deploy', label: 'Deploy', description: 'Ship it' },
  ]}
  current={current}
  onStepClick={(step, i) => setCurrent(i)}
/>`}
        />
      </Section>

      <Section title="Vertical" note="orientation='vertical' stacks the steps with a connector running down the left.">
        <Preview
          canvas={
            <Stepper
              orientation="vertical"
              current="verify"
              steps={[
                { id: 'install', label: 'Install agent', description: 'Pushed to 240 devices' },
                { id: 'verify', label: 'Verify check-in', description: '187 of 240 reporting' },
                { id: 'baseline', label: 'Baseline scan' },
              ]}
            />
          }
          code={`<Stepper
  orientation="vertical"
  current="verify"
  steps={[
    { id: 'install', label: 'Install agent', description: 'Pushed to 240 devices' },
    { id: 'verify', label: 'Verify check-in', description: '187 of 240 reporting' },
    { id: 'baseline', label: 'Baseline scan' },
  ]}
/>`}
        />
      </Section>

      <Section title="Error state" note="Give a step status: 'error' to flag it — the circle turns danger red with a warning icon.">
        <Preview
          canvas={
            <Stepper
              current={2}
              steps={[
                { id: 'a', label: 'Download' },
                { id: 'b', label: 'Install', status: 'error', description: 'Failed on 3 devices' },
                { id: 'c', label: 'Activate' },
              ]}
            />
          }
          code={`<Stepper
  current={2}
  steps={[
    { id: 'a', label: 'Download' },
    { id: 'b', label: 'Install', status: 'error', description: 'Failed on 3 devices' },
    { id: 'c', label: 'Activate' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Responsive"
        note="A horizontal stepper switches to the vertical layout on small screens by itself — nothing to configure. Shrink this window to watch it flip."
      >
        <Preview
          canvas={<Stepper steps={DEPLOY_STEPS} current={2} />}
          code={`{/* horizontal ≥ sm, vertical < sm — automatic */}`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Static display needs no JS; jumping back on click needs your own handlers on the button steps."
      >
        <Code>{`<ol class="vds-stepper vds-stepper--horizontal">
  <li class="vds-stepper__step vds-stepper__step--complete">
    <div class="vds-stepper__content">
      <span class="vds-stepper__indicator" aria-hidden="true"><svg class="vds-icon">…check…</svg></span>
      <span class="vds-stepper__text">
        <span class="vds-stepper__label"><span class="vds-stepper__sr">Completed: </span>Select devices</span>
        <span class="vds-stepper__description">Pick the targets</span>
      </span>
    </div>
  </li>
  <li class="vds-stepper__step vds-stepper__step--current" aria-current="step">
    <div class="vds-stepper__content">
      <span class="vds-stepper__indicator" aria-hidden="true"><span class="vds-stepper__number">2</span></span>
      <span class="vds-stepper__text"><span class="vds-stepper__label">Choose policy</span></span>
    </div>
  </li>
  <li class="vds-stepper__step vds-stepper__step--upcoming">
    <div class="vds-stepper__content">
      <span class="vds-stepper__indicator" aria-hidden="true"><span class="vds-stepper__number">3</span></span>
      <span class="vds-stepper__text"><span class="vds-stepper__label">Review</span></span>
    </div>
  </li>
</ol>

<!-- Clickable (completed) step: swap the inner div for
     <button class="vds-stepper__content" type="button">…</button> + your handler -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
