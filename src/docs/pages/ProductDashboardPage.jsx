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

/* ---- Demo data ------------------------------------------------------------ */
const TREE = [
  {
    id: 'r1', name: 'Monthly Reseller', type: 'reseller', status: 'active',
    children: [{ id: 'c1', name: 'qa_admin13', type: 'customer', status: 'active' }],
  },
]
const PATH = [TREE[0], TREE[0].children[0]]

/* Product glyphs are SVG path strings on the tile's 32×32 grid — they ship with
   your product config, not with the design system. */
const GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
}

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
