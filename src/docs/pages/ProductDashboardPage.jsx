import { useState } from 'react'
import {
  Mail, Send, Monitor, ScrollText, ShieldAlert, SlidersHorizontal,
  KeyRound, Users, Tag, Building2, User, ArrowUpRight,
} from 'lucide-react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { ScopeNavigator, SideNav, PageHeader, TimeframeSelect } from '../../components/index.js'
import { VipreLogo } from '../VipreLogo.jsx'

/* ---- Demo data ------------------------------------------------------------ */
const TREE = [
  {
    id: 'r1', name: 'Monthly Reseller', type: 'reseller', status: 'active',
    children: [{ id: 'c1', name: 'qa_admin13', type: 'customer', status: 'active' }],
  },
]
const PATH = [TREE[0], TREE[0].children[0]]

const GROUPS = [
  {
    id: 'ies', label: 'IES', icon: Mail,
    items: [
      { id: 'message-logs', label: 'Message Logs', icon: ScrollText },
      { id: 'threat-explorer', label: 'Threat Explorer', icon: ShieldAlert },
      { id: 'action-rules', label: 'Action Rules', icon: SlidersHorizontal },
    ],
    escape: { id: 'ies-portal', label: 'full portal', icon: ArrowUpRight },
  },
  { id: 'safesend', label: 'SafeSend', icon: Send, locked: true, lockHint: 'Not in your plan' },
  { id: 'edr', label: 'EDR', icon: Monitor, locked: true, lockHint: 'Not in your plan' },
]
const FOOTER_ITEMS = [
  { id: 'saml', label: 'SAML', icon: KeyRound },
  { id: 'admins', label: 'Admins', icon: Users },
  { id: 'roles', label: 'Roles', icon: Tag },
  { id: 'account', label: 'Account', icon: Building2 },
  { id: 'profile', label: 'Profile', icon: User },
]

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

/* The assembled shell: ScopeNavigator + SideNav + (PageHeader + 12-col body).
   Opens in the LIGHT theme; the toggle flips the chrome to navy. When `dark` is
   set the scope bar + rail get className="dark"; otherwise they follow the theme. */
function ShellDemo({ initialDark = false }) {
  const [path, setPath] = useState(PATH)
  const [page, setPage] = useState('message-logs')
  const [dark, setDark] = useState(initialDark)
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="vds-text vds-text--caption"
          style={{
            appearance: 'none',
            cursor: 'pointer',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            border: '1px solid var(--vds-line)',
            background: 'var(--vds-surface)',
            color: 'var(--vds-ink-muted)',
            fontWeight: 500,
          }}
        >
          {dark ? '☀ Light chrome' : '☾ Navy chrome'}
        </button>
      </div>
      <div
        style={{
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--vds-line)',
          borderRadius: 'var(--vds-radius-lg)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
      {/* Scope bar — persistent, dark */}
      <ScopeNavigator className={dark ? 'dark' : undefined} path={path} onNavigate={setPath} rootItems={TREE} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Product rail — persistent, dark */}
        <SideNav
          className={dark ? 'dark' : undefined}
          brand={<VipreLogo className="vds-logo" />}
          groups={GROUPS}
          footerItems={FOOTER_ITEMS}
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
            padding: '1.5rem',
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
    </div>
  )
}

export function ProductDashboardPage() {
  return (
    <ComponentPage
      title="Product Dashboard"
      description="The page template behind the Vipre Symphony Overview — a persistent shell (scope navigator + product rail) wrapping a swappable content region (page header + a 12-column body grid). Every product page is a different body inside the same frame, so the chrome is built once and the body changes per page. Composed from ScopeNavigator + SideNav + PageHeader; the body fills with DS metrics, charts, and tables (stubbed here as placeholders while we study spacing)."
      installCode={`import { ScopeNavigator, SideNav, PageHeader } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="The full shell. The scope bar and product rail are persistent chrome; the content region is what changes per page. Drill the scope bar, switch products in the rail, change the timeframe — then picture each grey block as a real widget. The body is a 12-column grid: a 4-up KPI row, a hero visualization beside a secondary chart, then two ranked lists. It opens in the light theme — use the toggle above the frame to flip the chrome to navy."
      >
        <Preview canvas={<ShellDemo />} code={`<div className="app-shell">
  <ScopeNavigator className="dark" path={path} onNavigate={setPath} rootItems={tree} />
  <div className="app-shell__body">
    <SideNav className="dark" brand={<VipreMark/>} groups={groups} footerItems={footer} activeId={page} onSelect={setPage} />
    <main className="app-shell__content">
      <PageHeader icon={Mail} eyebrow="Integrated Email Security" title="Overview" actions={<TimeframeSelect />} />
      <Grid cols={12} gap={4}>
        {/* KPI row */}
        <MetricCard span={3} … /> ×4
        {/* hero + secondary */}
        <Panel span={8} /> <Panel span={4} />
        {/* ranked lists */}
        <Panel span={6} /> <Panel span={6} />
      </Grid>
    </main>
  </div>
</div>`} />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['Scope bar', 'Which account am I acting on (MSP context switch). Persistent.', <IC key="a">ScopeNavigator</IC>],
            ['Product rail', 'Switch product / section; entitlement & "full portal" live here. Persistent.', <IC key="b">SideNav</IC>],
            ['Page header', 'Orient the page + scope time. Title is the only required slot.', <IC key="c">PageHeader</IC>],
            ['Body grid', 'The swappable content — KPI row first, then a 12-col grid of widgets.', <span key="d"><IC>Grid</IC> + metrics / charts / tables</span>],
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
