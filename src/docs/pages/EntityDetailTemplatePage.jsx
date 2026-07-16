import { Copy, GraduationCap, Lock, Mail, Monitor, MoreHorizontal, Pencil, Radar, Shield, Trash2, Users } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  Breadcrumb, Avatar, Badge, Tag, Button, Icon, Heading, Text,
  Menu, MenuItem, MenuSeparator,
  Tabs, TabList, Tab, TabPanel,
  MetricCard, StatTile, Grid, Stack, Inline, Card, Divider,
  Progress, Sparkline, DescriptionList, Alert, EmptyState,
} from '../../components/index.js'
import { PRODUCTS } from '../templateData.js'

const PRODUCT_ICONS = { ies: Mail, edr: Radar, sat: GraduationCap }

/* ---- The assembled page ------------------------------------------------------ */

function EntityDetailDemo() {
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
      <Stack gap={5}>
        {/* Where am I — the scope trail down to this account. */}
        <Breadcrumb
          items={[
            { label: 'All accounts', onClick: () => {} },
            { label: 'Meridian Distribution', onClick: () => {} },
            { label: 'Northwind Partners', onClick: () => {} },
            { label: 'Acme Corp' },
          ]}
        />

        {/* Identity header — who this is, at a glance, plus the account actions. */}
        <Inline justify="between" wrap gap={3} align="start">
          <Inline gap={3}>
            <Avatar name="Acme Corp" shape="square" size="xl" />
            <Stack gap={1}>
              <Heading level="heading" as="h2">Acme Corp</Heading>
              <Inline gap={2} wrap>
                <Badge tone="success" dot>Active</Badge>
                <Tag size="sm">Customer</Tag>
                <Text as="span" variant="detail" tone="muted">Customer since Mar 2024</Text>
              </Inline>
            </Stack>
          </Inline>
          <Inline gap={2}>
            <Button size="sm" variant="outline" tone="neutral">Open portal</Button>
            <Menu
              aria-label="Account actions"
              placement="bottom-end"
              trigger={
                <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Account actions">
                  <Icon as={MoreHorizontal} size="sm" />
                </Button>
              }
            >
              <MenuItem icon={Pencil} onSelect={() => {}}>Edit account</MenuItem>
              <MenuItem icon={Copy} onSelect={() => {}}>Copy account ID</MenuItem>
              <MenuSeparator />
              <MenuItem icon={Trash2} danger onSelect={() => {}}>Suspend account</MenuItem>
            </Menu>
          </Inline>
        </Inline>

        <Tabs defaultValue="overview">
          <TabList aria-label="Account sections">
            <Tab value="overview">Overview</Tab>
            <Tab value="products" count={PRODUCTS.length}>Products</Tab>
            <Tab value="details">Details</Tab>
          </TabList>

          {/* Overview — the hero metric, the quick stats, and package adoption. */}
          <TabPanel value="overview">
            <Stack gap={4} style={{ paddingTop: 'var(--vds-space-4)' }}>
              <MetricCard
                icon={Monitor}
                title="Protected devices"
                period="Last 30 days"
                value={214}
                delta="+6"
                deltaCaption="vs previous 30 days"
                progress={{ value: 89, label: 'Coverage target: 240 seats' }}
                breakdown={[
                  { label: 'Workstations', value: 148 },
                  { label: 'Laptops', value: 58 },
                  { label: 'Servers', value: 8 },
                ]}
              />
              <Grid min="11rem" gap={3}>
                <StatTile icon={Shield} value={342} label="Threats blocked" tone="success" delta="+12%" trend={[4, 6, 5, 8, 7, 9, 11]} />
                <StatTile icon={Users} value={89} suffix="%" label="Seats used" tone="primary" caption="214 of 240" />
                <StatTile icon={Monitor} value={94} suffix="%" label="Compliance" tone="success" delta="+2%" />
              </Grid>

              <Card title="Package adoption" actions={<Button size="sm" variant="ghost" tone="neutral">View all</Button>}>
                <Stack gap={3}>
                  {PRODUCTS.map((p, i) => (
                    <Stack key={p.id} gap={3}>
                      {i > 0 && <Divider />}
                      <Inline justify="between" wrap gap={3}>
                        <Inline gap={2}>
                          <Icon as={PRODUCT_ICONS[p.id]} size="sm" tone="muted" />
                          <Stack gap={0}>
                            <Text as="span" variant="body">{p.full}</Text>
                            <Text as="span" variant="detail" tone="muted" tabular>
                              {p.used} of {p.seats} seats
                            </Text>
                          </Stack>
                        </Inline>
                        <Inline gap={2}>
                          <Sparkline data={p.trend} tone="primary" width={80} height={24} label={`${p.name} adoption trend`} />
                          <Text as="span" variant="body" tabular>{p.adoption}%</Text>
                        </Inline>
                      </Inline>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </TabPanel>

          {/* Products — one card per product, plus a teaser for the locked one. */}
          <TabPanel value="products">
            <div style={{ paddingTop: 'var(--vds-space-4)' }}>
              <Grid min="13rem" gap={3}>
                {PRODUCTS.map((p) => (
                  <Card key={p.id} title={p.name} actions={<Badge tone="success" dot>Active</Badge>}>
                    <Stack gap={3}>
                      <Text variant="detail" tone="muted">{p.full}</Text>
                      <Progress value={p.adoption} label="Adoption" showValue size="sm" />
                      <Text variant="detail" tone="muted" tabular>{p.used} of {p.seats} seats in use</Text>
                    </Stack>
                  </Card>
                ))}
                <Card title="SafeSend">
                  <EmptyState
                    size="sm"
                    inset
                    icon={Lock}
                    title="Not in this plan"
                    actions={<Button size="sm" variant="soft">Add product</Button>}
                  >
                    Stop misdirected email before it leaves the org.
                  </EmptyState>
                </Card>
              </Grid>
            </div>
          </TabPanel>

          {/* Details — the labelled facts, plus anything the admin should know. */}
          <TabPanel value="details">
            <Stack gap={4} style={{ paddingTop: 'var(--vds-space-4)' }}>
              <Alert tone="info" title="Inherited policies">
                This account inherits 4 policies from Northwind Partners. Local policies win when they overlap.
              </Alert>
              <DescriptionList
                columns={2}
                divided
                items={[
                  { term: 'Account ID', description: 'acct_8f42-acme' },
                  { term: 'Type', description: 'Customer' },
                  { term: 'Status', description: 'Active' },
                  { term: 'Region', description: 'EU (Frankfurt)' },
                  { term: 'Primary contact', description: 'it@acme.example' },
                  { term: 'Seats', description: '214 of 240 used' },
                  { term: 'Customer since', description: 'Mar 2024' },
                  { term: 'Managed by', description: 'Northwind Partners' },
                  { term: 'Products', description: 'IES, EDR, SAT', span: 2 },
                ]}
              />
            </Stack>
          </TabPanel>
        </Tabs>
      </Stack>
    </div>
  )
}

/* ---- Page ---------------------------------------------------------------------- */

export function EntityDetailTemplatePage() {
  return (
    <ComponentPage
      title="Entity Detail"
      description="One account, up close. A breadcrumb says where you are in the partner tree. The identity header says who this is — tile, name, status, type — with the account actions on the right. Tabs split the rest: Overview for the numbers, Products for what they own, Details for the facts. This body slots into the MSP Shell template's content region; the Customer Directory's drawer is the compact version of this same anatomy."
      installCode={`import { Breadcrumb, Avatar, Tabs, MetricCard, StatTile, Card, Progress, DescriptionList } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="All live. Switch tabs, open the … menu, hover the sparklines. Overview leads with one hero metric (MetricCard counts up on scroll-in) and backs it with quick stats and per-product adoption. Products is a card grid — the locked product gets a teaser card with the action to fix it. Details is labelled facts plus an inline Alert for the one thing an admin must know. Panels keep their state when you switch away and back."
      >
        <Preview
          canvas={<EntityDetailDemo />}
          code={`<Breadcrumb items={[
  { label: 'All accounts', href: '#/' },
  { label: 'Meridian Distribution', href: '#/meridian' },
  { label: 'Northwind Partners', href: '#/northwind' },
  { label: 'Acme Corp' },                       // current page
]} />

{/* identity header */}
<Inline justify="between" wrap gap={3} align="start">
  <Inline gap={3}>
    <Avatar name="Acme Corp" shape="square" size="xl" />
    <Stack gap={1}>
      <Heading level="heading" as="h2">Acme Corp</Heading>
      <Inline gap={2} wrap>
        <Badge tone="success" dot>Active</Badge>
        <Tag size="sm">Customer</Tag>
      </Inline>
    </Stack>
  </Inline>
  <Inline gap={2}>
    <Button variant="outline" tone="neutral">Open portal</Button>
    <Menu trigger={<Button iconOnly aria-label="Account actions">…</Button>}>…</Menu>
  </Inline>
</Inline>

<Tabs defaultValue="overview">
  <TabList aria-label="Account sections">
    <Tab value="overview">Overview</Tab>
    <Tab value="products" count={3}>Products</Tab>
    <Tab value="details">Details</Tab>
  </TabList>

  <TabPanel value="overview">
    <MetricCard icon={Monitor} title="Protected devices" value={214} delta="+6"
                progress={{ value: 89, label: 'Coverage target: 240 seats' }}
                breakdown={[{ label: 'Workstations', value: 148 }, …]} />
    <Grid min="11rem" gap={3}> <StatTile … /> ×3 </Grid>
    <Card title="Package adoption"> {/* rows: name + seats + Sparkline + % */} </Card>
  </TabPanel>

  <TabPanel value="products">
    <Grid min="13rem" gap={3}>
      <Card title="IES" actions={<Badge tone="success" dot>Active</Badge>}>
        <Progress value={89} label="Adoption" showValue />
      </Card>
      {/* … */}
      <Card title="SafeSend">
        <EmptyState size="sm" inset icon={Lock} title="Not in this plan"
                    actions={<Button variant="soft">Add product</Button>} />
      </Card>
    </Grid>
  </TabPanel>

  <TabPanel value="details">
    <Alert tone="info" title="Inherited policies">…</Alert>
    <DescriptionList columns={2} divided items={facts} />
  </TabPanel>
</Tabs>`}
        />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['Breadcrumb', 'The trail from the root to this account. The last crumb is the current page; long trails fold their middle into a … menu.', <IC key="a">Breadcrumb</IC>],
            ['Identity header', 'Who this is: tile, name, status Badge, type Tag — with Open portal and a … actions Menu on the right. Built from basic pieces, no special component.', <span key="b"><IC>Avatar</IC> + <IC>Badge</IC>/<IC>Tag</IC> + <IC>Menu</IC></span>],
            ['Tabs', 'Splits the page into Overview / Products / Details. Panels stay mounted, so state survives switching.', <span key="c"><IC>Tabs</IC> (<IC>vds-tabs</IC>)</span>],
            ['Overview', 'One hero number with target + breakdown, three quick stats, then per-product adoption rows with trends.', <span key="d"><IC>MetricCard</IC> + <IC>StatTile</IC>s + <IC>Card</IC> with <IC>Sparkline</IC> rows</span>],
            ['Products', 'A card per product with an adoption bar; locked products get a teaser card with the fix action.', <span key="e"><IC>Grid</IC> of <IC>Card</IC>s + <IC>Progress</IC> + <IC>EmptyState inset</IC></span>],
            ['Details', 'Labelled facts in two columns that drop to one when narrow, with an Alert above for the must-know.', <span key="f"><IC>DescriptionList</IC> + <IC>Alert</IC></span>],
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
