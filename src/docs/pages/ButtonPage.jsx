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
      description="The primary interactive element. Four variants to match the weight of the action, three sizes, an opacity-based disabled state, and a visible keyboard focus ring. Forwards all native button props."
      installCode={`import { Button } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'primary' | 'secondary' | 'ghost' | 'danger'" }, { code: "'primary'" }, 'Visual weight of the action'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Control height + type step'],
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
        <>Disabled uses <IC>opacity</IC> + <IC>pointer-events: none</IC> — never a new gray.</>,
        <>Icon-only buttons must be given an <IC>aria-label</IC>.</>,
      ]}
    >
      <Section title="Variants" note="Four variants to match the weight of the action.">
        <Preview
          canvas={
            <>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </>
          }
          code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
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

      <Section title="Icon-only" note="Square buttons for a lone icon — ideal as low-emphasis row actions. Always pass an aria-label.">
        <Preview
          canvas={
            <Inline gap={1}>
              <Button variant="ghost" size="sm" iconOnly aria-label="View"><Icon as={Eye} size="sm" /></Button>
              <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><Icon as={Pencil} size="sm" /></Button>
              <Button variant="ghost" size="sm" iconOnly aria-label="Delete"><Icon as={Trash2} size="sm" /></Button>
              <Button variant="secondary" iconOnly aria-label="Edit"><Icon as={Pencil} size="sm" /></Button>
            </Inline>
          }
          code={`<Button variant="ghost" size="sm" iconOnly aria-label="Edit">
  <Icon as={Pencil} size="sm" />
</Button>`}
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
