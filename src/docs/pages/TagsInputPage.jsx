import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, PropsTable, IC, Kbd } from '../primitives.jsx'
import {
  TagsInput,
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
        note="Every visual value is a --vds-tags-* custom property on the .vds-tags root, bound to foundation tokens only. The shell chrome mirrors Input's field recipe (neutral border + hover darken + soft focus ring on :focus-within); colors point at semantic tokens, so light/dark comes free."
      >
        <TokenGroup
          label="Shape & color"
          rows={[
            [{ code: '--vds-tags-radius' }, { code: 'var(--vds-radius-sm)' }, 'Corner radius'],
            [{ code: '--vds-tags-border-w' }, { code: 'var(--vds-border-w)' }, 'Border hairline width'],
            [{ code: '--vds-tags-fill' }, { code: 'var(--vds-surface-sunken)' }, 'Field background'],
            [{ code: '--vds-tags-border' }, { code: 'var(--vds-line-strong)' }, 'Resting border'],
            [{ code: '--vds-tags-border-hover' }, 'border + ink @ hover-mix', 'Border on hover'],
            [{ code: '--vds-tags-border-focus' }, { code: 'var(--vds-focus-ring)' }, 'Border on focus'],
            [{ code: '--vds-tags-ring' }, 'focus-ring @ ring-tint', 'Soft focus ring (field recipe)'],
            [{ code: '--vds-tags-ink-muted' }, { code: 'var(--vds-ink-subtle)' }, 'Placeholder text'],
          ]}
        />
        <TokenGroup
          label="Spacing & sizing"
          rows={[
            [{ code: '--vds-tags-gap' }, { code: 'var(--vds-space-1-5)' }, 'Chip ↔ chip / chip ↔ input gap'],
            [{ code: '--vds-tags-pad-y' }, { code: 'var(--vds-space-1)' }, 'Top / bottom padding'],
            [{ code: '--vds-tags-pad-x-sm' }, { code: 'var(--vds-space-2)' }, 'Left / right padding — sm'],
            [{ code: '--vds-tags-pad-x-md' }, { code: 'var(--vds-space-2-5)' }, 'Left / right padding — md'],
            [{ code: '--vds-tags-pad-x-lg' }, { code: 'var(--vds-space-3)' }, 'Left / right padding — lg'],
            [{ code: '--vds-tags-min-h-sm' }, { code: 'var(--vds-control-h-sm)' }, 'Minimum height — sm'],
            [{ code: '--vds-tags-min-h-md' }, { code: 'var(--vds-control-h-md)' }, 'Minimum height — md'],
            [{ code: '--vds-tags-min-h-lg' }, { code: 'var(--vds-control-h-lg)' }, 'Minimum height — lg'],
          ]}
        />
        <TokenGroup
          label="Motion"
          rows={[
            [{ code: '--vds-tags-dur' }, { code: 'var(--vds-dur-fast)' }, 'Border / ring transition speed'],
            [{ code: '--vds-tags-ease' }, { code: 'var(--vds-ease-out)' }, 'Easing curve (gated behind prefers-reduced-motion)'],
          ]}
        />
      </Section>

      <Section
        title="Reference implementation"
        note="How the demo on this page is built — reference only. The design system does not ship this markup or CSS; it ships the tokens above. Your team writes its own tags field (its own classes, its own framework) and binds to the --vds-tags-* variables."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The reference build lives in the repo under <IC>src/components/TagsInput</IC>. It composes the shipped
          <IC>Tag</IC> chip for each value. Treat it as a worked example of the tokens — not something to install
          today. It's also the seed of a future <em>versioned, installable</em> package: when Vipre is ready, the
          same token contract makes that a drop-in, not a rewrite.
        </p>
      </Section>
    </ComponentPage>
  )
}
