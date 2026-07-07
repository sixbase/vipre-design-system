import { useState } from 'react'
import { Search, X, Mail } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
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
      colors={COMPONENT_COLORS.Input}
      title="Input"
      description="A box for one line of text. Three sizes (sm/md/lg) that match Button; each has the same looks — normal, with an icon in front, wrong, and turned off. You can add things before or after the text to build a search box. The ref points at the real input inside."
      installCode={`import { Input } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'How tall it is and its text size (matches Button)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid to show something’s wrong'],
            [{ code: 'leading' }, { code: 'ReactNode' }, '—', 'Something before the text (like an Icon)'],
            [{ code: 'trailing' }, { code: 'ReactNode' }, '—', 'Something after the text (like a clear button)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'value, onChange, placeholder, disabled, type…'],
          ],
        },
      ]}
      accessibility={[
        <>Always give it a <IC>{'<label>'}</IC> or <IC>aria-label</IC> so people know what it’s for.</>,
        <><IC>invalid</IC> sets <IC>aria-invalid</IC>; connect the error text with <IC>aria-describedby</IC>.</>,
        <>The whole box lights up when you click into it (<IC>:focus-within</IC>) using the input’s graphite ring.</>,
      ]}
    >
      {/* ---- Buckets by size; each shows every state ---- */}
      <Section title="Small" note={'size="sm" · 32px tall — packed tables, toolbars, inline filters.'}>
        <Preview canvas={<SizeBucket size="sm" />} code={sizeCode('sm')} />
      </Section>

      <Section title="Medium" note={'size="md" · 36px tall — the go-to for most forms.'}>
        <Preview canvas={<SizeBucket size="md" />} code={sizeCode('md')} />
      </Section>

      <Section title="Large" note={'size="lg" · 44px tall — big fields or ones easy to tap.'}>
        <Preview canvas={<SizeBucket size="lg" />} code={sizeCode('lg')} />
      </Section>

      {/* ---- Composition patterns (size-independent) ---- */}
      <Section title="Search field" note="Put an icon in front and a clear button after — the clear button shows up once you type. Shown at all three sizes.">
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

      <Section title="With help text" note="A quiet hint below the field, connected with aria-describedby. Shown at all three sizes.">
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

      <Section title="With eyebrow label" note="A small all-caps label sitting above the field. Shown at all three sizes.">
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

      <Section title="Multi-line (Textarea)" note="For longer text that runs over many lines. A close cousin of Input that looks the same, at all three sizes.">
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

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. The box is a wrapper div; the real <input> sits inside it. No JS needed (a clear button in the trailing slot is your own JS)."
      >
        <Code>{`<!-- sizes: vds-input--sm | --md | --lg -->
<div class="vds-input vds-input--md">
  <input class="vds-input__field" placeholder="you@company.com" />
</div>

<!-- with a leading icon and a trailing action -->
<div class="vds-input vds-input--md">
  <span class="vds-input__affix vds-input__affix--lead">
    <svg class="vds-icon" width="16" height="16" aria-hidden="true">…</svg>
  </span>
  <input class="vds-input__field" placeholder="Search devices…" />
  <span class="vds-input__affix vds-input__affix--trail">
    <button type="button" aria-label="Clear search">…</button>
  </span>
</div>

<!-- invalid: add the modifier AND aria-invalid on the input -->
<div class="vds-input vds-input--md vds-input--invalid">
  <input class="vds-input__field" aria-invalid="true" value="ada@" />
</div>

<!-- disabled: add the modifier AND the disabled attribute -->
<div class="vds-input vds-input--md vds-input--disabled">
  <input class="vds-input__field" disabled value="ACC-2041" />
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
