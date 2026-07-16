import { useMemo, useState } from 'react'
import {
  LayoutGrid, Mail, ScrollText, Radar, Settings, Send, FileText, ShieldCheck,
  Laptop, Monitor, Bell, GraduationCap, Database, UserCog, User, ArrowRight, LogOut,
  Shield, AlertTriangle,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  CurrentLeftNav, PageHeader, TimeframeSelect, StatTile, Card, Table, Badge,
} from '../../components/index.js'
import { VipreLogo } from '../VipreLogo.jsx'

/* ---------------------------------------------------------------------------
   The VIPRE Symphony brand lockup for the rail header.
   ------------------------------------------------------------------------- */
function SymphonyLockup() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <VipreLogo />
      <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
        Symphony
      </span>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Nav model. Each product owns a set of pages; the `owner` map lets the rail
   light up the product the active page lives inside (the filled accent toggle).
   ------------------------------------------------------------------------- */
const OVERVIEW = { id: 'overview', label: 'Overview', icon: LayoutGrid }

const PRODUCTS = [
  {
    id: 'ies', label: 'IES', icon: Mail,
    items: [
      { id: 'ies-logs', label: 'Message Logs', icon: ScrollText },
      { id: 'ies-threat', label: 'Threat Explorer', icon: Radar },
      { id: 'ies-config', label: 'Email Config.', icon: Settings },
    ],
    escape: { id: 'ies-portal', label: 'full portal', icon: ArrowRight },
  },
  {
    id: 'safesend', label: 'SafeSend', icon: Send, defaultOpen: false,
    items: [
      { id: 'ss-reports', label: 'Reports', icon: FileText },
      { id: 'ss-policies', label: 'Policies', icon: ShieldCheck },
      { id: 'ss-settings', label: 'Settings', icon: Settings },
    ],
    escape: { id: 'ss-portal', label: 'full portal', icon: ArrowRight },
  },
  {
    id: 'edr', label: 'EDR', icon: Laptop,
    items: [
      { id: 'edr-devices', label: 'Devices', icon: Monitor },
      { id: 'edr-incidents', label: 'Incidents', icon: Bell },
      { id: 'edr-settings', label: 'Settings', icon: Settings },
    ],
    escape: { id: 'edr-portal', label: 'full portal', icon: ArrowRight },
  },
  { id: 'sat', label: 'SAT', icon: GraduationCap, locked: true, lockHint: 'Not in your plan — contact sales to enable' },
  { id: 'archive', label: 'Archive', icon: Database, locked: true, lockHint: 'Not in your plan — contact sales to enable' },
]

const FOOTER_ITEMS = [
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { id: 'admins', label: 'Admins', icon: UserCog },
  { id: 'profile', label: 'Profile', icon: User, trailingIcon: LogOut, trailingLabel: 'Sign out', onTrailingClick: () => {} },
]

// page id -> owning product id (so the rail highlights the right card)
const OWNER = Object.fromEntries(
  PRODUCTS.flatMap((p) => (p.items || []).map((it) => [it.id, p.id])),
)

// flat lookup: every selectable id -> { label, icon } (for the generic header)
const LOOKUP = Object.fromEntries(
  [OVERVIEW, ...PRODUCTS.flatMap((p) => p.items || []), ...FOOTER_ITEMS,
   ...PRODUCTS.filter((p) => p.escape).map((p) => p.escape)]
    .map((it) => [it.id, it]),
)

/* ---------------------------------------------------------------------------
   A few realistic page bodies. The point of the prototype is the navigation
   FEEL, so most pages reuse a generic body; a handful are built out with real
   DS widgets (StatTile / Table / Card) to show the frame holding real content.
   ------------------------------------------------------------------------- */
const grid = (cols = 12) => ({ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem' })
const cell = (span, extra = {}) => ({ gridColumn: `span ${span}`, ...extra })

function Panel({ span = 6, h = 180, label }) {
  return (
    <div style={cell(span, {
      height: h, borderRadius: 'var(--vds-radius-lg)', border: '1px dashed var(--vds-line-strong)',
      background: 'var(--vds-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--vds-ink-subtle)', fontSize: '0.8125rem', fontWeight: 500,
    })}>{label}</div>
  )
}

function OverviewBody() {
  return (
    <div style={grid()}>
      <div style={cell(3)}><StatTile value="128,402" label="Total Emails" icon={Mail} delta="+4%" trend={[8, 9, 7, 11, 10, 13, 12]} /></div>
      <div style={cell(3)}><StatTile value="1,284" label="Detected Threats" icon={Shield} tone="warning" delta="-6%" invertDelta trend={[14, 12, 13, 9, 10, 8, 7]} /></div>
      <div style={cell(3)}><StatTile value="312" label="Devices Online" icon={Monitor} tone="success" delta="+2%" /></div>
      <div style={cell(3)}><StatTile value="7" label="Open Incidents" icon={AlertTriangle} tone="danger" delta="+3" invertDelta /></div>
      <Panel span={8} h={240} label="Email Threat Journey" />
      <div style={cell(4)}>
        <Card title="Recent activity" padding={5}>
          <ul style={{ margin: 0, paddingLeft: '1rem', display: 'grid', gap: '0.5rem', color: 'var(--vds-ink-muted)', fontSize: '0.8125rem' }}>
            <li>Quarantined phishing → 3 recipients</li>
            <li>New device enrolled — <em>WS-4471</em></li>
            <li>Policy “Exec Protection” updated</li>
            <li>Incident #4471 escalated</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function MessageLogsBody() {
  const data = [
    { id: 1, subject: 'Q3 invoice — action required', from: 'billing@acme-supply.co', verdict: 'Quarantined', tone: 'danger', time: '2m ago' },
    { id: 2, subject: 'Your package is on the way', from: 'noreply@parcel.com', verdict: 'Delivered', tone: 'success', time: '14m ago' },
    { id: 3, subject: 'Shared document: Roadmap', from: 'no-reply@docs.io', verdict: 'Suspicious', tone: 'warning', time: '38m ago' },
    { id: 4, subject: 'Password reset', from: 'security@vendor.net', verdict: 'Delivered', tone: 'success', time: '1h ago' },
    { id: 5, subject: 'RE: wire transfer confirmation', from: 'cfo@acrne-supply.co', verdict: 'Quarantined', tone: 'danger', time: '2h ago' },
  ]
  return (
    <Card padding={0}>
      <Table
        columns={[
          { key: 'subject', header: 'Subject' },
          { key: 'from', header: 'Sender' },
          { key: 'verdict', header: 'Verdict', render: (r) => <Badge tone={r.tone} dot>{r.verdict}</Badge> },
          { key: 'time', header: 'Received', align: 'right' },
        ]}
        data={data}
        zebra
      />
    </Card>
  )
}

function DevicesBody() {
  const data = [
    { id: 1, name: 'WS-4471', os: 'Windows 11', status: 'Protected', tone: 'success', seen: '1m ago' },
    { id: 2, name: 'MBP-Ortega', os: 'macOS 15.3', status: 'Protected', tone: 'success', seen: '4m ago' },
    { id: 3, name: 'WS-2210', os: 'Windows 10', status: 'At risk', tone: 'warning', seen: '22m ago' },
    { id: 4, name: 'SRV-DC01', os: 'Windows Server', status: 'Offline', tone: 'danger', seen: '3h ago' },
  ]
  return (
    <div style={grid()}>
      <div style={cell(4)}><StatTile value="312" label="Protected" icon={ShieldCheck} tone="success" /></div>
      <div style={cell(4)}><StatTile value="6" label="At risk" icon={AlertTriangle} tone="warning" /></div>
      <div style={cell(4)}><StatTile value="3" label="Offline" icon={Monitor} tone="danger" /></div>
      <div style={cell(12)}>
        <Card padding={0}>
          <Table
            columns={[
              { key: 'name', header: 'Device' },
              { key: 'os', header: 'OS' },
              { key: 'status', header: 'Status', render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
              { key: 'seen', header: 'Last seen', align: 'right' },
            ]}
            data={data}
          />
        </Card>
      </div>
    </div>
  )
}

function GenericBody({ title }) {
  return (
    <div style={grid()}>
      <div style={cell(12)}>
        <Card title={title} padding={5}>
          <p style={{ margin: 0, color: 'var(--vds-ink-muted)', fontSize: '0.875rem' }}>
            This page is a placeholder in the prototype — the frame is the same everywhere, so building
            a real screen here means swapping only this body. Use the rail to feel how you move between
            products and pages.
          </p>
        </Card>
      </div>
      <Panel span={6} h={150} label="Widget" />
      <Panel span={6} h={150} label="Widget" />
    </div>
  )
}

const PAGE_META = {
  overview: { icon: LayoutGrid, iconTone: 'primary', eyebrow: 'VIPRE Symphony', title: 'Overview' },
  'ies-logs': { icon: ScrollText, iconTone: 'primary', eyebrow: 'Integrated Email Security', title: 'Message Logs' },
  'ies-threat': { icon: Radar, iconTone: 'info', eyebrow: 'Integrated Email Security', title: 'Threat Explorer' },
  'edr-devices': { icon: Monitor, iconTone: 'success', eyebrow: 'Endpoint Detection & Response', title: 'Devices' },
  'edr-incidents': { icon: Bell, iconTone: 'danger', eyebrow: 'Endpoint Detection & Response', title: 'Incidents' },
}

function renderBody(id) {
  if (id === 'overview') return <OverviewBody />
  if (id === 'ies-logs') return <MessageLogsBody />
  if (id === 'edr-devices') return <DevicesBody />
  return <GenericBody title={LOOKUP[id]?.label || 'Page'} />
}

/* ---------------------------------------------------------------------------
   The assembled shell. CurrentLeftNav is the persistent chrome (always navy);
   the content region swaps per selected page. A content-theme toggle proves the
   rail stays navy while the page flips light/dark.
   ------------------------------------------------------------------------- */
function ShellDemo() {
  const [page, setPage] = useState('overview')
  const [dark, setDark] = useState(false)

  // Light the product that owns the active page; expand it too.
  const groups = useMemo(() => {
    const ownerId = OWNER[page]
    return PRODUCTS.map((p) =>
      p.locked ? p : { ...p, active: p.id === ownerId, defaultOpen: p.id === ownerId ? true : p.defaultOpen },
    )
  }, [page])

  const meta = PAGE_META[page] || {
    icon: LOOKUP[page]?.icon || LayoutGrid, iconTone: 'primary', eyebrow: 'VIPRE Symphony', title: LOOKUP[page]?.label || 'Page',
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="vds-text vds-text--caption"
          style={{
            appearance: 'none', cursor: 'pointer', padding: '0.25rem 0.625rem', borderRadius: '9999px',
            border: '1px solid var(--vds-line)', background: 'var(--vds-surface)', color: 'var(--vds-ink-muted)', fontWeight: 500,
          }}
        >
          {dark ? '☀ Light page' : '☾ Dark page'}
        </button>
      </div>

      <div style={{
        height: '80vh', minHeight: 640, display: 'flex',
        border: '1px solid var(--vds-line)', borderRadius: 'var(--vds-radius-lg)', overflow: 'hidden', width: '100%',
      }}>
        <CurrentLeftNav
          brand={<SymphonyLockup />}
          overview={OVERVIEW}
          groups={groups}
          footerItems={FOOTER_ITEMS}
          activeId={page}
          onSelect={setPage}
        />

        <main
          className={dark ? 'dark' : undefined}
          style={{
            flex: 1, minWidth: 0, overflowY: 'auto', background: 'var(--vds-canvas)',
            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          }}
        >
          <PageHeader
            icon={meta.icon}
            iconTone={meta.iconTone}
            eyebrow={meta.eyebrow}
            title={meta.title}
            actions={<TimeframeSelect size="sm" />}
          />
          {renderBody(page)}
        </main>
      </div>
    </div>
  )
}

export function CurrentNavShellPage() {
  return (
    <ComponentPage
      title="Current Nav Shell"
      description="A full-page app layout built around Current Left Nav — the real VIPRE frame, saved so we can build against it. The rail stays put (always navy). The content area (page header + body) swaps with each page you pick. Click through products and pages to feel how it works today — a few pages use real widgets, the rest are placeholders. Made from CurrentLeftNav + PageHeader + TimeframeSelect + StatTile / Card / Table."
      installCode={`import { CurrentLeftNav, PageHeader } from 'vipre-design-system'`}
    >
      <Section
        title="Live shell"
        note="A working demo, not a picture. Click Overview, or go into IES → Message Logs or EDR → Devices to see real widgets. The rail lights up the product that holds the current page and keeps it open. SafeSend starts closed; SAT and Archive are locked. Flip the page theme — the rail stays navy on purpose, so the frame stays steady while the page changes."
      >
        <Preview
          canvas={<ShellDemo />}
          code={`function Shell() {
  const [page, setPage] = useState('overview')
  // light + expand the product that owns the active page
  const groups = PRODUCTS.map((p) =>
    p.locked ? p : { ...p, active: p.id === OWNER[page] })

  return (
    <div className="app-shell">
      <CurrentLeftNav
        brand={<SymphonyLockup />}
        overview={{ id: 'overview', label: 'Overview', icon: LayoutGrid }}
        groups={groups}
        footerItems={FOOTER_ITEMS}
        activeId={page}
        onSelect={setPage}
      />
      <main className="app-shell__content">
        <PageHeader icon={meta.icon} eyebrow={meta.eyebrow} title={meta.title}
          actions={<TimeframeSelect size="sm" />} />
        {renderBody(page)}
      </main>
    </div>
  )
}`}
        />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['Product rail', 'Navy frame that stays put. Switch product or page, close cards, jump to a “full portal”, use the account footer.', <IC key="a">CurrentLeftNav</IC>],
            ['Page header', 'Says what the page is (product eyebrow + title) and sets the timeframe. Only the title is required.', <IC key="b">PageHeader</IC>],
            ['Body', 'The part that changes. Same frame everywhere — building a screen means replacing only this part.', <span key="c"><IC>StatTile</IC> / <IC>Card</IC> / <IC>Table</IC></span>],
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
