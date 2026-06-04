import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Select } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 280 }
const OPTS = (
  <>
    <option value="active">Active</option>
    <option value="trial">Trial</option>
    <option value="suspended">Suspended</option>
  </>
)

export function SelectPage() {
  return (
    <ComponentPage
      title="Select"
      description="A native dropdown styled to match Input — same sizes, neutral-graphite chrome, recessed fill, and a chevron affix. Uses the platform picker, so it's reliable on every device."
      installCode={`import { Select } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Control height (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Danger border + aria-invalid'],
            [{ code: 'children' }, { code: '<option>…' }, '—', 'Native option elements'],
            [{ code: '…props' }, { code: 'SelectHTMLAttributes' }, '—', 'value, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Native <IC>{'<select>'}</IC> — full keyboard and platform picker. Pair with a <IC>{'<label>'}</IC>.</>,
        <>The chevron is <IC>aria-hidden</IC>; <IC>invalid</IC> sets <IC>aria-invalid</IC>.</>,
      ]}
    >
      <Section title="Sizes">
        <Preview
          canvas={
            <div style={COL}>
              <Select size="sm" defaultValue="active">{OPTS}</Select>
              <Select size="md" defaultValue="active">{OPTS}</Select>
              <Select size="lg" defaultValue="active">{OPTS}</Select>
            </div>
          }
          code={`<Select size="sm" defaultValue="active">
  <option value="active">Active</option>
  <option value="suspended">Suspended</option>
</Select>`}
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Select invalid defaultValue="active" aria-label="Status">{OPTS}</Select>
              <Select disabled defaultValue="active" aria-label="Status">{OPTS}</Select>
            </div>
          }
          code={`<Select invalid>…</Select>
<Select disabled>…</Select>`}
        />
      </Section>
    </ComponentPage>
  )
}
