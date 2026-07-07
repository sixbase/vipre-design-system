import { useMemo, useState } from 'react'
import { Building2, Eye, Monitor, MoreHorizontal, Pencil, Shield, Trash2, Users } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  PageHeader, SearchInput, Button, StatTile, Grid, Stack, Inline, Table,
  Avatar, Badge, Tag, Sparkline, Pagination, Menu, MenuItem, MenuSeparator,
  SegmentedControl, EmptyState, Drawer, DescriptionList, Divider, Heading, Text, Icon,
} from '../../components/index.js'
import { CUSTOMERS, CUSTOMER_TYPE, CUSTOMER_STATUS } from '../templateData.js'

/* ---- The assembled page ----------------------------------------------------- */

function CustomerListDemo() {
  const [mode, setMode] = useState('data') // data | loading | empty
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    if (mode === 'empty') return []
    const q = query.trim().toLowerCase()
    return q ? CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q)) : CUSTOMERS
  }, [mode, query])

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: false,
      render: (r) => (
        <Inline gap={2}>
          <Avatar name={r.name} shape="square" size="sm" />
          <Text as="span" variant="body">{r.name}</Text>
        </Inline>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (r) => <Tag size="sm" tone={CUSTOMER_TYPE[r.type].tone}>{CUSTOMER_TYPE[r.type].label}</Tag>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge tone={CUSTOMER_STATUS[r.status].tone} dot>{CUSTOMER_STATUS[r.status].label}</Badge>,
    },
    {
      key: 'devices',
      header: 'Devices',
      align: 'right',
      render: (r) => <Text as="span" variant="body" tabular>{r.devices.toLocaleString()}</Text>,
    },
    {
      key: 'adoption',
      header: 'Adoption',
      render: (r) => (
        <Sparkline
          data={r.adoption}
          tone={r.adoption[r.adoption.length - 1] >= r.adoption[0] ? 'primary' : 'danger'}
          width={80}
          height={24}
          label={`Adoption trend for ${r.name}`}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        /* Stop the click so opening the menu doesn't also open the drawer. */
        <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Menu
            aria-label={`Actions for ${r.name}`}
            trigger={
              <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={`Actions for ${r.name}`}>
                <Icon as={MoreHorizontal} size="sm" />
              </Button>
            }
          >
            <MenuItem icon={Eye} onSelect={() => setSelected(r)}>View details</MenuItem>
            <MenuItem icon={Pencil} onSelect={() => {}}>Edit customer</MenuItem>
            <MenuSeparator />
            <MenuItem icon={Trash2} danger onSelect={() => {}}>Remove</MenuItem>
          </Menu>
        </span>
      ),
    },
  ]

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      {/* Docs-only toggle: flip the page between its three states. */}
      <SegmentedControl
        aria-label="Demo state"
        size="sm"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'data', label: 'Data' },
          { value: 'loading', label: 'Loading' },
          { value: 'empty', label: 'Empty' },
        ]}
      />

      <div
        style={{
          height: 620,
          overflowY: 'auto',
          border: '1px solid var(--vds-line)',
          borderRadius: 'var(--vds-radius-lg)',
          background: 'var(--vds-canvas)',
          padding: 'var(--vds-page-pad)',
        }}
      >
        <Stack gap={6}>
          <PageHeader
            icon={Building2}
            title="Customers"
            subtitle="Every account you manage, in one list."
            actions={
              <>
                <SearchInput
                  size="sm"
                  placeholder="Search customers…"
                  aria-label="Search customers"
                  value={query}
                  onChange={(v) => { setQuery(v); setPage(1) }}
                />
                <Button size="sm">Add customer</Button>
              </>
            }
          />

          {/* KPI strip — the whole book's totals, before the table narrows in. */}
          <Grid min="10rem" gap={3}>
            <StatTile icon={Building2} value={48} label="Customers" delta="+3" loading={mode === 'loading'} />
            <StatTile icon={Monitor} value={2914} label="Devices" tone="primary" loading={mode === 'loading'} />
            <StatTile icon={Shield} value={6412} label="Threats blocked" tone="success" trend={[18, 22, 20, 26, 25, 30, 34]} loading={mode === 'loading'} />
            <StatTile icon={Users} value={87} suffix="%" label="Seats used" caption="3,005 of 3,455" loading={mode === 'loading'} />
          </Grid>

          <Table
            caption="Customers in this scope"
            columns={columns}
            data={filtered}
            responsive
            loading={mode === 'loading'}
            skeletonRows={6}
            onRowClick={(r) => setSelected(r)}
            empty={
              <EmptyState
                size="sm"
                icon={Building2}
                title={query ? 'No matches' : 'No customers yet'}
                actions={<Button size="sm">Add customer</Button>}
              >
                {query
                  ? 'Nothing matches your search. Try fewer letters.'
                  : 'Customers show up here after you add your first account.'}
              </EmptyState>
            }
          />

          <Inline justify="between" wrap gap={3}>
            <Text variant="detail" tone="muted" tabular>
              Showing {filtered.length} of 48 customers
            </Text>
            <Pagination size="sm" page={page} pageCount={6} onPageChange={setPage} />
          </Inline>
        </Stack>
      </div>

      {/* Row drill-in — the customer summary drawer. */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Customer'}
        footer={
          <Inline gap={2} justify="end" style={{ width: '100%' }}>
            <Button variant="outline" tone="neutral" onClick={() => setSelected(null)}>Close</Button>
            <Button>Open account</Button>
          </Inline>
        }
      >
        {selected && (
          <Stack gap={5}>
            <Inline gap={3}>
              <Avatar name={selected.name} shape="square" size="lg" />
              <Stack gap={1}>
                <Heading level="subheading" as="h3">{selected.name}</Heading>
                <Inline gap={2} wrap>
                  <Badge tone={CUSTOMER_STATUS[selected.status].tone} dot>
                    {CUSTOMER_STATUS[selected.status].label}
                  </Badge>
                  <Tag size="sm" tone={CUSTOMER_TYPE[selected.type].tone}>
                    {CUSTOMER_TYPE[selected.type].label}
                  </Tag>
                </Inline>
              </Stack>
            </Inline>

            <Grid min="8rem" gap={3}>
              <StatTile size="sm" icon={Monitor} value={selected.devices} label="Devices" />
              <StatTile size="sm" icon={Shield} value={selected.threats} label="Threats blocked" tone="success" />
            </Grid>

            <Divider />

            <DescriptionList
              columns={2}
              divided
              items={[
                { term: 'Seats used', description: `${selected.seatsUsed.toLocaleString()} of ${selected.seats.toLocaleString()}` },
                { term: 'Customer since', description: selected.added },
                { term: 'Contact', description: selected.contact },
                { term: 'Products', description: selected.products.join(', '), span: 2 },
              ]}
            />
          </Stack>
        )}
      </Drawer>
    </Stack>
  )
}

/* ---- Page ------------------------------------------------------------------- */

export function CustomerListTemplatePage() {
  return (
    <ComponentPage
      title="Customer Directory"
      description="The MSP landing page: every account you manage, as a table. A header with search and an add button, a strip of totals, then the list itself — name, type, status, device count, and an adoption trend per row. Click a row and a drawer slides in with that customer's summary, so you can peek without leaving the list. This body slots into the MSP Shell template's content region."
      installCode={`import { PageHeader, SearchInput, StatTile, Table, Drawer, Pagination } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="All live. Type in the search to filter. Click a row to open the customer drawer; the row menu (…) has quick actions. The toggle above the frame flips the page between its three states — the table shows skeleton rows while loading, and an EmptyState when there's nothing to show. The table has its responsive mode on: below ~640px of its own width, rows become labelled cards. Try the drawer at a narrow window too."
      >
        <Preview
          canvas={<CustomerListDemo />}
          code={`<PageHeader
  icon={Building2} title="Customers"
  actions={<><SearchInput onChange={setQuery} /><Button>Add customer</Button></>}
/>

<Grid min="10rem" gap={3}>
  <StatTile icon={Building2} value={48} label="Customers" delta="+3" />
  <StatTile icon={Monitor} value={2914} label="Devices" tone="primary" />
  <StatTile icon={Shield} value={6412} label="Threats blocked" tone="success" trend={…} />
  <StatTile icon={Users} value={87} suffix="%" label="Seats used" />
</Grid>

<Table
  responsive
  columns={[
    { key: 'name', header: 'Customer', render: (r) => <Avatar … /> },
    { key: 'type', header: 'Type', render: (r) => <Tag size="sm">…</Tag> },
    { key: 'status', header: 'Status', render: (r) => <Badge dot>…</Badge> },
    { key: 'devices', header: 'Devices', align: 'right' },
    { key: 'adoption', header: 'Adoption', render: (r) => <Sparkline data={r.adoption} /> },
    { key: 'actions', header: '', render: (r) => <Menu trigger={…}>…</Menu> },
  ]}
  data={customers}
  loading={isFetching}
  empty={<EmptyState icon={Building2} title="No customers yet" … />}
  onRowClick={(r) => setSelected(r)}
/>

<Pagination page={page} pageCount={6} onPageChange={setPage} />

<Drawer open={!!selected} onClose={close} title={selected?.name}
        footer={<><Button variant="outline" tone="neutral">Close</Button><Button>Open account</Button></>}>
  {/* Avatar + badges, StatTiles, DescriptionList */}
</Drawer>`}
        />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['Page header', 'Names the page and holds the search + the primary action.', <span key="a"><IC>PageHeader</IC> with <IC>SearchInput</IC> + <IC>Button</IC> in <IC>actions</IC></span>],
            ['KPI strip', 'The big totals, before any filtering. Auto-fits from four columns down to one.', <span key="b"><IC>Grid</IC> of <IC>StatTile</IC>s (<IC>vds-stat</IC>)</span>],
            ['Customer table', 'The list itself. Cells are composed: Avatar for identity, Tag for type, Badge for status, Sparkline for trend, Menu for row actions. Its responsive prop turns rows into cards on narrow screens.', <span key="c"><IC>Table responsive</IC> (<IC>vds-table</IC>)</span>],
            ['Pager', 'Page numbers under the table; collapses to "Page 2 of 6" on small screens by itself.', <IC key="d">Pagination</IC>],
            ['States', 'Loading shows skeleton rows (Table loading); nothing-to-show renders an EmptyState through the Table empty slot.', <span key="e"><IC>Table loading / empty</IC> + <IC>EmptyState</IC></span>],
            ['Detail drawer', 'The row drill-in. Identity up top, two quick stats, then labelled facts. Actions pinned in the footer.', <span key="f"><IC>Drawer</IC> + <IC>StatTile</IC> + <IC>DescriptionList</IC></span>],
          ].map(([region, resp, comp]) => (
            <div key={region} style={{ display: 'grid', gridTemplateColumns: '8rem 1fr', gap: '0.75rem', alignItems: 'start' }}>
              <strong style={{ color: 'var(--vds-ink)' }}>{region}</strong>
              <span style={{ color: 'var(--vds-ink-muted)' }}>{resp} — {comp}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentPage>
  )
}
