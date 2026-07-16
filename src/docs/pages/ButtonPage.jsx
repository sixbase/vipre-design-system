import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, ChevronRight, Download, Plus, Settings, Trash2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, Kbd, IC, PropsTable, A11yList, RefTable, TokenSpecTable } from '../primitives.jsx'
import { Button, Icon, Inline, Table, Badge, Surface, Stack, Text, SegmentedControl, Select, Switch, Divider } from '../../components/index.js'

/* ---------------------------------------------------------------------------
   Small shared bits used by several sections below.
   -------------------------------------------------------------------------- */

const TONES = ['primary', 'neutral', 'success', 'warning', 'danger', 'info']
const VARIANTS = ['solid', 'soft', 'outline', 'ghost']
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

/* OFFICIAL icon-size mapping: xs→"xs", sm/md→"sm", lg/xl→"md". */
const ICON_SIZE = { xs: 'xs', sm: 'sm', md: 'sm', lg: 'md', xl: 'md' }

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/* Every public --vds-button-* token, resolved once against a live probe so the
   spec tables (Sizes, Tokens) show the value the browser actually computes. */
const BUTTON_TOKENS = [
  '--vds-button-h-xs', '--vds-button-h-sm', '--vds-button-h-md', '--vds-button-h-lg', '--vds-button-h-xl',
  '--vds-button-pad-x-xs', '--vds-button-pad-x-sm', '--vds-button-pad-x-md', '--vds-button-pad-x-lg', '--vds-button-pad-x-xl',
  '--vds-button-gap-xs', '--vds-button-gap-sm', '--vds-button-gap-md', '--vds-button-gap-lg', '--vds-button-gap-xl', '--vds-button-icon-nudge', '--vds-button-radius', '--vds-button-border-w', '--vds-button-weight', '--vds-button-weight-strong',
  '--vds-button-ring-w', '--vds-button-ring-offset', '--vds-button-dur', '--vds-button-ease',
]

/**
 * useResolvedTokens — render a hidden .vds-button probe and read each token's
 * live computed value off it. Button-scoped tokens resolve on the probe; any
 * root token resolves on <html>. `names` MUST be a stable reference (a module
 * constant) so the effect runs once, not on every render.
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
      const src = n.startsWith('--vds-button-') ? cs : root
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

/* ---------------------------------------------------------------------------
   S1 · Playground
   -------------------------------------------------------------------------- */

const LEADING_ICONS = { none: null, settings: Settings, plus: Plus, download: Download }
const TRAILING_ICONS = { none: null, 'chevron-right': ChevronRight, 'chevron-down': ChevronDown, 'arrow-up-right': ArrowUpRight }

function ControlField({ label, children }) {
  return (
    <Stack gap={1} style={{ flex: '0 0 auto' }}>
      <Text as="span" variant="eyebrow" tone="muted">{label}</Text>
      {children}
    </Stack>
  )
}

function Playground() {
  const [variant, setVariant] = useState('solid')
  const [tone, setTone] = useState('primary')
  const [size, setSize] = useState('md')
  const [leading, setLeading] = useState('settings')
  const [trailing, setTrailing] = useState('none')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [iconOnly, setIconOnly] = useState(false)

  const isz = ICON_SIZE[size]
  const LeadingIcon = LEADING_ICONS[leading]
  const TrailingIcon = TRAILING_ICONS[trailing]

  // The exact class string the component assembles — the framework-agnostic
  // takeaway (markup consumers copy classes, not JSX).
  const classString = [
    'vds-button',
    `vds-button--${variant}`,
    `vds-button--${tone}`,
    `vds-button--${size}`,
    iconOnly && 'vds-button--icon',
    fullWidth && 'vds-button--full',
    loading && 'vds-button--loading',
  ].filter(Boolean).join(' ')

  const liveButton = (
    <Button
      variant={variant}
      tone={tone}
      size={size}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      leading={!iconOnly && LeadingIcon ? <Icon as={LeadingIcon} size={isz} /> : undefined}
      trailing={!iconOnly && TrailingIcon ? <Icon as={TrailingIcon} size={isz} /> : undefined}
      aria-label={iconOnly ? 'Demo action' : undefined}
    >
      {iconOnly ? <Icon as={LeadingIcon || Plus} size={isz} /> : 'Button'}
    </Button>
  )

  return (
    <Inline gap={6} wrap align="start">
      {/* Column 1 — the stage + the class string it produces. */}
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <Stack gap={0} align="center" justify="center" style={{ minHeight: '9rem', justifyContent: 'center' }}>
            {fullWidth ? (
              <div style={{ width: '100%', maxWidth: '22rem' }}>{liveButton}</div>
            ) : (
              liveButton
            )}
          </Stack>
        </Surface>
        <Text as="span" variant="eyebrow" tone="muted">Markup classes — copy these</Text>
        <Code>{classString}</Code>
      </Stack>

      {/* Column 2 — the knobs. */}
      <Surface bordered padding={5} style={{ flex: '0 0 17rem' }}>
        <Stack gap={4}>
          <Text as="span" variant="eyebrow" tone="muted">Options</Text>

          <ControlField label="Variant">
            <SegmentedControl
              size="sm"
              fullWidth
              aria-label="Variant"
              value={variant}
              onChange={setVariant}
              options={VARIANTS.map((v) => ({ value: v, label: cap(v) }))}
            />
          </ControlField>
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
          <ControlField label="Tone">
            <Select
              aria-label="Tone"
              value={tone}
              onChange={setTone}
              options={TONES.map((t) => ({ value: t, label: cap(t) }))}
            />
          </ControlField>
          <ControlField label="Leading icon">
            <Select
              aria-label="Leading icon"
              value={leading}
              onChange={setLeading}
              disabled={iconOnly}
              options={[
                { value: 'none', label: 'None' },
                { value: 'settings', label: 'Settings' },
                { value: 'plus', label: 'Plus' },
                { value: 'download', label: 'Download' },
              ]}
            />
          </ControlField>
          <ControlField label="Trailing icon">
            <Select
              aria-label="Trailing icon"
              value={trailing}
              onChange={setTrailing}
              disabled={iconOnly}
              options={[
                { value: 'none', label: 'None' },
                { value: 'chevron-right', label: 'Chevron right' },
                { value: 'chevron-down', label: 'Chevron down' },
                { value: 'arrow-up-right', label: 'Arrow up-right' },
              ]}
            />
          </ControlField>

          <Divider />

          <Text as="span" variant="eyebrow" tone="muted">States</Text>
          <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>Disabled</Switch>
          <Switch checked={loading} onChange={(e) => setLoading(e.target.checked)}>Loading</Switch>

          <Text as="span" variant="eyebrow" tone="muted">Layout</Text>
          <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)}>Full width</Switch>
          <Switch checked={iconOnly} onChange={(e) => setIconOnly(e.target.checked)}>Icon only</Switch>
        </Stack>
      </Surface>
    </Inline>
  )
}

/* ---------------------------------------------------------------------------
   S6 · States matrix
   -------------------------------------------------------------------------- */

function StateMatrix() {
  const [tone, setTone] = useState('primary')
  const cols = ['Rest', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Loading']

  const cell = (variant, col) => {
    const common = { variant, tone, size: 'md' }
    switch (col) {
      case 'Rest': return <Button {...common}>Save</Button>
      case 'Hover': return <Button {...common} className="vds-demo-state--hover">Save</Button>
      case 'Pressed': return <Button {...common} className="vds-demo-state--active">Save</Button>
      case 'Focus': return <Button {...common} className="vds-demo-state--focus">Save</Button>
      case 'Disabled': return <Button {...common} disabled>Save</Button>
      case 'Loading': return <Button {...common} loading>Save</Button>
      default: return null
    }
  }

  return (
    <Stack gap={4}>
      <SegmentedControl
        size="sm"
        aria-label="Tone"
        value={tone}
        onChange={setTone}
        options={TONES.map((t) => ({ value: t, label: cap(t) }))}
      />
      <div style={{ overflowX: 'auto', padding: 'var(--vds-space-2)', margin: 'calc(var(--vds-space-2) * -1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(6, minmax(5rem, 1fr))', gap: '0.75rem', alignItems: 'center', minWidth: 'max-content' }}>
          <span />
          {cols.map((c) => (
            <div key={c} style={{ textAlign: 'center' }}>
              <Text as="span" variant="detail" tone="muted">{c}</Text>
            </div>
          ))}
          {VARIANTS.map((v) => (
            <Fragment key={v}>
              <div><IC>{v}</IC></div>
              {cols.map((c) => (
                <div key={c} style={{ display: 'flex', justifyContent: 'center' }}>{cell(v, c)}</div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <Text variant="detail" tone="muted">
        Hover, pressed, and focus here are forced with docs-only classes so you can compare them — real buttons do this on their own.
      </Text>
    </Stack>
  )
}

/* ---------------------------------------------------------------------------
   S5 · Sizes spec table
   -------------------------------------------------------------------------- */

const SIZE_ROWS = [
  { size: 'xs', h: '--vds-button-h-xs', px: '--vds-button-pad-x-xs', gap: '--vds-button-gap-xs', type: 'micro', icon: 'xs (14px)', touch: '44px overlay' },
  { size: 'sm', h: '--vds-button-h-sm', px: '--vds-button-pad-x-sm', gap: '--vds-button-gap-sm', type: 'detail', icon: 'sm (16px)', touch: '44px overlay' },
  { size: 'md', h: '--vds-button-h-md', px: '--vds-button-pad-x-md', gap: '--vds-button-gap-md', type: 'body', icon: 'sm (16px)', touch: 'native — none needed' },
  { size: 'lg', h: '--vds-button-h-lg', px: '--vds-button-pad-x-lg', gap: '--vds-button-gap-lg', type: 'body-lg', icon: 'md (20px)', touch: '—' },
  { size: 'xl', h: '--vds-button-h-xl', px: '--vds-button-pad-x-xl', gap: '--vds-button-gap-xl', type: 'subheading', icon: 'md (20px)', touch: '—' },
]

function SizeSpecTable({ values }) {
  return (
    <RawTable
      headers={['Size', 'Height', 'Pad-x', 'Gap', 'Type step', 'Icon size', 'Min touch target']}
      rows={SIZE_ROWS.map((r) => [
        <IC key="s">{r.size}</IC>,
        <TokenValue key="h" name={r.h} values={values} />,
        <TokenValue key="p" name={r.px} values={values} />,
        <TokenValue key="g" name={r.gap} values={values} />,
        <IC key="t">{r.type}</IC>,
        r.icon,
        r.touch,
      ])}
    />
  )
}

/* ---------------------------------------------------------------------------
   S10 · Tokens table
   -------------------------------------------------------------------------- */

/* The one token spec — Token / Bound to / What it controls, grouped. Live
   values are read at render by the shared TokenSpecTable off a .vds-button
   probe. */
const BUTTON_TOKEN_GROUPS = [
  {
    label: 'Sizing',
    tokens: [
      { token: '--vds-button-h-xs', bound: 'var(--vds-control-h-xs)', controls: 'Height — xs (dense rows, toolbars)' },
      { token: '--vds-button-h-sm', bound: 'var(--vds-control-h-sm)', controls: 'Height — sm' },
      { token: '--vds-button-h-md', bound: 'var(--vds-control-h-md)', controls: 'Height — md (default)' },
      { token: '--vds-button-h-lg', bound: 'var(--vds-control-h-lg)', controls: 'Height — lg' },
      { token: '--vds-button-h-xl', bound: 'var(--vds-control-h-xl)', controls: 'Height — xl (hero CTA)' },
      { token: '--vds-button-pad-x-xs', bound: 'var(--vds-space-2)', controls: 'Left/right padding — xs' },
      { token: '--vds-button-pad-x-sm', bound: 'var(--vds-space-3)', controls: 'Left/right padding — sm' },
      { token: '--vds-button-pad-x-md', bound: 'var(--vds-space-4)', controls: 'Left/right padding — md' },
      { token: '--vds-button-pad-x-lg', bound: 'var(--vds-space-6)', controls: 'Left/right padding — lg' },
      { token: '--vds-button-pad-x-xl', bound: 'var(--vds-space-8)', controls: 'Left/right padding — xl' },
      { token: '--vds-button-gap-xs', bound: 'var(--vds-space-2)', controls: 'Icon ↔ label gap — xs' },
      { token: '--vds-button-gap-sm', bound: 'var(--vds-space-2)', controls: 'Icon ↔ label gap — sm' },
      { token: '--vds-button-gap-md', bound: 'var(--vds-space-2-5)', controls: 'Icon ↔ label gap — md' },
      { token: '--vds-button-gap-lg', bound: 'var(--vds-space-3)', controls: 'Icon ↔ label gap — lg (grows to keep pace with the padding)' },
      { token: '--vds-button-gap-xl', bound: 'var(--vds-space-3)', controls: 'Icon ↔ label gap — xl' },
      { token: '--vds-button-icon-nudge', bound: 'var(--vds-space-1)', controls: 'How far icon slots pull toward the edge (optical correction; scales 2→8px)' },
    ],
  },
  {
    label: 'Shape',
    tokens: [
      { token: '--vds-button-radius', bound: 'var(--vds-radius-sm)', controls: 'Corner radius' },
      { token: '--vds-button-border-w', bound: 'var(--vds-border-w)', controls: 'Border hairline width' },
    ],
  },
  {
    label: 'Type',
    tokens: [
      { token: '--vds-button-weight', bound: 'var(--vds-weight-medium)', controls: 'Label weight (xs–lg)' },
      { token: '--vds-button-weight-strong', bound: 'var(--vds-weight-semibold)', controls: 'Label weight — xl only, reads heavier' },
    ],
  },
  {
    label: 'Focus ring',
    tokens: [
      { token: '--vds-button-ring-w', bound: 'var(--vds-control-ring-w)', controls: 'Focus ring thickness' },
      { token: '--vds-button-ring-offset', bound: 'var(--vds-control-ring-offset)', controls: 'Focus ring gap from the edge' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-button-dur', bound: 'var(--vds-dur-fast)', controls: 'Hover / focus transition speed' },
      { token: '--vds-button-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve' },
    ],
  },
]

/* ---------------------------------------------------------------------------
   S9 · Do / Don't pair
   -------------------------------------------------------------------------- */

function DoDont({ doCaption, doExample, dontCaption, dontExample }) {
  const box = (label, tone, example, caption) => (
    <Surface padding={5} radius="md">
      <Stack gap={3}>
        <Badge tone={tone}>{label}</Badge>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', minHeight: '2.5rem' }}>
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

export function ButtonPage() {
  const [tokenValues, probeRef] = useResolvedTokens(BUTTON_TOKENS)

  const scrollToTokens = (e) => {
    e.preventDefault()
    document.getElementById('button-tokens')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Button}
      title="Button"
      description="A thing people click to do something. Two dials: variant is how loud it looks (solid, soft, outline, ghost), and tone is its color and job (primary, neutral, success, warning, danger, info). Any look works with any color. Five sizes — tiny xs for packed rows up to big xl for one hero moment. It has a loading spinner, a faded off state, and a focus ring you can see when you tab to it. Takes all the normal button props too."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own button against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'solid' | 'soft' | 'outline' | 'ghost'" }, { code: "'solid'" }, 'How loud the button looks'],
            [{ code: 'tone' }, { code: "'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'primary'" }, 'The button’s job and color'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'How tall the button is and its text size'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Show a spinner and stop clicks while it works'],
            [{ code: 'fullWidth' }, { code: 'boolean' }, { code: 'false' }, 'Stretch to fill the space it sits in'],
            [{ code: 'iconOnly' }, { code: 'boolean' }, { code: 'false' }, 'Make it a square for a single icon (needs aria-label)'],
            [{ code: 'leading' }, { code: 'node' }, '—', 'Icon before the label — says what the action IS (hidden while loading; the spinner takes its place)'],
            [{ code: 'trailing' }, { code: 'node' }, '—', 'Icon after the label — says where the action GOES (next, menu, external)'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'type' }, { code: "'button' | 'submit'" }, { code: "'button'" }, 'The normal button type'],
            [{ code: '…props' }, { code: 'ButtonHTMLAttributes' }, '—', 'onClick, aria-*, and more, passed to <button>'],
          ],
        },
      ]}
      accessibility={[
        <>Keyboard: <Kbd>Enter</Kbd> and <Kbd>Space</Kbd> activate the button.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> and only shows when you tab to it (<IC>:focus-visible</IC>) — it is keyboard-only.</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC> and turns the button off so it can’t be re-fired.</>,
        <>Disabled uses <IC>opacity</IC> + <IC>pointer-events: none</IC> — never a new gray.</>,
        <>Icon-only buttons must have an <IC>aria-label</IC> so screen readers know what they do.</>,
        <>On a coarse pointer, <IC>xs</IC> keeps a 44px invisible touch target so the tap area never drops below the minimum.</>,
      ]}
    >
      {/* Hidden probe: carries the .vds-button custom-property context so the
          spec tables can read each token's live computed value. */}
      <button
        ref={probeRef}
        aria-hidden="true"
        tabIndex={-1}
        className="vds-button vds-button--solid vds-button--primary vds-button--md"
        style={{ position: 'absolute', width: 0, height: 0, padding: 0, border: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      />

      <Section
        title="Playground"
        note="Turn the dials and watch the button change. The class list below the stage is exactly what a plain-HTML app copies into its markup."
      >
        <Playground />
      </Section>

      <Section
        title="Anatomy"
        note="One button, four parts. Icons are optional; the label is not."
      >
        <Stack gap={4}>
          <Surface padding={8} elevation="flat">
            <Stack gap={0} align="center" style={{ justifyContent: 'center', minHeight: '4rem' }}>
              <Button
                className="vds-demo-state--focus"
                leading={<Icon as={Plus} size="sm" />}
                trailing={<Icon as={ChevronDown} size="sm" />}
              >
                Add device
              </Button>
            </Stack>
          </Surface>
          <PropsTable
            headers={['#', 'Part', 'What it does']}
            rows={[
              ['1', { code: '.vds-button__leading' }, 'Leading icon slot — what the action IS'],
              ['2', { code: '.vds-button__label' }, 'Verb-first, sentence case — nudged down a touch at xs/md so the letters sit level with the icon (token --vds-button-label-optical)'],
              ['3', { code: '.vds-button__trailing' }, 'Trailing icon slot — where it GOES'],
              ['4', 'Focus ring', '2px outline, 2px offset, keyboard only'],
              ['5', 'Optical nudge', 'icon slots hang 4px into the padding (2px at xs/sm) so both edges feel even — token --vds-button-icon-nudge'],
            ]}
          />
          <Text variant="detail" tone="muted">
            Height, padding, and gap all come from tokens — see <a href="#/component/button" onClick={scrollToTokens}>Tokens ↓</a>.
          </Text>
        </Stack>
      </Section>

      <Section title="Variants" note="Four levels of loudness, from a solid fill down to a see-through ghost.">
        <Stack gap={4}>
          <Preview
            canvas={
              <>
                <Button variant="solid">Solid</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </>
            }
          />
          <PropsTable
            headers={['Variant', 'When to use']}
            rows={[
              [{ code: 'solid' }, 'The ONE main action of a view'],
              [{ code: 'soft' }, 'Secondary actions that still need weight'],
              [{ code: 'outline' }, 'Secondary next to a solid, or on busy surfaces'],
              [{ code: 'ghost' }, 'Quiet / inline actions — table rows, toolbars'],
            ]}
          />
        </Stack>
      </Section>

      <Section title="Tones" note="The color for the button’s job. Any tone works with any look — shown here as soft fills.">
        <Stack gap={4}>
          <Preview
            canvas={
              <>
                <Button variant="soft" tone="primary">Primary</Button>
                <Button variant="soft" tone="neutral">Neutral</Button>
                <Button variant="soft" tone="success">Success</Button>
                <Button variant="soft" tone="warning">Warning</Button>
                <Button variant="soft" tone="danger">Danger</Button>
                <Button variant="soft" tone="info">Info</Button>
              </>
            }
          />
          <PropsTable
            headers={['Tone', 'When to use']}
            rows={[
              [{ code: 'primary' }, 'Default for the main action'],
              [{ code: 'neutral' }, 'Chrome / secondary (“Cancel”, “Back”)'],
              [{ code: 'success' }, 'Confirm a positive outcome (usually soft; solid success is rare)'],
              [{ code: 'warning' }, 'Risky but recoverable (“Regenerate keys”)'],
              [{ code: 'danger' }, 'Destructive / irreversible'],
              [{ code: 'info' }, 'Informational side actions (rare)'],
            ]}
          />
        </Stack>
      </Section>

      <Section title="Sizes" note="Five sizes: xs for the tightest surfaces, xl for a single hero moment. sm/md/lg cover everything in between. Icons scale with the size.">
        <Stack gap={4}>
          <Preview
            canvas={
              <Inline gap={2} align="end" wrap>
                {SIZES.map((sz) => (
                  <Button
                    key={sz}
                    size={sz}
                    leading={<Icon as={Settings} size={ICON_SIZE[sz]} />}
                    trailing={<Icon as={ChevronRight} size={ICON_SIZE[sz]} />}
                  >
                    {sz.toUpperCase()}
                  </Button>
                ))}
              </Inline>
            }
          />
          <SizeSpecTable values={tokenValues} />
          <Text variant="detail" tone="muted">
            Icon-size rule: <IC>xs</IC> uses Icon <IC>xs</IC> (14px); <IC>sm</IC> and <IC>md</IC> use <IC>sm</IC> (16px); <IC>lg</IC> and <IC>xl</IC> use <IC>md</IC> (20px).
          </Text>
          <Text variant="detail" tone="muted">
            The icon ↔ label gap grows with the button (8px at xs/sm → 10px md → 12px lg/xl) so it keeps pace with the wider side padding. Icons also hang --vds-button-icon-nudge into the pad (2px xs/sm → 4px md → 6px lg → 8px xl) — that's on purpose; glyphs carry whitespace inside their box.
          </Text>
        </Stack>
      </Section>

      <Section
        title="States"
        note="Every look in every state, one color at a time. Switch the color to repaint the whole grid."
      >
        <StateMatrix />
      </Section>

      <Section
        title="With icons"
        note="Two icon slots. leading says what the action is (add, download) — it helps people scan. trailing says where it goes (next step, opens a menu, leaves the app). Usually pick one. No room for words? Use icon-only instead."
      >
        <Stack gap={4}>
          <Preview
            canvas={
              <Stack gap={3}>
                <Inline gap={2} wrap>
                  <Button leading={<Icon as={Plus} size="sm" />}>Add customer</Button>
                  <Button variant="soft" leading={<Icon as={Download} size="sm" />}>Download report</Button>
                  <Text as="span" variant="detail" tone="muted">← leading: says what it does</Text>
                </Inline>
                <Inline gap={2} wrap>
                  <Button variant="outline" tone="neutral" trailing={<Icon as={ChevronRight} size="sm" />}>Next step</Button>
                  <Button variant="outline" tone="neutral" trailing={<Icon as={ChevronDown} size="sm" />}>Actions</Button>
                  <Button variant="ghost" trailing={<Icon as={ArrowUpRight} size="sm" />}>Open portal</Button>
                  <Text as="span" variant="detail" tone="muted">← trailing: says where it goes</Text>
                </Inline>
              </Stack>
            }
          />
          <PropsTable
            headers={['Use', 'Slot', 'Examples']}
            rows={[
              ['The icon explains the action', { code: 'leading' }, 'Add +, Download ↓, Search 🔍 — reinforces meaning, easy to scan in a list of buttons'],
              ['The icon points onward', { code: 'trailing' }, 'Next ›, opens a menu ▾, external link ↗ — signals what happens after the click'],
              ['No room for a label', { code: 'iconOnly' }, 'Table rows, toolbars — must have an aria-label'],
              ['Both slots at once', { code: 'leading + trailing' }, 'Rare — only when both are true (e.g. Download ↓ … opens menu ▾). Never decorate both sides.'],
            ]}
          />
        </Stack>
      </Section>

      <Section
        title="In a table"
        note="xs is the smallest size that still looks like a button — good for table rows and toolbars. On a touch screen the tap area quietly grows to 44px, without making the row any taller."
      >
        <Preview
          canvas={
            <Table
              columns={[
                { key: 'device', header: 'Device' },
                { key: 'status', header: 'Status', render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
                { key: 'seen', header: 'Last seen', align: 'right' },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  render: () => (
                    <Inline gap={1} justify="end">
                      <Button variant="outline" tone="neutral" size="xs">Edit</Button>
                      <Button variant="ghost" tone="danger" size="xs" iconOnly aria-label="Remove">
                        <Icon as={Trash2} size="xs" />
                      </Button>
                    </Inline>
                  ),
                },
              ]}
              data={[
                { id: 1, device: 'WS-4471', status: 'Protected', tone: 'success', seen: '1m ago' },
                { id: 2, device: 'MBP-Ortega', status: 'Protected', tone: 'success', seen: '4m ago' },
                { id: 3, device: 'WS-2210', status: 'At risk', tone: 'warning', seen: '22m ago' },
                { id: 4, device: 'SRV-DC01', status: 'Offline', tone: 'danger', seen: '3h ago' },
              ]}
              zebra
            />
          }
        />
      </Section>

      <Section
        title="Call to action"
        note="xl is for one big marketing moment — a hero, a pricing page, a single call to action. Use one per screen; more than that and nothing feels big anymore."
      >
        <Preview
          canvas={
            <Surface padding={8} style={{ width: '100%' }}>
              <Stack gap={4} align="center">
                <Button size="xl">Start free trial</Button>
              </Stack>
            </Surface>
          }
        />
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '24rem' }}>
              <Button size="xl" fullWidth>Start free trial</Button>
            </div>
          }
        />
      </Section>

      <Section
        title="Status actions"
        note="A practical guide, not every combination — pick the pairing that matches what the action actually does."
      >
        <Stack gap={5}>
          <Stack gap={1}>
            <Preview canvas={<Button variant="solid" tone="primary">Save changes</Button>} />
            <Text variant="detail" tone="muted">Confirm / save — the default, loudest action on the screen.</Text>
          </Stack>

          <Stack gap={1}>
            <Preview
              canvas={
                <Inline gap={2}>
                  <Button variant="ghost" tone="neutral">Cancel</Button>
                  <Button variant="solid" tone="danger">Delete device</Button>
                </Inline>
              }
            />
            <Text variant="detail" tone="muted">Destructive — a solid danger button paired with a quiet neutral Cancel right next to it, never alone.</Text>
          </Stack>

          <Stack gap={1}>
            <Preview canvas={<Button variant="soft" tone="warning">Override policy</Button>} />
            <Text variant="detail" tone="muted">Risky but not destructive — a soft warning signals “think first,” without the alarm of solid danger.</Text>
          </Stack>

          <Stack gap={1}>
            <Preview canvas={<Button variant="soft" tone="success">Approved</Button>} />
            <Text variant="detail" tone="muted">Success confirmation — soft, not solid. Success is usually feedback after the fact, not an action someone clicks to cause.</Text>
          </Stack>
        </Stack>
      </Section>

      <Section
        title="Content & usage rules"
        note="A button’s label is the smallest, most-read copy in the product. Keep it a verb, keep it short."
      >
        <Stack gap={5}>
          <A11yList
            items={[
              <>Start with a verb (<IC>Save changes</IC>, not <IC>Changes</IC>).</>,
              <>Use sentence case.</>,
              <>Aim for ≤ 3 words.</>,
              <>Add “…” <strong>only</strong> when the button opens a dialog that needs more input.</>,
              <>Never put two solid buttons side by side.</>,
              <>One solid primary per view.</>,
            ]}
          />

          <DoDont
            doCaption="One solid primary + an outline neutral beside it."
            doExample={
              <>
                <Button>Save</Button>
                <Button variant="outline" tone="neutral">Cancel</Button>
              </>
            }
            dontCaption="Two solid primaries — nothing wins the eye."
            dontExample={
              <>
                <Button>Save</Button>
                <Button>Publish</Button>
              </>
            }
          />

          <DoDont
            doCaption="Solid danger to delete, quiet ghost neutral to back out."
            doExample={
              <>
                <Button variant="solid" tone="danger">Delete</Button>
                <Button variant="ghost" tone="neutral">Cancel</Button>
              </>
            }
            dontCaption="Solid danger next to solid primary — two loud choices fight."
            dontExample={
              <>
                <Button variant="solid" tone="danger">Delete</Button>
                <Button variant="solid" tone="primary">Save</Button>
              </>
            }
          />

          <DoDont
            doCaption="A leading icon that repeats the verb."
            doExample={<Button leading={<Icon as={Plus} size="sm" />}>Add customer</Button>}
            dontCaption="Icons on both sides as decoration — noise, not meaning."
            dontExample={
              <Button leading={<Icon as={Plus} size="sm" />} trailing={<Icon as={ChevronRight} size="sm" />}>
                Add customer
              </Button>
            }
          />

          <DoDont
            doCaption="Keep the label while loading — the width holds still."
            doExample={<Button loading>Saving…</Button>}
            dontCaption="Swap the label for a spinner only — the width jumps."
            dontExample={<Button loading iconOnly aria-label="Saving" />}
          />
        </Stack>
      </Section>

      <div id="button-tokens">
        <Section
          title="Tokens"
          note="Every look comes from a --vds-button-* variable on the .vds-button root, built from the foundation tokens. 'Live value' is what the browser shows right now. Set any of these on your own button to re-space or re-shape it — nothing else in the system moves."
        >
          <TokenSpecTable scope="vds-button" prefix="--vds-button-" groups={BUTTON_TOKEN_GROUPS} />

          <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.75rem' }}>
            Size is a typescale step, not a raw value: xs = <IC>micro</IC>, sm = <IC>detail</IC>, md = <IC>body</IC>, lg = <IC>body-lg</IC>, xl = <IC>subheading</IC>.
          </p>
          <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
            Action controls (buttons, checkboxes) use a hard outline ring — it reads clearly on any tone fill. Field controls (inputs, selects) use a softer shadow ring instead; the two are deliberately different recipes.
          </p>
          <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '1.25rem' }}>
            <strong>Tone &amp; variant colors</strong> aren’t their own token set — every fill, hover, and ink comes
            from the semantic <IC>--vds-primary</IC> / <IC>--vds-danger</IC> / <IC>--vds-success</IC> / … families,
            one per tone. See <a href="#/foundation/color-usage">Color usage →</a>.
          </p>
          <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '0.75rem' }}>
            <strong>Primary is the Vipre brand blue — <IC>#0068cb</IC></strong> (the cobalt ramp, same as the
            nav accent). A solid primary button fills with it in light mode; dark mode brightens it a step so it
            reads on the navy canvas. <IC>--vds-on-primary</IC> keeps the label AA-legible on top.
          </p>
        </Section>
      </div>

    </ComponentPage>
  )
}
