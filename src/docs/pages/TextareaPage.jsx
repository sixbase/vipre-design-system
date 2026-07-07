import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from '../colorUsage.js'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Textarea, Field } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }

export function TextareaPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Textarea}
      title="Textarea"
      description="A box for text that runs over several lines — notes, descriptions, messages. It looks and behaves like Input (same three sizes, same borders and states) and can be dragged taller by its bottom-right corner. The ref points at the real <textarea>."
      installCode={`import { Textarea } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Text size and padding (matches Input)'],
            [{ code: 'rows' }, { code: 'number' }, { code: '4' }, 'How many lines tall it starts'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid to show something’s wrong'],
            [{ code: '…props' }, { code: 'TextareaHTMLAttributes' }, '—', 'value, onChange, placeholder, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Always give it a <IC>{'<label>'}</IC> or <IC>aria-label</IC> — wrap it in a <IC>Field</IC> and this is done for you.</>,
        <><IC>invalid</IC> sets <IC>aria-invalid</IC>; connect the error text with <IC>aria-describedby</IC> (Field does this too).</>,
        <>On touch screens the default size bumps to 16px text so iOS doesn't zoom the page when the field focuses.</>,
      ]}
    >
      <Section title="Sizes" note="Three sizes that match Input. rows sets how tall it starts; people can drag it taller.">
        <Preview
          canvas={
            <div style={COL}>
              <Textarea size="sm" rows={2} placeholder="Small…" aria-label="Small" />
              <Textarea size="md" rows={3} placeholder="Medium…" aria-label="Medium" />
              <Textarea size="lg" rows={3} placeholder="Large…" aria-label="Large" />
            </div>
          }
          code={`<Textarea size="sm" rows={2} placeholder="Small…" />
<Textarea size="md" rows={3} placeholder="Medium…" />   {/* default */}
<Textarea size="lg" rows={3} placeholder="Large…" />`}
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Textarea rows={2} invalid defaultValue="Too short" aria-label="Invalid" />
              <Textarea rows={2} disabled defaultValue="Read-only note" aria-label="Disabled" />
            </div>
          }
          code={`<Textarea invalid defaultValue="Too short" />
<Textarea disabled defaultValue="Read-only note" />`}
        />
      </Section>

      <Section title="With Field" note="The usual way to use it — Field adds the label and help or error text, and wires the accessibility.">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Notes" help="Visible to other admins on this account.">
                <Textarea rows={3} placeholder="Add a note…" />
              </Field>
              <Field label="Reason" error="A reason is required">
                <Textarea rows={2} />
              </Field>
            </div>
          }
          code={`<Field label="Notes" help="Visible to other admins on this account.">
  <Textarea rows={3} placeholder="Add a note…" />
</Field>
<Field label="Reason" error="A reason is required">
  <Textarea rows={2} />   {/* error → invalid + aria-describedby, automatically */}
</Field>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. One real <textarea> — no wrapper. No JS needed."
      >
        <Code>{`<!-- sizes: vds-textarea--sm | (md is the bare class) | --lg -->
<textarea class="vds-textarea" rows="4" placeholder="Add a note…"></textarea>

<!-- invalid: add the modifier AND aria-invalid -->
<textarea class="vds-textarea vds-textarea--invalid" aria-invalid="true" rows="4"></textarea>

<!-- disabled: add the modifier AND the disabled attribute -->
<textarea class="vds-textarea vds-textarea--disabled" disabled rows="4"></textarea>`}</Code>
      </Section>
    </ComponentPage>
  )
}
