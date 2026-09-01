import { useMemo, useState } from 'react'
import { ShieldCheck, Mail, Globe, Database, Eye, Pencil, Trash2, Copy, MoreHorizontal, Download, ShieldAlert, Search, Send, Lock, Shield, TriangleAlert, Paperclip, Clock, CircleCheck, X, Check, Calendar, FileText, Users , Stacks} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Table, Badge, Button, Text, Icon, Inline, Stack, Avatar, Progress, Pagination, EmptyState, Menu, MenuItem, MenuSeparator, Divider, Tag, ProductTile } from '../../components/index.js'

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
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={`${label} actions`}>
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
          <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={`Actions for ${user.name}`}>
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

/* ============================================================================
   Compact audit log — a dense, log-style table. Each row is a ONE-LINE summary;
   the three columns that make audit logs tall (recipients, attachments, DLP
   outcomes) collapse into single-line count chips, and the verbose breakdown
   moves into the Table's expandable detail drawer. Nothing is lost — it just
   isn't in the resting row.
   ========================================================================== */

/* One inline count: a small tinted icon + tabular number, kept to a single
   line. `color` is always a semantic token — never a raw value. */
function Count({ icon, n, color, label }) {
  return (
    <span
      title={label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', color }}
    >
      <Icon as={icon} size="xs" />
      <Text as="span" variant="detail" tabular style={{ color: 'inherit', fontWeight: 600 }}>{n}</Text>
    </span>
  )
}

/* Recipients by trust zone: internal (brand), external (caution), forbidden
   (danger). One line replaces the source's stacked pills. */
function CountRow({ children }) {
  // inline-flex is flex-wrap:nowrap by default, so the chips never stack — the
  // cell stays one line and the column just widens to fit (the table scrolls
  // sideways if it must). That single line is the whole point of "compact".
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--vds-space-2)', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function RecipientCounts({ internal, external, forbidden }) {
  return (
    <CountRow>
      {internal ? <Count icon={Shield} n={internal} color="var(--vds-primary)" label={`${internal} internal`} /> : null}
      {external ? <Count icon={Globe} n={external} color="var(--vds-on-warning-soft)" label={`${external} external`} /> : null}
      {forbidden ? <Count icon={TriangleAlert} n={forbidden} color="var(--vds-danger)" label={`${forbidden} forbidden`} /> : null}
    </CountRow>
  )
}

function AttachmentCounts({ scanned, attached, failed }) {
  if (!scanned && !attached && !failed) return <Text as="span" variant="detail" tone="subtle">—</Text>
  return (
    <CountRow>
      {failed ? <Count icon={X} n={failed} color="var(--vds-danger)" label={`${failed} failed`} /> : null}
      {attached ? <Count icon={Paperclip} n={attached} color="var(--vds-ink-muted)" label={`${attached} attached`} /> : null}
      {scanned ? <Count icon={Check} n={scanned} color="var(--vds-ink-subtle)" label={`${scanned} scanned`} /> : null}
    </CountRow>
  )
}

/* DLP outcome: a "DLP" flag when the scan matched, plus danger-tinted removal
   counts. The full sentence-form list is in the drawer. */
function DlpFlags({ matches, recipientsRemoved, attachmentsRemoved }) {
  if (!matches && !recipientsRemoved && !attachmentsRemoved)
    return <Text as="span" variant="detail" tone="subtle">—</Text>
  return (
    <CountRow>
      {matches ? <Tag size="sm" tone="amber">DLP</Tag> : null}
      {recipientsRemoved ? <Count icon={Users} n={`−${recipientsRemoved}`} color="var(--vds-danger)" label={`${recipientsRemoved} recipients removed`} /> : null}
      {attachmentsRemoved ? <Count icon={Paperclip} n={`−${attachmentsRemoved}`} color="var(--vds-danger)" label={`${attachmentsRemoved} attachments removed`} /> : null}
    </CountRow>
  )
}

/* Status → a single Badge (tone + icon) instead of the source's colored pill. */
const LOG_STATUS = {
  'Confirmed & Sent': { tone: 'success', icon: CircleCheck },
  'Modified & Sent': { tone: 'info', icon: Pencil },
  Sent: { tone: 'success', icon: Check },
  'Not Allowed': { tone: 'danger', icon: TriangleAlert },
  'Timed Out': { tone: 'warning', icon: Clock },
  Cancelled: { tone: 'neutral', icon: X },
  'Review Required': { tone: 'warning', icon: Eye },
}
/* A DOT, like every other status on this page. These wore an icon each — a tick, a
   pencil, a clock, an eye — which put a second thing to read inside a 20px chip and made
   one table's status look like a different component from the rest. The word already says
   which state it is; the mark only has to say THAT it is a state, and carry the tone. */
function LogStatus({ status }) {
  const s = LOG_STATUS[status] ?? { tone: 'neutral' }
  return <Badge tone={s.tone} dot>{status}</Badge>
}

const LOG_TYPE = { meeting: Calendar, mail: Mail, other: FileText }

/* Fixture — a DLP audit log. Recipient counts + statuses track the source
   design; attachment and DLP outcomes are plausible fillers. */
const AUDIT_LOG = [
  { id: 'l1', type: 'other', date: 'Jun 10, 2026', time: '11:49:57 AM', sender: 'frank@zackdevsandbox.onmicrosoft.com', subject: 'E2E-LOG006-1749…', policy: 'Default Policy', rcpt: { internal: 3 }, status: 'Confirmed & Sent', att: { failed: 2, attached: 2 }, dlp: { matches: true, recipientsRemoved: 2, attachmentsRemoved: 1 } },
  { id: 'l2', type: 'mail', date: 'Jun 10, 2026', time: '10:51:02 AM', sender: 'bob@zackdevsandbox.onmicrosoft.com', subject: 'E2E-LOG005-1749…', policy: 'Default Policy', rcpt: { internal: 2, external: 3, forbidden: 2 }, status: 'Confirmed & Sent', att: { failed: 2, attached: 1 }, dlp: { matches: true } },
  { id: 'l3', type: 'other', date: 'Jun 10, 2026', time: '10:48:56 AM', sender: 'alice@zackdevsandbox.onmicrosoft.com', subject: 'E2E-LOG002-1749…', policy: 'Default Policy', rcpt: { internal: 2, external: 1, forbidden: 2 }, status: 'Modified & Sent', att: { attached: 1 }, dlp: { matches: true, recipientsRemoved: 1, attachmentsRemoved: 1 } },
  { id: 'l4', type: 'meeting', date: 'Jun 10, 2026', time: '10:42:28 AM', sender: 'alicebrown@zackdevsandbox.com', subject: 'E2E-LOG001-1749…', policy: 'Default Policy', rcpt: { internal: 3, external: 1 }, status: 'Not Allowed', att: { attached: 1 }, dlp: { matches: true, attachmentsRemoved: 1 } },
  { id: 'l5', type: 'meeting', date: 'Jun 10, 2026', time: '10:07:56 AM', sender: 'evedavis@zackdevsandbox.com', subject: 'E2E-LOG002-1749…', policy: 'Default Policy', rcpt: { internal: 1, external: 4 }, status: 'Timed Out', att: { scanned: 1 }, dlp: { attachmentsRemoved: 1 } },
  { id: 'l6', type: 'other', date: 'Jun 10, 2026', time: '10:01:37 AM', sender: 'jwhite@zackdevsandbox.onmicrosoft.com', subject: 'E2E-LOG002-1749…', policy: 'Default Policy', rcpt: { external: 5 }, status: 'Sent', att: { scanned: 2, attached: 1 }, dlp: { recipientsRemoved: 2, attachmentsRemoved: 1 } },
  { id: 'l7', type: 'meeting', date: 'Jun 10, 2026', time: '9:22:40 AM', sender: 'alicewilson@zackdevsandbox.com', subject: 'E2E-LOG001-1749…', policy: 'Default Policy', rcpt: { internal: 3, external: 1 }, status: 'Cancelled', att: { scanned: 1 }, dlp: { matches: true, attachmentsRemoved: 2 } },
  { id: 'l8', type: 'meeting', date: 'Jun 10, 2026', time: '8:58:38 AM', sender: 'sara@zackdevsandbox.onmicrosoft.com', subject: 'E2E-LOG004-1749…', policy: 'Default Policy', rcpt: { internal: 3, external: 3, forbidden: 1 }, status: 'Cancelled', att: { scanned: 3 }, dlp: { recipientsRemoved: 1 } },
  { id: 'l9', type: 'mail', date: 'Jun 10, 2026', time: '8:55:38 AM', sender: 'sarajohnson@zackdevsandbox.com', subject: 'E2E-LOG006-1749…', policy: 'Default Policy', rcpt: { internal: 4, external: 2 }, status: 'Not Allowed', att: { scanned: 1, failed: 2, attached: 1 }, dlp: { matches: true, recipientsRemoved: 2, attachmentsRemoved: 2 } },
  { id: 'l10', type: 'meeting', date: 'Jun 10, 2026', time: '8:47:09 AM', sender: 'etaylor@zackdevsandbox.com', subject: 'E2E-LOG006-1749…', policy: 'Default Policy', rcpt: { external: 1 }, status: 'Review Required', att: { scanned: 3 }, dlp: { attachmentsRemoved: 1 } },
]

/* One labelled field in the expanded drawer. */
function DetailField({ label, children }) {
  return (
    <Stack gap={0} style={{ minWidth: 0 }}>
      <Text as="span" variant="eyebrow" tone="subtle">{label}</Text>
      {/* overflowWrap: 'anywhere' — the values here include email addresses and message
          IDs, which carry no space for the browser to break at. `minWidth: 0` lets the
          grid track shrink and `white-space: normal` lets it wrap, and neither helps a
          40-character unbroken token: it stayed one line, 230px of ink in a 191px column,
          and ran under the field beside it. Measured, not guessed. */}
      <Text as="span" variant="detail" style={{ overflowWrap: 'anywhere' }}>{children}</Text>
    </Stack>
  )
}

/* The verbose breakdown, shown only when a row is open. */
function AuditDetail(row) {
  const list = (parts) => parts.filter(Boolean).join(', ')
  const dlp = list([
    row.dlp.matches && 'DLP matches found',
    row.dlp.recipientsRemoved && `${row.dlp.recipientsRemoved} recipient${row.dlp.recipientsRemoved > 1 ? 's' : ''} removed`,
    row.dlp.attachmentsRemoved && `${row.dlp.attachmentsRemoved} attachment${row.dlp.attachmentsRemoved > 1 ? 's' : ''} removed`,
  ])
  const att = list([
    row.att.failed && `${row.att.failed} failed`,
    row.att.attached && `${row.att.attached} attached`,
    row.att.scanned && `${row.att.scanned} scanned`,
  ])
  const rcpt = list([
    row.rcpt.internal && `${row.rcpt.internal} internal`,
    row.rcpt.external && `${row.rcpt.external} external`,
    row.rcpt.forbidden && `${row.rcpt.forbidden} forbidden`,
  ])
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: 'var(--vds-space-4)' }}>
      <DetailField label="Message ID">{row.subject}</DetailField>
      <DetailField label="Sent">{row.date} · {row.time}</DetailField>
      <DetailField label="Sender">{row.sender}</DetailField>
      <DetailField label="Recipients">{rcpt}</DetailField>
      <DetailField label="Attachments">{att || 'None'}</DetailField>
      <DetailField label="DLP outcome">{dlp || 'No action'}</DetailField>
    </div>
  )
}

function AuditLogDemo() {
  const columns = [
    { key: 'type', header: '', align: 'center', width: '1%', render: (r) => (
      <span style={{ color: 'var(--vds-ink-subtle)', display: 'inline-flex' }}>
        <Icon as={LOG_TYPE[r.type] ?? FileText} size="sm" />
      </span>
    ) },
    { key: 'date', header: 'Date', render: (r) => (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Text as="span" variant="detail" style={{ fontWeight: 600 }}>{r.date.replace(', 2026', '')}</Text>
        <Text as="span" variant="detail" tone="subtle">{` · ${r.time.replace(/:\d\d /, ' ')}`}</Text>
      </span>
    ) },
    { key: 'sender', header: 'Sender', render: (r) => (
      <Text as="span" variant="detail" title={r.sender} style={{ display: 'block', maxWidth: '16ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.sender}</Text>
    ) },
    { key: 'subject', header: 'Subject', render: (r) => (
      <Text as="span" variant="detail" tone="muted" tabular title={r.subject} style={{ display: 'block', maxWidth: '14ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subject}</Text>
    ) },
    { key: 'policy', header: 'Policy', render: (r) => <Text as="span" variant="detail" tone="muted" style={{ whiteSpace: 'nowrap' }}>{r.policy}</Text> },
    { key: 'rcpt', header: 'Recipients', render: (r) => <RecipientCounts {...r.rcpt} /> },
    { key: 'status', header: 'Status', render: (r) => <LogStatus status={r.status} /> },
    { key: 'att', header: 'Attach', render: (r) => <AttachmentCounts {...r.att} /> },
    { key: 'dlp', header: 'DLP', render: (r) => <DlpFlags {...r.dlp} /> },
  ]
  return (
    <div style={{ width: '100%' }}>
      <SortableTable
        density="compact"
        columns={columns}
        data={AUDIT_LOG}
        minWidth={760}
        renderDetail={AuditDetail}
        defaultExpandedKeys={['l1']}
        caption="Email DLP audit log"
      />
    </div>
  )
}

/* Sample product catalog — each row leads with a product icon. */
/* The product marks, drawn on the tile's 32x32 grid — the same three the Product Tile
   and Side Nav pages demonstrate with, so a reader meets one SafeSend mark, not three. */
const GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
}

/* ---- grouped rows ------------------------------------------------------------------
   ONE FLAT ARRAY, TAGGED, not a table per group. Three tables would size their columns
   independently, so the figures stop lining up the moment one group holds a five-digit
   number and another does not — they look identical until the data makes them disagree.

   The aggregate sits OUTSIDE the groups. "All packages" is a total, not a sibling of
   Bundles: every bundle is already counted in it, so as a third section it would double
   count. It also never sorts with the rest — sorted by customers it would sit at the top
   pretending to be the best-selling row. */
const GROUPED = [
  { rowKey: 'all', isAll: true, name: 'All packages', customers: 324, trials: 112 },

  { rowKey: 'grp-bundles', isGroup: true, group: 'Bundles' },
  { rowKey: 'email-cloud', name: 'Email Cloud', glyph: GLYPHS.ies, customers: 58, trials: 6 },
  { rowKey: 'atp', name: 'Advanced Threat Protection', glyph: GLYPHS.ies, customers: 57, trials: 10 },
  { rowKey: 'ep-email', name: 'Endpoint+Email', glyph: GLYPHS.edr, customers: 55, trials: 3 },
  { rowKey: 'total-email', name: 'Total Email Protection', glyph: GLYPHS.ies, customers: 49, trials: 3 },

  { rowKey: 'grp-packages', isGroup: true, group: 'Packages' },
  { rowKey: 'ies', name: 'IES', glyph: GLYPHS.ies, customers: 51, trials: 8 },
  { rowKey: 'safesend-ai', name: 'SafeSend + AI', glyph: GLYPHS.safesend, customers: 48, trials: 5 },
  { rowKey: 'safesend', name: 'SafeSend', glyph: GLYPHS.safesend, customers: 46, trials: 7 },
]

/* A heading row prints in the FIRST column only — every other column renders null on it.
   No colspan, so the columns stay exactly where the rest of the table put them. */
const groupedCell = (render) => (r) => (r.isGroup ? null : render(r))

/* Sorting a grouped table sorts WITHIN each group. A plain column sort reorders every
   row it is handed, which scatters the headings and the total through the list — the
   grouping is structure, not an ordering, so the sort has to respect it.

   The total never sorts at all. Ordered by customers it would sit at the top pretending
   to be the best-selling package; it is a figure every row below is counted into, and it
   holds the first slot whatever the sort does. */
function GroupedDemo() {
  const [sort, setSort] = useState({ key: 'customers', direction: 'desc' })
  const [activeId, setActiveId] = useState('email-cloud')

  const rows = useMemo(() => {
    const out = []
    let bucket = []
    const flush = () => {
      bucket.sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av ?? '').localeCompare(String(bv ?? ''))
        return sort.direction === 'asc' ? cmp : -cmp
      })
      out.push(...bucket)
      bucket = []
    }
    for (const row of GROUPED) {
      if (row.isAll) { out.push(row); continue }
      if (row.isGroup) { flush(); out.push(row); continue }
      bucket.push(row)
    }
    flush()
    return out
  }, [sort])

  return (
    <Table
      density="compact"
      style={{ maxWidth: '34rem' }}
      data={rows}
      getRowKey={(r) => r.rowKey}
      sort={sort}
      onSortChange={setSort}
      selectedKeys={[activeId]}
      onRowClick={(r) => { if (!r.isGroup) setActiveId(r.rowKey) }}
      rowClassName={(r) =>
        r.isGroup ? 'vds-table__row--heading' : r.isAll ? 'vds-table__row--total' : undefined}
      columns={[
        {
          key: 'name',
          header: 'Package',
          sortable: true,
          render: (r) =>
            r.isGroup ? (
              <Text as="span" variant="eyebrow" tone="subtle">{r.group}</Text>
            ) : (
              <Inline gap={3} align="center">
                {/* The total gets a mark, but NOT a ProductTile — it is not a product, and
                    a product's tile on it would say it is one. Material Symbols' `stacks`:
                    an aggregate standing for the things underneath it. Sized and slotted
                    like the tiles so the column of marks stays a column. */}
                {r.isAll
                  ? <span style={{ width: 20, display: 'grid', placeItems: 'center', flex: 'none' }}>
                      <Icon as={Stacks} size="sm" tone="muted" />
                    </span>
                  : <ProductTile glyph={r.glyph} tonal size={20} />}
                {/* Same size as every other row. The total is set apart by its rule and its
                    weight, not by being bigger — a larger face would make it a heading. */}
                <Text as="span" variant="caption"
                  style={r.isAll ? { fontWeight: 'var(--vds-weight-medium)' } : undefined}>
                  {r.name}
                </Text>
              </Inline>
            ),
        },
        { key: 'customers', header: 'Customers', align: 'right', width: '96px', sortable: true,
          render: groupedCell((r) => r.customers.toLocaleString()) },
        { key: 'trials', header: 'Trials', align: 'right', width: '72px', sortable: true,
          render: groupedCell((r) => r.trials.toLocaleString()) },
      ]}
    />
  )
}



const PRODUCTS = [
  { id: 'p1', name: 'Endpoint+Email', category: 'Endpoint security', glyph: GLYPHS.edr, seats: 1284, status: 'Active', tone: 'success' },
  { id: 'p2', name: 'Email Cloud', category: 'Email protection', glyph: GLYPHS.ies, seats: 642, status: 'Active', tone: 'success' },
  { id: 'p3', name: 'SafeSend + AI', category: 'Outbound safety', glyph: GLYPHS.safesend, seats: 311, status: 'Trial', tone: 'warning' },
  { id: 'p4', name: 'VaultCritical Suite', category: 'Archiving', glyph: GLYPHS.ies, seats: 0, status: 'Inactive', tone: 'neutral' },
]

/* Leading product cell — composed entirely from existing DS primitives:
   Inline (row) + Icon (the product glyph) + Stack (name over category) + Text.
   No bespoke markup; reuse this shape in any first column. */
function ProductCell({ glyph, name, category }) {
  return (
    <Inline gap={3} align="center">
      <ProductTile glyph={glyph} tonal size={32} />
      <Stack gap={0}>
        <Text as="span" variant="body">{name}</Text>
        <Text as="span" variant="detail" tone="subtle">{category}</Text>
      </Stack>
    </Inline>
  )
}

/* Compact variant — one line: a smaller icon + name, no secondary text. Pairs
   with the table's density="compact" for log-dense screens. */
function ProductCellCompact({ glyph, name }) {
  return (
    <Inline gap={3}>
      <ProductTile glyph={glyph} tonal size={20} />
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
        <SortableTable
          minWidth={640}
          columns={[
            { key: 'name', header: 'Device' },
            { key: 'owner', header: 'Owner' },
            { key: 'status', header: 'Status', width: '110px', render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
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
      {/* tone="neutral", not the Button's primary default. A row's actions are chrome —
          three of them on every row, on every row of the table. In primary they are a
          column of brand colour running down the page, competing with the one control
          that should be carrying it, and they say "this is the thing to do here" about
          nine rows at once. Neutral until you reach for them; the tone arrives on hover.
          Delete keeps neutral too: the confirmation is where danger belongs, not the
          icon that opens it. */}
      <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={`View ${label}`} onClick={onView}>
        <Icon as={Eye} size="sm" />
      </Button>
      <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={`Edit ${label}`} onClick={onEdit}>
        <Icon as={Pencil} size="sm" />
      </Button>
      <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={`Delete ${label}`} onClick={onDelete}>
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
        // No align set — `risk` is numeric, so the column auto-aligns right.
        { key: 'risk', header: 'Risk', sortable: true },
      ]}
      data={data}
      sort={sort}
      onSortChange={setSort}
    />
  )
}

/* Compact, but two lines. The dense row still has something to say under the name —
   an edition, an owner, a last-seen — and the tile stays at 20 rather than stepping up
   to 24: the size answers the ROW's density, not the cell's line count. Top-aligned
   like every two-line cell, so the mark leads the name instead of pointing between
   the two lines. */
function ProductCellCompactTwoLine({ glyph, name, detail }) {
  return (
    <Inline gap={3} align="center">
      <ProductTile glyph={glyph} tonal size={20} />
      <Stack gap={0}>
        <Text as="span" variant="caption">{name}</Text>
        <Text as="span" variant="detail" tone="subtle">{detail}</Text>
      </Stack>
    </Inline>
  )
}

/* ---- SortableTable — the docs harness, not a component ----------------------------
   Sorting is not a feature you switch on for one example. It is what a table looks like
   the rest of the time: a leading arrow on the sorted column, that column's label at
   full ink, and every other arrow hidden until you reach for it. Demonstrated once, in
   a section called "Sortable", it reads as an optional extra — so every example on this
   page renders through here instead.

   It adds three things a live demo needs and a consumer writes themselves: local sort
   state, `sortable: true` on any column that names a field, and an actual comparator so
   clicking a header really reorders the rows. Columns with no `key`, or whose key is an
   actions/selection slot, are left alone — there is nothing to sort them by.

   The `code=` samples beside each canvas still show plain <SortableTable> with sort/onSortChange,
   which is what a consumer writes. This is the harness that saves the page from
   declaring the same three lines twenty-three times. */
const NOT_SORTABLE = new Set(['actions', 'menu', 'select', 'expand', ''])

/* Rows are interactive unless an example says otherwise. Nearly every table in the
   product opens something when you click a row, so a page of tables that do not is a
   page showing the exception. Pass onRowClick to give a demo real behaviour, or
   onRowClick={null} to show a table that genuinely has nowhere to go — a read-only log,
   a totals list. The default handler does nothing: in a docs demo the point is the
   affordance — the pointer, the hover, the keyboard focus — not the destination. */
const DEMO_ROW_CLICK = () => {}

function SortableTable({ columns, data, defaultSort, onRowClick, ...rest }) {
  const first = columns.find((c) => c.key && !NOT_SORTABLE.has(c.key))
  const [sort, setSort] = useState(defaultSort ?? { key: first?.key, direction: 'desc' })

  const cols = useMemo(
    () => columns.map((c) => (c.key && !NOT_SORTABLE.has(c.key) ? { ...c, sortable: true } : c)),
    [columns],
  )

  const rows = useMemo(() => {
    if (!sort?.key) return data
    const out = [...data]
    out.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      // Numbers compare as numbers; everything else as text, so "At risk" and "Threat"
      // order the way a reader expects rather than by character code.
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av ?? '').localeCompare(String(bv ?? ''))
      return sort.direction === 'asc' ? cmp : -cmp
    })
    return out
  }, [data, sort])

  return (
    <Table
      columns={cols}
      data={rows}
      sort={sort}
      onSortChange={setSort}
      onRowClick={onRowClick === null ? undefined : (onRowClick ?? DEMO_ROW_CLICK)}
      {...rest}
    />
  )
}

/* ---- live selection demo (controlled selectedKeys) ---- */
function SelectableDemo() {
  const [selected, setSelected] = useState(['d2'])
  return (
    <div style={{ width: '100%' }}>
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
      <SortableTable
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
    <Stack gap={0} style={{ width: '100%' }}>
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
      <SortableTable
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        radius={null}
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        columns={[
          { key: 'name', header: 'Device' },
          { key: 'owner', header: 'Owner' },
          STATUS_COL,
          { key: 'seen', header: 'Last seen' },
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

  /* The pager goes in the table's own footer, not after it. The range used to be
     printed here as a separate <Text> beside the pager; Pagination renders it from
     `total` + `pageSize` now, so printing it here too said it twice. */
  return (
    <SortableTable
      columns={columns}
      data={padded}
      footer={
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          size="sm"
          total={FLEET.length}
          pageSize={pageSize}
          compact
          style={{ width: '100%' }}
        />
      }
    />
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
      render: (r) =>
        r.active
          ? <Text as="span" variant="detail" tone="muted">{r.active}</Text>
          : <Text as="span" variant="detail" tone="subtle">—</Text>,
    },
    { key: 'actions', header: '', align: 'right', width: '1%', render: (r) => <UserRowMenu user={r} /> },
  ]
  return (
    <Stack gap={0} style={{ width: '100%' }}>
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
      <SortableTable
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
            [{ code: 'verticalAlign' }, { code: "'middle' | 'top'" }, { code: "'middle'" }, 'Use top when any column can wrap to two lines, so every cell lines up on the first one'],
            [{ code: 'onSortChange' }, { code: '(next) => void' }, '—', 'Runs when someone clicks a sortable header'],
            [{ code: 'selectable' }, { code: 'boolean' }, { code: 'false' }, 'Adds a checkbox column'],
            [{ code: 'selectedKeys' }, { code: 'array | Set' }, '—', 'Which rows are checked'],
            [{ code: 'onSelectionChange' }, { code: '(keys[]) => void' }, '—', 'Runs when the checked rows change'],
            [{ code: 'onRowClick' }, { code: '(row, i) => void' }, '—', 'Makes rows clickable (with hover + keyboard)'],
            [{ code: 'renderDetail' }, { code: '(row, i) => ReactNode' }, '—', 'Adds an expand caret to each row that reveals this node in a full-width drawer below it — how you keep a dense row to one line'],
            [{ code: 'defaultExpandedKeys' }, { code: 'array | Set' }, { code: '[]' }, 'Which rows start expanded (uncontrolled)'],
            [{ code: 'expandedKeys' }, { code: 'array | Set' }, '—', 'Which rows are expanded (controlled)'],
            [{ code: 'onExpandedChange' }, { code: '(keys[]) => void' }, '—', 'Runs when a row is expanded or collapsed'],
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
            [{ code: 'align' }, { code: "'left' | 'center' | 'right'" }, "Which side the cell sits on. Skip it and the column auto-aligns by data type — number columns go right (digits line up), everything else left."],
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
        <>The <IC>renderDetail</IC> expand caret is a real <IC>{'<button>'}</IC> with <IC>aria-expanded</IC> and <IC>aria-controls</IC> pointing at the drawer, so screen readers announce it and it opens from the keyboard.</>,
        <>The little sort arrow is just for looks (<IC>aria-hidden</IC>) — the sort direction comes from <IC>aria-sort</IC>, not from color.</>,
        <>Pass <IC>caption</IC> to give the table a name. It's hidden on screen but read out by screen readers.</>,
        <>The product icon at the front of a row is just for looks — <IC>Icon</IC> is <IC>aria-hidden</IC> by default, so the meaning comes from the name next to it.</>
      ]}
    >
      <Section title="Basic" note="List your columns and hand over your data. A column's render() lets you draw your own cell content.">
        <Preview
          canvas={
            <SortableTable
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                { key: 'os', header: 'OS' },
                { key: 'ip', header: 'IP address' },
                STATUS_COL,
                { key: 'seen', header: 'Last seen' },
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
    { key: 'seen', header: 'Last seen' },
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
            <SortableTable
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
        note="A product and its name in the first column. The mark is a ProductTile, tonal — the product's own square, not a general-purpose icon, which says &quot;something about email&quot; where the tile says &quot;this product&quot;. Tonal because a table is a light surface; the rail treatments are built for navy and read as a heavy block here. 32px, because the cell carries a second line — a two-line row steps the mark up one place on the scale. Mark and name live in ONE cell, so there is no mark column to align and no empty header to explain. Every row here is exactly two lines, so the figure and the chip centre against the row and sit level with the pair — reach for verticalAlign=&quot;top&quot; only when rows VARY in height, where centring would put the mark beside a different line each time."
      >
        <Preview
          canvas={
            <SortableTable
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCell glyph={r.glyph} name={r.name} category={r.category} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', width: '80px', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'status',
                  header: 'Status',
                  width: '110px',
                  render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge>,
                },
              ]}
              data={PRODUCTS}
              /* Capped, and the cap is the point: three short columns cannot fill 997px,
                 and no column rule fixes that — sizing Seats and Status correctly just
                 moves the surplus into the name. A table is as wide as its data. */
              style={{ maxWidth: '39rem' }}
            />
          }
          code={`import { Inline, ProductTile, Stack, Table, Text } from 'vipre-design-system'

const columns = [
  {
    key: 'name',
    header: 'Product',
    render: (r) => (
      // align="start", not centre: the row's height changes with the second
      // line, and a centred mark points at a different line on every row.
      <Inline gap={3} align="center">
        <ProductTile glyph={r.glyph} tonal size={32} />
        <Stack gap={0}>
          <Text as="span" variant="body">{r.name}</Text>
          <Text as="span" variant="detail" tone="subtle">{r.category}</Text>
        </Stack>
      </Inline>
    ),
  },
  // …more columns
]

<Table columns={columns} data={products} verticalAlign="top" />`}
        />
      </Section>

      <Section
        title="Compact product cell"
        note="For packed screens: density=&quot;compact&quot; with a one-line cell. The tile steps down to 20 — the size for a row that is only a name and its figures."
      >
        <Preview
          canvas={
            <SortableTable
              density="compact"
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCellCompact glyph={r.glyph} name={r.name} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', width: '80px', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'status',
                  header: 'Status',
                  width: '110px',
                  render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge>,
                },
              ]}
              data={PRODUCTS}
              /* Capped, and the cap is the point: three short columns cannot fill 997px,
                 and no column rule fixes that — sizing Seats and Status correctly just
                 moves the surplus into the name. A table is as wide as its data. */
              style={{ maxWidth: '39rem' }}
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
        title="Compact product cell, two lines"
        note="A dense row that still carries a second line. The tile steps up to 24 — one place on the scale, because the cell carries a second line — and everything centres on the row, because every row here is the same two lines tall."
      >
        <Preview
          canvas={
            <SortableTable
              density="compact"
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => (
                    <ProductCellCompactTwoLine glyph={r.glyph} name={r.name} detail={r.category} />
                  ),
                },
                { key: 'seats', header: 'Seats', align: 'right', width: '80px', render: (r) => r.seats.toLocaleString() },
                { key: 'status', header: 'Status', width: '110px', render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
              ]}
              data={PRODUCTS}
              /* Capped, and the cap is the point: three short columns cannot fill 997px,
                 and no column rule fixes that — sizing Seats and Status correctly just
                 moves the surplus into the name. A table is as wide as its data. */
              style={{ maxWidth: '39rem' }}
            />
          }
          code={`<Table
  density="compact"
  columns={[
    {
      key: 'name',
      header: 'Product',
      render: (r) => (
        <Inline gap={3} align="start">
          <ProductTile glyph={r.glyph} tonal size={20} />
          <Stack gap={0}>
            <Text as="span" variant="caption">{r.name}</Text>
            <Text as="span" variant="detail" tone="subtle">{r.category}</Text>
          </Stack>
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
            <SortableTable
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

<SortableTable columns={columns} data={devices} />`}
        />
      </Section>

      <Section
        title="Row actions"
        note="Row buttons are just one more column at the end: a right-aligned Inline of icon-only ghost Buttons. Each Button needs an aria-label because there's no words to read."
      >
        <Preview
          canvas={
            <SortableTable
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCell glyph={r.glyph} name={r.name} category={r.category} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', width: '80px', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  width: '1%',
                  render: (r) => <RowActions label={r.name} />,
                },
              ]}
              data={PRODUCTS}
              /* Capped, and the cap is the point: three short columns cannot fill 997px,
                 and no column rule fixes that — sizing Seats and Status correctly just
                 moves the surplus into the name. A table is as wide as its data. */
              style={{ maxWidth: '39rem' }}
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
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={\`View \${r.name}\`}>
          <Icon as={Eye} size="sm" />
        </Button>
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={\`Edit \${r.name}\`}>
          <Icon as={Pencil} size="sm" />
        </Button>
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={\`Delete \${r.name}\`}>
          <Icon as={Trash2} size="sm" />
        </Button>
      </Inline>
    ),
  },
]

<SortableTable columns={columns} data={products} />`}
        />
      </Section>

      <Section
        title="Grouped rows"
        note="One set of columns, rows banded into labelled sections, and a total pinned above them. density=&quot;compact&quot; because a grouped list is longer than the list it replaces — the headings cost rows, so the rows have to cost less."
      >
        <Preview
          canvas={<GroupedDemo />}
          code={`// One flat array, tagged — not a table per group.
const rows = [
  { rowKey: 'all', isAll: true, name: 'All packages', customers: 324, trials: 112 },
  { rowKey: 'grp-bundles', isGroup: true, group: 'Bundles' },
  …bundles,
  { rowKey: 'grp-packages', isGroup: true, group: 'Packages' },
  …packages,
]

// A heading row prints in the first column only.
const cell = (render) => (r) => (r.isGroup ? null : render(r))

<Table density="compact" data={rows} getRowKey={(r) => r.rowKey} columns={[
  { key: 'name', header: 'Package', render: (r) => r.isGroup ? <Text variant="eyebrow">{r.group}</Text> : … },
  { key: 'customers', header: 'Customers', align: 'right', render: cell((r) => r.customers) },
]} />`}
        />
        <p>
          <strong>One table, not one per group.</strong> Three tables would size their columns
          independently, so the figures stop lining up the moment one group holds a five-digit number
          and another does not — they look identical until the data makes them disagree.
        </p>
        <p>
          <strong>The heading is a row, not a line inside the first cell.</strong> Put it in the cell
          and it inherits that row&rsquo;s state: the first row of the first group is usually the
          selected one, so the caption ends up painted inside a selected pill — a group heading
          wearing the state of one of its members. A row of its own cannot be selected or hovered.
        </p>
        <p>
          <strong>A total is not a group.</strong> &ldquo;All packages&rdquo; sits above the sections
          rather than beside them, because every bundle is already counted in it — as a third band it
          would double count. It is also the one row that must not sort with the others: ordered by
          customers it would sit at the top pretending to be the best-selling package.
        </p>
      </Section>

      <Section
        title="Pinned actions"
        note="Set pinned on the last column and it holds the table's right edge while everything else scrolls under it. Scroll this one sideways: the actions stay put, and the columns fade out as they pass beneath rather than being cut off."
      >
        <Preview
          canvas={
            <SortableTable
              minWidth="72rem"
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                { key: 'os', header: 'OS' },
                { key: 'ip', header: 'IP address' },
                STATUS_COL,
                { key: 'seen', header: 'Last seen' },
                { key: 'risk', header: 'Risk' },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  width: '104px',
                  pinned: true,
                  render: (r) => (
                    <RowActions
                      label={r.name}
                      onView={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ),
                },
              ]}
              data={FLEET}
            />
          }
          code={`{
  key: 'actions',
  header: '',
  align: 'right',
  width: '104px',
  pinned: true,          // holds the right edge; the rest scrolls under it
  render: (row) => <RowActions … />,
}`}
        />
        <p>
          Only one column should take it, and it should be the last one. The fade is the
          table&rsquo;s own ground dissolving, not a shadow — nothing is on top of those columns,
          they simply stop being legible as they pass under. It rides the same scroll timeline as
          the edge shadows, so it disappears once you reach the end and never appears at all on a
          table that fits.
        </p>
      </Section>

      <Section
        title="Row menu"
        note="Once a row has more than a couple of actions, collapse them into a kebab menu instead of a row of buttons. The trigger is one icon Button; Menu handles the popover, keyboard, and focus."
      >
        <Preview
          canvas={
            <SortableTable
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  render: (r) => <ProductCell glyph={r.glyph} name={r.name} category={r.category} />,
                },
                { key: 'seats', header: 'Seats', align: 'right', width: '80px', render: (r) => r.seats.toLocaleString() },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  width: '1%',
                  render: (r) => <RowMenu label={r.name} />,
                },
              ]}
              data={PRODUCTS}
              /* Capped, and the cap is the point: three short columns cannot fill 997px,
                 and no column rule fixes that — sizing Seats and Status correctly just
                 moves the surplus into the name. A table is as wide as its data. */
              style={{ maxWidth: '39rem' }}
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
          <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={\`\${r.name} actions\`}>
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

<SortableTable columns={columns} data={products} />`}
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
<Pagination page={page} pageCount={pageCount} onPageChange={setPage} size="sm"\n  total={rows.length} pageSize={pageSize} />`} />
      </Section>

      <Section title="Compact + zebra" note="Tighter rows for log-style data, with striped rows so they're easy to scan.">
        <Preview
          canvas={
            <SortableTable
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

      <Section
        title="Interactive rows"
        note="Pass onRowClick to make each row clickable so you can open it. Row actions live in a trailing column, and they stopPropagation — a click on Delete must not also open the row behind it."
      >
        <Preview
          canvas={
            <SortableTable
              onRowClick={(r) => window.alert(`Opening ${r.name}`)}
              columns={[
                { key: 'name', header: 'Device' },
                { key: 'owner', header: 'Owner' },
                STATUS_COL,
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  width: '96px',
                  render: (r) => (
                    <Inline gap={1} style={{ justifyContent: 'flex-end' }}>
                      <Button
                        variant="ghost" tone="neutral" size="xs" iconOnly
                        aria-label={`Edit ${r.name}`} title="Edit"
                        onClick={(e) => { e.stopPropagation(); window.alert(`Editing ${r.name}`) }}
                      >
                        <Icon as={Pencil} size="sm" />
                      </Button>
                      <Button
                        variant="ghost" tone="danger" size="xs" iconOnly
                        aria-label={`Delete ${r.name}`} title="Delete"
                        onClick={(e) => { e.stopPropagation(); window.alert(`Deleting ${r.name}`) }}
                      >
                        <Icon as={Trash2} size="sm" />
                      </Button>
                    </Inline>
                  ),
                },
              ]}
              data={DEVICES}
            />
          }
          code={`const columns = [
  // …data columns
  {
    key: 'actions',
    header: '',
    align: 'right',
    width: '96px',
    render: (row) => (
      <Inline gap={1} style={{ justifyContent: 'flex-end' }}>
        <Button variant="ghost" tone="neutral" size="xs" iconOnly
          aria-label={\`Edit \${row.name}\`}
          onClick={(e) => { e.stopPropagation(); edit(row) }}>
          <Icon as={Pencil} size="sm" />
        </Button>
        <Button variant="ghost" tone="danger" size="xs" iconOnly
          aria-label={\`Delete \${row.name}\`}
          onClick={(e) => { e.stopPropagation(); remove(row) }}>
          <Icon as={Trash2} size="sm" />
        </Button>
      </Inline>
    ),
  },
]

<Table onRowClick={(row) => open(row)} columns={columns} data={devices} />`}
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
                  { key: 'seen', header: 'Last seen' },
                ]}
                data={[]}
              />
              <Table
                columns={[
                  { key: 'name', header: 'Device' },
                  { key: 'owner', header: 'Owner' },
                  { key: 'seen', header: 'Last seen' },
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
    key: 'active', header: 'Last activity',
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
            <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={\`Actions for \${u.name}\`}>
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

<SortableTable
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
        title="Compact audit log"
        note="A dense, log-style alternative for rows carrying a lot of dimensions. Instead of stacking pills and bulleted outcomes (which makes rows tall), each row is a single line: recipients, attachments, and DLP outcomes each collapse to a run of tinted count chips. The verbose breakdown moves into the Table's renderDetail drawer — expand a row (or the pre-opened first one) to see it. Uses density='compact'."
      >
        <Preview
          canvas={<AuditLogDemo />}
          code={`// Row summary stays one line; the full breakdown lives in renderDetail.
<Table
  density="compact"
  columns={columns}          // recipients/attachments/DLP render as count chips
  data={auditLog}
  renderDetail={(row) => <AuditDetail row={row} />}
  defaultExpandedKeys={['l1']}
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
