import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC, TokenSpecTable } from '../primitives.jsx'
import { Field, Input, Select } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 360 }

/* The one token spec — Token / Bound to / What it controls, grouped. Live
   values are read at render by the shared TokenSpecTable off a .vds-field
   probe. */
const FIELD_TOKEN_GROUPS = [
  {
    label: 'Spacing',
    tokens: [
      { token: '--vds-field-gap', bound: 'var(--vds-space-1-5)', controls: 'Vertical gap: label → control → help/error' },
    ],
  },
  {
    label: 'Text color',
    tokens: [
      { token: '--vds-field-label-color', bound: 'var(--vds-ink-muted)', controls: 'Label text above the control' },
      { token: '--vds-field-help-color', bound: 'var(--vds-ink-muted)', controls: 'Helper text below the control' },
      { token: '--vds-field-error-color', bound: 'var(--vds-danger)', controls: 'Error message below the control' },
    ],
  },
]

export function FieldPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Field}
      title="Field"
      description="The standard wrapper that puts a label on a form control. It shows the label on top and optional help or error text below, and hooks up the accessibility for you — adding id, aria-describedby, and (when there’s an error) invalid onto the control inside. Wrap it around every Input, Select, and Textarea so labels look the same everywhere."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own field wrapper against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
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
        />
      </Section>

      <Section
        title="Tokens"
        note="Field sets the spacing between rows and the color of the label, help, and error text. Every value is a variable on the .vds-field root — change any one to reshape the field without touching the markup."
      >
        <TokenSpecTable scope="vds-field" prefix="--vds-field-" groups={FIELD_TOKEN_GROUPS} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.75rem' }}>
          The color tokens bind to semantic tokens (<IC>--vds-ink-muted</IC>, <IC>--vds-danger</IC>) that
          already flip light/dark on their own — so the defaults need no theming. Label, help, and error type
          come from the <IC>detail</IC> / <IC>eyebrow</IC> text-size steps.
        </p>
      </Section>
    </ComponentPage>
  )
}
