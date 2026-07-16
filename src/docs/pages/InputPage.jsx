import { useEffect, useRef, useState } from 'react'
import { Search, X } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC, PropsTable, RefTable, TokenSpecTable } from '../primitives.jsx'
import { Input, Icon, Inline, Badge, Surface, Stack, Text, SegmentedControl, Select, Switch, Divider, Field } from '../../components/index.js'

/* ---------------------------------------------------------------------------
   Small shared bits used by several sections below.
   -------------------------------------------------------------------------- */

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

/* OFFICIAL icon-size mapping for fields: xs→"xs", sm/md→"sm", lg/xl→"md". */
const ICON_SIZE = { xs: 'xs', sm: 'sm', md: 'sm', lg: 'md', xl: 'md' }

/* Every public --vds-input-* token, resolved once against a live probe so the
   spec tables (Sizes, Tokens) show the value the browser actually computes. */
const INPUT_TOKENS = [
  '--vds-input-h-xs', '--vds-input-h-sm', '--vds-input-h-md', '--vds-input-h-lg', '--vds-input-h-xl',
  '--vds-input-pad-x-xs', '--vds-input-pad-x-sm', '--vds-input-pad-x-md', '--vds-input-pad-x-lg', '--vds-input-pad-x-xl',
  '--vds-input-gap', '--vds-input-affix-nudge',
  '--vds-input-radius', '--vds-input-border-w',
  '--vds-input-fill', '--vds-input-border', '--vds-input-muted',
  '--vds-input-addon-bg', '--vds-input-addon-ink',
  '--vds-control-ring-w', '--vds-input-ring',
  '--vds-input-touch-min',
  '--vds-input-dur', '--vds-input-ease',
]

/**
 * useResolvedTokens — render a hidden .vds-input shell probe and read each
 * token's live computed value off it. Input-scoped tokens resolve on the probe;
 * any root/shared token (e.g. --vds-control-ring-w) resolves on <html>. `names`
 * MUST be a stable reference (a module constant) so the effect runs once.
 */
function useResolvedTokens(names) {
  const ref = useRef(null)
  const [values, setValues] = useState({})
  useEffect(() => {
    if (!ref.current) return
    const cs = getComputedStyle(ref.current)
    const root = getComputedStyle(document.documentElement)
    const next = {}
    for (const n of names) {
      const src = n.startsWith('--vds-input-') ? cs : root
      next[n] = src.getPropertyValue(n).trim() || '—'
    }
    setValues(next)
  }, [names])
  return [values, ref]
}

/* Local alias kept for the Sizes spec table below; RefTable is the shared
   node-in-cell table now living in primitives. */
function RawTable(props) {
  return <RefTable {...props} />
}

/* Token name stacked over its live-resolved value, for the spec tables. */
function TokenValue({ name, values }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.15rem', alignItems: 'flex-start' }}>
      <code className="vds-inline-code">{name}</code>
      <span className="vds-text vds-text--micro vds-text--tone-muted">{values[name] || '…'}</span>
    </span>
  )
}

/* A bare clear button — the canonical trailing ACTION affix. It's a real
   <button> with an aria-label (screen readers must know what it does). */
function ClearButton({ size = 'sm', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Clear"
      style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', color: 'inherit' }}
    >
      <Icon as={X} size={size} />
    </button>
  )
}

/* ---------------------------------------------------------------------------
   S1 · Playground
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
  const [leading, setLeading] = useState('search')
  const [trailing, setTrailing] = useState('clear')
  const [invalid, setInvalid] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [value, setValue] = useState('')

  const isz = ICON_SIZE[size]
  const leadingNode = leading === 'search' ? <Icon as={Search} size={isz} /> : undefined
  const trailingNode = trailing === 'clear' ? <ClearButton size={isz} onClick={() => setValue('')} /> : undefined

  // The exact class string the component assembles — the framework-agnostic
  // takeaway (markup consumers copy classes, not JSX). Affixes are child spans,
  // not modifiers, so only size / invalid / disabled show up here.
  const classString = [
    'vds-input',
    `vds-input--${size}`,
    invalid && 'vds-input--invalid',
    disabled && 'vds-input--disabled',
  ].filter(Boolean).join(' ')

  return (
    <Inline gap={6} wrap align="start">
      {/* Column 1 — the stage + the class string it produces. */}
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <Stack gap={0} align="center" justify="center" style={{ minHeight: '9rem', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '22rem' }}>
              <Input
                size={size}
                invalid={invalid}
                disabled={disabled}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="you@company.com"
                leading={leadingNode}
                trailing={trailingNode}
                aria-label="Work email"
              />
            </div>
          </Stack>
        </Surface>
        <Text as="span" variant="eyebrow" tone="muted">Markup classes — copy these</Text>
        <Code>{classString}</Code>
      </Stack>

      {/* Column 2 — the knobs. */}
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
          <ControlField label="Leading icon">
            <Select
              aria-label="Leading icon"
              value={leading}
              onChange={setLeading}
              options={[
                { value: 'none', label: 'None' },
                { value: 'search', label: 'Search' },
              ]}
            />
          </ControlField>
          <ControlField label="Trailing icon">
            <Select
              aria-label="Trailing icon"
              value={trailing}
              onChange={setTrailing}
              options={[
                { value: 'none', label: 'None' },
                { value: 'clear', label: 'X (clear)' },
              ]}
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
   S3 · Sizes spec table
   -------------------------------------------------------------------------- */

const SIZE_ROWS = [
  { size: 'xs', h: '--vds-input-h-xs', px: '--vds-input-pad-x-xs', type: 'micro', icon: 'xs (14px)', touch: '—' },
  { size: 'sm', h: '--vds-input-h-sm', px: '--vds-input-pad-x-sm', type: 'detail', icon: 'sm (16px)', touch: '—' },
  { size: 'md', h: '--vds-input-h-md', px: '--vds-input-pad-x-md', type: 'body', icon: 'sm (16px)', touch: 'md grows text to 1rem on coarse pointers (iOS zoom guard)' },
  { size: 'lg', h: '--vds-input-h-lg', px: '--vds-input-pad-x-lg', type: 'body-lg', icon: 'md (20px)', touch: '—' },
  { size: 'xl', h: '--vds-input-h-xl', px: '--vds-input-pad-x-xl', type: 'body-lg', icon: 'md (20px)', touch: '—' },
]

function SizeSpecTable({ values }) {
  return (
    <RawTable
      headers={['Size', 'Height', 'Pad-x', 'Type step', 'Icon size', 'Touch note']}
      rows={SIZE_ROWS.map((r) => [
        <IC key="s">{r.size}</IC>,
        <TokenValue key="h" name={r.h} values={values} />,
        <TokenValue key="p" name={r.px} values={values} />,
        <IC key="t">{r.type}</IC>,
        r.icon,
        r.touch,
      ])}
    />
  )
}

/* ---------------------------------------------------------------------------
   S4 · States matrix
   -------------------------------------------------------------------------- */

function StateMatrix() {
  const cols = ['Rest', 'Hover', 'Focus', 'Invalid', 'Invalid + focus', 'Disabled']

  const cell = (col) => {
    const common = { size: 'md', defaultValue: 'Acme Corp', 'aria-label': 'Company' }
    switch (col) {
      case 'Rest': return <Input {...common} />
      case 'Hover': return <Input {...common} className="vds-demo-input--hover" />
      case 'Focus': return <Input {...common} className="vds-demo-input--focus" />
      case 'Invalid': return <Input {...common} invalid />
      case 'Invalid + focus': return <Input {...common} invalid className="vds-demo-input--focus" />
      case 'Disabled': return <Input {...common} disabled />
      default: return null
    }
  }

  return (
    <Stack gap={4}>
      <div style={{ overflowX: 'auto', padding: 'var(--vds-space-2)', margin: 'calc(var(--vds-space-2) * -1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(8rem, 1fr))', gap: '0.75rem', alignItems: 'center', minWidth: 'max-content' }}>
          {cols.map((c) => (
            <div key={c} style={{ textAlign: 'left' }}>
              <Text as="span" variant="detail" tone="muted">{c}</Text>
            </div>
          ))}
          {cols.map((c) => (
            <div key={c}>{cell(c)}</div>
          ))}
        </div>
      </div>
      <Text variant="detail" tone="muted">
        Hover and focus here are forced with docs-only classes so you can compare them — real fields do this on their own.
      </Text>
    </Stack>
  )
}

/* ---------------------------------------------------------------------------
   S8 · Tokens table
   -------------------------------------------------------------------------- */

/* The one token spec — Token / Bound to / What it controls, grouped. Live
   values are read at render by the shared TokenSpecTable off a .vds-input
   probe. */
const INPUT_TOKEN_GROUPS = [
  {
    label: 'Sizing',
    tokens: [
      { token: '--vds-input-h-xs', bound: 'var(--vds-control-h-xs)', controls: 'Height — xs (dense rows, toolbars)' },
      { token: '--vds-input-h-sm', bound: 'var(--vds-control-h-sm)', controls: 'Height — sm' },
      { token: '--vds-input-h-md', bound: 'var(--vds-control-h-md)', controls: 'Height — md (default)' },
      { token: '--vds-input-h-lg', bound: 'var(--vds-control-h-lg)', controls: 'Height — lg' },
      { token: '--vds-input-h-xl', bound: 'var(--vds-control-h-xl)', controls: 'Height — xl (hero / marketing forms)' },
      { token: '--vds-input-pad-x-xs', bound: 'var(--vds-space-2)', controls: 'Left/right padding — xs' },
      { token: '--vds-input-pad-x-sm', bound: 'var(--vds-space-2-5)', controls: 'Left/right padding — sm' },
      { token: '--vds-input-pad-x-md', bound: 'var(--vds-space-3)', controls: 'Left/right padding — md' },
      { token: '--vds-input-pad-x-lg', bound: 'var(--vds-space-4)', controls: 'Left/right padding — lg' },
      { token: '--vds-input-pad-x-xl', bound: 'var(--vds-space-5)', controls: 'Left/right padding — xl' },
      { token: '--vds-input-gap', bound: 'var(--vds-space-2)', controls: 'Space between an affix (icon/button) and the text' },
      { token: '--vds-input-affix-nudge', bound: 'calc(var(--vds-space-1) / 2)', controls: 'How far affixes hang into the pad (optical correction; full space-1 at lg/xl)' },
    ],
  },
  {
    label: 'Shape',
    tokens: [
      { token: '--vds-input-radius', bound: 'var(--vds-radius-sm)', controls: 'Corner radius' },
      { token: '--vds-input-border-w', bound: 'var(--vds-border-w)', controls: 'Border hairline width' },
    ],
  },
  {
    label: 'Color',
    tokens: [
      { token: '--vds-input-fill', bound: 'var(--vds-surface-sunken)', controls: 'Field background' },
      { token: '--vds-input-border', bound: 'var(--vds-line-strong)', controls: 'Resting border' },
      { token: '--vds-input-muted', bound: 'var(--vds-ink-subtle)', controls: 'Placeholder text + affix icon color' },
    ],
  },
  {
    label: 'Add-ons',
    tokens: [
      { token: '--vds-input-addon-bg', bound: 'mix(surface-sunken, ink 4%)', controls: 'Attached prefix/suffix segment background (fill mixed a hair toward ink)' },
      { token: '--vds-input-addon-ink', bound: 'var(--vds-ink-muted)', controls: 'Attached prefix/suffix segment text color' },
    ],
  },
  {
    label: 'Focus ring',
    tokens: [
      { token: '--vds-control-ring-w', bound: '— (shared control token)', controls: 'Focus ring thickness — shared by every control' },
      { token: '--vds-input-ring', bound: 'focus-ring @ --vds-control-ring-tint', controls: 'Valid focus ring color (soft shadow)' },
    ],
  },
  {
    label: 'Touch',
    tokens: [
      { token: '--vds-input-touch-min', bound: 'var(--vds-control-font-touch-min)', controls: 'Bumps md font-size on coarse pointers so iOS doesn’t zoom on focus' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-input-dur', bound: 'var(--vds-dur-fast)', controls: 'Border / ring transition speed' },
      { token: '--vds-input-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve' },
    ],
  },
]

/* ---------------------------------------------------------------------------
   S7 · Do / Don't pair
   -------------------------------------------------------------------------- */

function DoDont({ doCaption, doExample, dontCaption, dontExample }) {
  const box = (label, tone, example, caption) => (
    <Surface padding={5} radius="md">
      <Stack gap={3}>
        <Badge tone={tone}>{label}</Badge>
        <div style={{ width: '100%', maxWidth: '20rem' }}>
          {example}
        </div>
        <Text variant="detail" tone="muted">{caption}</Text>
      </Stack>
    </Surface>
  )
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', gap: '1rem' }}>
      {box('Do', 'success', doExample, doCaption)}
      {box('Don’t', 'danger', dontExample, dontCaption)}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export function InputPage() {
  const [tokenValues, probeRef] = useResolvedTokens(INPUT_TOKENS)

  const scrollToTokens = (e) => {
    e.preventDefault()
    document.getElementById('input-tokens')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Input}
      title="Input"
      description="A box for one line of text. Five sizes — from a tiny xs for dense tables to a big xl for marketing forms — each with the same looks: normal, hovered, focused (a soft ring), wrong (red), and turned off. You can hang things before or after the text — an icon that says what the box is for, or a button that does something like clear it — to build a search box. The ref points at the real input inside, and it passes through all normal input props."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own input against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'How tall it is and its text size (matches Button)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid to show something’s wrong'],
            [{ code: 'prefix' }, { code: 'ReactNode' }, '—', 'An attached chrome segment BEFORE everything — a “$” or “https://” glued inside the border'],
            [{ code: 'leading' }, { code: 'ReactNode' }, '—', 'Something before the text (like an Icon) — says what the box is FOR'],
            [{ code: 'trailing' }, { code: 'ReactNode' }, '—', 'Something after the text (like a clear button) — an ACTION'],
            [{ code: 'suffix' }, { code: 'ReactNode' }, '—', 'An attached chrome segment AFTER everything — a “kg” or “.00” glued inside the border'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'value, onChange, placeholder, type, aria-*…'],
          ],
        },
      ]}
      accessibility={[
        <>Always give it a <IC>{'<label>'}</IC> or <IC>aria-label</IC> so people know what it’s for — a placeholder is an example, not a label.</>,
        <><IC>invalid</IC> sets <IC>aria-invalid</IC>; connect the error text with <IC>aria-describedby</IC> (or just wrap it in <IC>Field</IC>, which does this for you).</>,
        <>The whole box lights up when you click or tab into it (<IC>:focus-within</IC>) using the input’s soft graphite ring — keyboard AND pointer.</>,
        <>Affix <strong>actions</strong> (clear, show password) must be real <IC>{'<button>'}</IC>s with an <IC>aria-label</IC> — a bare icon isn’t reachable or announced.</>,
        <>On touch screens, an interactive affix grows an invisible 44px tap target (the field’s height doesn’t change), so even a dense <IC>xs</IC> field’s buttons stay tappable.</>,
      ]}
    >
      {/* Hidden probe: a .vds-input shell that carries the input custom-property
          context so the spec tables can read each token's live computed value. */}
      <div
        ref={probeRef}
        aria-hidden="true"
        className="vds-input vds-input--md"
        style={{ position: 'absolute', width: 0, height: 0, padding: 0, border: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      />

      {/* S1 · Playground */}
      <Section
        title="Playground"
        note="Turn the knobs — the field updates live, and you can type into it. The class list under the stage is exactly what a non-React app copies into its markup."
      >
        <Playground />
      </Section>

      {/* S2 · Anatomy */}
      <Section
        title="Anatomy"
        note="One field, up to four parts inside one box. The affixes are optional; the input is not."
      >
        <Stack gap={4}>
          <Surface padding={8} elevation="flat">
            <Stack gap={0} align="center" style={{ justifyContent: 'center', minHeight: '4rem' }}>
              <div style={{ width: '100%', maxWidth: '22rem' }}>
                <Input
                  className="vds-demo-input--focus"
                  defaultValue="Acme Corp"
                  aria-label="Company"
                  leading={<Icon as={Search} size="sm" />}
                  trailing={<ClearButton size="sm" />}
                />
              </div>
            </Stack>
          </Surface>
          <PropsTable
            headers={['#', 'Part', 'What it does']}
            rows={[
              ['1', { code: '.vds-input' }, 'Shell — the border, fill, and radius that make one box'],
              ['2', { code: '.vds-input__affix--lead' }, 'Leading affix — context: what the box is for (search, currency)'],
              ['3', { code: '<input>' }, 'The field itself — the native text input'],
              ['4', { code: '.vds-input__affix--trail' }, 'Trailing affix — an action (clear, show password)'],
              ['5', 'Focus ring', 'Soft box-shadow ring on :focus-within — shows for keyboard AND pointer'],
              ['6', 'Optical nudge', 'Affixes hang into the pad so both edges feel even — token --vds-input-affix-nudge'],
            ]}
          />
          <Text variant="detail" tone="muted">
            Height, padding, and gap all come from tokens — see <a href="#/component/input" onClick={scrollToTokens}>Tokens ↓</a>.
          </Text>
        </Stack>
      </Section>

      {/* S3 · Sizes */}
      <Section
        title="Sizes"
        note="Five sizes: xs for the tightest surfaces like table filters, xl for a single hero form. sm/md/lg cover everything in between. Icons scale with the size."
      >
        <Stack gap={4}>
          <Preview
            canvas={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }}>
                {SIZES.map((sz) => (
                  <Input
                    key={sz}
                    size={sz}
                    placeholder="you@company.com"
                    aria-label={`Email (${sz})`}
                    leading={<Icon as={Search} size={ICON_SIZE[sz]} />}
                    trailing={<ClearButton size={ICON_SIZE[sz]} />}
                  />
                ))}
              </div>
            }
          />
          <SizeSpecTable values={tokenValues} />
          <Text variant="detail" tone="muted">
            Icon-size rule: <IC>xs</IC> uses Icon <IC>xs</IC> (14px); <IC>sm</IC> and <IC>md</IC> use <IC>sm</IC> (16px); <IC>lg</IC> and <IC>xl</IC> use <IC>md</IC> (20px).
          </Text>
          <Text variant="detail" tone="muted">
            Affixes hang --vds-input-affix-nudge into the pad (2px, or 4px at lg/xl) — that's on purpose; glyphs carry whitespace inside their box, so a flush icon would read over-padded.
          </Text>
        </Stack>
      </Section>

      {/* S4 · States */}
      <Section
        title="States"
        note="Every state a field can be in, side by side, all at md. Rest and invalid are real props; hover and focus are forced here so you can compare them."
      >
        <StateMatrix />
      </Section>

      {/* S5 · With affixes */}
      <Section
        title="With affixes"
        note="Two slots. leading = context — what the box is FOR (a search icon, a currency symbol, a URL prefix); it helps people know what to type. trailing = an ACTION — clear the field, show the password, a loading spinner. Pick the one that matches the job; use both only when both jobs are truly real."
      >
        <Stack gap={4}>
          <Preview
            canvas={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }}>
                <Input placeholder="Search devices…" aria-label="Search" leading={<Icon as={Search} size="sm" />} />
                <Input defaultValue="Acme Corp" aria-label="Company" trailing={<ClearButton size="sm" />} />
                <Input placeholder="Search devices…" aria-label="Search both" leading={<Icon as={Search} size="sm" />} trailing={<ClearButton size="sm" />} />
              </div>
            }
          />
          <PropsTable
            headers={['Slot', 'Job', 'Examples']}
            rows={[
              [{ code: 'leading' }, 'Context — what the box is for', 'Search 🔍, a currency symbol, a URL prefix — never clickable, just a hint'],
              [{ code: 'trailing' }, 'Action — do something to the field', 'Clear ×, show password, loading spinner — a real button with an aria-label'],
              [{ code: 'leading + trailing' }, 'Both jobs are real', 'Rare — e.g. Search 🔍 … clear ×. Never decorate both sides.'],
            ]}
          />
          <Text variant="detail" tone="muted">
            Affix <strong>actions</strong> must be real <IC>{'<button>'}</IC>s with an <IC>aria-label</IC> — a bare clickable icon isn’t keyboard-reachable or announced.
          </Text>
        </Stack>
      </Section>

      {/* S5b · Add-ons */}
      <Section
        title="Add-ons"
        note="Add-ons are little segments glued inside the border — a currency mark, a URL scheme, a unit. They look like part of the box (a slightly darker segment split off by a thin line), not something you type. Use prefix for the front (a “$”, “https://”) and suffix for the back (“kg”, “.00”). They’re different from leading/trailing affixes: affixes are icons or buttons that sit in the padding; add-ons are labelled segments flush to the edge."
      >
        <Stack gap={4}>
          <Preview
            canvas={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 360 }}>
                <Input prefix="$" placeholder="0.00" inputMode="decimal" aria-label="Amount" />
                <Input prefix="https://" placeholder="example.com" aria-label="Website" />
                <Input suffix="kg" defaultValue="68" inputMode="decimal" aria-label="Weight" />
                <Input prefix="$" suffix="USD" placeholder="0.00" inputMode="decimal" aria-label="Price" />
              </div>
            }
          />
          <PropsTable
            headers={['Prop', 'Where it sits', 'Examples']}
            rows={[
              [{ code: 'prefix' }, 'Attached segment before everything', 'A currency “$”, a scheme “https://” — context glued to the front'],
              [{ code: 'suffix' }, 'Attached segment after everything', 'A unit “kg”, a currency code “USD”, a “.00” — context glued to the back'],
              [{ code: 'prefix + suffix' }, 'Both ends wrapped', 'e.g. “$” … amount … “USD” — use both only when both are real'],
            ]}
          />
          <Text variant="detail" tone="muted">
            An add-on is <strong>decoration</strong>, not a control — it’s a plain segment with muted ink, not a button. Its background is <IC>--vds-input-addon-bg</IC> (the fill mixed a hair toward ink) and it stays put through hover, focus, and invalid, because it’s inside the field’s own border.
          </Text>
        </Stack>
      </Section>

      {/* S6 · In a form */}
      <Section
        title="In a form"
        note="Wrap the input in a Field and it wires the label, the help text, and the error to the control for you — the right ids, aria-describedby, and aria-invalid, automatically. Use it every time."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 360 }}>
              <Field label="Work email" help="We only use this for alerts.">
                <Input type="email" placeholder="you@company.com" />
              </Field>
              <Field label="Work email" error="Needs an @ — try name@company.com">
                <Input type="email" defaultValue="ada.company.com" />
              </Field>
            </div>
          }
        />
      </Section>

      {/* S7 · Content & usage rules */}
      <Section
        title="Content & usage rules"
        note="The label and the error are the words that decide whether someone can fill the form. Keep the label visible and the error specific."
      >
        <Stack gap={5}>
          <ul className="vds-a11y">
            <li>Every input gets a <strong>visible label</strong> — a placeholder is an example of what to type, not a label (it vanishes the moment they start).</li>
            <li>Error text says <strong>what’s wrong AND how to fix it</strong> — not just that something failed.</li>
            <li>Help text comes <strong>before</strong> the user fails; error text comes <strong>after</strong>.</li>
            <li>Size the wrapper to the expected content — a ZIP field short, an email field wide — so the length hints at the answer.</li>
          </ul>

          <DoDont
            doCaption="A visible label, with the placeholder as an example."
            doExample={
              <Field label="Work email">
                <Input placeholder="you@company.com" />
              </Field>
            }
            dontCaption="Placeholder standing in for the label — it disappears as you type."
            dontExample={<Input placeholder="Work email" aria-label="Work email" />}
          />

          <DoDont
            doCaption="Say what’s wrong and how to fix it."
            doExample={
              <Field label="Work email" error="Needs an @ — try name@company.com">
                <Input defaultValue="ada.company.com" />
              </Field>
            }
            dontCaption="“Invalid input” — true, but useless."
            dontExample={
              <Field label="Work email" error="Invalid input">
                <Input defaultValue="ada.company.com" />
              </Field>
            }
          />

          <DoDont
            doCaption="One trailing action, one job."
            doExample={<Input defaultValue="Acme Corp" aria-label="Company" trailing={<ClearButton size="sm" />} />}
            dontCaption="Decorative icons on both sides — noise, not meaning."
            dontExample={<Input defaultValue="Acme Corp" aria-label="Company decorated" leading={<Icon as={Search} size="sm" />} trailing={<Icon as={X} size="sm" />} />}
          />

          <DoDont
            doCaption="xs in a dense table filter; xl in a marketing form."
            doExample={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Input size="xs" placeholder="Filter rows…" aria-label="Filter" leading={<Icon as={Search} size="xs" />} />
                <Input size="xl" placeholder="you@company.com" aria-label="Email" />
              </div>
            }
            dontCaption="Two different sizes stacked in one form — the rhythm breaks."
            dontExample={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Input size="sm" placeholder="First name" aria-label="First name" />
                <Input size="lg" placeholder="Last name" aria-label="Last name" />
              </div>
            }
          />
        </Stack>
      </Section>

      {/* S8 · Tokens */}
      <div id="input-tokens">
        <Section
          title="Tokens"
          note="Every visual value is a --vds-input-* variable on the .vds-input root, built only from foundation tokens. Live value is what the browser shows right now. Set any of them on your own selector to re-space or reshape the field; nothing else changes. Colors point at semantic tokens, so light and dark come free."
        >
          <TokenSpecTable scope="vds-input" prefix="--vds-input-" groups={INPUT_TOKEN_GROUPS} />

          <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.75rem' }}>
            Size is a text-size step, not a raw value: xs = <IC>micro</IC>, sm = <IC>detail</IC>, md = <IC>body</IC>, lg and xl = <IC>body-lg</IC>.
          </p>
          <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
            <strong>D1 — soft ring.</strong> Fields (Input, Select, Textarea) render focus as a soft <IC>box-shadow</IC> ring; action controls (Button, Checkbox) use a hard <IC>outline</IC> ring instead. Both are intentional recipes, not a mismatch.
          </p>
          <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
            <strong>D2 — two tints.</strong> The valid ring is the brand focus-ring at <IC>--vds-control-ring-tint</IC> (35%); the invalid ring is danger at <IC>--vds-control-ring-tint-invalid</IC> (30%). The split is intentional: danger reads stronger than the brand ring at equal alpha, so the invalid ring is dialed down to balance.
          </p>
        </Section>
      </div>

    </ComponentPage>
  )
}
