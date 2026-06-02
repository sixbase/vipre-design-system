import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Input, Icon, Text } from '../../components/index.js'

/* A field with a label above and an optional red error message below.
   (Until a Field/Label primitive lands, this shows the intended pattern.) */
function LabeledField({ label, htmlFor, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <Text as="label" htmlFor={htmlFor} variant="detail" tone="muted">
        {label}
      </Text>
      {children}
      {error && (
        <Text as="span" id={`${htmlFor}-error`} role="alert" variant="detail" tone="danger">
          {error}
        </Text>
      )}
    </div>
  )
}

function SearchDemo() {
  const [value, setValue] = useState('')
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <Input
        placeholder="Search devices…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leading={<Icon as={Search} size="sm" tone="subtle" />}
        trailing={
          value ? (
            <button
              type="button"
              onClick={() => setValue('')}
              aria-label="Clear search"
              style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', color: 'inherit' }}
            >
              <Icon as={X} size="sm" tone="subtle" />
            </button>
          ) : null
        }
      />
    </div>
  )
}

export function InputPage() {
  return (
    <ComponentPage
      title="Input"
      description="A single-line text field. Sizes match Button (sm/md/lg). Optional leading and trailing slots hold icons or actions — compose a search field with a leading search icon and a trailing clear button. The forwarded ref points at the underlying input."
      installCode={`import { Input } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Control height + type step (matches Button)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Danger border + aria-invalid'],
            [{ code: 'leading' }, { code: 'ReactNode' }, '—', 'Slot before the field (e.g. an Icon)'],
            [{ code: 'trailing' }, { code: 'ReactNode' }, '—', 'Slot after the field (e.g. a clear button)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'value, onChange, placeholder, disabled, type…'],
          ],
        },
      ]}
      accessibility={[
        <>Always pair with a <IC>{'<label>'}</IC> or <IC>aria-label</IC>.</>,
        <><IC>invalid</IC> sets <IC>aria-invalid</IC> for assistive tech.</>,
        <>Focus is shown on the whole field via <IC>:focus-within</IC> using the focus-ring token.</>,
      ]}
    >
      <Section title="Sizes">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 320 }}>
              <Input size="sm" placeholder="Small" />
              <Input size="md" placeholder="Medium" />
              <Input size="lg" placeholder="Large" />
            </div>
          }
          code={`<Input size="sm" placeholder="Small" />\n<Input size="md" placeholder="Medium" />\n<Input size="lg" placeholder="Large" />`}
        />
      </Section>

      <Section title="States" note="Default, invalid (with an error message), and disabled — shown as real labeled fields.">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 320 }}>
              <LabeledField label="Display name" htmlFor="demo-name">
                <Input id="demo-name" placeholder="Ada Lovelace" />
              </LabeledField>
              <LabeledField label="Email" htmlFor="demo-email" error="Enter a valid email address">
                <Input id="demo-email" type="email" invalid defaultValue="ada@" aria-describedby="demo-email-error" />
              </LabeledField>
              <LabeledField label="Account ID" htmlFor="demo-acct">
                <Input id="demo-acct" disabled defaultValue="ACC-2041" />
              </LabeledField>
            </div>
          }
          code={`{/* invalid: you decide WHEN to set invalid, then show why */}
<label htmlFor="email">Email</label>
<Input
  id="email"
  type="email"
  invalid
  aria-describedby="email-error"
/>
<Text id="email-error" role="alert" tone="danger" variant="detail">
  Enter a valid email address
</Text>`}
        />
      </Section>

      <Section title="Search field" note="Compose leading + trailing slots with Icon — the clear button appears once there's text.">
        <Preview
          canvas={<SearchDemo />}
          code={`<Input
  placeholder="Search devices…"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  leading={<Icon as={Search} size="sm" tone="subtle" />}
  trailing={value && (
    <button onClick={() => setValue('')} aria-label="Clear search">
      <Icon as={X} size="sm" tone="subtle" />
    </button>
  )}
/>`}
        />
      </Section>
    </ComponentPage>
  )
}
