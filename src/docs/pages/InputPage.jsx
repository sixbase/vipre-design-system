import { useState } from 'react'
import { Search, X, Mail } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Input, Textarea, Icon, Text, Field } from '../../components/index.js'

const FIELD_COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }
const SIZES = ['sm', 'md', 'lg']
const SIZE_LABEL = { sm: 'Small', md: 'Medium', lg: 'Large' }

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

function SearchDemo({ size = 'md' }) {
  const [value, setValue] = useState('')
  const ic = size === 'sm' ? 'xs' : 'sm'
  return (
    <Input
      size={size}
      placeholder="Search devices…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      leading={<Icon as={Search} size={ic} />}
      trailing={
        value ? (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label="Clear search"
            style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', color: 'inherit' }}
          >
            <Icon as={X} size={ic} />
          </button>
        ) : null
      }
    />
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
      <Section title="Search field" note="Compose leading + trailing slots — the clear button appears once there's text. Shown at all three sizes.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              {SIZES.map((s) => (
                <StateRow key={s} caption={SIZE_LABEL[s]}>
                  <SearchDemo size={s} />
                </StateRow>
              ))}
            </div>
          }
          code={`<Input size="sm" placeholder="Search devices…" leading={<Icon as={Search} size="xs" />} … />
<Input size="md" placeholder="Search devices…" leading={<Icon as={Search} size="sm" />} … />
<Input size="lg" placeholder="Search devices…" leading={<Icon as={Search} size="sm" />} … />`}
        />
      </Section>

      <Section title="With help text" note="A muted hint below the field, linked with aria-describedby. Shown at all three sizes.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              {SIZES.map((s) => (
                <Field
                  key={s}
                  label={`Workspace name (${SIZE_LABEL[s]})`}
                  htmlFor={`ex-ws-${s}`}
                  help="Lowercase letters, numbers and dashes only."
                >
                  <Input size={s} placeholder="acme-prod" />
                </Field>
              ))}
            </div>
          }
          code={`<Field label="Workspace name" help="Lowercase letters, numbers and dashes only.">
  <Input placeholder="acme-prod" />
</Field>`}
        />
      </Section>

      <Section title="With eyebrow label" note="An uppercase overline label using the eyebrow type step. Shown at all three sizes.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              {SIZES.map((s) => (
                <Field key={s} label={`Primary contact (${SIZE_LABEL[s]})`} eyebrow htmlFor={`ex-eb-${s}`}>
                  <Input size={s} placeholder="Full name" />
                </Field>
              ))}
            </div>
          }
          code={`<Field label="Primary contact" eyebrow>
  <Input placeholder="Full name" />
</Field>`}
        />
      </Section>

      <Section title="Multi-line (Textarea)" note="For longer, paragraph-style input. A sibling primitive that shares the Input look, at all three sizes.">
        <Preview
          canvas={
            <div style={FIELD_COL}>
              {SIZES.map((s) => (
                <Field key={s} label={`Notes (${SIZE_LABEL[s]})`} htmlFor={`ex-notes-${s}`}>
                  <Textarea size={s} rows={s === 'sm' ? 2 : 3} placeholder="Add a note…" />
                </Field>
              ))}
            </div>
          }
          code={`import { Textarea } from 'vipre-design-system'

<Textarea size="sm" rows={2} placeholder="Add a note…" />
<Textarea size="md" rows={3} placeholder="Add a note…" />
<Textarea size="lg" rows={3} placeholder="Add a note…" />`}
        />
      </Section>
    </ComponentPage>
  )
}
