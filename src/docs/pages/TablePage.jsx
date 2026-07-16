import { useMemo, useState } from 'react'
import { ShieldCheck, Mail, Globe, Database, Eye, Pencil, Trash2, Copy, MoreHorizontal, Download, ShieldAlert, Search, Send, Lock } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Table, Badge, Button, Text, Icon, Inline, Stack, Avatar, Progress, Pagination, EmptyState, Menu, MenuItem, MenuSeparator, Divider, Tag } from '../../components/index.js'

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

/* A bigger fleet — enough rows to make the sticky-header scroll and the
   pagination examples feel real. Same shape as DEVICES. */
const FLEET = [
  { id: 'f1', name: 'MBP-014', owner: 'Ada Okafor', status: 'Protected', tone: 'success', seen: '2 min ago', risk: 4, os: 'macOS 14' },
  { id: 'f2', name: 'WIN-221', owner: 'Jun Park', status: 'At risk', tone: 'warning', seen: '1 hr ago', risk: 62, os: 'Windows 11' },
  { id: 'f3', name: 'LNX-007', owner: 'Mara Díaz', status: 'Threat', tone: 'danger', seen: '5 hr ago', risk: 91, os: 'Ubuntu 22' },
  { id: 'f4', name: 'MBP-052', owner: 'Ravi Singh', status: 'Protected', tone: 'success', seen: 'just now', risk: 2, os: 'macOS 14' },
  { id: 'f5', name: 'WIN-118', owner: 'Lena Voss', status: 'At risk', tone: 'warning', seen: '18 min ago', risk: 48, os: 'Windows 10' },
  { id: 'f6', name: 'MBP-090', owner: 'Tomás Reyes', status: 'Protected', tone: 'success', seen: '3 min ago', risk: 7, os: 'macOS 13' },
  { id: 'f7', name: 'LNX-023', owner: 'Nadia Haas', status: 'Threat', tone: 'danger', seen: '2 hr ago', risk: 84, os: 'Debian 12' },
  { id: 'f8', name: 'WIN-305', owner: 'Owen Blake', status: 'Protected', tone: 'success', seen: '9 min ago', risk: 11, os: 'Windows 11' },
  { id: 'f9', name: 'MBP-071', owner: 'Priya Nair', status: 'At risk', tone: 'warning', seen: '40 min ago', risk: 55, os: 'macOS 14' },
  { id: 'f10', name: 'WIN-142', owner: 'Sam Ortiz', status: 'Protected', tone: 'success', seen: '6 min ago', risk: 9, os: 'Windows 11' },
  { id: 'f11', name: 'LNX-041', owner: 'Yuki Tan', status: 'Protected', tone: 'success', seen: '1 min ago', risk: 3, os: 'Fedora 40' },
  { id: 'f12', name: 'WIN-260', owner: 'Chris Bauer', status: 'Threat', tone: 'danger', seen: '30 sec ago', risk: 88, os: 'Windows 10' },
]

/* Owner cell — a small Avatar (deterministic initials + tint) beside the name.
   Built from the Avatar primitive; no bespoke markup. */
function OwnerCell({ name }) {
  return (
    <Inline gap={2}>
      <Avatar name={name} size="sm" />
      <Text as="span" variant="body">{name}</Text>
    </Inline>
  )
}

/* Risk cell — a Progress bar whose tone tracks the score, with a tabular
   percentage after it. Reuses Progress; the column just picks the tone. */
function RiskMeter({ value }) {
  const tone = value >= 80 ? 'danger' : value >= 40 ? 'warning' : 'success'
  return (
    <Inline gap={2} style={{ minWidth: 132, justifyContent: 'flex-end' }}>
      <Progress value={value} tone={tone} size="sm" aria-label={`Risk ${value}%`} style={{ flex: 1 }} />
      <Text as="span" variant="detail" tone="muted" style={{ fontVariantNumeric: 'tabular-nums', width: '2.75ch', textAlign: 'right' }}>
        {value}
      </Text>
    </Inline>
  )
}

/* Row menu — a kebab that opens a Menu of actions. Scales better than a wall
   of icon buttons once a row has more than two or three actions. */
function RowMenu({ label }) {
  return (
    <Menu
      aria-label={`${label} actions`}
      trigger={
        <Button variant="ghost" size="sm" iconOnly aria-label={`${label} actions`}>
          <Icon as={MoreHorizontal} size="sm" />
        </Button>
      }
    >
      <MenuItem icon={Eye}>View details</MenuItem>
      <MenuItem icon={Pencil}>Rename</MenuItem>
      <MenuItem icon={Copy}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem icon={Trash2} danger>Delete</MenuItem>
    </Menu>
  )
}

/* ---- user management fixture + maps ---- */
const USERS = [
  { id: 'u1', name: 'Ada Okafor', email: 'ada@northwind.io', emails: 1284, attachments: 342, policy: 'Executive', active: '2 min ago' },
  { id: 'u2', name: 'Jun Park', email: 'jun@northwind.io', emails: 962, attachments: 210, policy: 'Standard', active: '1 hr ago' },
  { id: 'u3', name: 'Mara Díaz', email: 'mara@northwind.io', emails: 738, attachments: 512, policy: 'Standard', active: 'Yesterday' },
  { id: 'u4', name: 'Ravi Singh', email: 'ravi@northwind.io', emails: 44, attachments: 6, policy: 'Restricted', active: null },
  { id: 'u5', name: 'Lena Voss', email: 'lena@northwind.io', emails: 1490, attachments: 88, policy: 'Executive', active: '3 days ago' },
  { id: 'u6', name: 'Owen Blake', email: 'owen@northwind.io', emails: 312, attachments: 27, policy: 'Restricted', active: '2 weeks ago' },
  { id: 'u7', name: 'Priya Nair', email: 'priya@northwind.io', emails: 8, attachments: 0, policy: 'Standard', active: null },
  { id: 'u8', name: 'Yuki Tan', email: 'yuki@northwind.io', emails: 655, attachments: 174, policy: 'Standard', active: '5 hr ago' },
]

/* Top policy is a category (not a health signal), so it reads as a Tag with a
   chromatic tone; the everyday policy stays neutral. */
const POLICY_TONE = { Executive: 'amber', Restricted: 'emerald', Standard: 'neutral' }

/* Identity cell — Avatar (deterministic initials/tint) with the name over the
   email. The single most common first column in a people table. */
function UserCell({ name, email }) {
  return (
    <Inline gap={3}>
      <Avatar name={name} size="md" />
      <Stack gap={0}>
        <Text as="span" variant="body">{name}</Text>
        <Text as="span" variant="detail" tone="subtle">{email}</Text>
      </Stack>
    </Inline>
  )
}

/* Per-user action menu. */
function UserRowMenu({ user }) {
  return (
    // Stop the click so opening the menu never triggers a row-level handler.
    <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <Menu
        aria-label={`Actions for ${user.name}`}
        trigger={
          <Button variant="ghost" size="sm" iconOnly aria-label={`Actions for ${user.name}`}>
            <Icon as={MoreHorizontal} size="sm" />
          </Button>
        }
      >
        <MenuItem icon={Eye}>View profile</MenuItem>
        <MenuItem icon={Mail}>View mailbox</MenuItem>
        <MenuItem icon={ShieldCheck}>Change policy</MenuItem>
        <MenuSeparator />
        <MenuItem icon={Lock}>Suspend</MenuItem>
        <MenuItem icon={Trash2} danger>Remove</MenuItem>
      </Menu>
    </span>
  )
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

/* ---- bulk actions: selection drives a contextual toolbar ---- */
function BulkActionsDemo() {
  const [selected, setSelected] = useState([])
  const count = selected.length
  const clear = () => setSelected([])
  return (
    <Stack gap={0}>
      {/* The toolbar swaps in only while rows are picked. It sits on the same
          hairline as the table's top edge, so it reads as one surface. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          minHeight: 52,
          padding: '0 0.875rem',
          border: '1px solid var(--vds-line)',
          borderBottom: 'none',
          borderRadius: '6px 6px 0 0',
          background: count ? 'var(--vds-primary-soft)' : 'var(--vds-canvas)',
          transition: 'background-color var(--vds-dur-fast) var(--vds-ease-out)',
        }}
      >
        {count ? (
          <>
            <Text variant="body" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <strong>{count}</strong> selected
            </Text>
            <Inline gap={1}>
              <Button size="sm" variant="ghost"><Icon as={Download} size="sm" />Export</Button>
              <Button size="sm" variant="ghost"><Icon as={ShieldAlert} size="sm" />Quarantine</Button>
              <Button size="sm" variant="ghost" tone="danger"><Icon as={Trash2} size="sm" />Delete</Button>
              <Divider orientation="vertical" style={{ height: 20 }} />
              <Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
            </Inline>
          </>
        ) : (
          <Text variant="caption" tone="subtle">Pick rows to act on them.</Text>
        )}
      </div>
      <Table
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        radius={null}
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        columns={[
          { key: 'name', header: 'Device' },
          { key: 'owner', header: 'Owner' },
          STATUS_COL,
          { key: 'seen', header: 'Last seen', align: 'right' },
        ]}
        data={DEVICES}
      />
    </Stack>
  )
}

/* ---- pagination: you own the page state and slice the rows ---- */
const PAGE_COLUMNS = [
  { key: 'name', header: 'Device' },
  { key: 'owner', header: 'Owner' },
  { key: 'os', header: 'OS' },
  STATUS_COL,
  { key: 'risk', header: 'Risk', align: 'right', render: (r) => `${r.risk}%` },
]

function PaginationDemo() {
  const pageSize = 5
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(FLEET.length / pageSize)
  const start = (page - 1) * pageSize
  const rows = FLEET.slice(start, start + pageSize)

  // Pad the short final page up to pageSize with blank filler rows so the
  // table's height never changes between pages. Without this the last page
  // collapses and the whole layout (and the pager) jumps up under the cursor.
  const padded = [...rows]
  while (padded.length < pageSize) padded.push({ id: `empty-${padded.length}`, filler: true })

  // Blank every cell on a filler row. A non-breaking space keeps the empty row
  // exactly as tall as a real one, so no partial shift sneaks back in.
  const columns = PAGE_COLUMNS.map((col) => ({
    ...col,
    render: (r, i) => (r.filler ? ' ' : col.render ? col.render(r, i) : r[col.key]),
  }))

  return (
    <Stack gap={4}>
      <Table columns={columns} data={padded} />
      <Inline justify="between" gap={3} style={{ flexWrap: 'wrap' }}>
        <Text variant="caption" tone="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {start + 1}–{Math.min(page * pageSize, FLEET.length)} of {FLEET.length}
        </Text>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} size="sm" />
      </Inline>
    </Stack>
  )
}

/* ---- user management: identity + role + status + row menu, with a
   selection-driven bulk bar. A self-contained people table. ---- */
function UserManagementDemo() {
  const [selected, setSelected] = useState([])
  const count = selected.length
  const columns = [
    { key: 'name', header: 'User', render: (r) => <UserCell name={r.name} email={r.email} /> },
    { key: 'emails', header: 'Emails', align: 'right', render: (r) => <Text as="span" variant="detail" tone="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.emails.toLocaleString()}</Text> },
    { key: 'attachments', header: 'Attachments', align: 'right', render: (r) => <Text as="span" variant="detail" tone="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.attachments.toLocaleString()}</Text> },
    { key: 'policy', header: 'Top policy', render: (r) => <Tag size="sm" tone={POLICY_TONE[r.policy]}>{r.policy}</Tag> },
    {
      key: 'active',
      header: 'Last activity',
      align: 'right',
      render: (r) =>
        r.active
          ? <Text as="span" variant="detail" tone="muted">{r.active}</Text>
          : <Text as="span" variant="detail" tone="subtle">—</Text>,
    },
    { key: 'actions', header: '', align: 'right', width: '1%', render: (r) => <UserRowMenu user={r} /> },
  ]
  return (
    <Stack gap={0}>
      {/* Bulk bar: sits on the table's top edge, tints while rows are picked. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          minHeight: 52,
          padding: '0 0.875rem',
          border: '1px solid var(--vds-line)',
          borderBottom: 'none',
          borderRadius: '6px 6px 0 0',
          background: count ? 'var(--vds-primary-soft)' : 'var(--vds-canvas)',
          transition: 'background-color var(--vds-dur-fast) var(--vds-ease-out)',
        }}
      >
        {count ? (
          <>
            <Text variant="body" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <strong>{count}</strong> selected
            </Text>
            <Inline gap={1}>
              <Button size="sm" variant="ghost"><Icon as={ShieldCheck} size="sm" />Change policy</Button>
              <Button size="sm" variant="ghost"><Icon as={Lock} size="sm" />Suspend</Button>
              <Button size="sm" variant="ghost" tone="danger"><Icon as={Trash2} size="sm" />Remove</Button>
              <Divider orientation="vertical" style={{ height: 20 }} />
              <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
            </Inline>
          </>
        ) : (
          <>
            <Text variant="caption" tone="subtle">{USERS.length} members</Text>
            <Button size="sm"><Icon as={Send} size="sm" />Invite people</Button>
          </>
        )}
      </div>
      <Table
        caption="Workspace members"
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        radius={null}
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        columns={columns}
        data={USERS}
      />
    </Stack>
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
        title="Sticky header"
        note="For long lists, cap the height with maxHeight and turn on stickyHeader — the body scrolls while the column titles stay pinned at the top. Scroll the rows below."
      >
        <Preview
          canvas={
            <Table
              stickyHeader
              maxHeight={260}
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                { key: 'os', header: 'OS' },
                STATUS_COL,
                { key: 'risk', header: 'Risk', align: 'right', render: (r) => `${r.risk}%` },
              ]}
              data={FLEET}
            />
          }
          code={`<Table
  stickyHeader
  maxHeight={260}
  columns={columns}
  data={fleet}
/>`}
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
        title="Rich cells"
        note="Cells can hold any component. Here the owner is an Avatar with its name, and risk is a Progress bar whose color tracks the score. Both are built in a column's render() from primitives — Avatar and Progress — nothing table-specific."
      >
        <Preview
          canvas={
            <Table
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner', render: (r) => <OwnerCell name={r.owner} /> },
                STATUS_COL,
                { key: 'risk', header: 'Risk', align: 'right', width: '180px', render: (r) => <RiskMeter value={r.risk} /> },
              ]}
              data={DEVICES}
            />
          }
          code={`import { Avatar, Progress, Inline, Text } from 'vipre-design-system'

const columns = [
  { key: 'name', header: 'Device' },
  {
    key: 'owner', header: 'Owner',
    render: (r) => (
      <Inline gap={2}>
        <Avatar name={r.owner} size="sm" />
        <Text as="span" variant="body">{r.owner}</Text>
      </Inline>
    ),
  },
  {
    key: 'risk', header: 'Risk', align: 'right', width: '180px',
    render: (r) => {
      const tone = r.risk >= 80 ? 'danger' : r.risk >= 40 ? 'warning' : 'success'
      return (
        <Inline gap={2} style={{ justifyContent: 'flex-end' }}>
          <Progress value={r.risk} tone={tone} size="sm"
            aria-label={\`Risk \${r.risk}%\`} style={{ flex: 1 }} />
          <Text as="span" variant="detail" tone="muted">{r.risk}</Text>
        </Inline>
      )
    },
  },
]

<Table columns={columns} data={devices} />`}
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

      <Section
        title="Row menu"
        note="Once a row has more than a couple of actions, collapse them into a kebab menu instead of a row of buttons. The trigger is one icon Button; Menu handles the popover, keyboard, and focus."
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
                  render: (r) => <RowMenu label={r.name} />,
                },
              ]}
              data={PRODUCTS}
            />
          }
          code={`import { Eye, Pencil, Copy, Trash2, MoreHorizontal } from '@icons'
import { Button, Icon, Menu, MenuItem, MenuSeparator } from 'vipre-design-system'

const columns = [
  // …data columns
  {
    key: 'actions', header: '', align: 'right', width: '1%',
    render: (r) => (
      <Menu
        aria-label={\`\${r.name} actions\`}
        trigger={
          <Button variant="ghost" size="sm" iconOnly aria-label={\`\${r.name} actions\`}>
            <Icon as={MoreHorizontal} size="sm" />
          </Button>
        }
      >
        <MenuItem icon={Eye}>View details</MenuItem>
        <MenuItem icon={Pencil}>Rename</MenuItem>
        <MenuItem icon={Copy}>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem icon={Trash2} danger>Delete</MenuItem>
      </Menu>
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

      <Section
        title="Bulk actions"
        note="Selection usually feeds a toolbar. Track the selected keys, and when the count is above zero, swap in a bar of actions that apply to all picked rows. Pick some rows to see it."
      >
        <Preview canvas={<BulkActionsDemo />} code={`const [selected, setSelected] = useState([])

<Stack gap={0}>
  {selected.length > 0 && (
    <Toolbar>
      <Text><strong>{selected.length}</strong> selected</Text>
      <Inline gap={1}>
        <Button size="sm" variant="ghost"><Icon as={Download} size="sm" />Export</Button>
        <Button size="sm" variant="ghost"><Icon as={ShieldAlert} size="sm" />Quarantine</Button>
        <Button size="sm" variant="ghost" tone="danger"><Icon as={Trash2} size="sm" />Delete</Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
      </Inline>
    </Toolbar>
  )}
  <Table selectable selectedKeys={selected} onSelectionChange={setSelected}
    columns={columns} data={devices} />
</Stack>`} />
      </Section>

      <Section
        title="Pagination"
        note="For long lists, page the data yourself and pair the table with Pagination. You own the page state; the table just renders the current slice. Pad the short last page up to pageSize with blank filler rows so the table's height stays put between pages — otherwise the final page collapses and the pager jumps under your cursor."
      >
        <Preview canvas={<PaginationDemo />} code={`const pageSize = 5
const [page, setPage] = useState(1)
const pageCount = Math.ceil(fleet.length / pageSize)
const start = (page - 1) * pageSize
const rows = fleet.slice(start, start + pageSize)

// Keep every page the same height: pad the last one with blank filler rows,
// so switching pages never shifts the layout.
const padded = [...rows]
while (padded.length < pageSize) padded.push({ id: \`empty-\${padded.length}\`, filler: true })

// Blank out filler cells; the non-breaking space holds the row's full height.
const cols = columns.map((col) => ({
  ...col,
  render: (r, i) => (r.filler ? '\\u00A0' : col.render ? col.render(r, i) : r[col.key]),
}))

<Table columns={cols} data={padded} />
<Pagination page={page} pageCount={pageCount} onPageChange={setPage} size="sm" />`} />
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', width: '100%' }}>
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
        title="Rich empty state"
        note="The empty prop takes any node, so hand it an EmptyState with an icon, a message, and a way out. Use inset so it sits on a dashed well inside the table's frame."
      >
        <Preview
          canvas={
            <Table
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                { key: 'os', header: 'OS' },
                STATUS_COL,
              ]}
              data={[]}
              empty={
                <EmptyState
                  inset
                  size="sm"
                  icon={Search}
                  title="No devices match"
                  actions={<Button size="sm" variant="secondary">Clear filters</Button>}
                >
                  Try widening your filters or clearing the search.
                </EmptyState>
              }
            />
          }
          code={`import { Search } from '@icons'
import { EmptyState, Button } from 'vipre-design-system'

<Table
  columns={columns}
  data={[]}
  empty={
    <EmptyState
      inset
      size="sm"
      icon={Search}
      title="No devices match"
      actions={<Button size="sm" variant="secondary">Clear filters</Button>}
    >
      Try widening your filters or clearing the search.
    </EmptyState>
  }
/>`}
        />
      </Section>

      <Section
        title="User management"
        note="A real table, put together from the pieces above. Identity is an Avatar with the name over the email; emails and attachments are right-aligned tabular numbers; top policy is a Tag (a category); last activity is muted text (an em dash for people who never signed in); and each row has an action menu. Tick rows to reveal the bulk bar."
      >
        <Preview
          canvas={<UserManagementDemo />}
          code={`import { Table, Avatar, Tag, Button, Menu, MenuItem, MenuSeparator, Icon, Inline, Stack, Text } from 'vipre-design-system'
import { MoreHorizontal, Eye, Mail, ShieldCheck, Lock, Trash2 } from '@icons'

const POLICY_TONE = { Executive: 'amber', Restricted: 'emerald', Standard: 'neutral' }

const num = (n) => (
  <Text as="span" variant="detail" tone="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
    {n.toLocaleString()}
  </Text>
)

const columns = [
  {
    key: 'name', header: 'User',
    render: (u) => (
      <Inline gap={3}>
        <Avatar name={u.name} size="md" />
        <Stack gap={0}>
          <Text as="span" variant="body">{u.name}</Text>
          <Text as="span" variant="detail" tone="subtle">{u.email}</Text>
        </Stack>
      </Inline>
    ),
  },
  { key: 'emails', header: 'Emails', align: 'right', render: (u) => num(u.emails) },
  { key: 'attachments', header: 'Attachments', align: 'right', render: (u) => num(u.attachments) },
  { key: 'policy', header: 'Top policy', render: (u) => <Tag size="sm" tone={POLICY_TONE[u.policy]}>{u.policy}</Tag> },
  {
    key: 'active', header: 'Last activity', align: 'right',
    render: (u) => u.active
      ? <Text as="span" variant="detail" tone="muted">{u.active}</Text>
      : <Text as="span" variant="detail" tone="subtle">—</Text>,
  },
  {
    key: 'actions', header: '', align: 'right', width: '1%',
    render: (u) => (
      <span onClick={(e) => e.stopPropagation()}>
        <Menu
          aria-label={\`Actions for \${u.name}\`}
          trigger={
            <Button variant="ghost" size="sm" iconOnly aria-label={\`Actions for \${u.name}\`}>
              <Icon as={MoreHorizontal} size="sm" />
            </Button>
          }
        >
          <MenuItem icon={Eye}>View profile</MenuItem>
          <MenuItem icon={Mail}>View mailbox</MenuItem>
          <MenuItem icon={ShieldCheck}>Change policy</MenuItem>
          <MenuSeparator />
          <MenuItem icon={Lock}>Suspend</MenuItem>
          <MenuItem icon={Trash2} danger>Remove</MenuItem>
        </Menu>
      </span>
    ),
  },
]

const [selected, setSelected] = useState([])

<Table
  caption="Workspace members"
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  columns={columns}
  data={users}
/>`}
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
