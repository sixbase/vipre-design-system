import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, PropsTable, IC, Kbd, TokenSpecTable } from '../primitives.jsx'
import {
  PinInput,
  Text,
  Stack,
  Inline,
  Surface,
  Divider,
  SegmentedControl,
  Switch,
} from '../../components/index.js'

const SIZES = ['sm', 'md', 'lg']

/* Every public --vds-pin-* token, grouped. Live values are read at render by
   the shared TokenSpecTable off a .vds-pin probe. Mirrors PinInput.scss. */
const PININPUT_TOKEN_GROUPS = [
  {
    label: 'Sizing',
    tokens: [
      { token: '--vds-pin-gap', bound: 'var(--vds-space-2)', controls: 'Space between boxes' },
      { token: '--vds-pin-cell-sm', bound: 'var(--vds-control-h-sm)', controls: 'Square cell — sm (32px)' },
      { token: '--vds-pin-cell-md', bound: 'var(--vds-control-h-md)', controls: 'Square cell — md (36px)' },
      { token: '--vds-pin-cell-lg', bound: 'var(--vds-control-h-lg)', controls: 'Square cell — lg (44px)' },
    ],
  },
  {
    label: 'Shape & color',
    tokens: [
      { token: '--vds-pin-radius', bound: 'var(--vds-radius-sm)', controls: 'Cell corner radius' },
      { token: '--vds-pin-border-w', bound: 'var(--vds-border-w)', controls: 'Cell border hairline width' },
      { token: '--vds-pin-fill', bound: 'var(--vds-surface-sunken)', controls: 'Cell background' },
      { token: '--vds-pin-border', bound: 'var(--vds-line-strong)', controls: 'Resting border' },
      { token: '--vds-pin-border-hover', bound: 'border + ink @ hover-mix', controls: 'Border on hover' },
      { token: '--vds-pin-border-focus', bound: 'var(--vds-focus-ring)', controls: 'Border on focus' },
      { token: '--vds-pin-ring', bound: 'focus-ring @ ring-tint', controls: 'Soft focus ring (field recipe)' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-pin-dur', bound: 'var(--vds-dur-fast)', controls: 'Border / ring transition speed' },
      { token: '--vds-pin-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve (gated behind prefers-reduced-motion)' },
    ],
  },
]

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
  const [mask, setMask] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [numeric, setNumeric] = useState(true)
  const [done, setDone] = useState('')

  return (
    <Inline gap={6} wrap align="start">
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <Stack gap={3} align="center" style={{ justifyContent: 'center', minHeight: '6rem' }}>
            <PinInput
              key={`${size}-${mask}-${numeric}`}
              size={size}
              mask={mask}
              disabled={disabled}
              type={numeric ? 'number' : 'text'}
              onComplete={(code) => setDone(code)}
            />
          </Stack>
        </Surface>
        <Text as="span" variant="eyebrow" tone="muted">onComplete fired with</Text>
        <Text variant="detail" tone="muted">{done ? done : 'Nothing yet — fill every cell.'}</Text>
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
          <Switch checked={numeric} onChange={(e) => setNumeric(e.target.checked)}>Numbers only</Switch>
          <Switch checked={mask} onChange={(e) => setMask(e.target.checked)}>Mask (dots)</Switch>
          <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>Disabled</Switch>
        </Stack>
      </Surface>
    </Inline>
  )
}

export function PinInputPage() {
  return (
    <ComponentPage
      title="Pin Input"
      description="A little row of single-box cells for typing a code — the six-digit one an app texts you, say. Type a number and the cursor jumps to the next box; press Backspace on an empty box and it hops back. Paste the whole code and it spreads across the boxes for you. When every box is full it tells your app the code is ready. Numbers-only by default, and it can hide what you type as dots."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own code field against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'length' }, { code: 'number' }, { code: '6' }, 'How many boxes / how long the code is'],
            [{ code: 'value' }, { code: 'string' }, '—', 'The code, if you control it yourself'],
            [{ code: 'defaultValue' }, { code: 'string' }, { code: "''" }, 'Starting code when uncontrolled'],
            [{ code: 'onChange' }, { code: '(string) => void' }, '—', 'Fires on every keystroke with the code so far'],
            [{ code: 'onComplete' }, { code: '(string) => void' }, '—', 'Fires once when every box is filled'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Box size and text size'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'mask' }, { code: 'boolean' }, { code: 'false' }, 'Hide what you type as password dots'],
            [{ code: 'type' }, { code: "'number' | 'text'" }, { code: "'number'" }, "'number' allows only digits + the numeric keypad"],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Anything else, spread onto the root'],
          ],
        },
      ]}
      accessibility={[
        <>The row is <IC>role="group"</IC> with an aria-label; each box is labelled <IC>Digit N of L</IC> so screen readers say where you are.</>,
        <>The first box carries <IC>autocomplete="one-time-code"</IC>, so phones can offer to fill an SMS code.</>,
        <>Full keyboard support — type, <Kbd>Backspace</Kbd>, <Kbd>←</Kbd>/<Kbd>→</Kbd>, and paste all work.</>,
        <>The focused box shows the same soft ring as a text field and lifts above its neighbours so the ring isn't clipped.</>,
      ]}
    >
      <Section
        title="Playground"
        note="Type a code, or paste one in. Flip the switches to try numbers-only, masking, and the disabled state."
      >
        <Playground />
      </Section>

      <Section
        title="Sizes"
        note="Three square sizes matched to the control heights — sm (32px), md (36px), lg (44px)."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {SIZES.map((sz) => (
                <PinInput key={sz} size={sz} length={6} defaultValue="12" aria-label={`Code (${sz})`} />
              ))}
            </div>
          }
        />
      </Section>

      <Section
        title="Keyboard"
        note="Everything works from the keyboard — no mouse needed."
      >
        <PropsTable
          headers={['Key', 'What it does']}
          rows={[
            ['A digit', 'Fills the box and moves to the next one'],
            ['Backspace', 'Clears the box, or hops back and clears the one before if empty'],
            ['← / →', 'Move between boxes'],
            ['Paste', 'Spreads a whole code across the boxes from the current one'],
          ]}
        />
      </Section>

      <Section
        title="Tokens"
        note="Every look comes from a --vds-pin-* variable on the .vds-pin root, bound to foundation tokens only. The cells copy Input's field recipe (neutral border, darker on hover, soft focus ring); colors point at semantic tokens, so light/dark comes free."
      >
        <TokenSpecTable scope="vds-pin" prefix="--vds-pin-" groups={PININPUT_TOKEN_GROUPS} />
      </Section>
    </ComponentPage>
  )
}
