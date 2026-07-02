import { Eye, Pencil, Trash2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Kbd, IC } from '../primitives.jsx'
import { Button, Icon, Inline } from '../../components/index.js'

export function ButtonPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Button}
      title="Button"
      description="A button people click. Two choices: variant is how loud it looks (solid, soft, outline, ghost) and tone is its job and color (primary, neutral, success, warning, danger, info). Any look works with any color. Three sizes, a spinner for loading, a faded look when off, and a ring you can see when you tab to it. Passes through all normal button props."
      installCode={`import { Button } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'solid' | 'soft' | 'outline' | 'ghost'" }, { code: "'solid'" }, 'How loud the button looks'],
            [{ code: 'tone' }, { code: "'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'primary'" }, 'The button’s job and color'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'How tall the button is and its text size'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Show a spinner and stop clicks while it works'],
            [{ code: 'fullWidth' }, { code: 'boolean' }, { code: 'false' }, 'Stretch to fill the space it sits in'],
            [{ code: 'iconOnly' }, { code: 'boolean' }, { code: 'false' }, 'Make it a square for a single icon (needs aria-label)'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'type' }, { code: "'button' | 'submit'" }, { code: "'button'" }, 'The normal button type'],
            [{ code: '…props' }, { code: 'ButtonHTMLAttributes' }, '—', 'onClick, aria-*, and more, passed to <button>'],
          ],
        },
      ]}
      accessibility={[
        <>Keyboard: <Kbd>Enter</Kbd> and <Kbd>Space</Kbd> activate the button.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> and only shows when you tab to it (<IC>:focus-visible</IC>).</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC> and turns the button off so it can’t be clicked twice.</>,
        <>Disabled uses <IC>opacity</IC> + <IC>pointer-events: none</IC> — never a new gray.</>,
        <>Icon-only buttons must have an <IC>aria-label</IC> so screen readers know what they do.</>,
      ]}
    >
      <Section title="Variants" note="Four levels of loudness, from a solid fill down to a see-through ghost.">
        <Preview
          canvas={
            <>
              <Button variant="solid">Solid</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </>
          }
          code={`<Button variant="solid">Solid</Button>
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`}
        />
      </Section>

      <Section title="Tones" note="The color for the button’s job. Any tone works with any look — shown here as soft fills.">
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
          code={`<Button variant="soft" tone="success">Approve</Button>
<Button variant="solid" tone="danger">Delete</Button>
<Button variant="outline" tone="warning">Review</Button>`}
        />
      </Section>

      <Section title="Sizes">
        <Preview
          canvas={
            <>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </>
          }
          code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>   {/* default */}
<Button size="lg">Large</Button>`}
        />
      </Section>

      <Section title="Loading" note="Shows a spinner, sets aria-busy, and blocks clicks. Keep the label so the width doesn’t jump.">
        <Preview
          canvas={
            <>
              <Button loading>Saving…</Button>
              <Button variant="soft" tone="success" loading>Approving…</Button>
              <Button variant="outline" loading>Loading</Button>
            </>
          }
          code={`<Button loading>Saving…</Button>
<Button variant="soft" tone="success" loading>Approving…</Button>`}
        />
      </Section>

      <Section title="Icon-only" note="Square buttons for a single icon — great as quiet actions in table rows. Always pass an aria-label.">
        <Preview
          canvas={
            <Inline gap={1}>
              <Button variant="ghost" size="sm" iconOnly aria-label="View"><Icon as={Eye} size="sm" /></Button>
              <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><Icon as={Pencil} size="sm" /></Button>
              <Button variant="ghost" tone="danger" size="sm" iconOnly aria-label="Delete"><Icon as={Trash2} size="sm" /></Button>
              <Button variant="outline" tone="neutral" iconOnly aria-label="Edit"><Icon as={Pencil} size="sm" /></Button>
            </Inline>
          }
          code={`<Button variant="ghost" size="sm" iconOnly aria-label="Edit">
  <Icon as={Pencil} size="sm" />
</Button>`}
        />
      </Section>

      <Section title="Full width" note="Stretches to fill the space around it — handy in forms, pop-ups, and skinny side panels.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '20rem' }}>
              <Button fullWidth>Continue</Button>
            </div>
          }
          code={`<Button fullWidth>Continue</Button>`}
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <>
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
            </>
          }
          code={`<Button>Default</Button>
<Button disabled>Disabled</Button>`}
        />
      </Section>
    </ComponentPage>
  )
}
