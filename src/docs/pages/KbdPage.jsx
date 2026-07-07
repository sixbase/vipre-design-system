import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Kbd } from '../../components/Kbd/index.js'
import { Text } from '../../components/Text/index.js'

export function KbdPage() {
  return (
    <ComponentPage
      title="Kbd"
      description="A tiny key cap for keyboard hints — 'Press ⌘K to search'. It renders a real <kbd> tag with a subtle raised-key look: light fill, hairline border, and a small shelf shadow along the bottom. Use it in menus, palette footers, tooltips, and docs."
      installCode={`import { Kbd } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Key cap height and text size'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The key text ("Esc", "⌘", "K")'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Passed to the <kbd> (title, aria-*, …)'],
          ],
        },
      ]}
      accessibility={[
        <>Renders a semantic <IC>&lt;kbd&gt;</IC> element, so the content reads as keyboard input.</>,
        <>Screen readers read the text as-is. Prefer real key names ("Esc", "Enter") over glyphs; if you must show a glyph like ↵, pair it with an <IC>aria-label</IC>.</>,
        <>It is text, not a control — it never takes focus and needs no keyboard handling.</>,
        <>Numerals are tabular, so "F5" and "F12" line up in a column of shortcuts.</>,
      ]}
    >
      <Section title="Basic" note="Drop it inline with text. One Kbd per key.">
        <Preview
          canvas={
            <Text tone="muted">
              Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, or <Kbd>Esc</Kbd> to close.
            </Text>
          }
          code={`Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, or <Kbd>Esc</Kbd> to close.`}
        />
      </Section>

      <Section title="Sizes" note="md for body text, sm for dense spots like menu rows and palette footers.">
        <Preview
          canvas={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vds-space-4)' }}>
              <Text tone="muted">
                md: <Kbd>Shift</Kbd> <Kbd>?</Kbd>
              </Text>
              <Text tone="muted">
                sm: <Kbd size="sm">Shift</Kbd> <Kbd size="sm">?</Kbd>
              </Text>
            </div>
          }
          code={`<Kbd>Shift</Kbd> <Kbd>?</Kbd>
<Kbd size="sm">Shift</Kbd> <Kbd size="sm">?</Kbd>`}
        />
      </Section>

      <Section title="Combos" note="Write the + or 'then' as plain text between the caps — don't put it inside a key.">
        <Preview
          canvas={
            <div style={{ display: 'grid', gap: 'var(--vds-space-2)' }}>
              <Text tone="muted">
                Save: <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
              </Text>
              <Text tone="muted">
                Go to devices: <Kbd>G</Kbd> then <Kbd>D</Kbd>
              </Text>
            </div>
          }
          code={`Save: <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
Go to devices: <Kbd>G</Kbd> then <Kbd>D</Kbd>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. No JS needed — it's just styled text."
      >
        <Code>{`Press <kbd class="vds-kbd vds-kbd--md">⌘</kbd> <kbd class="vds-kbd vds-kbd--md">K</kbd> to search

<!-- Small, e.g. in a command palette footer: -->
<kbd class="vds-kbd vds-kbd--sm">esc</kbd>`}</Code>
      </Section>
    </ComponentPage>
  )
}
