import { useState } from 'react'
import {
  Bell, Building2, KeyRound, LayoutGrid, Monitor,
  Radar, ScrollText, Shield, User, UserCog, Users,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  AppShell, AppShellNavTrigger, TopBar, SideNav, ProductTile,
  PageHeader, TimeframeSelect, StatTile, Grid, Stack, Button, Avatar,
} from '../../components/index.js'
import { VipreLogo } from '../VipreLogo.jsx'
import { GLYPHS } from '../templateData.js'

/* ---- Demo data ------------------------------------------------------------ */

const MeridianTile = (
  <ProductTile>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">M</text>
  </ProductTile>
)
const AcmeTile = (
  <ProductTile>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">A</text>
  </ProductTile>
)

/* The MSP view: partner pages first, then the product cards. */
const MSP_SECTIONS = [
  {
    id: 'partners',
    label: 'Partners',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'customers', label: 'Customers', icon: Building2 },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    items: [
      {
        id: 'ies', label: 'IES', glyph: GLYPHS.ies,
        items: [
          { id: 'ies-logs', label: 'Message Logs', icon: ScrollText },
          { id: 'ies-threats', label: 'Threat Explorer', icon: Radar },
        ],
        escape: { id: 'ies-portal', label: 'Full portal' },
      },
      {
        id: 'edr', label: 'EDR', glyph: GLYPHS.edr,
        items: [
          { id: 'edr-devices', label: 'Devices', icon: Monitor },
          { id: 'edr-incidents', label: 'Incidents', icon: Bell, badge: 3 },
        ],
      },
      { id: 'safesend', label: 'SafeSend', glyph: GLYPHS.safesend, locked: true, lockHint: 'Not in your plan' },
    ],
  },
]

/* Scoped into one customer: only that customer's products. */
const CUSTOMER_SECTIONS = [
  {
    id: 'products',
    label: 'Products',
    items: [
      {
        id: 'ies', label: 'IES', glyph: GLYPHS.ies, defaultOpen: true,
        items: [
          { id: 'ies-overview', label: 'Overview', icon: LayoutGrid },
          { id: 'ies-logs', label: 'Message Logs', icon: ScrollText },
        ],
        escape: { id: 'ies-portal', label: 'Full portal' },
      },
      {
        id: 'edr', label: 'EDR', glyph: GLYPHS.edr,
        items: [{ id: 'edr-devices', label: 'Devices', icon: Monitor }],
      },
      { id: 'sat', label: 'SAT', glyph: GLYPHS.sat, locked: true, lockHint: 'Not subscribed' },
    ],
  },
]

const FOOTER_SECTIONS = [
  {
    id: 'other',
    label: 'Other',
    items: [
      { id: 'admins', label: 'Admins', icon: UserCog },
      { id: 'saml', label: 'SAML', icon: KeyRound },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
]

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  'ies-overview': 'Overview',
  'ies-logs': 'Message Logs',
  'ies-threats': 'Threat Explorer',
  'ies-portal': 'IES Full Portal',
  'edr-devices': 'Devices',
  'edr-incidents': 'Incidents',
  admins: 'Admins',
  saml: 'SAML',
  profile: 'Profile',
}

/* ---- The assembled shell --------------------------------------------------- */

function ShellDemo() {
  const [scoped, setScoped] = useState(false)
  const [page, setPage] = useState('dashboard')

  const scopeIn = () => {
    setScoped(true)
    setPage('ies-overview')
  }
  const scopeOut = () => {
    setScoped(false)
    setPage('dashboard')
  }

  const account = scoped
    ? { name: 'Acme Corp', typeLabel: 'Customer', tile: AcmeTile }
    : { name: 'Meridian Distribution', typeLabel: 'Distributor', tile: MeridianTile }

  const kpis = scoped
    ? [
        { icon: Monitor, value: 214, label: 'Devices', tone: 'default', delta: '+6' },
        { icon: Shield, value: 342, label: 'Threats blocked', tone: 'success', trend: [4, 6, 5, 8, 7, 9, 11] },
        { icon: Users, value: 89, suffix: '%', label: 'Seats used', tone: 'primary', caption: '214 of 240' },
      ]
    : [
        { icon: Building2, value: 48, label: 'Customers', tone: 'default', delta: '+3' },
        { icon: Monitor, value: 2914, label: 'Devices', tone: 'primary', trend: [20, 22, 21, 25, 27, 28, 30] },
        { icon: Shield, value: 6412, label: 'Threats blocked', tone: 'success', delta: '+12%' },
      ]

  return (
    <div
      style={{
        width: '100%',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* AppShell normally fills the viewport; an inline height confines the demo. */}
      <AppShell
        style={{ height: 620 }}
        nav={
          <SideNav
            aria-label="Product"
            account={account}
            onBack={scoped ? scopeOut : undefined}
            parentName="Meridian Distribution"
            sections={scoped ? CUSTOMER_SECTIONS : MSP_SECTIONS}
            footerSections={FOOTER_SECTIONS}
            activeId={page}
            onSelect={setPage}
          />
        }
        topBar={
          <TopBar
            tone="navy"
            leading={<AppShellNavTrigger />}
            trailing={<Avatar name="Priya Sharma" size="sm" />}
          >
            <VipreLogo className="vds-logo" />
          </TopBar>
        }
      >
        <Stack gap={6}>
          <PageHeader
            eyebrow={scoped ? 'Acme Corp' : 'Meridian Distribution'}
            title={PAGE_TITLES[page] ?? 'Dashboard'}
            actions={<TimeframeSelect size="sm" />}
          />
          <Grid min="12rem" gap={3}>
            {kpis.map((k) => (
              <StatTile key={k.label} {...k} />
            ))}
          </Grid>
          {!scoped && (
            <div>
              <Button variant="outline" tone="neutral" size="sm" onClick={scopeIn}>
                Scope into Acme Corp
              </Button>
            </div>
          )}
        </Stack>
      </AppShell>
    </div>
  )
}

/* ---- Page ------------------------------------------------------------------ */

export function MspShellTemplatePage() {
  return (
    <ComponentPage
      title="MSP Shell"
      description="The full chrome around every MSP screen. AppShell is the frame; the navy SideNav rail sits on the left; the navy TopBar sits on top; your page fills the rest. The rail's account header shows who you are scoped to — step into a customer and the whole menu swaps to their world, with a Back row to climb out. Build this frame once. Every page after this only changes the content."
      installCode={`import { AppShell, AppShellNavTrigger, TopBar, SideNav, ProductTile, PageHeader } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="Everything is live. Click pages in the rail, open and close product cards, collapse the rail with the bottom row. Then click 'Scope into Acme Corp' — the account header swaps, the sections become Acme's products, and a Back row appears. Click Back to climb out again. Below the lg breakpoint the rail becomes a drawer; the hamburger in the top bar opens it."
      >
        <Preview
          canvas={<ShellDemo />}
          code={`const [scoped, setScoped] = useState(false)
const [page, setPage] = useState('dashboard')

<AppShell
  nav={
    <SideNav
      aria-label="Product"
      account={scoped ? acmeAccount : mspAccount}   // { name, typeLabel, tile }
      onBack={scoped ? () => setScoped(false) : undefined}
      parentName="Meridian Distribution"
      sections={scoped ? customerSections : mspSections}  // Partners / Products groups
      footerSections={otherSections}                       // Admins / SAML / Profile
      activeId={page}
      onSelect={setPage}
    />
  }
  topBar={
    <TopBar tone="navy" leading={<AppShellNavTrigger />} trailing={<Avatar … />}>
      <VipreLogo />
    </TopBar>
  }
>
  <PageHeader eyebrow={accountName} title={pageTitle} actions={<TimeframeSelect />} />
  {/* …the page body — see the other templates… */}
</AppShell>`}
        />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['App frame', 'Owns the layout: rail column, top bar, scrolling content. Below the lg breakpoint the rail becomes an off-canvas drawer.', <IC key="a">AppShell</IC>],
            ['Top bar', 'The navy strip on top. Hamburger on the left (only shows on small screens), brand in the middle, account actions on the right.', <span key="b"><IC>TopBar tone="navy"</IC> + <IC>AppShellNavTrigger</IC></span>],
            ['Product rail', 'The navy menu. Account header up top, product cards in the middle, admin rows pinned at the bottom. Always navy in both themes.', <span key="c"><IC>SideNav</IC> (<IC>vds-sidenav</IC>)</span>],
            ['Scope header', 'Who you are working on. Scoping into a customer swaps the account and sections; onBack adds the "Back to …" row.', <span key="d"><IC>SideNav</IC> account + <IC>onBack</IC></span>],
            ['Page header', 'Names the page and holds its controls. Only the title is required.', <IC key="e">PageHeader</IC>],
            ['Body', 'The only part that changes per page. See the other templates for full bodies.', <span key="f">your page content</span>],
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
