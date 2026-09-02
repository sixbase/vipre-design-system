import { useState } from 'react'
import {
  Mail, ScrollText, ShieldAlert, SlidersHorizontal,
  KeyRound, Users, Tag, Building2, User,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  ScopeNavigator, SideNav, ProductTile, AppShell, TopBar, PageHeader, TimeframeSelect,
} from '../../components/index.js'
import { VipreLogo } from '../VipreLogo.jsx'
import { GLYPHS } from '../templateData.js'

/* ---- Demo data ------------------------------------------------------------ */
const TREE = [
  {
    id: 'r1', name: 'Monthly Reseller', type: 'reseller', status: 'active',
    children: [{ id: 'c1', name: 'qa_admin13', type: 'customer', status: 'active' }],
  },
]
const PATH = [TREE[0], TREE[0].children[0]]


const SECTIONS = [
  {
    id: 'products',
    label: 'Products',
    items: [
      {
        id: 'ies', label: 'IES', glyph: GLYPHS.ies,
        items: [
          { id: 'message-logs', label: 'Message Logs', icon: ScrollText },
          { id: 'threat-explorer', label: 'Threat Explorer', icon: ShieldAlert },
          { id: 'action-rules', label: 'Action Rules', icon: SlidersHorizontal },
        ],
        escape: { id: 'ies-portal', label: 'Full portal' },
      },
      { id: 'safesend', label: 'SafeSend', glyph: GLYPHS.safesend, locked: true, lockHint: 'Not in your plan' },
      { id: 'edr', label: 'EDR', glyph: GLYPHS.edr, locked: true, lockHint: 'Not in your plan' },
    ],
  },
]
const FOOTER_SECTIONS = [
  {
    id: 'admin',
    label: 'Other',
    items: [
      { id: 'saml', label: 'SAML', icon: KeyRound },
      { id: 'admins', label: 'Admins', icon: Users },
      { id: 'roles', label: 'Roles', icon: Tag },
      { id: 'account', label: 'Account', icon: Building2 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
]

const ACCOUNT = {
  name: 'qa_admin13',
  typeLabel: 'Customer',
  tile: (
    <ProductTile>
      <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">Q</text>
    </ProductTile>
  ),
}

/* A sized, labelled placeholder — the body is a spacing study, so real widgets
   (KPIs, charts, tables) are stubbed as blocks that occupy the grid. */
function Block({ span = 3, h = 96, label }) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        height: h,
        borderRadius: 'var(--vds-radius-lg)',
        border: '1px dashed var(--vds-line-strong)',
        background: 'var(--vds-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--vds-ink-subtle)',
        fontSize: '0.8125rem',
        fontWeight: 500,
        textAlign: 'center',
        padding: '0.5rem',
      }}
    >
      {label}
    </div>
  )
}

/* The assembled shell: ScopeNavigator on top, then the AppShell frame — the v2
   SideNav rail (always navy) + a content region (PageHeader + 12-col body). */
function ShellDemo() {
  const [path, setPath] = useState(PATH)
  const [page, setPage] = useState('message-logs')
  return (
    <div
      style={{
        height: 620,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Scope bar — persistent chrome above the frame */}
      <ScopeNavigator path={path} onNavigate={setPath} rootItems={TREE} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Product rail — always the navy chrome; selection follows --vds-nav-accent */}
        <SideNav
          aria-label="Product"
          account={ACCOUNT}
          sections={SECTIONS}
          footerSections={FOOTER_SECTIONS}
          activeId={page}
          onSelect={setPage}
        />

        {/* Content region — page header + swappable 12-col body */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            background: 'var(--vds-canvas)',
            padding: 'var(--vds-page-pad)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <PageHeader
            icon={Mail}
            eyebrow="Integrated Email Security"
            title="Overview"
            actions={<TimeframeSelect size="sm" />}
          />

          {/* The swappable body: 12-col grid, here stubbed with placeholders that
              map onto the Overview screen (KPI row → hero viz → ranked lists). */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }}>
            <Block span={3} label="Total Emails" />
            <Block span={3} label="Detected Threats" />
            <Block span={3} label="Malicious" />
            <Block span={3} label="Suspicious" />
            <Block span={8} h={240} label="Email Threat Journey" />
            <Block span={4} h={240} label="Emails vs Threats" />
            <Block span={6} h={170} label="Top Targeted Users" />
            <Block span={6} h={170} label="Top Targeted Groups" />
          </div>
        </main>
      </div>
    </div>
  )
}

export function ProductDashboardPage() {
  return (
    <ComponentPage
      title="Product Dashboard"
      description="The page layout behind the Vipre Symphony Overview. The frame stays put (scope bar + navy product rail); the content changes (page header + a 12-column body grid). Build the frame once, swap the body per page. In a real app, wrap the whole thing in AppShell — it handles the mobile drawer and page padding for you."
      installCode={`import { AppShell, TopBar, SideNav, ScopeNavigator, PageHeader } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="The full frame. The scope bar and product rail stay put; the content area changes per page. Move around the scope bar, open a product in the rail, change the timeframe — then imagine each grey block as a real widget. The body is a 12-column grid: a row of 4 KPIs, a big chart next to a smaller one, then two ranked lists. The rail is always navy in both themes; its selected color is the brandable --vds-nav-accent token."
      >
        <Preview canvas={<ShellDemo />} code={`<AppShell
  nav={
    <SideNav
      account={{ name: 'qa_admin13', typeLabel: 'Customer', tile: <ProductTile>…</ProductTile> }}
      sections={sections}            // product groups with glyph tiles, locked teasers
      footerSections={footer}        // SAML / Admins / Roles / …
      activeId={page} onSelect={setPage}
    />
  }
  topBar={<TopBar leading={<AppShellNavTrigger />}><ScopeNavigator … /></TopBar>}
>
  <PageHeader icon={Mail} eyebrow="Integrated Email Security" title="Overview" actions={<TimeframeSelect />} />
  <Grid cols={12} gap={4}>
    {/* KPI row */}      <MetricCard span={3} … /> ×4
    {/* hero + second */} <Panel span={8} /> <Panel span={4} />
    {/* ranked lists */}  <Panel span={6} /> <Panel span={6} />
  </Grid>
</AppShell>`} />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['App frame', 'Holds the layout: rail on the left, top bar up top, scrolling page. On a narrow screen the rail slides out as a drawer.', <IC key="f">AppShell</IC>],
            ['Scope bar', 'Which account am I working on. Stays put.', <IC key="a">ScopeNavigator</IC>],
            ['Product rail', 'Switch product or section; locks and "Full portal" live here. Stays put, always navy.', <IC key="b">SideNav</IC>],
            ['Page header', 'Says what the page is and sets the timeframe. Only the title is required.', <IC key="c">PageHeader</IC>],
            ['Body grid', 'The part that changes — KPI row first, then a 12-column grid of widgets.', <span key="d"><IC>Grid</IC> + metrics / charts / tables</span>],
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
