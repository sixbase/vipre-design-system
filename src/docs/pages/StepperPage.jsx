import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Stepper } from '../../components/Stepper/index.js'
import { Button } from '../../components/Button/index.js'
import { Inline } from '../../components/Inline/index.js'
import { Text } from '../../components/Text/index.js'

const DEPLOY_STEPS = [
  { id: 'select', label: 'Select devices', description: 'Pick the targets' },
  { id: 'policy', label: 'Choose policy', description: 'What to enforce' },
  { id: 'review', label: 'Review', description: 'Double-check' },
  { id: 'deploy', label: 'Deploy', description: 'Ship it' },
]

const TWO_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'products', label: 'Products' },
]

const ONBOARDING_STEPS = [
  { id: 'resource', label: 'Add your first resource' },
  { id: 'network', label: 'Connect your network' },
  { id: 'client', label: 'Download the client' },
]

function InlineExample() {
  const [current, setCurrent] = useState(1)
  return (
    <div style={{ width: '100%', display: 'grid', gap: '1.5rem' }}>
      <Stepper variant="inline" steps={ONBOARDING_STEPS} current={current}
        onStepClick={(_, i) => setCurrent(i)} />
      <Inline gap={2}>
        <Button variant="outline" tone="neutral" size="sm" disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === ONBOARDING_STEPS.length - 1}
          onClick={() => setCurrent((c) => c + 1)}>
          Next
        </Button>
      </Inline>
    </div>
  )
}

function CompactExample() {
  const [current, setCurrent] = useState(0)
  return (
    <div style={{ width: '100%', display: 'grid', gap: '1.5rem' }}>
      <Stepper variant="compact" steps={TWO_STEPS} current={current} />
      <Inline gap={2}>
        <Button variant="outline" tone="neutral" size="sm" disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === TWO_STEPS.length - 1}
          onClick={() => setCurrent((c) => c + 1)}>
          Next
        </Button>
      </Inline>
    </div>
  )
}

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
      description="Shows progress through steps in order — a setup wizard, an onboarding flow, a runbook. Done steps get a check, the current step is the heaviest mark in the row, later steps stay muted. Pass onStepClick and finished steps become clickable so people can jump back. Three shapes: a named track for flows worth mapping, an inline row for when the stepper has to share a line, and a compact status line for short flows and dialog headers."
      installCode={`import { Stepper } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'steps' }, { code: '[{ id, label, description?, status? }]' }, '—', 'The steps, in order. status: \'error\' marks one as failed'],
            [{ code: 'current' }, { code: 'number | string' }, { code: '0' }, 'Where the user is — an index or a step id'],
            [{ code: 'variant' }, { code: "'track' | 'inline' | 'compact'" }, { code: "'track'" }, 'Stretching named track, content-width named row, or a one-line count over a segmented rail'],
            [{ code: 'orientation' }, { code: "'horizontal' | 'vertical'" }, { code: "'horizontal'" }, 'Row or column — track only'],
            [{ code: 'onStepClick' }, { code: '(step, index) => void' }, '—', 'When given, completed and error steps become buttons — track and inline'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Passed to the <ol> (the <div> for compact)'],
          ],
        },
      ]}
      accessibility={[
        <>An ordered list (<IC>&lt;ol&gt;</IC>), so screen readers hear the steps in order with a count.</>,
        <>The current step carries <IC>aria-current="step"</IC>.</>,
        <><IC>variant="compact"</IC> states its position as visible text (“Step 2 of 4 · Choose policy”), so it needs no ARIA of its own — the rail beneath is decorative and <IC>aria-hidden</IC> rather than read out twice.</>,
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

      <Section
        title="Inline"
        note="variant='inline' names every step like the track does, but sizes itself to its words and separates them with a chevron instead of a stretching rule. Use it when the stepper has to share a line — a page header, a toolbar, the top of a card. Completed steps are still clickable."
      >
        <Preview
          canvas={<InlineExample />}
          code={`<Stepper
  variant="inline"
  current={current}
  steps={[
    { id: 'resource', label: 'Add your first resource' },
    { id: 'network', label: 'Connect your network' },
    { id: 'client', label: 'Download the client' },
  ]}
  onStepClick={(step, i) => setCurrent(i)}
/>`}
        />
      </Section>

      <Section
        title="Why inline isn't just a narrow track"
        note="Track's connector grows to fill whatever it's given, so it always claims the whole row. Inline ends where its words end — which is what leaves room for the rest of the header."
      >
        <Preview
          canvas={
            <div style={{ width: '100%', display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <Text variant="detail" tone="muted">
                  Track in a header — the connector takes the row, and the button has nowhere to sit.
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Stepper steps={ONBOARDING_STEPS} current={1} />
                  <Button size="sm">Continue</Button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <Text variant="detail" tone="muted">
                  Inline in the same header — the steps keep their names, the row keeps its space.
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Stepper variant="inline" steps={ONBOARDING_STEPS} current={1} />
                  <Button size="sm" style={{ marginLeft: 'auto' }}>Continue</Button>
                </div>
              </div>
            </div>
          }
          code={`{/* the stepper owns the row */}
<Stepper steps={steps} current={1} />

{/* the stepper shares the row */}
<header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <Stepper variant="inline" steps={steps} current={1} />
  <Button size="sm" style={{ marginLeft: 'auto' }}>Continue</Button>
</header>`}
        />
      </Section>

      <Section
        title="Compact"
        note="variant='compact' states the position in words over a segmented rail. Use it for two- and three-step flows, and for any stepper living in a dialog, drawer or panel header — a short track stretched across a wide surface spends most of its ink on an empty connector. Same steps array; nothing else changes."
      >
        <Preview
          canvas={<CompactExample />}
          code={`<Stepper
  variant="compact"
  current={current}
  steps={[
    { id: 'details', label: 'Details' },
    { id: 'products', label: 'Products' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Track or compact"
        note="Pick by what the user needs from it, not by how much room you have."
      >
        <Preview
          canvas={
            <div style={{ width: '100%', display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <Text variant="detail" tone="muted">
                  Track — the step NAMES are information. Worth the space at 3+ steps.
                </Text>
                <Stepper steps={DEPLOY_STEPS} current={1} />
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <Text variant="detail" tone="muted">
                  Compact — the same four steps when the stepper is a status line, not a map.
                </Text>
                <Stepper variant="compact" steps={DEPLOY_STEPS} current={1} />
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <Text variant="detail" tone="muted">
                  Two steps in a wide container — this is the case compact exists for.
                </Text>
                <Stepper steps={TWO_STEPS} current={0} />
                <Stepper variant="compact" steps={TWO_STEPS} current={0} />
              </div>
            </div>
          }
          code={`{/* 3+ named steps, room to breathe */}
<Stepper steps={steps} current={1} />

{/* short flow, or inside a dialog / drawer / panel header */}
<Stepper variant="compact" steps={steps} current={1} />`}
        />
      </Section>

      <Section
        title="One accent, not two"
        note="Completed and current steps are both the brand accent — they differ by check-versus-ring, not by hue. Don't recolour completed steps green per-flow: green is the outcome colour, and clearing step 1 of 2 isn't an outcome. Two hues in one progression also breaks the connector, which has to pick a side."
      >
        <Preview
          canvas={<Stepper steps={DEPLOY_STEPS} current={2} />}
          code={`{/* Correct — the component already distinguishes done from current. */}
<Stepper steps={steps} current={2} />

{/* Wrong — a consumer-side override that invents a second hue.
    .my-flow .vds-stepper__step--complete .vds-stepper__indicator {
      background: var(--vds-success);
    } */}`}
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
     <button class="vds-stepper__content" type="button">…</button> + your handler -->

<!-- variant="inline" — same list, same step classes. The only differences are the
     wrapper class and the chevron, which TRAILS every step but the last so a
     wrapped row never opens with a separator pointing at nothing. -->
<ol class="vds-stepper vds-stepper--inline">
  <li class="vds-stepper__step vds-stepper__step--complete">
    <div class="vds-stepper__content">
      <span class="vds-stepper__indicator" aria-hidden="true"><svg class="vds-icon">…check…</svg></span>
      <span class="vds-stepper__text">
        <span class="vds-stepper__label"><span class="vds-stepper__sr">Completed: </span>Add your first resource</span>
      </span>
    </div>
    <span class="vds-stepper__sep" aria-hidden="true"><svg class="vds-icon">…chevron-right…</svg></span>
  </li>
  <li class="vds-stepper__step vds-stepper__step--current" aria-current="step">
    <div class="vds-stepper__content">
      <span class="vds-stepper__indicator" aria-hidden="true"><span class="vds-stepper__number">2</span></span>
      <span class="vds-stepper__text"><span class="vds-stepper__label">Connect your network</span></span>
    </div>
    <span class="vds-stepper__sep" aria-hidden="true"><svg class="vds-icon">…chevron-right…</svg></span>
  </li>
  <li class="vds-stepper__step vds-stepper__step--upcoming">
    <div class="vds-stepper__content">
      <span class="vds-stepper__indicator" aria-hidden="true"><span class="vds-stepper__number">3</span></span>
      <span class="vds-stepper__text"><span class="vds-stepper__label">Download the client</span></span>
    </div>
  </li>
</ol>

<!-- variant="compact" — a div, not a list. The status line carries the state as
     real text, so the rail underneath is decorative. -->
<div class="vds-stepper vds-stepper--compact vds-stepper--compact-current">
  <p class="vds-stepper__status">
    <span class="vds-stepper__count">Step 2 of 4</span>
    <span class="vds-stepper__current">Choose policy</span>
    <span class="vds-stepper__next">Next: Review</span>
  </p>
  <span class="vds-stepper__rail" aria-hidden="true">
    <span class="vds-stepper__seg vds-stepper__seg--complete"></span>
    <span class="vds-stepper__seg vds-stepper__seg--current"></span>
    <span class="vds-stepper__seg vds-stepper__seg--upcoming"></span>
    <span class="vds-stepper__seg vds-stepper__seg--upcoming"></span>
  </span>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
