import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { ToggleChip, ToggleChipGroup } from '../../components/ToggleChip/index.js'
import { SegmentedControl } from '../../components/SegmentedControl/index.js'
import { Text } from '../../components/Text/index.js'
import { Stack } from '../../components/Stack/index.js'

const STATUS = [
  { value: 'active', label: 'Active', count: 186, dot: 'success' },
  { value: 'trial', label: 'Trial', count: 24, dot: 'warning' },
  { value: 'suspended', label: 'Suspended', count: 8, dot: 'danger' },
]

const PRODUCTS = [
  { value: 'ies', label: 'Email Security' },
  { value: 'safesend', label: 'SafeSend' },
  { value: 'edr', label: 'Endpoint EDR' },
  { value: 'sat', label: 'Awareness Training' },
  { value: 'dns', label: 'DNS Protection', disabled: true },
]

function OneChip() {
  const [on, setOn] = useState(false)
  return (
    <ToggleChip pressed={on} onChange={setOn}>
      Managed only
    </ToggleChip>
  )
}

function GroupDemo() {
  const [v, setV] = useState(['active'])
  return (
    <Stack gap={3}>
      <ToggleChipGroup aria-label="Status" options={STATUS} value={v} onChange={setV} />
      <Text variant="detail" tone="muted">
        {v.length ? `On: ${v.join(', ')}` : 'None picked — a filter that shows everything'}
      </Text>
    </Stack>
  )
}

function SingleDemo() {
  const [v, setV] = useState([])
  return (
    <Stack gap={3}>
      <ToggleChipGroup
        aria-label="Plan"
        single
        options={[
          { value: 'annual', label: 'Annual' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'prepaid', label: 'Prepaid' },
        ]}
        value={v}
        onChange={setV}
      />
      <Text variant="detail" tone="muted">
        {v.length ? `${v[0]} — click it again to clear` : 'Nothing picked'}
      </Text>
    </Stack>
  )
}

function VersusDemo() {
  const [view, setView] = useState('all')
  const [tags, setTags] = useState(['ies'])
  return (
    <Stack gap={5}>
      <Stack gap={2}>
        <Text variant="detail" tone="subtle">SegmentedControl — always exactly one</Text>
        <SegmentedControl
          aria-label="View"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: 'all', label: 'All' },
            { value: 'managed', label: 'Managed' },
            { value: 'unmanaged', label: 'Unmanaged' },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <Text variant="detail" tone="subtle">ToggleChipGroup — none, one, or several</Text>
        <ToggleChipGroup aria-label="Products" options={PRODUCTS} value={tags} onChange={setTags} />
      </Stack>
    </Stack>
  )
}

function SizesDemo() {
  const [a, setA] = useState(['x'])
  const [b, setB] = useState(['x'])
  const opts = [
    { value: 'x', label: 'Picked' },
    { value: 'y', label: 'Not picked' },
  ]
  return (
    <Stack gap={4}>
      <ToggleChipGroup aria-label="Medium" options={opts} value={a} onChange={setA} />
      <ToggleChipGroup aria-label="Small" size="sm" options={opts} value={b} onChange={setB} />
    </Stack>
  )
}

export function ToggleChipPage() {
  return (
    <ComponentPage
      title="ToggleChip"
      description="A chip that is on or off. Use it when the question is “which of these do you want?” and the answer may be none, one, or several — filters, tag pickers, category selectors. It is the multi-select counterpart to SegmentedControl and the stateful counterpart to Tag."
      installCode={`import { ToggleChip, ToggleChipGroup } from 'vipre-design-system'`}
      props={[
        {
          name: 'ToggleChip',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'pressed' }, { code: 'boolean' }, { code: 'false' }, 'On or off'],
            [{ code: 'onChange' }, { code: '(next, event) => void' }, '—', 'Called with the state it is moving to'],
            [{ code: 'count' }, { code: 'number' }, '—', 'A facet count after the label'],
            [{ code: 'dot' }, { code: "'success' | 'warning' | 'danger' | 'info' | 'neutral'" }, '—', 'Leading status dot (decorative)'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Matches the shared control heights'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Dimmed and unclickable'],
          ],
        },
        {
          name: 'ToggleChipGroup',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'options' }, { code: '{ value, label, count?, dot?, disabled? }[]' }, { code: '[]' }, 'The chips'],
            [{ code: 'value' }, { code: 'string[]' }, { code: '[]' }, 'Which ones are on'],
            [{ code: 'onChange' }, { code: '(nextValues) => void' }, '—', 'Called with the whole next array'],
            [{ code: 'single' }, { code: 'boolean' }, { code: 'false' }, 'At most one — clicking the live chip clears it'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Applied to every chip'],
            [{ code: 'aria-label' }, { code: 'string' }, '—', 'Names the group (it renders role="group")'],
          ],
        },
      ]}
      accessibility={[
        <>Each chip is a real <IC>{'<button>'}</IC> carrying <IC>aria-pressed</IC>, so its on/off state is announced and <IC>Tab</IC> reaches every one.</>,
        <><IC>aria-pressed</IC> is right here <em>because</em> several can be on. For a pick-exactly-one set use SegmentedControl — that one is radios, and radios are what "choose one of these" means to a screen reader.</>,
        <>The status dot is decorative (<IC>aria-hidden</IC>); the label always carries the meaning in words, so the chip never depends on colour alone.</>,
        <>On touch each chip grows to the <IC>--vds-tap-target</IC> minimum while staying compact for a mouse.</>,
        <>Disabled chips are <IC>opacity 0.5</IC> plus <IC>pointer-events: none</IC> — never a new grey.</>,
      ]}
    >
      <Section title="One chip" note="On its own it is a single on/off control — a lightweight alternative to a checkbox when the label is short and the control should sit inline.">
        <Preview canvas={<OneChip />} />
      </Section>

      <Section
        title="A group"
        note="The usual shape: hand it options and the picked values. Counts tell you what a pick is worth before you make it; the dot tones a status. Turning everything off is a legitimate state — it means “no filter”."
      >
        <Preview canvas={<GroupDemo />} />
      </Section>

      <Section
        title="Pick at most one"
        note="single narrows the group to one. This still differs from SegmentedControl: clicking the live chip clears it, so the group can sit empty. That is the whole reason an optional filter can’t be a segmented control."
      >
        <Preview canvas={<SingleDemo />} />
      </Section>

      <Section
        title="Against SegmentedControl"
        note="Side by side. The segmented control can never be empty — one segment is always lit — which makes it right for “which view am I in” and wrong for “which ones do I want”. Chips wrap and can all be off."
      >
        <Preview canvas={<VersusDemo />} />
      </Section>

      <Section title="Sizes" note="md matches the small control height; sm is for dense toolbars and inside filter panels.">
        <Preview canvas={<SizesDemo />} />
      </Section>
    </ComponentPage>
  )
}
