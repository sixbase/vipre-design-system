import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC, PropsTable } from '../primitives.jsx'
import { Field, Input, Select } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 360 }

/* A labelled token table for the Tokens section. */
function TokenGroup({ label, headers, rows }) {
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <p className="vds-text vds-text--eyebrow" style={{ margin: '0 0 0.4rem' }}>{label}</p>
      <PropsTable headers={headers} rows={rows} />
    </div>
  )
}

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
        note="Field owns the vertical rhythm and the label / help / error text color. Every value is a public custom property set on the .vds-field root — re-point any of them to re-shape the field without touching markup."
      >
        <TokenGroup label="Spacing" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-field-gap' }, { code: '0.375rem (6px)' }, 'Vertical gap: label → control → help/error'],
        ]} />
        <TokenGroup label="Text color" headers={['Token', 'Bound to', 'Controls']} rows={[
          [{ code: '--vds-field-label-color' }, { code: '--vds-ink-muted' }, 'Label text above the control'],
          [{ code: '--vds-field-help-color' }, { code: '--vds-ink-muted' }, 'Helper text below the control'],
          [{ code: '--vds-field-error-color' }, { code: '--vds-danger' }, 'Error message below the control'],
        ]} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
          The color tokens bind to semantic tokens (<IC>--vds-ink-muted</IC>, <IC>--vds-danger</IC>) that
          already flip light/dark on their own — so the defaults need no theming. Label, help, and error type
          come from the <IC>detail</IC> / <IC>eyebrow</IC> typescale steps.
        </p>
      </Section>

      <Section
        title="Reference implementation"
        note="How the demos on this page are built — reference only. The design system does not ship this markup or CSS as an installable package; it ships the tokens above. Your team writes its own field wrapper (its own classes, its own framework) and binds to the --vds-field-* variable."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The reference build lives in the repo under <IC>src/components/Field</IC>. Treat it as a worked
          example of the tokens — not something to install today. It's also the seed of a future
          <em> versioned, installable</em> package: when Vipre is ready, the same token contract makes that a
          drop-in, not a rewrite.
        </p>
      </Section>
    </ComponentPage>
  )
}
