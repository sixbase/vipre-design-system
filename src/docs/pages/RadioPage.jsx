import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Radio } from '../../components/Radio/index.js'
import { RadioGroup } from '../../components/RadioGroup/index.js'
import { Text } from '../../components/Text/index.js'

function ControlledExample() {
  const [depth, setDepth] = useState('quick')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <RadioGroup label="Scan depth" value={depth} onChange={setDepth}>
        <Radio value="quick">Quick scan</Radio>
        <Radio value="full">Full scan</Radio>
        <Radio value="custom">Custom</Radio>
      </RadioGroup>
      <Text variant="detail" tone="muted">
        Picked: {depth}
      </Text>
    </div>
  )
}

export function RadioPage() {
  return (
    <ComponentPage
      title="Radio"
      description="Radio buttons let you pick exactly one thing from a short list. Each Radio is a real radio input hidden behind a styled circle, wrapped in a label so clicking the text works too. RadioGroup holds them together: it gives them a shared name, remembers which one is picked, and tells you when that changes."
      installCode={`import { RadioGroup, Radio } from 'vipre-design-system'`}
      props={[
        {
          name: 'RadioGroup',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'label' }, { code: 'ReactNode' }, '—', 'The group’s visible label (or pass aria-label instead)'],
            [{ code: 'name' }, { code: 'string' }, 'auto', 'Shared input name (made up for you if you skip it)'],
            [{ code: 'value / defaultValue' }, { code: 'string' }, '—', 'The picked value, with or without you tracking it'],
            [{ code: 'onChange' }, { code: '(value, event) => void' }, '—', 'Runs with the value that was picked'],
            [{ code: 'orientation' }, { code: "'vertical' | 'horizontal'" }, { code: "'vertical'" }, 'Stack or row. The row wraps when space runs out.'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turns off every Radio inside'],
          ],
        },
        {
          name: 'Radio',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string' }, '—', 'This option’s value (matched against the group’s value)'],
            [{ code: 'children' }, { code: 'ReactNode' }, '—', 'The label text (optional)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'name, checked, onChange, disabled… for standalone use'],
          ],
        },
      ]}
      accessibility={[
        <>Real <IC>{'<input type="radio">'}</IC> inputs — Tab reaches the group, Arrow keys move the pick. All free from the browser.</>,
        <>The group is <IC>role="radiogroup"</IC>, named by its <IC>label</IC> (or your <IC>aria-label</IC>).</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> on the circle (<IC>:focus-visible</IC>).</>,
        <>On touch screens, the tap area grows to <IC>--vds-tap-target</IC> — the circle stays the same size.</>,
      ]}
    >
      <Section title="Basic">
        <Preview
          canvas={
            <RadioGroup label="Plan" defaultValue="pro">
              <Radio value="starter">Starter</Radio>
              <Radio value="pro">Pro</Radio>
              <Radio value="enterprise">Enterprise</Radio>
            </RadioGroup>
          }
          code={`<RadioGroup label="Plan" defaultValue="pro" onChange={setPlan}>
  <Radio value="starter">Starter</Radio>
  <Radio value="pro">Pro</Radio>
  <Radio value="enterprise">Enterprise</Radio>
</RadioGroup>`}
        />
      </Section>

      <Section
        title="Horizontal"
        note="Options sit in a row. When the container gets narrow, they wrap back into a stack on their own."
      >
        <Preview
          canvas={
            <RadioGroup label="Severity" orientation="horizontal" defaultValue="medium">
              <Radio value="low">Low</Radio>
              <Radio value="medium">Medium</Radio>
              <Radio value="high">High</Radio>
            </RadioGroup>
          }
          code={`<RadioGroup label="Severity" orientation="horizontal" defaultValue="medium">
  <Radio value="low">Low</Radio>
  <Radio value="medium">Medium</Radio>
  <Radio value="high">High</Radio>
</RadioGroup>`}
        />
      </Section>

      <Section title="Controlled" note="You hold the value; the group tells you when it changes.">
        <Preview
          canvas={<ControlledExample />}
          code={`const [depth, setDepth] = useState('quick')

<RadioGroup label="Scan depth" value={depth} onChange={setDepth}>
  <Radio value="quick">Quick scan</Radio>
  <Radio value="full">Full scan</Radio>
  <Radio value="custom">Custom</Radio>
</RadioGroup>`}
        />
      </Section>

      <Section
        title="Disabled"
        note="Disable one option, or the whole group. Disabled means half-faded and click-proof — never a new gray."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <RadioGroup label="One option off" defaultValue="a">
                <Radio value="a">Available</Radio>
                <Radio value="b" disabled>
                  Not on this plan
                </Radio>
              </RadioGroup>
              <RadioGroup label="Whole group off" defaultValue="x" disabled>
                <Radio value="x">Alpha</Radio>
                <Radio value="y">Beta</Radio>
              </RadioGroup>
            </div>
          }
          code={`<Radio value="b" disabled>Not on this plan</Radio>

<RadioGroup label="Whole group off" defaultValue="x" disabled>…</RadioGroup>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. No JS needed for the basics — checking, arrow keys, and form posting are all native radio behaviour."
      >
        <Code>{`<div class="vds-radio-group vds-radio-group--vertical" role="radiogroup" aria-labelledby="plan-label">
  <span class="vds-radio-group__label" id="plan-label">Plan</span>
  <div class="vds-radio-group__items">
    <label class="vds-radio">
      <input class="vds-radio__input" type="radio" name="plan" value="starter">
      <span class="vds-radio__circle" aria-hidden="true"></span>
      <span class="vds-radio__label">Starter</span>
    </label>
    <label class="vds-radio">
      <input class="vds-radio__input" type="radio" name="plan" value="pro" checked>
      <span class="vds-radio__circle" aria-hidden="true"></span>
      <span class="vds-radio__label">Pro</span>
    </label>
    <!-- disabled: add vds-radio--disabled to the label AND disabled to the input -->
  </div>
</div>

<!-- Horizontal: swap the modifier for vds-radio-group--horizontal -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
