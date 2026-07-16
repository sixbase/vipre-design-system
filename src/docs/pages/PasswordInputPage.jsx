import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC, TokenSpecTable } from '../primitives.jsx'
import { PasswordInput } from '../../components/PasswordInput/index.js'
import { Surface, Stack, Inline, Text, SegmentedControl, Switch, Divider, Field } from '../../components/index.js'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

/* ---------------------------------------------------------------------------
   Playground-lite — size + invalid + disabled, like the Input page but small.
   -------------------------------------------------------------------------- */

function ControlField({ label, children }) {
  return (
    <Stack gap={1} style={{ flex: '0 0 auto' }}>
      <Text as="span" variant="eyebrow" tone="muted">{label}</Text>
      {children}
    </Stack>
  )
}

function Playground() {
  const [size, setSize] = useState('md')
  const [invalid, setInvalid] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <Inline gap={6} wrap align="start">
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <Stack gap={0} align="center" justify="center" style={{ minHeight: '9rem', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '22rem' }}>
              <PasswordInput
                size={size}
                invalid={invalid}
                disabled={disabled}
                defaultValue="hunter2"
                autoComplete="new-password"
                aria-label="Password"
              />
            </div>
          </Stack>
        </Surface>
        <Text as="span" variant="detail" tone="muted">
          Click the eye to reveal or hide — the field's <IC>type</IC> flips between <IC>password</IC> and <IC>text</IC>; the value never moves.
        </Text>
      </Stack>

      <Surface bordered padding={5} style={{ flex: '0 0 17rem' }}>
        <Stack gap={4}>
          <Text as="span" variant="eyebrow" tone="muted">Options</Text>
          <ControlField label="Size">
            <SegmentedControl
              size="sm"
              fullWidth
              aria-label="Size"
              value={size}
              onChange={setSize}
              options={SIZES.map((s) => ({ value: s, label: s.toUpperCase() }))}
            />
          </ControlField>
          <Divider />
          <Text as="span" variant="eyebrow" tone="muted">States</Text>
          <Switch checked={invalid} onChange={(e) => setInvalid(e.target.checked)}>Invalid</Switch>
          <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>Disabled</Switch>
        </Stack>
      </Surface>
    </Inline>
  )
}

/* ---------------------------------------------------------------------------
   Tokens — the --vds-password-* set, grouped. Live values resolve at render
   against a hidden .vds-password probe inside the shared TokenSpecTable.
   -------------------------------------------------------------------------- */

const PASSWORDINPUT_TOKEN_GROUPS = [
  {
    label: 'Toggle button',
    tokens: [
      { token: '--vds-password-toggle-ink', bound: 'var(--vds-input-muted)', controls: 'Resting eye-icon color (matches the field affix)' },
      { token: '--vds-password-toggle-ink-hover', bound: 'var(--vds-ink)', controls: 'Eye-icon color on hover / focus' },
      { token: '--vds-password-toggle-radius', bound: 'var(--vds-radius-sm)', controls: 'Corner of the toggle’s focus ring' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-password-toggle-dur', bound: 'var(--vds-dur-fast)', controls: 'Icon color transition speed' },
      { token: '--vds-password-toggle-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve' },
    ],
  },
]

/* ---------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export function PasswordInputPage() {
  return (
    <ComponentPage
      title="Password Input"
      description="A password box with an eye button to peek at what you typed. It's just an Input wearing a show/hide toggle — the same box, the same sizes, the same red-when-wrong and turned-off looks. The eye flips the field between hidden dots and plain text; your password never leaves the real input, so password managers and autofill work like normal."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own field against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'How tall it is and its text size (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid to show something’s wrong'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'defaultVisible' }, { code: 'boolean' }, { code: 'false' }, 'Start with the password already showing'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'value, onChange, autoComplete, name, aria-*…'],
          ],
        },
      ]}
      accessibility={[
        <>The eye is a real <IC>{'<button type="button">'}</IC> so it never submits the form; its <IC>aria-label</IC> flips between "Show password" and "Hide password", and <IC>aria-pressed</IC> tells a screen reader whether the password is currently visible.</>,
        <>The field owns the soft focus ring; the toggle carries its <strong>own</strong> hard-outline <IC>:focus-visible</IC> ring, so tabbing to it is obvious.</>,
        <>Give it a <IC>{'<label>'}</IC> or <IC>aria-label</IC> like any Input; <IC>invalid</IC> sets <IC>aria-invalid</IC>. Pass <IC>autoComplete</IC> (e.g. <IC>new-password</IC>) straight through.</>,
        <><IC>prefers-reduced-motion</IC> turns off the icon color transition.</>,
      ]}
    >
      <Section
        title="Playground"
        note="Turn the knobs and click the eye. The password sits in the real input the whole time — revealing it only swaps the input's type."
      >
        <Playground />
      </Section>

      <Section
        title="States"
        note="Every state a password field can be in, side by side at md. Rest, wrong (invalid), and turned off (disabled)."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }}>
              <Field label="Password">
                <PasswordInput defaultValue="hunter2" autoComplete="current-password" />
              </Field>
              <Field label="Password" error="At least 8 characters">
                <PasswordInput invalid defaultValue="short" />
              </Field>
              <Field label="Password">
                <PasswordInput disabled defaultValue="hunter2" />
              </Field>
            </div>
          }
        />
      </Section>

      <Section
        title="Sizes"
        note="Five sizes, exactly like Input. The eye icon scales with the field: xs uses a 14px icon, sm/md 16px, lg/xl 20px."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }}>
              {SIZES.map((sz) => (
                <PasswordInput key={sz} size={sz} defaultValue="hunter2" aria-label={`Password (${sz})`} />
              ))}
            </div>
          }
        />
      </Section>

      <Section
        title="Tokens"
        note="The shell IS an Input, so it reuses every --vds-input-* token for height, padding, border, fill, and the focus ring. The only Password-specific tokens dress the eye toggle — all bound to foundation tokens, so light/dark comes free."
      >
        <TokenSpecTable scope="vds-password" prefix="--vds-password-" groups={PASSWORDINPUT_TOKEN_GROUPS} />
      </Section>
    </ComponentPage>
  )
}
