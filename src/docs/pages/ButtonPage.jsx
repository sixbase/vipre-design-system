import { Eye, Pencil, Trash2 } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Kbd, IC } from '../primitives.jsx'
import { Button, Icon, Inline } from '../../components/index.js'

export function ButtonPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Button}
      title="Button"
      description="The primary interactive element. Styling splits across two axes — variant (emphasis: solid · soft · outline · ghost) and tone (intent: primary · neutral · success · warning · danger · info) — so any weight pairs with any intent. Three sizes, a built-in loading state, an opacity-based disabled state, and a visible keyboard focus ring. Forwards all native button props."
      installCode={`import { Button } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'solid' | 'soft' | 'outline' | 'ghost'" }, { code: "'solid'" }, 'Visual emphasis of the action'],
            [{ code: 'tone' }, { code: "'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'primary'" }, 'Intent / color of the action'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Control height + type step'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Show a spinner, set aria-busy, and block interaction'],
            [{ code: 'fullWidth' }, { code: 'boolean' }, { code: 'false' }, 'Stretch to fill the container'],
            [{ code: 'iconOnly' }, { code: 'boolean' }, { code: 'false' }, 'Square the button for a lone icon (needs aria-label)'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Disables interaction (opacity 0.5)'],
            [{ code: 'type' }, { code: "'button' | 'submit'" }, { code: "'button'" }, 'Native button type'],
            [{ code: '…props' }, { code: 'ButtonHTMLAttributes' }, '—', 'onClick, aria-*, etc. spread to <button>'],
          ],
        },
      ]}
      accessibility={[
        <>Keyboard: <Kbd>Enter</Kbd> and <Kbd>Space</Kbd> activate the button.</>,
        <>Focus ring uses <IC>--vds-focus-ring</IC> and shows only for keyboard nav (<IC>:focus-visible</IC>).</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC> and disables the control so the action can't be re-fired.</>,
        <>Disabled uses <IC>opacity</IC> + <IC>pointer-events: none</IC> — never a new gray.</>,
        <>Icon-only buttons must be given an <IC>aria-label</IC>.</>,
      ]}
    >
      <Section title="Variants" note="Four levels of emphasis, from a solid fill down to a transparent ghost.">
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

      <Section title="Tones" note="Intent color, independent of emphasis. Any tone pairs with any variant — shown here as soft fills.">
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

      <Section title="Loading" note="Swaps in a Spinner, sets aria-busy, and blocks clicks. Keep the label so width stays stable.">
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

      <Section title="Icon-only" note="Square buttons for a lone icon — ideal as low-emphasis row actions. Always pass an aria-label.">
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

      <Section title="Full width" note="Stretches to fill its container — common in forms, modals, and narrow side panels.">
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
