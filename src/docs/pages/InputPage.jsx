import { useState } from 'react'
import { Search, X, Mail } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC, PropsTable } from '../primitives.jsx'
import { Input, Textarea, Icon, Text, Field } from '../../components/index.js'

const FIELD_COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }
const SIZES = ['sm', 'md', 'lg']
const SIZE_LABEL = { sm: 'Small', md: 'Medium', lg: 'Large' }

/* A labelled token table for the Tokens section. */
function TokenGroup({ label, headers, rows }) {
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <p className="vds-text vds-text--eyebrow" style={{ margin: '0 0 0.4rem' }}>{label}</p>
      <PropsTable headers={headers} rows={rows} />
    </div>
  )
}

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
      installCode={`<!-- Tokens-only: link the CSS variables, build your own input against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
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
        <Preview canvas={<SizeBucket size="sm" />} />
      </Section>

      <Section title="Medium" note={'size="md" · 36px tall — the go-to for most forms.'}>
        <Preview canvas={<SizeBucket size="md" />} />
      </Section>

      <Section title="Large" note={'size="lg" · 44px tall — big fields or ones easy to tap.'}>
        <Preview canvas={<SizeBucket size="lg" />} />
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
        />
      </Section>

      <Section
        title="Tokens"
        note="Every visual value is a --vds-input-* custom property set on the .vds-input root. Re-declare any of them on your own selector to retheme or re-space the field; nothing else in the system changes. Colors point at semantic tokens (so light/dark comes free); sizing binds to the shared control-height and spacing scale that Button also uses."
      >
        <TokenGroup label="Sizing" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-input-h-sm' }, { code: '2rem (32px)' }, 'Small height (= --vds-control-h-sm)'],
          [{ code: '--vds-input-h-md' }, { code: '2.25rem (36px)' }, 'Medium height'],
          [{ code: '--vds-input-h-lg' }, { code: '2.75rem (44px)' }, 'Large height'],
          [{ code: '--vds-input-pad-x-sm' }, { code: '0.625rem (10px)' }, 'Small horizontal padding'],
          [{ code: '--vds-input-pad-x-md' }, { code: '0.75rem (12px)' }, 'Medium horizontal padding'],
          [{ code: '--vds-input-pad-x-lg' }, { code: '1rem (16px)' }, 'Large horizontal padding'],
          [{ code: '--vds-input-gap' }, { code: '0.5rem (8px)' }, 'Gap between an affix (icon/button) and the text'],
        ]} />

        <TokenGroup label="Shape" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-input-radius' }, { code: '0.25rem (4px)' }, 'Corner radius (= --vds-radius-sm)'],
          [{ code: '--vds-input-border-w' }, { code: '1px' }, 'Border thickness'],
        ]} />

        <TokenGroup label="Color" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-input-fill' }, { code: '--vds-surface-sunken' }, 'Field background'],
          [{ code: '--vds-input-border' }, { code: '--vds-line-strong' }, 'Resting border'],
          [{ code: '--vds-input-border-hover' }, { code: 'border darkened toward ink 30%' }, 'Border on hover (color-mix recipe, resting only)'],
          [{ code: '--vds-input-muted' }, { code: '--vds-ink-subtle' }, 'Placeholder text + affix icon color'],
        ]} />

        <TokenGroup label="Focus ring" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-control-ring-w' }, { code: '2px' }, 'Ring thickness — shared by every control'],
          [{ code: '--vds-input-ring' }, { code: 'focus-ring @ 35% (--vds-control-ring-tint)' }, 'Valid focus ring color'],
          [{ code: '(invalid ring)' }, { code: 'danger @ 30% (--vds-control-ring-tint-invalid)' }, 'Invalid focus ring color'],
        ]} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
          Fields (Input, Select, Textarea) use a soft <IC>box-shadow</IC> ring; action controls (Button,
          Checkbox) use a hard <IC>outline</IC> ring instead — both are intentional, not a mismatch. The
          35%/30% split is intentional too: danger reads stronger than the brand ring at equal alpha, so the
          invalid ring is dialed down to balance.
        </p>

        <TokenGroup label="Touch" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-input-touch-min' }, { code: '1rem (16px)' }, 'Bumps the md field’s font-size on coarse pointers so iOS doesn’t zoom the page on focus'],
        ]} />

        <TokenGroup label="Motion" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-input-dur' }, { code: '120ms (--vds-dur-fast)' }, 'Border/ring transition speed'],
          [{ code: '--vds-input-ease' }, { code: 'cubic-bezier(0.16,1,0.3,1) (--vds-ease-out)' }, 'Border/ring transition curve'],
        ]} />
      </Section>

      <Section
        title="Reference implementation"
        note="How the demos on this page are built — reference only. The design system does not ship this markup or CSS as an installable package; it ships the tokens above. Your team writes its own input component (its own classes, its own framework) and binds to the --vds-input-* variables."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The reference build lives in the repo under <IC>src/components/Input</IC>. Treat it as a worked
          example of the tokens — not something to install today. It's also the seed of a future
          <em> versioned, installable</em> package: when Vipre is ready, the same token contract makes that a
          drop-in, not a rewrite.
        </p>
      </Section>
    </ComponentPage>
  )
}
