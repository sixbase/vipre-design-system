import { useState } from 'react'
import { Search, X, Mail } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Input, Textarea, Icon, Text } from '../../components/index.js'

const FIELD_COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }

/* A single state, captioned. */
function StateRow({ caption, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Text variant="detail" tone="muted">
        {caption}
      </Text>
      {children}
    </div>
  )
}

/* Every state at one size — the per-size bucket. */
function SizeBucket({ size }) {
  const ic = size === 'sm' ? 'xs' : 'sm'
  return (
    <div style={FIELD_COL}>
      <StateRow caption="Default">
        <Input size={size} placeholder="you@company.com" />
      </StateRow>
      <StateRow caption="With icon">
        <Input size={size} placeholder="you@company.com" leading={<Icon as={Mail} size={ic} />} />
      </StateRow>
      <StateRow caption="Invalid">
        <Input size={size} invalid defaultValue="ada@" aria-label="Email" />
      </StateRow>
      <StateRow caption="Disabled">
        <Input size={size} disabled defaultValue="ACC-2041" aria-label="Account ID" />
      </StateRow>
    </div>
  )
}

const sizeCode = (s) => `<Input size="${s}" placeholder="you@company.com" />
<Input size="${s}" leading={<Icon as={Mail} size="${s === 'sm' ? 'xs' : 'sm'}" />} />
<Input size="${s}" invalid defaultValue="ada@" />
<Input size="${s}" disabled defaultValue="ACC-2041" />`

/* A field with a label (or eyebrow) above, optional help / error below. */
function LabeledField({ label, eyebrow, htmlFor, help, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <Text as="label" htmlFor={htmlFor} variant={eyebrow ? 'eyebrow' : 'detail'} tone="muted">
        {label}
      </Text>
      {children}
      {help && !error && (
        <Text as="span" id={`${htmlFor}-help`} variant="detail" tone="muted">
          {help}
        </Text>
      )}
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
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Input
        placeholder="Search devices…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leading={<Icon as={Search} size="sm" />}
        trailing={
          value ? (
            <button
              type="button"
              onClick={() => setValue('')}
              aria-label="Clear search"
              style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', color: 'inherit' }}
            >
              <Icon as={X} size="sm" />
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
      description="A single-line text field. Three sizes (sm/md/lg) that match Button; each supports the same states — default, with a leading icon, invalid, and disabled. Optional leading/trailing slots compose search fields. The forwarded ref points at the underlying input."
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
        <><IC>invalid</IC> sets <IC>aria-invalid</IC>; link the error with <IC>aria-describedby</IC>.</>,
        <>Focus is shown on the whole field via <IC>:focus-within</IC> using the input's graphite ring.</>,
      ]}
    >
      {/* ---- Buckets by size; each shows every state ---- */}
      <Section title="Small" note={'size="sm" · 32px tall — dense tables, toolbars, inline filters.'}>
        <Preview canvas={<SizeBucket size="sm" />} code={sizeCode('sm')} />
      </Section>

      <Section title="Medium" note={'size="md" · 36px tall — the default for most forms.'}>
        <Preview canvas={<SizeBucket size="md" />} code={sizeCode('md')} />
      </Section>

      <Section title="Large" note={'size="lg" · 44px tall — prominent or touch-friendly fields.'}>
        <Preview canvas={<SizeBucket size="lg" />} code={sizeCode('lg')} />
      </Section>

      {/* ---- Composition patterns (size-independent) ---- */}
      <Section title="Search field" note="Compose leading + trailing slots — the clear button appears once there's text.">
        <Preview
          canvas={<SearchDemo />}
          code={`<Input
  placeholder="Search devices…"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  leading={<Icon as={Search} size="sm" />}
  trailing={value && (
    <button onClick={() => setValue('')} aria-label="Clear search">
      <Icon as={X} size="sm" />
    </button>
  )}
/>`}
        />
      </Section>

      <Section title="With help text" note="A muted hint below the field. Link it with aria-describedby so screen readers read it.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              <LabeledField label="Workspace name" htmlFor="ex-ws" help="Lowercase letters, numbers and dashes only.">
                <Input id="ex-ws" placeholder="acme-prod" aria-describedby="ex-ws-help" />
              </LabeledField>
            </div>
          }
          code={`<label htmlFor="ws">Workspace name</label>
<Input id="ws" aria-describedby="ws-help" placeholder="acme-prod" />
<Text id="ws-help" variant="detail" tone="muted">
  Lowercase letters, numbers and dashes only.
</Text>`}
        />
      </Section>

      <Section title="With eyebrow label" note="An uppercase overline label using the eyebrow type step — for grouped or sectioned forms.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              <LabeledField label="Primary contact" eyebrow htmlFor="ex-eb">
                <Input id="ex-eb" placeholder="Full name" />
              </LabeledField>
            </div>
          }
          code={`<Text as="label" htmlFor="contact" variant="eyebrow" tone="muted">
  Primary contact
</Text>
<Input id="contact" placeholder="Full name" />`}
        />
      </Section>

      <Section title="Multi-line (Textarea)" note="For longer, paragraph-style input. Textarea is a sibling primitive that shares the Input look and is vertically resizable.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              <LabeledField label="Notes" htmlFor="ex-notes" help="Add context for your teammates.">
                <Textarea id="ex-notes" rows={4} placeholder="Add a note…" aria-describedby="ex-notes-help" />
              </LabeledField>
            </div>
          }
          code={`import { Textarea } from 'vipre-design-system'

<Textarea rows={4} placeholder="Add a note…" />`}
        />
      </Section>
    </ComponentPage>
  )
}
