import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Slider } from '../../components/Slider/index.js'
import { Field } from '../../components/Field/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: 360 }

function ControlledExample() {
  const [threshold, setThreshold] = useState(70)
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Field label={`Alert threshold: ${threshold}%`}>
        <Slider min={0} max={100} value={threshold} onChange={setThreshold} aria-label="Alert threshold" />
      </Field>
    </div>
  )
}

export function SliderPage() {
  return (
    <ComponentPage
      title="Slider"
      description="Drag a knob to pick a number. It’s a real range input underneath, so arrow keys, Home/End, and screen readers work for free. The filled part of the track follows the knob, painted by a CSS variable the component keeps up to date."
      installCode={`import { Slider } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'min / max / step' }, { code: 'number' }, { code: '0 / 100 / 1' }, 'The range and how big each step is'],
            [{ code: 'value / defaultValue' }, { code: 'number' }, 'midpoint', 'The current number, with or without you tracking it'],
            [{ code: 'onChange' }, { code: '(value, event) => void' }, '—', 'Runs with the new number (a real number, not a string)'],
            [{ code: 'showValue' }, { code: 'boolean' }, { code: 'false' }, 'Show the number next to the track'],
            [{ code: 'marks' }, { code: 'number[] | { value, label }[]' }, '—', 'Little ticks (and optional labels) along the track'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Track thickness'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Half-faded and click-proof'],
          ],
        },
      ]}
      accessibility={[
        <>A real <IC>{'<input type="range">'}</IC> — arrows nudge, Home/End jump to the ends, screen readers announce the value.</>,
        <>Give it a name: <IC>aria-label</IC>, or wrap it in a <IC>Field</IC>.</>,
        <>The knob is 20px, never smaller. On touch screens the hit area grows to <IC>--vds-tap-target</IC>.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> on the knob, keyboard only (<IC>:focus-visible</IC>).</>,
      ]}
    >
      <Section title="Basic">
        <Preview
          canvas={
            <div style={COL}>
              <Slider defaultValue={40} aria-label="Basic slider" />
            </div>
          }
          code={`<Slider defaultValue={40} aria-label="Basic slider" />`}
        />
      </Section>

      <Section title="With the value shown" note="showValue prints the live number after the track. Digits are tabular so they don’t wiggle.">
        <Preview
          canvas={
            <div style={COL}>
              <Slider defaultValue={65} showValue aria-label="CPU limit" />
            </div>
          }
          code={`<Slider defaultValue={65} showValue aria-label="CPU limit" />`}
        />
      </Section>

      <Section title="Steps and bounds" note="min, max, and step work exactly like the native input.">
        <Preview
          canvas={
            <div style={COL}>
              <Slider min={0} max={30} step={5} defaultValue={15} showValue aria-label="Retention days" />
            </div>
          }
          code={`<Slider min={0} max={30} step={5} defaultValue={15} showValue aria-label="Retention days" />`}
        />
      </Section>

      <Section title="Marks" note="Ticks show where the notable values sit. Add labels for the ones worth naming.">
        <Preview
          canvas={
            <div style={COL}>
              <Slider
                min={0}
                max={100}
                step={25}
                defaultValue={50}
                marks={[
                  { value: 0, label: 'Off' },
                  { value: 25, label: 'Low' },
                  { value: 50, label: 'Med' },
                  { value: 75, label: 'High' },
                  { value: 100, label: 'Max' },
                ]}
                aria-label="Scan intensity"
              />
            </div>
          }
          code={`<Slider
  min={0} max={100} step={25} defaultValue={50}
  marks={[
    { value: 0, label: 'Off' },
    { value: 25, label: 'Low' },
    { value: 50, label: 'Med' },
    { value: 75, label: 'High' },
    { value: 100, label: 'Max' },
  ]}
  aria-label="Scan intensity"
/>`}
        />
      </Section>

      <Section title="Controlled, in a Field" note="Hold the value yourself and put the live number in the label.">
        <Preview
          canvas={<ControlledExample />}
          code={`const [threshold, setThreshold] = useState(70)

<Field label={\`Alert threshold: \${threshold}%\`}>
  <Slider min={0} max={100} value={threshold} onChange={setThreshold} />
</Field>`}
        />
      </Section>

      <Section title="Sizes and disabled">
        <Preview
          canvas={
            <div style={COL}>
              <Slider size="sm" defaultValue={30} aria-label="Small slider" />
              <Slider size="md" defaultValue={60} aria-label="Medium slider" />
              <Slider defaultValue={45} disabled aria-label="Disabled slider" />
            </div>
          }
          code={`<Slider size="sm" defaultValue={30} />
<Slider size="md" defaultValue={60} />
<Slider defaultValue={45} disabled />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes. JS you must supply yourself: set --vds-slider-pct (0–100) on the input whenever the value changes — it drives the filled track. Everything else is native."
      >
        <Code>{`<span class="vds-slider vds-slider--md">
  <span class="vds-slider__control">
    <input class="vds-slider__input" type="range"
           min="0" max="100" step="1" value="40"
           style="--vds-slider-pct: 40" aria-label="Threshold">
    <!-- optional ticks -->
    <span class="vds-slider__marks" aria-hidden="true">
      <span class="vds-slider__mark" style="--vds-slider-mark-pct: 50">
        <span class="vds-slider__mark-label">Med</span>
      </span>
    </span>
  </span>
  <!-- optional readout -->
  <output class="vds-slider__value">40</output>
</span>

<!-- JS: input.style.setProperty('--vds-slider-pct',
       (input.value - input.min) / (input.max - input.min) * 100) -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
