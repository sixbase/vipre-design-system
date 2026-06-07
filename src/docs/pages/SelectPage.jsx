import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Select, Field } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 280 }
const OPTS = (
  <>
    <option value="active">Active</option>
    <option value="trial">Trial</option>
    <option value="suspended">Suspended</option>
  </>
)

export function SelectPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Select}
      title="Select"
      description="A single-choice dropdown. The trigger keeps Input's neutral-graphite chrome, but the open list is the same Popover menu TimeframeSelect uses — so it flips, clamps, and dismisses like every other dropdown, and its options share one look (hover, active fill, check affix)."
      installCode={`import { Select } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'options' }, { code: '{ value, label, disabled }[]' }, '—', 'Option data (or pass <option> children)'],
            [{ code: 'value / defaultValue' }, { code: 'string' }, '—', 'Controlled / uncontrolled selection'],
            [{ code: 'onChange' }, { code: '(value) => void' }, '—', 'Fires with the chosen value'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Select…'" }, 'Trigger text when nothing is selected'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Trigger height (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Danger border + aria-invalid'],
            [{ code: 'placement' }, { code: 'Popover placement' }, { code: "'bottom-start'" }, 'Where the menu opens'],
          ],
        },
      ]}
      accessibility={[
        <>Trigger is a <IC>button</IC> with <IC>aria-haspopup="listbox"</IC>; the panel is <IC>role="listbox"</IC> with <IC>role="option"</IC> items. Arrow keys rove between options.</>,
        <>Pair with a <IC>{'<label>'}</IC> / <IC>Field</IC> for a visible name; <IC>invalid</IC> sets <IC>aria-invalid</IC>.</>,
      ]}
    >
      <Section title="Sizes">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Status (Small)" htmlFor="sel-sm"><Select size="sm" defaultValue="active">{OPTS}</Select></Field>
              <Field label="Status (Medium)" htmlFor="sel-md"><Select size="md" defaultValue="active">{OPTS}</Select></Field>
              <Field label="Status (Large)" htmlFor="sel-lg"><Select size="lg" defaultValue="active">{OPTS}</Select></Field>
            </div>
          }
          code={`<Field label="Status">
  <Select defaultValue="active">
    <option value="active">Active</option>
    <option value="suspended">Suspended</option>
  </Select>
</Field>`}
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Status" error="Choose a status" htmlFor="sel-invalid">
                <Select defaultValue="active">{OPTS}</Select>
              </Field>
              <Field label="Status" htmlFor="sel-disabled">
                <Select disabled defaultValue="active">{OPTS}</Select>
              </Field>
            </div>
          }
          code={`<Field label="Status" error="Choose a status"><Select>…</Select></Field>
<Field label="Status"><Select disabled>…</Select></Field>`}
        />
      </Section>
    </ComponentPage>
  )
}
