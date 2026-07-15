import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, PropsTable, IC, Kbd } from '../primitives.jsx'
import {
  PinInput,
  Heading,
  Text,
  Stack,
  Inline,
  Surface,
  Divider,
  SegmentedControl,
  Switch,
} from '../../components/index.js'

const SIZES = ['sm', 'md', 'lg']

function TokenGroup({ label, rows }) {
  return (
    <>
      <Heading level="subheading" as="h3" style={{ margin: '1.25rem 0 0.5rem' }}>
        {label}
      </Heading>
      <PropsTable headers={['Token', 'Bound to', 'What it controls']} rows={rows} />
    </>
  )
}

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
        note="Every visual value is a --vds-pin-* custom property on the .vds-pin root, bound to foundation tokens only. The cell chrome mirrors Input's field recipe (neutral border + hover darken + soft focus ring); colors point at semantic tokens, so light/dark comes free."
      >
        <TokenGroup
          label="Sizing"
          rows={[
            [{ code: '--vds-pin-gap' }, { code: 'var(--vds-space-2)' }, 'Space between boxes'],
            [{ code: '--vds-pin-cell-sm' }, { code: 'var(--vds-control-h-sm)' }, 'Square cell — sm (32px)'],
            [{ code: '--vds-pin-cell-md' }, { code: 'var(--vds-control-h-md)' }, 'Square cell — md (36px)'],
            [{ code: '--vds-pin-cell-lg' }, { code: 'var(--vds-control-h-lg)' }, 'Square cell — lg (44px)'],
          ]}
        />
        <TokenGroup
          label="Shape & color"
          rows={[
            [{ code: '--vds-pin-radius' }, { code: 'var(--vds-radius-sm)' }, 'Cell corner radius'],
            [{ code: '--vds-pin-border-w' }, { code: 'var(--vds-border-w)' }, 'Cell border hairline width'],
            [{ code: '--vds-pin-fill' }, { code: 'var(--vds-surface-sunken)' }, 'Cell background'],
            [{ code: '--vds-pin-border' }, { code: 'var(--vds-line-strong)' }, 'Resting border'],
            [{ code: '--vds-pin-border-hover' }, 'border + ink @ hover-mix', 'Border on hover'],
            [{ code: '--vds-pin-border-focus' }, { code: 'var(--vds-focus-ring)' }, 'Border on focus'],
            [{ code: '--vds-pin-ring' }, 'focus-ring @ ring-tint', 'Soft focus ring (field recipe)'],
          ]}
        />
        <TokenGroup
          label="Motion"
          rows={[
            [{ code: '--vds-pin-dur' }, { code: 'var(--vds-dur-fast)' }, 'Border / ring transition speed'],
            [{ code: '--vds-pin-ease' }, { code: 'var(--vds-ease-out)' }, 'Easing curve (gated behind prefers-reduced-motion)'],
          ]}
        />
      </Section>

      <Section
        title="Reference implementation"
        note="How the demo on this page is built — reference only. The design system does not ship this markup or CSS; it ships the tokens above. Your team writes its own code field (its own classes, its own framework) and binds to the --vds-pin-* variables."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The reference build lives in the repo under <IC>src/components/PinInput</IC>. Treat it as a worked
          example of the tokens — not something to install today. It's also the seed of a future
          <em> versioned, installable</em> package: when Vipre is ready, the same token contract makes that a
          drop-in, not a rewrite.
        </p>
      </Section>
    </ComponentPage>
  )
}
