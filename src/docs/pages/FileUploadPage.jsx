import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, PropsTable, IC } from '../primitives.jsx'
import {
  FileUpload,
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

/* One group of the token table — a subheading over a 3-col PropsTable. */
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
        note="Every visual value is a --vds-fileupload-* custom property on the .vds-fileupload root, bound to foundation tokens only. Re-declare any of them on your own selector to retheme or re-space the zone; colors point at semantic tokens, so light/dark comes free."
      >
        <TokenGroup
          label="Color"
          rows={[
            [{ code: '--vds-fileupload-fill' }, { code: 'var(--vds-surface-sunken)' }, 'Resting background'],
            [{ code: '--vds-fileupload-fill-active' }, 'surface + primary 5%', 'Hover / drag-over background'],
            [{ code: '--vds-fileupload-border' }, { code: 'var(--vds-line-strong)' }, 'Resting dashed border'],
            [{ code: '--vds-fileupload-border-active' }, { code: 'var(--vds-primary)' }, 'Border on hover / drag / focus'],
            [{ code: '--vds-fileupload-ink' }, { code: 'var(--vds-ink)' }, 'Active label + file names'],
            [{ code: '--vds-fileupload-ink-muted' }, { code: 'var(--vds-ink-subtle)' }, 'Resting label'],
            [{ code: '--vds-fileupload-icon' }, { code: 'var(--vds-ink-subtle)' }, 'The upload glyph'],
            [{ code: '--vds-fileupload-ring' }, 'focus-ring @ ring-tint', 'Soft focus ring (field recipe)'],
          ]}
        />
        <TokenGroup
          label="Shape & spacing"
          rows={[
            [{ code: '--vds-fileupload-radius' }, { code: 'var(--vds-radius-md)' }, 'Corner radius'],
            [{ code: '--vds-fileupload-border-w' }, { code: 'var(--vds-border-w)' }, 'Border hairline width'],
            [{ code: '--vds-fileupload-gap' }, { code: 'var(--vds-space-2)' }, 'Icon ↔ label gap; zone ↔ list gap'],
            [{ code: '--vds-fileupload-pad-sm' }, { code: 'var(--vds-space-4)' }, 'Zone padding — sm'],
            [{ code: '--vds-fileupload-pad-md' }, { code: 'var(--vds-space-6)' }, 'Zone padding — md'],
            [{ code: '--vds-fileupload-pad-lg' }, { code: 'var(--vds-space-8)' }, 'Zone padding — lg'],
          ]}
        />
        <TokenGroup
          label="Motion"
          rows={[
            [{ code: '--vds-fileupload-dur' }, { code: 'var(--vds-dur-fast)' }, 'Border / background / ring transition speed'],
            [{ code: '--vds-fileupload-ease' }, { code: 'var(--vds-ease-out)' }, 'Easing curve (gated behind prefers-reduced-motion)'],
          ]}
        />
      </Section>

      <Section
        title="Reference implementation"
        note="How the demo on this page is built — reference only. The design system does not ship this markup or CSS; it ships the tokens above. Your team writes its own dropzone (its own classes, its own framework) and binds to the --vds-fileupload-* variables."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The reference build lives in the repo under <IC>src/components/FileUpload</IC>. Treat it as a worked
          example of the tokens — not something to install today. It's also the seed of a future
          <em> versioned, installable</em> package: when Vipre is ready, the same token contract makes that a
          drop-in, not a rewrite.
        </p>
      </Section>
    </ComponentPage>
  )
}
