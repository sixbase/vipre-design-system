import { useMemo, useState } from 'react'
import { ShieldCheck, Mail, Globe, Database, Eye, Pencil, Trash2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Table, Badge, Button, Text, Icon, Inline, Stack } from '../../components/index.js'

/* Sample fleet rows — mirrors the kind of data Vipre tables actually carry. */
const DEVICES = [
  { id: 'd1', name: 'MBP-014', owner: 'A. Okafor', status: 'Protected', tone: 'success', seen: '2 min ago', risk: 4 },
  { id: 'd2', name: 'WIN-221', owner: 'J. Park', status: 'At risk', tone: 'warning', seen: '1 hr ago', risk: 62 },
  { id: 'd3', name: 'LNX-007', owner: 'M. Díaz', status: 'Threat', tone: 'danger', seen: '5 hr ago', risk: 91 },
  { id: 'd4', name: 'MBP-052', owner: 'R. Singh', status: 'Protected', tone: 'success', seen: 'just now', risk: 2 },
]

const STATUS_COL = {
  key: 'status',
  header: 'Status',
  render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge>,
}

/* Sample product catalog — each row leads with a product icon. */
const PRODUCTS = [
  { id: 'p1', name: 'Endpoint Defense', category: 'Security', icon: ShieldCheck, seats: 1284, status: 'Active', tone: 'success' },
  { id: 'p2', name: 'Mail Gateway', category: 'Email protection', icon: Mail, seats: 642, status: 'Active', tone: 'success' },
  { id: 'p3', name: 'DNS Filter', category: 'Network', icon: Globe, seats: 311, status: 'Trial', tone: 'warning' },
  { id: 'p4', name: 'Backup Vault', category: 'Storage', icon: Database, seats: 0, status: 'Inactive', tone: 'neutral' },
]

/* Leading product cell — composed entirely from existing DS primitives:
   Inline (row) + Icon (the product glyph) + Stack (name over category) + Text.
   No bespoke markup; reuse this shape in any first column. */
function ProductCell({ icon, name, category }) {
  return (
    <Inline gap={3}>
      <Icon as={icon} size="md" tone="muted" />
      <Stack gap={0}>
        <Text as="span" variant="body">{name}</Text>
        <Text as="span" variant="detail" tone="subtle">{category}</Text>
      </Stack>
    </Inline>
  )
}

/* Compact variant — one line: a smaller icon + name, no secondary text. Pairs
   with the table's density="compact" for log-dense screens. */
function ProductCellCompact({ icon, name }) {
  return (
    <Inline gap={2}>
      <Icon as={icon} size="sm" tone="muted" />
      <Text as="span" variant="caption">{name}</Text>
    </Inline>
  )
}

/* Responsive demo — drop the table into a width-constrained frame so it can be
   exercised at phone / tablet / full widths. The frame is also drag-resizable
   (resize: horizontal). The table keeps columns readable via minWidth and
   scrolls horizontally when the frame is narrower than that. */
const WIDTH_PRESETS = [
  { label: 'Mobile · 375', w: 375 },
  { label: 'Tablet · 768', w: 768 },
  { label: 'Full', w: null },
]

function ResponsiveDemo() {
  const [w, setW] = useState(375)
  return (
    <Stack gap={3}>
      <Inline gap={1}>
        {WIDTH_PRESETS.map((p) => (
          <Button
            key={p.label}
            size="sm"
            variant={w === p.w ? 'secondary' : 'ghost'}
            onClick={() => setW(p.w)}
          >
            {p.label}
          </Button>
        ))}
      </Inline>
      <div
        style={{
          width: w == null ? '100%' : w,
          maxWidth: '100%',
          resize: 'horizontal',
          overflow: 'hidden',
          padding: '0.5rem',
          border: '1px dashed var(--vds-line-strong)',
          borderRadius: 8,
        }}
      >
        <Table
          minWidth={640}
          columns={[
            { key: 'name', header: 'Device' },
            { key: 'owner', header: 'Owner' },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
            { key: 'seen', header: 'Last seen' },
            { key: 'risk', header: 'Risk', align: 'right', render: (r) => `${r.risk}%` },
          ]}
          data={DEVICES}
        />
      </div>
    </Stack>
  )
}

/* Row actions — a trailing column of icon-only ghost Buttons. Each action is a
   real Button (focusable, labelled); the icon is decorative. Right-align the
   column so the controls sit at the row's edge. */
function RowActions({ label, onView, onEdit, onDelete }) {
  return (
    <Inline gap={1} justify="end">
      <Button variant="ghost" size="sm" iconOnly aria-label={`View ${label}`} onClick={onView}>
        <Icon as={Eye} size="sm" />
      </Button>
      <Button variant="ghost" size="sm" iconOnly aria-label={`Edit ${label}`} onClick={onEdit}>
        <Icon as={Pencil} size="sm" />
      </Button>
      <Button variant="ghost" size="sm" iconOnly aria-label={`Delete ${label}`} onClick={onDelete}>
        <Icon as={Trash2} size="sm" />
      </Button>
    </Inline>
  )
}

/* ---- live sorting demo (sorting is controlled — the page owns the order) ---- */
function SortableDemo() {
  const [sort, setSort] = useState({ key: 'risk', direction: 'desc' })
  const data = useMemo(() => {
    const rows = [...DEVICES]
    rows.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sort.direction === 'asc' ? cmp : -cmp
    })
    return rows
  }, [sort])

  return (
    <Table
      columns={[
        { key: 'name', header: 'Device', sortable: true },
        { key: 'owner', header: 'Owner', sortable: true },
        STATUS_COL,
        { key: 'risk', header: 'Risk', align: 'right', sortable: true },
      ]}
      data={data}
      sort={sort}
      onSortChange={setSort}
    />
  )
}

/* ---- live selection demo (controlled selectedKeys) ---- */
function SelectableDemo() {
  const [selected, setSelected] = useState(['d2'])
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        {/* tabular-nums keeps every digit the same width, so "Clear" doesn't
            shift left/right as the count changes (1 is narrower than 4 otherwise). */}
        <Text variant="caption" tone="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {selected.length} selected
        </Text>
        <Button size="sm" variant="ghost" disabled={selected.length === 0} onClick={() => setSelected([])}>
          Clear
        </Button>
      </div>
      <Table
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        columns={[
          { key: 'name', header: 'Device' },
          { key: 'owner', header: 'Owner' },
          STATUS_COL,
        ]}
        data={DEVICES}
      />
    </div>
  )
}

export function TablePage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Table}
      title="Table"
      description="A data-driven table: declare your columns, hand it your data, and it renders the head and body — owning alignment, density, zebra striping, a sticky header, sortable headers, row selection, row-click drill-in, and loading / empty states. Composes Surface for the bordered, rounded shell."
      installCode={`import { Table } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'columns' }, { code: 'Column[]' }, '—', 'Column definitions (see below)'],
            [{ code: 'data' }, { code: 'object[]' }, '—', 'Row objects'],
            [{ code: 'getRowKey' }, { code: '(row, i) => key' }, { code: 'row.id ?? i' }, 'Stable key per row'],
            [{ code: 'density' }, { code: "'comfortable' | 'compact'" }, { code: 'comfortable' }, 'Cell padding rhythm'],
            [{ code: 'zebra' }, { code: 'boolean' }, { code: 'false' }, 'Striped rows'],
            [{ code: 'stickyHeader' }, { code: 'boolean' }, { code: 'false' }, 'Header stays put while the body scrolls'],
            [{ code: 'maxHeight' }, { code: 'string | number' }, '—', 'Enables a vertical scroll body (pair with stickyHeader)'],
            [{ code: 'sort' }, { code: '{ key, direction }' }, '—', 'Controlled sort indicator'],
            [{ code: 'onSortChange' }, { code: '(next) => void' }, '—', 'Fires when a sortable header is clicked'],
            [{ code: 'selectable' }, { code: 'boolean' }, { code: 'false' }, 'Show the selection column'],
            [{ code: 'selectedKeys' }, { code: 'array | Set' }, '—', 'Controlled selection'],
            [{ code: 'onSelectionChange' }, { code: '(keys[]) => void' }, '—', 'Fires when selection changes'],
            [{ code: 'onRowClick' }, { code: '(row, i) => void' }, '—', 'Makes rows interactive (hover + keyboard)'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Show skeleton rows'],
            [{ code: 'skeletonRows' }, { code: 'number' }, { code: '5' }, 'Skeleton row count while loading'],
            [{ code: 'empty' }, { code: 'ReactNode' }, { code: "'No data'" }, 'Shown when data is empty'],
            [{ code: 'caption' }, { code: 'ReactNode' }, '—', 'Visually-hidden accessible caption'],
            [{ code: '…props' }, { code: 'Surface props' }, '—', 'radius, elevation, bordered, raised, as…'],
          ],
        },
        {
          name: 'Column',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'key' }, { code: 'string' }, 'Row property to read, and the sort key'],
            [{ code: 'header' }, { code: 'ReactNode' }, 'Column label (defaults to the key)'],
            [{ code: 'align' }, { code: "'left' | 'center' | 'right'" }, "Cell alignment ('right' uses tabular numerics)"],
            [{ code: 'width' }, { code: 'string' }, 'Any CSS width (e.g. "120px", "20%")'],
            [{ code: 'render' }, { code: '(row, i) => node' }, 'Custom cell content (badges, links, actions…)'],
            [{ code: 'sortable' }, { code: 'boolean' }, 'Mark the header clickable'],
          ],
        },
      ]}
      accessibility={[
        <>Renders a real <IC>{'<table>'}</IC> with <IC>scope="col"</IC> headers, so screen readers announce row/column relationships.</>,
        <>Sortable headers are <IC>{'<button>'}</IC>s inside the <IC>{'<th>'}</IC> and set <IC>aria-sort</IC> to reflect the active direction.</>,
        <>Interactive rows (<IC>onRowClick</IC>) are keyboard-focusable and respond to <IC>Enter</IC> / <IC>Space</IC>.</>,
        <>The sort caret is decorative (<IC>aria-hidden</IC>) — direction is conveyed by <IC>aria-sort</IC>, not color alone.</>,
        <>Pass <IC>caption</IC> to give the table an accessible name; it is visually hidden but read by assistive tech.</>,
        <>A leading product icon is decorative — <IC>Icon</IC> is <IC>aria-hidden</IC> by default, so the meaning rides on the adjacent name text.</>,
      ]}
    >
      <Section title="Basic" note="Declare columns, pass data. A column's render() returns custom cell content.">
        <Preview
          canvas={
            <Table
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                STATUS_COL,
                { key: 'seen', header: 'Last seen', align: 'right' },
              ]}
              data={DEVICES}
            />
          }
          code={`<Table
  columns={[
    { key: 'name', header: 'Device' },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status',
      render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
    { key: 'seen', header: 'Last seen', align: 'right' },
  ]}
  data={devices}
/>`}
        />
      </Section>

      <Section
        title="Responsive"
        note="The table fills its container and follows it as it resizes. Pass minWidth to keep columns readable — below it the shell scrolls horizontally instead of crushing columns. Use the presets, drag the frame's bottom-right corner, or just resize the window to test."
      >
        <Preview
          canvas={<ResponsiveDemo />}
          code={`// minWidth keeps columns readable; the shell scrolls below it.
// No media queries needed — it reacts to its container, not the viewport.
<Table minWidth={640} columns={columns} data={devices} />`}
        />
      </Section>

      <Section
        title="Leading product cell"
        note="A common first-column pattern: a product icon + name (with an optional secondary line). Compose it in a column's render() from existing primitives — Inline, Icon, Stack, Text — no bespoke markup."
      >
        <Preview
          canvas={
            <Table
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCell icon={r.icon} name={r.name} category={r.category} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge>,
                },
              ]}
              data={PRODUCTS}
            />
          }
          code={`import { ShieldCheck } from '@icons'
import { Icon, Inline, Stack, Text } from 'vipre-design-system'

const columns = [
  {
    key: 'name',
    header: 'Product',
    render: (r) => (
      <Inline gap={3}>
        <Icon as={r.icon} size="md" tone="muted" />
        <Stack gap={0}>
          <Text as="span" variant="body">{r.name}</Text>
          <Text as="span" variant="detail" tone="subtle">{r.category}</Text>
        </Stack>
      </Inline>
    ),
  },
  // …more columns
]

<Table columns={columns} data={products} />`}
        />
      </Section>

      <Section
        title="Compact product cell"
        note="For dense screens: pair density=&quot;compact&quot; with a single-line cell — a smaller Icon + a caption-sized name, no secondary text."
      >
        <Preview
          canvas={
            <Table
              density="compact"
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCellCompact icon={r.icon} name={r.name} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge>,
                },
              ]}
              data={PRODUCTS}
            />
          }
          code={`<Table
  density="compact"
  columns={[
    {
      key: 'name',
      header: 'Product',
      render: (r) => (
        <Inline gap={2}>
          <Icon as={r.icon} size="sm" tone="muted" />
          <Text as="span" variant="caption">{r.name}</Text>
        </Inline>
      ),
    },
    // …more columns
  ]}
  data={products}
/>`}
        />
      </Section>

      <Section
        title="Row actions"
        note="Per-row actions are just a trailing column: render a right-aligned Inline of icon-only ghost Buttons. Each Button needs an aria-label since there's no visible text."
      >
        <Preview
          canvas={
            <Table
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCell icon={r.icon} name={r.name} category={r.category} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  width: '1%',
                  render: (r) => <RowActions label={r.name} />,
                },
              ]}
              data={PRODUCTS}
            />
          }
          code={`import { Eye, Pencil, Trash2 } from '@icons'
import { Button, Icon, Inline } from 'vipre-design-system'

const columns = [
  // …data columns
  {
    key: 'actions',
    header: '',
    align: 'right',
    width: '1%',          // shrink-to-fit so the controls hug the row edge
    render: (r) => (
      <Inline gap={1} justify="end">
        <Button variant="ghost" size="sm" iconOnly aria-label={\`View \${r.name}\`}>
          <Icon as={Eye} size="sm" />
        </Button>
        <Button variant="ghost" size="sm" iconOnly aria-label={\`Edit \${r.name}\`}>
          <Icon as={Pencil} size="sm" />
        </Button>
        <Button variant="ghost" size="sm" iconOnly aria-label={\`Delete \${r.name}\`}>
          <Icon as={Trash2} size="sm" />
        </Button>
      </Inline>
    ),
  },
]

<Table columns={columns} data={products} />`}
        />
      </Section>

      <Section title="Sortable" note="Sorting is controlled: the header sets the indicator and fires onSortChange; you order the data.">
        <Preview
          canvas={<SortableDemo />}
          code={`const [sort, setSort] = useState({ key: 'risk', direction: 'desc' })
const data = useMemo(() => sortRows(devices, sort), [sort])

<Table
  columns={[
    { key: 'name', header: 'Device', sortable: true },
    { key: 'risk', header: 'Risk', align: 'right', sortable: true },
  ]}
  data={data}
  sort={sort}
  onSortChange={setSort}
/>`}
        />
      </Section>

      <Section title="Selection" note="A checkbox column with a select-all header (indeterminate when partial). Controlled via selectedKeys.">
        <Preview
          canvas={<SelectableDemo />}
          code={`const [selected, setSelected] = useState([])

<Table
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  columns={columns}
  data={devices}
/>`}
        />
      </Section>

      <Section title="Compact + zebra" note="Denser rhythm for log-like data, with zebra striping for scanability.">
        <Preview
          canvas={
            <Table
              density="compact"
              zebra
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                STATUS_COL,
                { key: 'risk', header: 'Risk', align: 'right' },
              ]}
              data={DEVICES}
            />
          }
          code={`<Table density="compact" zebra columns={columns} data={devices} />`}
        />
      </Section>

      <Section title="Interactive rows" note="Pass onRowClick to make each row a focusable, clickable drill-in.">
        <Preview
          canvas={
            <Table
              onRowClick={(r) => window.alert(`Opening ${r.name}`)}
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                STATUS_COL,
              ]}
              data={DEVICES}
            />
          }
          code={`<Table onRowClick={(row) => open(row)} columns={columns} data={devices} />`}
        />
      </Section>

      <Section title="Loading + empty">
        <Preview
          canvas={
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Table
                loading
                skeletonRows={3}
                columns={[
                  { key: 'name', header: 'Device' },
                  { key: 'owner', header: 'Owner' },
                  { key: 'seen', header: 'Last seen', align: 'right' },
                ]}
                data={[]}
              />
              <Table
                columns={[
                  { key: 'name', header: 'Device' },
                  { key: 'owner', header: 'Owner' },
                  { key: 'seen', header: 'Last seen', align: 'right' },
                ]}
                data={[]}
                empty="No devices match your filters."
              />
            </div>
          }
          code={`<Table loading skeletonRows={3} columns={columns} data={[]} />
<Table columns={columns} data={[]} empty="No devices match your filters." />`}
        />
      </Section>
    </ComponentPage>
  )
}
