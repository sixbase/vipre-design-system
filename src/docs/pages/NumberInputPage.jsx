import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC, TokenSpecTable } from '../primitives.jsx'
import { NumberInput } from '../../components/NumberInput/index.js'
import { Surface, Stack, Inline, Text, SegmentedControl, Switch, Divider, Field } from '../../components/index.js'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

/* ---------------------------------------------------------------------------
   Playground-lite — size + invalid + disabled.
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
  const [value, setValue] = useState(3)

  return (
    <Inline gap={6} wrap align="start">
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <Stack gap={0} align="center" justify="center" style={{ minHeight: '9rem', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '14rem' }}>
              <NumberInput
                size={size}
                invalid={invalid}
                disabled={disabled}
                min={0}
                max={10}
                value={value}
                onChange={setValue}
                aria-label="Quantity"
              />
            </div>
          </Stack>
        </Surface>
        <Text as="span" variant="detail" tone="muted">
          Clamped to 0–10. Type, press ArrowUp / ArrowDown, or use the stepper — the buttons disable themselves at each edge. Value: <IC>{String(value)}</IC>
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
   Tokens — the --vds-number-* set, grouped. Live values are read at render by
   the shared TokenSpecTable off a .vds-number probe.
   -------------------------------------------------------------------------- */

const NUMBERINPUT_TOKEN_GROUPS = [
  {
    label: 'Alignment',
    tokens: [
      { token: '--vds-number-align', bound: 'right', controls: 'Text alignment — numbers read better flush-right (a CSS keyword, so it stays literal)' },
    ],
  },
  {
    label: 'Stepper buttons',
    tokens: [
      { token: '--vds-number-step-ink', bound: 'var(--vds-input-muted)', controls: 'Resting +/- glyph color' },
      { token: '--vds-number-step-ink-hover', bound: 'var(--vds-ink)', controls: '+/- glyph color on hover / focus' },
      { token: '--vds-number-step-radius', bound: 'var(--vds-radius-sm)', controls: 'Corner of a stepper button’s focus ring' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-number-step-dur', bound: 'var(--vds-dur-fast)', controls: 'Glyph color transition speed' },
      { token: '--vds-number-step-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve' },
    ],
  },
]

/* ---------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export function NumberInputPage() {
  return (
    <ComponentPage
      title="Number Input"
      description="A box for one number, with a little up/down stepper on the right. It's an Input set to numbers — the same sizes, red-when-wrong, and turned-off looks — plus + and − buttons that add or subtract by step and stop at your min and max. The real input is in charge, so typing and the keyboard's own up/down arrows work too. Numbers sit flush-right so columns of them line up."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own field against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value / defaultValue' }, { code: "number | ''" }, '—', 'Controlled / uncontrolled number (empty when cleared)'],
            [{ code: 'onChange' }, { code: "(value: number | '') => void" }, '—', 'Gets the NUMBER (or \'\' when empty) — not the event'],
            [{ code: 'min / max' }, { code: 'number' }, '—', 'Bounds — clamp the stepper and disable it at the edge'],
            [{ code: 'step' }, { code: 'number' }, { code: '1' }, 'How much the +/- buttons move'],
            [{ code: 'precision' }, { code: 'number' }, '—', 'Round stepped values to this many decimals'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'Height + text size (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'name, placeholder, aria-*…'],
          ],
        },
      ]}
      accessibility={[
        <>The native <IC>{'<input type="number">'}</IC> is the source of truth — <strong>ArrowUp / ArrowDown</strong> and typing already work for keyboards, so the stepper buttons sit out of the tab order (<IC>tabIndex -1</IC>) to avoid a double stop.</>,
        <>The stepper buttons are real <IC>{'<button type="button">'}</IC>s with <IC>aria-label</IC> "Increment" / "Decrement"; each disables itself (opacity 0.5, not clickable) once the value reaches its bound.</>,
        <>Give it a <IC>{'<label>'}</IC> or <IC>aria-label</IC> like any Input; <IC>invalid</IC> sets <IC>aria-invalid</IC>.</>,
        <><IC>prefers-reduced-motion</IC> turns off the glyph color transition.</>,
      ]}
    >
      <Section
        title="Playground"
        note="Turn the knobs. Type a number, press the keyboard up/down arrows, or click the stepper — everything stays clamped to 0–10, and the buttons grey out at each end."
      >
        <Playground />
      </Section>

      <Section
        title="States"
        note="Every state a number field can be in, side by side at md. Rest, wrong (invalid), and turned off (disabled)."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 260 }}>
              <Field label="Quantity">
                <NumberInput min={0} max={99} defaultValue={4} />
              </Field>
              <Field label="Quantity" error="Must be at least 1">
                <NumberInput invalid min={0} defaultValue={0} />
              </Field>
              <Field label="Quantity">
                <NumberInput disabled defaultValue={4} />
              </Field>
            </div>
          }
        />
      </Section>

      <Section
        title="Sizes"
        note="Five sizes, exactly like Input. The stepper stays neatly stacked in the trailing slot at every height."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 260 }}>
              {SIZES.map((sz) => (
                <NumberInput key={sz} size={sz} min={0} max={10} defaultValue={3} aria-label={`Quantity (${sz})`} />
              ))}
            </div>
          }
        />
      </Section>

      <Section
        title="Step & precision"
        note="step sets how far each +/- jump goes; precision rounds the result so 0.1 + 0.2 doesn't drift into a long decimal."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 260 }}>
              <Field label="Price step 0.5">
                <NumberInput step={0.5} precision={2} min={0} defaultValue={1.5} />
              </Field>
              <Field label="Tens">
                <NumberInput step={10} min={0} max={100} defaultValue={20} />
              </Field>
            </div>
          }
        />
      </Section>

      <Section
        title="Tokens"
        note="The shell IS an Input, so it reuses every --vds-input-* token for height, padding, border, fill, and the focus ring. The only Number-specific tokens are the right-alignment keyword and the stepper glyphs — all bound to foundation tokens, so light/dark comes free."
      >
        <TokenSpecTable scope="vds-number" prefix="--vds-number-" groups={NUMBERINPUT_TOKEN_GROUPS} />
      </Section>
    </ComponentPage>
  )
}
