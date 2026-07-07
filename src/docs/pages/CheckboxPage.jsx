import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Checkbox } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '0.75rem' }

export function CheckboxPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Checkbox}
      title="Checkbox"
      description="A checkbox with a label. It can be checked, unchecked, or show a dash when only some things are picked. There’s a real checkbox hidden behind the pretty box, wrapped in a label so clicking the text flips it too."
      installCode={`import { Checkbox } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'indeterminate' }, { code: 'boolean' }, { code: 'false' }, 'The dash look for “some are picked”'],
            [{ code: 'children' }, { code: 'ReactNode' }, '—', 'The label text (optional)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'checked, defaultChecked, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Wraps a real <IC>{'<input type="checkbox">'}</IC> — works with the keyboard and screen readers.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> on the box when you tab to it (<IC>:focus-visible</IC>).</>,
        <><IC>indeterminate</IC> is only how it looks — in your own data it still has to end up checked or unchecked.</>,
      ]}
    >
      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Checkbox>Unchecked</Checkbox>
              <Checkbox defaultChecked>Checked</Checkbox>
              <Checkbox indeterminate>Indeterminate</Checkbox>
              <Checkbox defaultChecked disabled>
                Disabled
              </Checkbox>
            </div>
          }
          code={`<Checkbox>Unchecked</Checkbox>
<Checkbox defaultChecked>Checked</Checkbox>
<Checkbox indeterminate>Indeterminate</Checkbox>
<Checkbox defaultChecked disabled>Disabled</Checkbox>`}
        />
      </Section>

      <Section title="Without a label" note="Leave out the text when it sits in a table header or row.">
        <Preview
          canvas={<Checkbox aria-label="Select row" />}
          code={`<Checkbox aria-label="Select row" />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. A real checkbox does all the work; the styled box is just paint. The only JS is for the indeterminate dash — it can only be set as a DOM property (input.indeterminate = true), never as an attribute."
      >
        <Code>{`<label class="vds-checkbox">
  <input type="checkbox" class="vds-checkbox__input" />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
  <span class="vds-checkbox__label">Include archived</span>
</label>

<!-- no label text: keep an aria-label on the input -->
<label class="vds-checkbox">
  <input type="checkbox" class="vds-checkbox__input" aria-label="Select row" />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
</label>

<!-- disabled: add the modifier AND the disabled attribute -->
<label class="vds-checkbox vds-checkbox--disabled">
  <input type="checkbox" class="vds-checkbox__input" disabled checked />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
  <span class="vds-checkbox__label">Disabled</span>
</label>`}</Code>
      </Section>
    </ComponentPage>
  )
}
