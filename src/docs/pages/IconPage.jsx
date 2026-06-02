import { Shield, Monitor, Building2, Search, ChevronRight, Bell, TriangleAlert, CircleCheck } from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Icon } from '../../components/index.js'

const SIZES = ['xs', 'sm', 'md', 'lg']
const TONES = ['current', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger', 'info']

export function IconPage() {
  return (
    <ComponentPage
      title="Icon"
      description="A presentation wrapper that gives any SVG a consistent size and tone. It ships no icons of its own — pass a lucide-react icon (the prototype's icon set) via the `as` prop, or raw SVG as children. Color inherits from surrounding text unless a tone is set."
      installCode={`import { Icon } from 'vipre-design-system'\nimport { Shield } from 'lucide-react'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'as' }, { code: 'ComponentType' }, '—', 'Icon component to render (e.g. a lucide icon)'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg'" }, { code: "'md'" }, '14 / 16 / 20 / 24px'],
            [{ code: 'tone' }, { code: "'current' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'current'" }, 'Color; default inherits text color'],
            [{ code: 'label' }, { code: 'string' }, '—', 'Accessible name; omit for decorative icons'],
          ],
        },
      ]}
      accessibility={[
        <>With <IC>label</IC>, the icon is exposed as <IC>role="img"</IC> with that name.</>,
        <>Without <IC>label</IC> it is <IC>aria-hidden</IC> — correct for icons next to text.</>,
        <>Tone colors meet AA contrast on canvas/surface in both themes.</>,
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

      <Section title="In context" note="Icons inherit the surrounding text color by default — pair them with labels.">
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
