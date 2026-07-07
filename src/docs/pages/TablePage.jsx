import { useMemo, useState } from 'react'
import { ShieldCheck, Mail, Globe, Database, Eye, Pencil, Trash2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Table, Badge, Button, Text, Icon, Inline, Stack } from '../../components/index.js'

/* Sample fleet rows — mirrors the kind of data Vipre tables actually carry. */
const DEVICES = [
  { id: 'd1', name: 'MBP-014', owner: 'A. Okafor', status: 'Protected', tone: 'success', seen: '2 min ago', risk: 4, os: 'macOS 14', ip: '10.0.4.21' },
  { id: 'd2', name: 'WIN-221', owner: 'J. Park', status: 'At risk', tone: 'warning', seen: '1 hr ago', risk: 62, os: 'Windows 11', ip: '10.0.7.88' },
  { id: 'd3', name: 'LNX-007', owner: 'M. Díaz', status: 'Threat', tone: 'danger', seen: '5 hr ago', risk: 91, os: 'Ubuntu 22', ip: '10.0.2.13' },
  { id: 'd4', name: 'MBP-052', owner: 'R. Singh', status: 'Protected', tone: 'success', seen: 'just now', risk: 2, os: 'macOS 14', ip: '10.0.4.57' },
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
      description="A table that builds itself. You tell it your columns and hand it your data, and it draws the whole thing. It handles alignment, row height, striped rows, a header that stays put, sortable columns, row picking, clicking a row to open it, and loading and empty states. The rounded, bordered box comes from Surface."
      installCode={`import { Table } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'columns' }, { code: 'Column[]' }, '—', 'What each column is (see below)'],
            [{ code: 'data' }, { code: 'object[]' }, '—', 'One object per row'],
            [{ code: 'getRowKey' }, { code: '(row, i) => key' }, { code: 'row.id ?? i' }, 'Gives each row a steady id'],
            [{ code: 'density' }, { code: "'comfortable' | 'compact'" }, { code: 'comfortable' }, 'How tall the rows are'],
            [{ code: 'zebra' }, { code: 'boolean' }, { code: 'false' }, 'Shades every other row'],
            [{ code: 'stickyHeader' }, { code: 'boolean' }, { code: 'false' }, 'Keeps the header in place while the rows scroll'],
            [{ code: 'maxHeight' }, { code: 'string | number' }, '—', 'Caps the height so the rows scroll (use with stickyHeader)'],
            [{ code: 'sort' }, { code: '{ key, direction }' }, '—', 'Which column is sorted, and which way'],
            [{ code: 'onSortChange' }, { code: '(next) => void' }, '—', 'Runs when someone clicks a sortable header'],
            [{ code: 'selectable' }, { code: 'boolean' }, { code: 'false' }, 'Adds a checkbox column'],
            [{ code: 'selectedKeys' }, { code: 'array | Set' }, '—', 'Which rows are checked'],
            [{ code: 'onSelectionChange' }, { code: '(keys[]) => void' }, '—', 'Runs when the checked rows change'],
            [{ code: 'onRowClick' }, { code: '(row, i) => void' }, '—', 'Makes rows clickable (with hover + keyboard)'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Shows placeholder rows'],
            [{ code: 'skeletonRows' }, { code: 'number' }, { code: '5' }, 'How many placeholder rows to show while loading'],
            [{ code: 'empty' }, { code: 'ReactNode' }, { code: "'No data'" }, 'What to show when there are no rows'],
            [{ code: 'caption' }, { code: 'ReactNode' }, '—', 'A hidden name for screen readers'],
            [{ code: 'responsive' }, { code: 'boolean' }, { code: 'false' }, 'In a narrow spot (under ~640px of container width) each row turns into a small card: every cell shows its column name next to its value. Column names come from string headers. Note: sortable headers are hidden in card mode.'],
            [{ code: '…props' }, { code: 'Surface props' }, '—', 'radius, elevation, bordered, raised, as…'],
          ],
        },
        {
          name: 'Column',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'key' }, { code: 'string' }, 'Which field to read from the row, and what to sort by'],
            [{ code: 'header' }, { code: 'ReactNode' }, 'The column title (uses the key if you skip it)'],
            [{ code: 'align' }, { code: "'left' | 'center' | 'right'" }, "Which side the cell sits on ('right' lines up numbers neatly)"],
            [{ code: 'width' }, { code: 'string' }, 'Any CSS width (e.g. "120px", "20%")'],
            [{ code: 'render' }, { code: '(row, i) => node' }, 'Your own cell content (badges, links, actions…)'],
            [{ code: 'sortable' }, { code: 'boolean' }, 'Makes the header clickable to sort'],
          ],
        },
      ]}
      accessibility={[
        <>It draws a real <IC>{'<table>'}</IC> with <IC>scope="col"</IC> headers, so screen readers can tell which cell belongs to which row and column.</>,
        <>In <IC>responsive</IC> card mode the header row is only hidden visually — screen readers still get the real table, and each value is labelled by its column name.</>,
        <>Sortable headers are <IC>{'<button>'}</IC>s inside the <IC>{'<th>'}</IC>, and they set <IC>aria-sort</IC> to say which way it's sorted.</>,
        <>Clickable rows (<IC>onRowClick</IC>) can be reached with the keyboard and open with <IC>Enter</IC> or <IC>Space</IC>.</>,
        <>The little sort arrow is just for looks (<IC>aria-hidden</IC>) — the sort direction comes from <IC>aria-sort</IC>, not from color.</>,
        <>Pass <IC>caption</IC> to give the table a name. It's hidden on screen but read out by screen readers.</>,
        <>The product icon at the front of a row is just for looks — <IC>Icon</IC> is <IC>aria-hidden</IC> by default, so the meaning comes from the name next to it.</>
      ]}
    >
      <Section title="Basic" note="List your columns and hand over your data. A column's render() lets you draw your own cell content.">
        <Preview
          canvas={
            <Table
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                { key: 'os', header: 'OS' },
                { key: 'ip', header: 'IP address' },
                STATUS_COL,
                { key: 'seen', header: 'Last seen', align: 'right' },
                { key: 'risk', header: 'Risk', align: 'right', render: (r) => `${r.risk}%` },
              ]}
              data={DEVICES}
            />
          }
          code={`<Table
  columns={[
    { key: 'name', header: 'Device' },
    { key: 'owner', header: 'Owner' },
    { key: 'os', header: 'OS' },
    { key: 'ip', header: 'IP address' },
    { key: 'status', header: 'Status',
      render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
    { key: 'seen', header: 'Last seen', align: 'right' },
    { key: 'risk', header: 'Risk', align: 'right',
      render: (r) => \`\${r.risk}%\` },
  ]}
  data={devices}
/>`}
        />
      </Section>

      <Section
        title="Responsive"
        note="The table fills its box and shrinks or grows with it. Pass minWidth so the columns never get too squished — once the box gets narrower than that, the table scrolls sideways instead. Try the buttons, drag the frame's bottom-right corner, or just resize the window."
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
        note="A common first-column look: a product icon and name, with an optional second line under it. Build it in a column's render() from parts you already have — Inline, Icon, Stack, Text — no custom markup."
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
        note="For packed screens: use density=&quot;compact&quot; with a one-line cell — a smaller Icon and a small name, no second line."
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
        note="Row buttons are just one more column at the end: a right-aligned Inline of icon-only ghost Buttons. Each Button needs an aria-label because there's no words to read."
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

      <Section title="Sortable" note="You're in charge of sorting. Clicking a header shows the arrow and calls onSortChange; then you put the rows in order.">
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

      <Section title="Selection" note="A checkbox column with a select-all box at the top (it shows a dash when only some rows are picked). You control it with selectedKeys.">
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

      <Section title="Compact + zebra" note="Tighter rows for log-style data, with striped rows so they're easy to scan.">
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

      <Section title="Interactive rows" note="Pass onRowClick to make each row clickable so you can open it.">
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

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. The shell and the classes are pure CSS — you write the rows yourself. Sorting, selection, and clickable rows are JS you'd wire: the classes and ARIA below are what the React component sets for you."
      >
        <Code>{`<!-- density: vds-table--comfortable | --compact. add-ons: --zebra, --sticky, --responsive -->
<div class="vds-surface vds-surface--bordered vds-surface--elev-resting vds-table vds-table--comfortable">
  <div class="vds-table__scroll">
    <table class="vds-table__el" style="min-width: 640px">
      <thead class="vds-table__head">
        <tr>
          <th scope="col" class="vds-table__th vds-table__cell--left">Device</th>
          <!-- sortable header: a button inside the th; aria-sort says the direction -->
          <th scope="col" aria-sort="descending"
              class="vds-table__th vds-table__cell--right vds-table__th--sortable vds-table__th--active">
            <button type="button" class="vds-table__sort-btn">
              <span>Risk</span>
              <span class="vds-table__sort vds-table__sort--desc" aria-hidden="true">…caret svg…</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody class="vds-table__body">
        <tr class="vds-table__row">
          <!-- data-label feeds the responsive card mode's inline column labels -->
          <td class="vds-table__td vds-table__cell--left" data-label="Device">MBP-014</td>
          <td class="vds-table__td vds-table__cell--right" data-label="Risk">4%</td>
        </tr>
        <!-- empty state -->
        <tr class="vds-table__row vds-table__row--empty">
          <td class="vds-table__td vds-table__empty" colspan="2">No data</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- clickable rows (JS): add vds-table--row-interactive on the shell and
     vds-table__row--interactive + tabindex="0" + role="button" on each row.
     selection (JS): a vds-table__cell--select column of Checkbox markup. -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
