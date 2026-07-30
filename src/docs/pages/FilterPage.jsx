import { useMemo, useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  Filter,
  FilterGroup,
  FilterPills,
  FilterCheckList,
  FilterChips,
  FilterCompare,
} from '../../components/Filter/index.js'
import { SegmentedControl } from '../../components/SegmentedControl/index.js'
import { Select } from '../../components/Select/index.js'
import { Slider } from '../../components/Slider/index.js'
import { Switch } from '../../components/Switch/index.js'
import { RadioGroup } from '../../components/RadioGroup/index.js'
import { Radio } from '../../components/Radio/index.js'
import { DatePicker } from '../../components/DatePicker/index.js'
import { Text } from '../../components/Text/index.js'
import { Table } from '../../components/Table/index.js'
import { Badge } from '../../components/Badge/index.js'

/* ---- shared fixtures -------------------------------------------------------- */

const TYPES = [
  { value: 'distributor', label: 'Distributor', count: 6 },
  { value: 'reseller', label: 'Reseller', count: 12 },
  { value: 'customer', label: 'Customer', count: 210 },
]

const STATUS = [
  { value: 'active', label: 'Active', count: 186, dot: 'success' },
  { value: 'trial', label: 'Trial', count: 24, dot: 'warning' },
  { value: 'suspended', label: 'Suspended', count: 8, dot: 'danger' },
]

const PRODUCTS = [
  { value: 'ies', label: 'Email Security (IES)', count: 142 },
  { value: 'safesend', label: 'SafeSend', count: 96 },
  { value: 'edr', label: 'Endpoint EDR', count: 88 },
  { value: 'sat', label: 'Security Awareness', count: 41 },
  { value: 'archive', label: 'Archive', count: 27 },
  { value: 'tep', label: 'Total Email Protection', count: 12 },
  { value: 'dns', label: 'DNS Protection', count: 0, disabled: true },
]

const ROWS = [
  { id: 1, name: 'Apex Networks', type: 'Distributor', status: 'Active', seats: 1240 },
  { id: 2, name: 'Sentinel Operations', type: 'Reseller', status: 'Trial', seats: 265 },
  { id: 3, name: 'Meridian Healthcare', type: 'Customer', status: 'Active', seats: 120 },
  { id: 4, name: 'IronGate Holdings', type: 'Distributor', status: 'Suspended', seats: 402 },
]

const TONE = { Active: 'success', Trial: 'warning', Suspended: 'danger' }

/* ---- 1. the everything panel ------------------------------------------------ */

function KitchenSink() {
  const [mgmt, setMgmt] = useState('all')
  const [types, setTypes] = useState(['reseller'])
  const [status, setStatus] = useState(['active'])
  const [billing, setBilling] = useState('')
  const [products, setProducts] = useState([])
  const [seats, setSeats] = useState(120)
  const [overdue, setOverdue] = useState(false)

  const active =
    (mgmt !== 'all' ? 1 : 0) +
    types.length +
    status.length +
    (billing ? 1 : 0) +
    products.length +
    (seats > 0 ? 1 : 0) +
    (overdue ? 1 : 0)

  const clear = () => {
    setMgmt('all'); setTypes([]); setStatus([]); setBilling('')
    setProducts([]); setSeats(0); setOverdue(false)
  }

  return (
    <Filter activeCount={active} resultCount={42} totalCount={228} onClearAll={clear}>
      <FilterGroup label="Management">
        <SegmentedControl
          aria-label="Management"
          value={mgmt}
          onChange={setMgmt}
          fullWidth
          size="sm"
          options={[
            { value: 'all', label: 'All' },
            { value: 'managed', label: 'Managed' },
            { value: 'unmanaged', label: 'Unmanaged' },
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Type" count={types.length}>
        <FilterCheckList options={TYPES} value={types} onChange={setTypes} />
      </FilterGroup>

      <FilterGroup label="Status" count={status.length}>
        <FilterPills options={STATUS} value={status} onChange={setStatus} />
      </FilterGroup>

      <FilterGroup label="Billing">
        <Select
          value={billing}
          onChange={setBilling}
          placeholder="Any billing type"
          size="sm"
          options={[
            { value: 'annual', label: 'Annual' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'prepaid', label: 'Prepaid' },
            { value: 'nfr', label: 'NFR' },
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Products" count={products.length} collapsible defaultOpen={false}>
        <FilterCheckList
          options={PRODUCTS}
          value={products}
          onChange={setProducts}
          searchable
          selectAll
          searchPlaceholder="Search products"
        />
      </FilterGroup>

      <FilterGroup label="Minimum seats">
        <Slider min={0} max={500} step={10} value={seats} onChange={setSeats} showValue size="sm" />
      </FilterGroup>

      <FilterGroup>
        <Switch checked={overdue} onChange={(e) => setOverdue(e.target.checked)}>
          Only overdue invoices
        </Switch>
      </FilterGroup>
    </Filter>
  )
}

/* ---- 2. each control on its own --------------------------------------------- */

function PillsDemo() {
  const [v, setV] = useState(['active'])
  return <FilterPills options={STATUS} value={v} onChange={setV} />
}

function PillsSingleDemo() {
  const [v, setV] = useState(['reseller'])
  return <FilterPills single options={TYPES} value={v} onChange={setV} />
}

function CheckListDemo() {
  const [v, setV] = useState(['ies'])
  return (
    <div style={{ width: '17rem' }}>
      <FilterCheckList options={PRODUCTS} value={v} onChange={setV} searchable selectAll />
    </div>
  )
}

function CompareDemo() {
  const [q, setQ] = useState({ op: 'gte', value: '250' })
  return (
    <div style={{ width: '17rem' }}>
      <FilterCompare op={q.op} value={q.value} onChange={setQ} unit="seats" />
    </div>
  )
}

function ChipsDemo() {
  const [items, setItems] = useState([
    { id: 'a', label: 'Type', value: 'Reseller' },
    { id: 'b', label: 'Status', value: 'Active' },
    { id: 'c', label: 'Seats', value: '≥ 250' },
    { id: 'd', value: 'Overdue only' },
  ])
  return (
    <FilterChips
      items={items}
      onRemove={(it) => setItems((p) => p.filter((x) => x.id !== it.id))}
      onClearAll={() => setItems([])}
    />
  )
}

/* ---- 3. commit models -------------------------------------------------------- */

function LiveDemo() {
  const [status, setStatus] = useState(['active'])
  const shown = status.length
    ? ROWS.filter((r) => status.includes(r.status.toLowerCase()))
    : ROWS
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <Filter
        activeCount={status.length}
        resultCount={shown.length}
        totalCount={ROWS.length}
        onClearAll={() => setStatus([])}
      >
        <FilterGroup label="Status" count={status.length}>
          <FilterPills options={STATUS} value={status} onChange={setStatus} />
        </FilterGroup>
      </Filter>
      <Text variant="detail" tone="muted">
        The table updates on every click — no Apply button.
      </Text>
    </div>
  )
}

function ApplyDemo() {
  const [draft, setDraft] = useState(['active'])
  const [applied, setApplied] = useState(['active'])
  const dirty = draft.join() !== applied.join()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <Filter
        activeCount={applied.length}
        resultCount={draft.length ? 2 : 4}
        totalCount={4}
        onClearAll={() => setDraft([])}
        onReset={() => setDraft(applied)}
        onApply={() => setApplied(draft)}
        applyLabel={dirty ? 'Apply changes' : 'Apply'}
      >
        <FilterGroup label="Status" count={draft.length}>
          <FilterPills options={STATUS} value={draft} onChange={setDraft} />
        </FilterGroup>
      </Filter>
      <Text variant="detail" tone="muted">
        Applied: {applied.length ? applied.join(', ') : 'none'}
        {dirty && ' — staged changes are waiting on Apply'}
      </Text>
    </div>
  )
}

/* ---- 4. in place, over a real table ------------------------------------------ */

function InContext() {
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])

  const chips = useMemo(
    () => [
      ...types.map((t) => ({ id: `t-${t}`, label: 'Type', value: TYPES.find((x) => x.value === t).label, kind: 'type', raw: t })),
      ...status.map((s) => ({ id: `s-${s}`, label: 'Status', value: STATUS.find((x) => x.value === s).label, kind: 'status', raw: s })),
    ],
    [types, status],
  )

  const rows = ROWS.filter(
    (r) =>
      (!types.length || types.includes(r.type.toLowerCase())) &&
      (!status.length || status.includes(r.status.toLowerCase())),
  )

  const remove = (chip) =>
    chip.kind === 'type'
      ? setTypes((p) => p.filter((x) => x !== chip.raw))
      : setStatus((p) => p.filter((x) => x !== chip.raw))

  const clear = () => { setTypes([]); setStatus([]) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Filter
          activeCount={chips.length}
          resultCount={rows.length}
          totalCount={ROWS.length}
          onClearAll={clear}
        >
          <FilterGroup label="Type" count={types.length}>
            <FilterCheckList options={TYPES} value={types} onChange={setTypes} />
          </FilterGroup>
          <FilterGroup label="Status" count={status.length}>
            <FilterPills options={STATUS} value={status} onChange={setStatus} />
          </FilterGroup>
        </Filter>
        <FilterChips items={chips} onRemove={remove} onClearAll={clear} />
      </div>
      <Table
        density="compact"
        data={rows}
        getRowKey={(r) => r.id}
        empty="No accounts match these filters"
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'type', header: 'Type' },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <Badge tone={TONE[r.status]} dot>{r.status}</Badge>,
          },
          {
            key: 'seats',
            header: 'Seats',
            align: 'right',
            render: (r) => r.seats.toLocaleString(),
          },
        ]}
      />
    </div>
  )
}

/* ---- 5. rail layout ---------------------------------------------------------- */

function RailDemo() {
  const [types, setTypes] = useState(['reseller'])
  const [status, setStatus] = useState([])
  const [seats, setSeats] = useState(0)
  return (
    <div
      style={{
        width: '16rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--vds-space-5)',
        padding: 'var(--vds-space-4)',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-lg)',
        background: 'var(--vds-surface)',
      }}
    >
      <FilterGroup label="Type" count={types.length}>
        <FilterCheckList options={TYPES} value={types} onChange={setTypes} />
      </FilterGroup>
      <FilterGroup label="Status" count={status.length}>
        <FilterPills options={STATUS} value={status} onChange={setStatus} />
      </FilterGroup>
      <FilterGroup label="Minimum seats">
        <Slider min={0} max={500} step={10} value={seats} onChange={setSeats} showValue size="sm" />
      </FilterGroup>
    </div>
  )
}

/* ---- 6. dates + one-of ------------------------------------------------------- */

function DateDemo() {
  const [preset, setPreset] = useState('30d')
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const active = preset === 'custom' ? (from || to ? 1 : 0) : preset === '30d' ? 0 : 1
  return (
    <Filter label="Created" activeCount={active} width="19rem">
      <FilterGroup label="Range">
        <RadioGroup value={preset} onChange={setPreset} aria-label="Date range">
          <Radio value="7d">Last 7 days</Radio>
          <Radio value="30d">Last 30 days</Radio>
          <Radio value="90d">Last 90 days</Radio>
          <Radio value="custom">Custom range</Radio>
        </RadioGroup>
      </FilterGroup>
      {preset === 'custom' && (
        <FilterGroup label="Between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vds-space-2)' }}>
            <DatePicker value={from} onChange={setFrom} size="sm" aria-label="From" />
            <Text as="span" variant="detail" tone="muted">to</Text>
            <DatePicker value={to} onChange={setTo} size="sm" aria-label="To" />
          </div>
        </FilterGroup>
      )}
    </Filter>
  )
}

export function FilterPage() {
  return (
    <ComponentPage
      title="Filter"
      description="The filter popover for a table or list — a button that says how many filters are on, a panel of controls, and a footer that says how many rows are left. It is a shell, not a fixed set of filters: you drop in whichever controls that table needs, so every filter in the product looks and behaves the same while asking different questions."
      installCode={`import {
  Filter, FilterGroup, FilterPills,
  FilterCheckList, FilterChips, FilterCompare,
} from 'vipre-design-system'`}
      props={[
        {
          name: 'Filter',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'label' }, { code: 'string' }, { code: "'Filter'" }, 'Trigger text, and the panel heading'],
            [{ code: 'activeCount' }, { code: 'number' }, { code: '0' }, 'How many filters are on — badge on the trigger'],
            [{ code: 'resultCount / totalCount' }, { code: 'number' }, '—', 'The footer’s "Showing X of Y"'],
            [{ code: 'onClearAll' }, { code: '() => void' }, '—', 'Header "Clear all" (hidden when nothing is on)'],
            [{ code: 'onReset' }, { code: '() => void' }, '—', 'Footer reset (falls back to onClearAll)'],
            [{ code: 'onApply' }, { code: '() => void' }, '—', 'Its PRESENCE switches to the apply model. Leave it out to filter live'],
            [{ code: 'width' }, { code: 'string' }, { code: "'20rem'" }, 'Panel width'],
            [{ code: 'placement' }, { code: 'Popover placement' }, { code: "'bottom-start'" }, 'Where the panel opens'],
            [{ code: 'trigger' }, { code: 'node' }, '—', 'Replace the built-in trigger button'],
            [{ code: 'footer' }, { code: 'node | null' }, '—', 'Replace the footer, or pass null to drop it'],
            [{ code: 'children' }, { code: 'node | ({ close }) => node' }, '—', 'The controls'],
          ],
        },
        {
          name: 'FilterGroup',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'label' }, { code: 'string' }, '—', 'Group heading'],
            [{ code: 'count' }, { code: 'number' }, { code: '0' }, 'Live picks in this group — a collapsed group still reports itself'],
            [{ code: 'hint' }, { code: 'string' }, '—', 'Small muted line under the label'],
            [{ code: 'collapsible' }, { code: 'boolean' }, { code: 'false' }, 'Render as a disclosure'],
            [{ code: 'defaultOpen' }, { code: 'boolean' }, { code: 'true' }, 'Starting state when collapsible'],
          ],
        },
        {
          name: 'FilterPills / FilterCheckList',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'options' }, { code: '{ value, label, count?, dot?, disabled? }[]' }, { code: '[]' }, 'dot tones the leading dot on a pill (success / warning / danger / info)'],
            [{ code: 'value' }, { code: 'string[]' }, { code: '[]' }, 'Picked values'],
            [{ code: 'onChange' }, { code: '(next) => void' }, '—', 'Called with the whole next array'],
            [{ code: 'single' }, { code: 'boolean' }, { code: 'false' }, 'Pills only — pick at most one'],
            [{ code: 'searchable' }, { code: 'boolean' }, { code: 'false' }, 'List only — filter the options'],
            [{ code: 'selectAll' }, { code: 'boolean' }, { code: 'false' }, 'List only — select-all / clear row'],
            [{ code: 'maxHeight' }, { code: 'string' }, { code: "'11rem'" }, 'List only — scroll past this height'],
          ],
        },
        {
          name: 'FilterChips / FilterCompare',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'items' }, { code: '{ id, label?, value }[]' }, { code: '[]' }, 'Chips — label names the field, value is the pick'],
            [{ code: 'onRemove' }, { code: '(item) => void' }, '—', 'Chips — the ✕ on each chip'],
            [{ code: 'op / value' }, { code: 'string' }, '—', 'Compare — the operator and the number'],
            [{ code: 'ops' }, { code: '{ value, label }[]' }, '≥ ≤ =', 'Compare — the operator set'],
            [{ code: 'unit' }, { code: 'string' }, '—', 'Compare — suffix inside the field'],
          ],
        },
      ]}
      accessibility={[
        <>The panel is a <IC>role="dialog"</IC> Popover: <IC>Escape</IC> closes it and hands focus back to the trigger, and clicking outside dismisses it.</>,
        <>Pills are real toggle buttons carrying <IC>aria-pressed</IC>, so a screen reader announces on/off. The status dot is decorative — the label always says the word.</>,
        <>The check list uses native checkboxes, so <IC>Tab</IC> and <IC>Space</IC> behave normally. A zero-count option is disabled rather than hidden, so the list never reshuffles under the pointer.</>,
        <>A collapsible group is a real disclosure — <IC>aria-expanded</IC> plus <IC>aria-controls</IC> — and its count stays visible while collapsed.</>,
        <>Every chip's ✕ has its own label ("Remove Type Reseller"), so the buttons aren't a row of identical "remove"s.</>,
        <>Counts use tabular figures so the numbers line up in a column instead of jittering.</>,
      ]}
    >
      <Section
        title="Everything at once"
        note="One panel using every control kind — segmented, check list, pills, dropdown, a searchable collapsible group, a slider, and a switch. This is the menu to pick from, not a recommendation: a real filter uses three or four of these, not all seven."
      >
        <Preview popover reserve={520} canvas={<KitchenSink />} />
      </Section>

      <Section
        title="Over a table"
        note="How it actually ships — the trigger sits in the toolbar, the applied filters show as chips beside it, and the table reacts. The chips matter: a filter you can't see from the table is a filter you forget you set."
      >
        <Preview popover reserve={420} canvas={<InContext />} />
      </Section>

      <Section
        title="Pills — pick several"
        note="The compact multi-select, for a handful of known values. This is the multi-select twin of SegmentedControl: that one picks exactly one and looks like a switch; these are independent on/off chips that wrap. Tone the dot when the values are statuses."
      >
        <Preview canvas={<PillsDemo />} />
      </Section>

      <Section
        title="Pills — pick one"
        note="Same control with single. Clicking the live pill clears it, so there's always a way back to 'no filter' — a segmented control can't do that, which is why it isn't the right choice for an optional filter."
      >
        <Preview canvas={<PillsSingleDemo />} />
      </Section>

      <Section
        title="Check list — facets with counts"
        note="The workhorse once there are more than a few options. The counts are the point: they tell you what a pick is worth before you make it. Add searchable past about eight options; add selectAll when picking most of them is normal. An option with zero rows is disabled, not hidden."
      >
        <Preview canvas={<CheckListDemo />} />
      </Section>

      <Section
        title="Number comparison"
        note="An operator next to a number. Reach for this instead of a slider when the field has no real ceiling — spend, seats, device count. A slider has to invent a maximum, and the invented one is always wrong for somebody."
      >
        <Preview canvas={<CompareDemo />} />
      </Section>

      <Section
        title="Applied chips"
        note="The summary bar that lives above the table, outside the popover. One chip per live filter, each removable on its own, with a clear-all once there's more than one."
      >
        <Preview canvas={<ChipsDemo />} />
      </Section>

      <Section
        title="Filter live"
        note="No onApply, so every click filters straight away and the footer count moves as you go. Right for client-side filtering, where showing the result is free."
      >
        <Preview popover reserve={300} canvas={<LiveDemo />} />
      </Section>

      <Section
        title="Stage, then apply"
        note="Pass onApply and the changes wait on the button — the panel closes when it lands. Right when filtering costs a request, or when a half-built filter would show something confusing. Reset drops back to what's applied rather than clearing everything."
      >
        <Preview popover reserve={300} canvas={<ApplyDemo />} />
      </Section>

      <Section
        title="Dates and one-of"
        note="Presets answer most date questions in one click; custom is there for the rest and only appears when it's asked for. Radios (not pills) because the ranges are mutually exclusive."
      >
        <Preview popover reserve={460} canvas={<DateDemo />} />
      </Section>

      <Section
        title="As a rail instead"
        note="The same groups outside a popover, in a left column. Worth it when filtering IS the task and people re-filter constantly — a browse or reporting screen. For an occasional filter on a dense table the popover wins, because the rail spends screen width all day for a control used once."
      >
        <Preview canvas={<RailDemo />} />
      </Section>
    </ComponentPage>
  )
}
