import { ComponentPage } from '../ComponentPage.jsx'
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
      title="Select"
      description="A native dropdown styled to match Input — same sizes, neutral-graphite chrome, recessed fill, and a chevron affix. Uses the platform picker, so it's reliable on every device."
      installCode={`import { Select } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Control height (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Danger border + aria-invalid'],
            [{ code: 'children' }, { code: '<option>…' }, '—', 'Native option elements'],
            [{ code: '…props' }, { code: 'SelectHTMLAttributes' }, '—', 'value, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Native <IC>{'<select>'}</IC> — full keyboard and platform picker. Pair with a <IC>{'<label>'}</IC>.</>,
        <>The chevron is <IC>aria-hidden</IC>; <IC>invalid</IC> sets <IC>aria-invalid</IC>.</>,
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
