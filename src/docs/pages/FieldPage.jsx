import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Field, Input, Select } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 360 }

export function FieldPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Field}
      title="Field"
      description="The standard wrapper that puts a label on a form control. It shows the label on top and optional help or error text below, and hooks up the accessibility for you — adding id, aria-describedby, and (when there’s an error) invalid onto the control inside. Wrap it around every Input, Select, and Textarea so labels look the same everywhere."
      installCode={`import { Field, Input } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'label' }, { code: 'ReactNode' }, '—', 'The label shown above the control'],
            [{ code: 'eyebrow' }, { code: 'boolean' }, { code: 'false' }, 'Show the label as small all-caps text'],
            [{ code: 'help' }, { code: 'ReactNode' }, '—', 'Quiet helper text below'],
            [{ code: 'error' }, { code: 'ReactNode' }, '—', 'Red error message (role=alert); also flags the control as wrong'],
            [{ code: 'htmlFor' }, { code: 'string' }, 'auto', 'The control’s id (made for you if you skip it)'],
            [{ code: 'children' }, { code: 'one control' }, '—', 'The Input / Select / Textarea to label'],
          ],
        },
      ]}
      accessibility={[
        <>Ties the <IC>{'<label>'}</IC> to the control with <IC>htmlFor</IC>/<IC>id</IC>.</>,
        <>Connects <IC>help</IC>/<IC>error</IC> through <IC>aria-describedby</IC>; <IC>error</IC> also sets <IC>invalid</IC>.</>,
        <>The error message uses <IC>role="alert"</IC> so screen readers read it out when it shows up.</>,
      ]}
    >
      <Section title="Label, help, error, eyebrow" note="One wrapper, the same spacing and text for every field.">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Workspace name">
                <Input placeholder="acme-prod" />
              </Field>
              <Field label="Email" help="We'll only use this for security alerts.">
                <Input type="email" placeholder="you@company.com" />
              </Field>
              <Field label="Email" error="Enter a valid email address">
                <Input type="email" defaultValue="ada@" />
              </Field>
              <Field label="Primary contact" eyebrow>
                <Input placeholder="Full name" />
              </Field>
              <Field label="Status">
                <Select defaultValue="active">
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </Field>
            </div>
          }
          code={`<Field label="Workspace name"><Input placeholder="acme-prod" /></Field>
<Field label="Email" help="We'll only use this for security alerts.">
  <Input type="email" />
</Field>
<Field label="Email" error="Enter a valid email address">
  <Input type="email" />   {/* error → invalid + aria-describedby, automatically */}
</Field>
<Field label="Primary contact" eyebrow><Input /></Field>
<Field label="Status"><Select>…</Select></Field>`}
        />
      </Section>
    </ComponentPage>
  )
}
