import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
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
    </ComponentPage>
  )
}
