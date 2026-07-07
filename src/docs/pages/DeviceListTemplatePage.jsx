import { useMemo, useState } from 'react'
import { Laptop, Monitor, Radar, ShieldAlert, ShieldCheck, TriangleAlert } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  PageHeader, SearchInput, Select, Switch, Button, StatTile, Grid, Stack, Inline,
  Table, Badge, Progress, Surface, Icon, Text,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent, Checkbox,
} from '../../components/index.js'
import { DEVICES, DEVICE_RISK } from '../templateData.js'

/* Facet definitions — value → how to read it off a device row. */
const FACETS = [
  { id: 'platform', label: 'Platform', of: (d) => d.platform },
  { id: 'kind', label: 'Device type', of: (d) => d.kind },
  { id: 'customer', label: 'Customer', of: (d) => d.customer },
]

/* The demo pretends Northwind Partners is the signed-in org; everyone else
   is a child org, so the "Include child orgs" switch has something to do. */
const OWN_ORG = 'Northwind Partners'

function complianceTone(v) {
  if (v >= 90) return 'success'
  if (v >= 60) return 'warning'
  return 'danger'
}

/* ---- The assembled page ------------------------------------------------------ */

function DeviceListDemo() {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('all')
  const [risk, setRisk] = useState('all')
  const [includeChildren, setIncludeChildren] = useState(true)
  const [checked, setChecked] = useState({ platform: [], kind: [], customer: [] })

  const toggleFacet = (facetId, value) => {
    setChecked((prev) => {
      const has = prev[facetId].includes(value)
      return {
        ...prev,
        [facetId]: has ? prev[facetId].filter((v) => v !== value) : [...prev[facetId], value],
      }
    })
  }
  const activeCount = FACETS.reduce((n, f) => n + checked[f.id].length, 0)
  const clearFacets = () => setChecked({ platform: [], kind: [], customer: [] })

  const scoped = useMemo(
    () => (includeChildren ? DEVICES : DEVICES.filter((d) => d.customer === OWN_ORG)),
    [includeChildren],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return scoped.filter((d) => {
      if (q && !d.hostname.toLowerCase().includes(q) && !d.customer.toLowerCase().includes(q)) return false
      if (platform !== 'all' && d.platform !== platform) return false
      if (risk !== 'all' && d.risk !== risk) return false
      for (const f of FACETS) {
        if (checked[f.id].length && !checked[f.id].includes(f.of(d))) return false
      }
      return true
    })
  }, [scoped, query, platform, risk, checked])

  /* KPIs follow the filters, so narrowing the list re-counts the strip. */
  const avgCompliance = filtered.length
    ? Math.round(filtered.reduce((s, d) => s + d.compliance, 0) / filtered.length)
    : 0
  const highRisk = filtered.filter((d) => d.risk === 'high').length
  const scanned = filtered.filter((d) => !d.lastScan.endsWith('d ago')).length
  const coverage = filtered.length ? Math.round((scanned / filtered.length) * 100) : 0

  const columns = [
    {
      key: 'hostname',
      header: 'Device',
      render: (d) => (
        <Inline gap={2}>
          <Icon as={d.kind === 'Laptop' ? Laptop : Monitor} size="sm" tone="muted" />
          <Text as="span" variant="body">{d.hostname}</Text>
        </Inline>
      ),
    },
    { key: 'customer', header: 'Customer' },
    { key: 'os', header: 'OS' },
    {
      key: 'agent',
      header: 'Agent',
      render: (d) =>
        d.agent < '5.0' ? (
          <Inline gap={1} as="span">
            <Icon as={TriangleAlert} size="xs" tone="warning" label="Outdated agent" />
            <Text as="span" variant="body" tone="warning" tabular>{d.agent}</Text>
          </Inline>
        ) : (
          <Text as="span" variant="body" tabular>{d.agent}</Text>
        ),
    },
    {
      key: 'risk',
      header: 'Risk',
      render: (d) => <Badge tone={DEVICE_RISK[d.risk].tone} dot>{DEVICE_RISK[d.risk].label}</Badge>,
    },
    {
      key: 'lastScan',
      header: 'Last scan',
      render: (d) => <Text as="span" variant="body" tone="muted" tabular>{d.lastScan}</Text>,
    },
    {
      key: 'compliance',
      header: 'Compliance',
      render: (d) => (
        <Inline gap={2} style={{ minWidth: '7rem' }}>
          <Progress
            size="sm"
            value={d.compliance}
            tone={complianceTone(d.compliance)}
            aria-label={`Compliance ${d.compliance}%`}
            style={{ flex: 1 }}
          />
          <Text as="span" variant="detail" tone="muted" tabular>{d.compliance}%</Text>
        </Inline>
      ),
    },
  ]

  return (
    <div
      style={{
        height: 620,
        overflowY: 'auto',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-lg)',
        background: 'var(--vds-canvas)',
        padding: 'var(--vds-page-pad)',
        width: '100%',
      }}
    >
      <Stack gap={6}>
        <PageHeader
          icon={Monitor}
          title="Devices"
          subtitle="Every endpoint in scope, with agent health and scan status."
          filters={
            <Inline gap={2} wrap>
              <SearchInput
                size="sm"
                placeholder="Search devices…"
                aria-label="Search devices"
                value={query}
                onChange={setQuery}
              />
              <Select
                size="sm"
                aria-label="Operating system"
                value={platform}
                onChange={setPlatform}
                options={[
                  { value: 'all', label: 'All OS' },
                  { value: 'Windows', label: 'Windows' },
                  { value: 'macOS', label: 'macOS' },
                  { value: 'Linux', label: 'Linux' },
                ]}
              />
              <Select
                size="sm"
                aria-label="Risk level"
                value={risk}
                onChange={setRisk}
                options={[
                  { value: 'all', label: 'All risk levels' },
                  { value: 'low', label: 'Low risk' },
                  { value: 'medium', label: 'Medium risk' },
                  { value: 'high', label: 'High risk' },
                ]}
              />
              <Switch checked={includeChildren} onChange={(e) => setIncludeChildren(e.target.checked)}>
                Include child orgs
              </Switch>
            </Inline>
          }
        />

        {/* KPI strip — re-counts as the filters narrow the list. */}
        <Grid min="11rem" gap={3}>
          <StatTile icon={ShieldCheck} value={avgCompliance} suffix="%" label="Compliance" tone="success" delta="+2%" trend={[86, 88, 87, 90, 91, 93, avgCompliance]} />
          <StatTile icon={ShieldAlert} value={highRisk} label="High-risk devices" tone="danger" delta={highRisk > 1 ? '+1' : '-1'} invertDelta />
          <StatTile icon={Radar} value={coverage} suffix="%" label="Scan coverage" tone="primary" caption="scanned in the last 3 days" trend={[70, 74, 73, 78, 81, 84, coverage]} />
        </Grid>

        {/* Sidebar + table. Flex-wrap glue: when the row gets too narrow for
            both, the sidebar wraps on top and the table takes the full width. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--vds-space-4)', alignItems: 'flex-start' }}>
          <Surface padding={3} style={{ flex: '1 1 12rem', maxWidth: '18rem', minWidth: 0 }}>
            <Stack gap={2}>
              <Inline justify="between">
                <Text variant="eyebrow" tone="muted" as="h3">Filters</Text>
                {activeCount > 0 && (
                  <Button variant="ghost" tone="neutral" size="sm" onClick={clearFacets}>
                    Clear ({activeCount})
                  </Button>
                )}
              </Inline>
              <Accordion type="multiple" defaultValue={['platform', 'kind']}>
                {FACETS.map((facet) => {
                  const counts = new Map()
                  for (const d of scoped) counts.set(facet.of(d), (counts.get(facet.of(d)) ?? 0) + 1)
                  return (
                    <AccordionItem key={facet.id} value={facet.id}>
                      <AccordionTrigger>{facet.label}</AccordionTrigger>
                      <AccordionContent>
                        <Stack gap={1}>
                          {[...counts.entries()].map(([value, count]) => (
                            <Checkbox
                              key={value}
                              checked={checked[facet.id].includes(value)}
                              onChange={() => toggleFacet(facet.id, value)}
                            >
                              {value}{' '}
                              <Text as="span" variant="detail" tone="subtle" tabular>· {count}</Text>
                            </Checkbox>
                          ))}
                        </Stack>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </Stack>
          </Surface>

          <div style={{ flex: '999 1 20rem', minWidth: 0 }}>
            <Stack gap={2}>
              <Table
                caption="Devices in this scope"
                columns={columns}
                data={filtered}
                responsive
                density="compact"
                empty={
                  <Text variant="body" tone="muted">
                    No devices match these filters. Clear a few and try again.
                  </Text>
                }
              />
              <Text variant="detail" tone="muted" tabular>
                Showing {filtered.length} of {scoped.length} devices
              </Text>
            </Stack>
          </div>
        </div>
      </Stack>
    </div>
  )
}

/* ---- Page --------------------------------------------------------------------- */

export function DeviceListTemplatePage() {
  return (
    <ComponentPage
      title="Device List"
      description="The fleet page: every endpoint in scope. Filters live in two places — quick ones in the header (search, OS, risk, a child-orgs switch) and deep ones in a facet sidebar (checkbox groups with counts). A KPI strip above the table re-counts as you filter, so the numbers always describe what you see. This body slots into the MSP Shell template's content region."
      installCode={`import { PageHeader, SearchInput, Select, Switch, Accordion, Checkbox, StatTile, Table, Progress } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="All live. Search, pick an OS or risk level, tick facet checkboxes — the table and the KPI strip both follow. Flip 'Include child orgs' off to scope down to just your own org's devices. On a narrow container the sidebar wraps on top of the table, and the table's responsive mode turns rows into labelled cards."
      >
        <Preview
          canvas={<DeviceListDemo />}
          code={`<PageHeader
  icon={Monitor} title="Devices"
  filters={
    <Inline gap={2} wrap>
      <SearchInput onChange={setQuery} />
      <Select options={osOptions} value={os} onChange={setOs} />
      <Select options={riskOptions} value={risk} onChange={setRisk} />
      <Switch checked={includeChildren} onChange={…}>Include child orgs</Switch>
    </Inline>
  }
/>

<Grid min="11rem" gap={3}>
  <StatTile icon={ShieldCheck} value={94} suffix="%" label="Compliance" tone="success" trend={…} />
  <StatTile icon={ShieldAlert} value={2} label="High-risk devices" tone="danger" invertDelta />
  <StatTile icon={Radar} value={88} suffix="%" label="Scan coverage" tone="primary" trend={…} />
</Grid>

{/* sidebar + table: flex-wrap glue — sidebar stacks on top when narrow */}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--vds-space-4)' }}>
  <Surface padding={3} style={{ flex: '1 1 12rem', maxWidth: '18rem' }}>
    <Accordion type="multiple" defaultValue={['platform']}>
      <AccordionItem value="platform">
        <AccordionTrigger>Platform</AccordionTrigger>
        <AccordionContent>
          <Checkbox checked={…} onChange={…}>Windows · 5</Checkbox>
          …
        </AccordionContent>
      </AccordionItem>
      {/* Device type, Customer … */}
    </Accordion>
  </Surface>

  <div style={{ flex: '999 1 20rem', minWidth: 0 }}>
    <Table
      responsive density="compact"
      columns={[
        { key: 'hostname', header: 'Device', render: (d) => <Icon … /> },
        { key: 'customer', header: 'Customer' },
        { key: 'os', header: 'OS' },
        { key: 'agent', header: 'Agent' },
        { key: 'risk', header: 'Risk', render: (d) => <Badge dot>…</Badge> },
        { key: 'lastScan', header: 'Last scan' },
        { key: 'compliance', header: 'Compliance', render: (d) => <Progress size="sm" value={d.compliance} /> },
      ]}
      data={filteredDevices}
    />
  </div>
</div>`}
        />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['Page header', 'Names the page. The filters slot holds the quick controls: search, two selects, a switch.', <span key="a"><IC>PageHeader</IC> with a <IC>filters</IC> row</span>],
            ['KPI strip', 'Compliance, risk, and scan coverage for what the table currently shows. Recomputes as filters change.', <span key="b"><IC>Grid</IC> of <IC>StatTile</IC>s</span>],
            ['Facet sidebar', 'Deep filters as checkbox groups with counts, each group collapsible. A Clear button appears once something is ticked.', <span key="c"><IC>Surface</IC> + <IC>Accordion</IC> + <IC>Checkbox</IC></span>],
            ['Device table', 'The fleet. Composed cells: an icon for the device kind, a warning glyph on outdated agents, a Badge for risk, a Progress bar for compliance.', <span key="d"><IC>Table responsive density="compact"</IC></span>],
            ['Stacking', 'No breakpoint code: the sidebar and table share a flex-wrap row. Too narrow for both → the sidebar wraps on top.', <span key="e">flex-wrap layout glue</span>],
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
