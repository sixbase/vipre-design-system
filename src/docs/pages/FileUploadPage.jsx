import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC, TokenSpecTable } from '../primitives.jsx'
import {
  FileUpload,
  Text,
  Stack,
  Inline,
  Surface,
  Divider,
  SegmentedControl,
  Switch,
} from '../../components/index.js'

const SIZES = ['sm', 'md', 'lg']

/* The one token spec — Token / Bound to / What it controls, grouped. Live
   values are read at render by the shared TokenSpecTable off a .vds-fileupload
   probe. Only tokens actually declared in FileUpload.scss are documented. */
const FILEUPLOAD_TOKEN_GROUPS = [
  {
    label: 'Color',
    tokens: [
      { token: '--vds-fileupload-fill', bound: 'var(--vds-surface-sunken)', controls: 'Resting background' },
      { token: '--vds-fileupload-fill-active', bound: 'surface + primary 5%', controls: 'Hover / drag-over background' },
      { token: '--vds-fileupload-border', bound: 'var(--vds-line-strong)', controls: 'Resting dashed border' },
      { token: '--vds-fileupload-border-active', bound: 'var(--vds-primary)', controls: 'Border on hover / drag / focus' },
      { token: '--vds-fileupload-ink', bound: 'var(--vds-ink)', controls: 'Active label + file names' },
      { token: '--vds-fileupload-ink-muted', bound: 'var(--vds-ink-subtle)', controls: 'Resting label' },
      { token: '--vds-fileupload-icon', bound: 'var(--vds-ink-subtle)', controls: 'The upload glyph' },
      { token: '--vds-fileupload-ring', bound: 'focus-ring @ ring-tint', controls: 'Soft focus ring (field recipe)' },
    ],
  },
  {
    label: 'Shape & spacing',
    tokens: [
      { token: '--vds-fileupload-radius', bound: 'var(--vds-radius-md)', controls: 'Corner radius' },
      { token: '--vds-fileupload-border-w', bound: 'var(--vds-border-w)', controls: 'Border hairline width' },
      { token: '--vds-fileupload-gap', bound: 'var(--vds-space-2)', controls: 'Icon ↔ label gap; zone ↔ list gap' },
      { token: '--vds-fileupload-pad-sm', bound: 'var(--vds-space-4)', controls: 'Zone padding — sm' },
      { token: '--vds-fileupload-pad-md', bound: 'var(--vds-space-6)', controls: 'Zone padding — md' },
      { token: '--vds-fileupload-pad-lg', bound: 'var(--vds-space-8)', controls: 'Zone padding — lg' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-fileupload-dur', bound: 'var(--vds-dur-fast)', controls: 'Border / background / ring transition speed' },
      { token: '--vds-fileupload-ease', bound: 'var(--vds-ease-out)', controls: 'Easing curve (gated behind prefers-reduced-motion)' },
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
  const [multiple, setMultiple] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [names, setNames] = useState([])

  return (
    <Inline gap={6} wrap align="start">
      <Stack gap={3} style={{ flex: '1 1 22rem', minWidth: 0 }}>
        <Surface bordered elevation="flat" padding={8}>
          <div style={{ width: '100%', maxWidth: '24rem', margin: '0 auto' }}>
            <FileUpload
              size={size}
              multiple={multiple}
              disabled={disabled}
              onFiles={(files) => setNames(files.map((f) => f.name))}
            />
          </div>
        </Surface>
        <Text as="span" variant="eyebrow" tone="muted">onFiles gave us</Text>
        <Text variant="detail" tone="muted">
          {names.length ? names.join(', ') : 'Nothing yet — drop or browse a file. (This demo only reads the names; it never uploads.)'}
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
          <Switch checked={multiple} onChange={(e) => setMultiple(e.target.checked)}>Multiple</Switch>
          <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>Disabled</Switch>
        </Stack>
      </Surface>
    </Inline>
  )
}

export function FileUploadPage() {
  return (
    <ComponentPage
      title="File Upload"
      description="A box you drop files onto — or click to pick them the normal way. It has a dashed edge that lights up blue when you drag a file over it. Picked files show up in a little list underneath, each with an × to take it back off. It never sends anything anywhere on its own; it just hands your app the files you chose. Comes in three sizes."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own dropzone against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'onFiles' }, { code: '(File[]) => void' }, '—', 'Called with the picked files — on drop AND on browse'],
            [{ code: 'accept' }, { code: 'string' }, '—', 'Which file types to allow (e.g. image/*,.pdf)'],
            [{ code: 'multiple' }, { code: 'boolean' }, { code: 'false' }, 'Let people pick more than one file'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'How much breathing room the drop area has'],
            [{ code: 'label' }, { code: 'string' }, { code: "'Drag files here or browse'" }, 'The prompt text inside the zone'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Anything else, spread onto the root'],
          ],
        },
      ]}
      accessibility={[
        <>The drop area is a real <IC>{'<button>'}</IC> — reachable with <IC>Tab</IC> and openable with <IC>Enter</IC> or <IC>Space</IC>, not just a mouse.</>,
        <>A polite live region announces how many files are selected, so screen-reader users hear the change.</>,
        <>Every remove button is a real button labelled <IC>Remove {'{name}'}</IC>.</>,
        <>Focus shows the same soft ring as a text field; on touch the remove buttons grow to a 44px tap target.</>,
      ]}
    >
      <Section
        title="Playground"
        note="Drop a file on the box or click to browse. Turn the knobs to see the sizes and states. The names below are all the demo keeps — nothing is uploaded."
      >
        <Playground />
      </Section>

      <Section
        title="Sizes"
        note="Three sizes — sm for tight forms, lg when the dropzone is the main event. The label and padding grow with the size."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 420 }}>
              {SIZES.map((sz) => (
                <FileUpload key={sz} size={sz} onFiles={() => {}} />
              ))}
            </div>
          }
        />
      </Section>

      <Section
        title="Tokens"
        note="Every look comes from a --vds-fileupload-* variable on the .vds-fileupload root, bound to foundation tokens only. Live value is what the browser shows right now. Re-set any of them on your own selector to restyle or re-space the zone; colors point at semantic tokens, so light/dark comes free."
      >
        <TokenSpecTable scope="vds-fileupload" prefix="--vds-fileupload-" groups={FILEUPLOAD_TOKEN_GROUPS} />
      </Section>
    </ComponentPage>
  )
}
