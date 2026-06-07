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
      description="The canonical wrapper for a labelled form control. It renders the label above and optional help / error text below, and wires the accessibility for you — injecting id, aria-describedby, and (when error is set) invalid onto the child control. Use it around every Input, Select, and Textarea so labels read identically everywhere."
      installCode={`import { Field, Input } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'label' }, { code: 'ReactNode' }, '—', 'Label rendered above the control'],
            [{ code: 'eyebrow' }, { code: 'boolean' }, { code: 'false' }, 'Render the label as an uppercase overline'],
            [{ code: 'help' }, { code: 'ReactNode' }, '—', 'Muted helper text below'],
            [{ code: 'error' }, { code: 'ReactNode' }, '—', 'Danger message (role=alert); also marks the control invalid'],
            [{ code: 'htmlFor' }, { code: 'string' }, 'auto', 'Control id (generated if omitted)'],
            [{ code: 'children' }, { code: 'one control' }, '—', 'The Input / Select / Textarea to label'],
          ],
        },
      ]}
      accessibility={[
        <>Associates the <IC>{'<label>'}</IC> with the control via <IC>htmlFor</IC>/<IC>id</IC>.</>,
        <>Links <IC>help</IC>/<IC>error</IC> through <IC>aria-describedby</IC>; <IC>error</IC> also sets <IC>invalid</IC>.</>,
        <>The error message uses <IC>role="alert"</IC> so it's announced when it appears.</>,
      ]}
    >
      <Section title="Label, help, error, eyebrow" note="One wrapper, the same rhythm and type for every field.">
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
