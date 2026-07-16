import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, PropsTable, IC, Kbd, TokenSpecTable } from '../primitives.jsx'
import {
  TagsInput,
  Text,
  Stack,
  Inline,
  Surface,
  Divider,
  SegmentedControl,
  Switch,
} from '../../components/index.js'

const SIZES = ['sm', 'md', 'lg']

/* Every public --vds-tags-* token — Token / Bound to / Live value / What it
   controls, grouped. Live values are read at render by the shared
   TokenSpecTable off a hidden .vds-tags probe. */
const TAGSINPUT_TOKEN_GROUPS = [
  {
    label: 'Shape & color',
    tokens: [
      { token: '--vds-tags-radius', bound: 'var(--vds-radius-sm)', controls: 'Corner radius' },
      { token: '--vds-tags-border-w', bound: 'var(--vds-border-w)', controls: 'Border hairline width' },
      { token: '--vds-tags-fill', bound: 'var(--vds-surface-sunken)', controls: 'Field background' },
      { token: '--vds-tags-border', bound: 'var(--vds-line-strong)', controls: 'Resting border' },
      { token: '--vds-tags-border-hover', bound: 'border + ink @ hover-mix', controls: 'Border on hover' },
      { token: '--vds-tags-border-focus', bound: 'var(--vds-focus-ring)', controls: 'Border on focus' },
      { token: '--vds-tags-ring', bound: 'focus-ring @ ring-tint', controls: 'Soft focus ring (field recipe)' },
      { token: '--vds-tags-ink-muted', bound: 'var(--vds-ink-subtle)', controls: 'Placeholder text' },
    ],
  },
  {
    label: 'Spacing & sizing',
    tokens: [
      { token: '--vds-tags-gap', bound: 'var(--vds-space-1-5)', controls: 'Chip ↔ chip / chip ↔ input gap' },
      { token: '--vds-tags-pad-y', bound: 'var(--vds-space-1)', controls: 'Top / bottom padding' },
      { token: '--vds-tags-pad-x-sm', bound: 'var(--vds-space-2)', controls: 'Left / right padding — sm' },
      { token: '--vds-tags-pad-x-md', bound: 'var(--vds-space-2-5)', controls: 'Left / right padding — md' },
      { token: '--vds-tags-pad-x-lg', bound: 'var(--vds-space-3)', controls: 'Left / right padding — lg' },
      { token: '--vds-tags-min-h-sm', bound: 'var(--vds-control-h-sm)', controls: 'Minimum height — sm' },
      { token: '--vds-tags-min-h-md', bound: 'var(--vds-control-h-md)', controls: 'Minimum height — md' },
      { token: '--vds-tags-min-h-lg', bound: 'var(--vds-control-h-lg)', controls: 'Minimum height — lg' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-tags-dur', bound: 'var(--vds-dur-fast)', controls: 'Border / ring transition speed' },
      { token: '--vds-tags-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve (gated behind prefers-reduced-motion)' },
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
  const [disabled, setDisabled] = useState(false)
  const [capped, setCapped] = useState(false)
  const [tags, setTags] = useState(['edr', 'siem'])

  return (
    <Inline gap={6} wrap align="start">
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <div style={{ width: '100%', maxWidth: '24rem', margin: '0 auto' }}>
            <TagsInput
              size={size}
              disabled={disabled}
              max={capped ? 4 : undefined}
              value={tags}
              onChange={setTags}
              aria-label="Device tags"
              placeholder="Type and press Enter…"
            />
          </div>
        </Surface>
        <Text as="span" variant="eyebrow" tone="muted">onChange gave us</Text>
        <Text variant="detail" tone="muted">{tags.length ? tags.join(', ') : 'No tags yet — type one and press Enter.'}</Text>
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
          <Switch checked={capped} onChange={(e) => setCapped(e.target.checked)}>Cap at 4 (max)</Switch>
          <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>Disabled</Switch>
        </Stack>
      </Surface>
    </Inline>
  )
}

export function TagsInputPage() {
  return (
    <ComponentPage
      title="Tags Input"
      description="A box for typing lots of little labels at once. Type a word and press Enter (or a comma) and it turns into a chip you can pop off with its ×. Press Backspace when the box is empty and it eats the last chip. It skips blanks and repeats, and you can cap how many are allowed or check each one before it's added. Clicking anywhere in the box jumps you to typing."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own tags field against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string[]' }, '—', 'The tags, if you control them yourself'],
            [{ code: 'defaultValue' }, { code: 'string[]' }, { code: '[]' }, 'Starting tags when uncontrolled'],
            [{ code: 'onChange' }, { code: '(string[]) => void' }, '—', 'Fires whenever a tag is added or removed'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Add a tag…'" }, 'Hint text in the empty input'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Field height and text size'],
            [{ code: 'max' }, { code: 'number' }, '—', 'Stop accepting new tags past this many'],
            [{ code: 'validate' }, { code: '(v: string) => boolean' }, '—', 'Reject a tag when this returns false'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Anything else, spread onto the root'],
          ],
        },
      ]}
      accessibility={[
        <>The shell is <IC>role="group"</IC> with an aria-label; clicking anywhere in it focuses the input.</>,
        <>Each chip's remove button is a real button labelled <IC>Remove {'{tag}'}</IC> (from Tag).</>,
        <>A polite live region announces every add and remove.</>,
        <>The whole shell shows the same soft focus ring as a text field on <IC>:focus-within</IC> — keyboard and pointer.</>,
      ]}
    >
      <Section
        title="Playground"
        note="Type a tag and press Enter or comma. Backspace on the empty input removes the last chip. Try the size, the max cap, and the disabled state."
      >
        <Playground />
      </Section>

      <Section
        title="Sizes"
        note="Three sizes matched to the field heights — an empty tags field is exactly as tall as an Input of the same size."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 420 }}>
              {SIZES.map((sz) => (
                <TagsInput key={sz} size={sz} defaultValue={['endpoint', 'edr']} aria-label={`Tags (${sz})`} />
              ))}
            </div>
          }
        />
      </Section>

      <Section
        title="Keyboard"
        note="The whole thing works from the keyboard."
      >
        <PropsTable
          headers={['Key', 'What it does']}
          rows={[
            [<><Kbd>Enter</Kbd> or <Kbd>,</Kbd></>, 'Commits the typed text as a new chip (trimmed; blanks and repeats skipped)'],
            ['Backspace', 'On an empty input, removes the last chip'],
            ['Type', 'Adds to the draft text; the input grows to fill the row'],
          ]}
        />
      </Section>

      <Section
        title="Tokens"
        note="Every look comes from a --vds-tags-* variable on the .vds-tags root, bound to foundation tokens only. Live value is what the browser shows right now. The box copies Input's field recipe (neutral border, darker on hover, soft focus ring on :focus-within); colors point at semantic tokens, so light/dark comes free."
      >
        <TokenSpecTable scope="vds-tags" prefix="--vds-tags-" groups={TAGSINPUT_TOKEN_GROUPS} />
      </Section>
    </ComponentPage>
  )
}
