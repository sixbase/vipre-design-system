import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Checkbox } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '0.75rem' }

export function CheckboxPage() {
  return (
    <ComponentPage
      title="Checkbox"
      description="A labelled checkbox with checked, unchecked, and indeterminate (some-selected) states. Renders a real input behind a styled box, wrapped in a label so the text toggles it."
      installCode={`import { Checkbox } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'indeterminate' }, { code: 'boolean' }, { code: 'false' }, 'The "some selected" dash state'],
            [{ code: 'children' }, { code: 'ReactNode' }, '—', 'Optional label content'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'checked, defaultChecked, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Wraps a real <IC>{'<input type="checkbox">'}</IC> — full keyboard + screen-reader support.</>,
        <>Focus ring uses <IC>--vds-focus-ring</IC> on the box via <IC>:focus-visible</IC>.</>,
        <><IC>indeterminate</IC> is a visual/AT state only — resolve it to checked/unchecked in your state.</>,
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

      <Section title="Without a label" note="Omit children for use inside a table header or row.">
        <Preview
          canvas={<Checkbox aria-label="Select row" />}
          code={`<Checkbox aria-label="Select row" />`}
        />
      </Section>
    </ComponentPage>
  )
}
