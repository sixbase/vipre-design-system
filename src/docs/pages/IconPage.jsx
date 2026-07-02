import { Shield, Monitor, Building2, Search, ChevronRight, Bell, TriangleAlert, CircleCheck } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Icon } from '../../components/index.js'

const SIZES = ['xs', 'sm', 'md', 'lg']
const TONES = ['current', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger', 'info']

export function IconPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Icon}
      title="Icon"
      description="A wrapper that gives any SVG the same size and color rules. It comes with no icons of its own — pass a lucide-react icon (the prototype's icon set) through the `as` prop, or plain SVG as children. The icon takes the color of the text around it unless you set a tone."
      installCode={`import { Icon } from 'vipre-design-system'\nimport { Shield } from '@icons'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'as' }, { code: 'ComponentType' }, '—', 'The icon to show (e.g. a lucide icon)'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg'" }, { code: "'md'" }, '14 / 16 / 20 / 24px'],
            [{ code: 'tone' }, { code: "'current' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'current'" }, 'Color; by default matches the text color'],
            [{ code: 'label' }, { code: 'string' }, '—', 'A name screen readers can read; leave it off for decoration-only icons'],
          ],
        },
      ]}
      accessibility={[
        <>With a <IC>label</IC>, the icon shows up as <IC>role="img"</IC> with that name for screen readers.</>,
        <>Without a <IC>label</IC> it is <IC>aria-hidden</IC> — the right choice for icons sitting next to text.</>,
        <>Tone colors stay easy to read (AA contrast) on canvas and surface in both light and dark.</>,
      ]}
    >
      <Section title="Sizes">
        <Preview
          canvas={SIZES.map((s) => <Icon key={s} as={Shield} size={s} />)}
          code={`<Icon as={Shield} size="xs" />\n<Icon as={Shield} size="sm" />\n<Icon as={Shield} size="md" />\n<Icon as={Shield} size="lg" />`}
        />
      </Section>

      <Section title="Tones">
        <Preview
          canvas={TONES.map((t) => <Icon key={t} as={CircleCheck} tone={t} label={t} />)}
          code={`<Icon as={CircleCheck} tone="primary" />\n<Icon as={CircleCheck} tone="success" />\n<Icon as={CircleCheck} tone="danger" />`}
        />
      </Section>

      <Section title="In context" note="By default icons take the color of the text next to them — always pair them with a label.">
        <Preview
          canvas={
            <>
              <Icon as={Building2} tone="muted" />
              <Icon as={Monitor} tone="muted" />
              <Icon as={Bell} tone="primary" />
              <Icon as={TriangleAlert} tone="warning" />
              <Icon as={Search} tone="subtle" />
              <Icon as={ChevronRight} tone="subtle" />
            </>
          }
          code={`<Icon as={Bell} tone="primary" />\n<Icon as={TriangleAlert} tone="warning" />`}
        />
      </Section>
    </ComponentPage>
  )
}
