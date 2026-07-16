import { useState } from 'react'
import {
  LayoutGrid, Mail, ScrollText, Radar, Settings, Send, FileText, ShieldCheck,
  Laptop, Monitor, Bell, GraduationCap, Database, UserCog, User, ArrowRight, LogOut,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { CurrentLeftNav } from '../../components/index.js'
import { VipreLogo } from '../VipreLogo.jsx'

/* The VIPRE Symphony brand lockup — wordmark + tracked sub-label. The rail
   header forces white, so the currentColor wordmark renders white for free. */
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

/* A faithful "current" Symphony rail: Overview, three product cards (IES open,
   SafeSend collapsed, EDR active with the accent toggle), two locked teaser
   products, and the account/admin footer. */
const GROUPS = [
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
    id: 'edr', label: 'EDR', icon: Laptop, active: true,
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

function Rail() {
  const [active, setActive] = useState('edr-devices')
  return (
    <div style={{ height: 720, display: 'flex' }}>
      <CurrentLeftNav
        brand={<SymphonyLockup />}
        overview={{ id: 'overview', label: 'Overview', icon: LayoutGrid }}
        groups={GROUPS}
        footerItems={FOOTER_ITEMS}
        activeId={active}
        onSelect={(id) => setActive(id)}
      />
    </div>
  )
}

export function CurrentLeftNavPage() {
  return (
    <ComponentPage
      title="Current Left Nav"
      description="The VIPRE left menu bar the way it ships today, saved as a component. One component builds the whole rail: a centered logo, a standalone Overview entry, a stack of product cards (each with sub-pages you can open and close, and a “full portal” link out), locked teaser rows for products you don't have, and a pinned account footer. It never follows the theme — it always shows the navy look, set by its own --vds-clnav-* values. This is an exact copy of the shipped nav; new builds should use SideNav instead."
      installCode={`import { CurrentLeftNav } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'brand' }, { code: 'node' }, '—', 'Centered content at the top (logo or name)'],
            [{ code: 'overview' }, { code: '{ id, label, icon }' }, '—', 'An optional single item at the top'],
            [{ code: 'groups' }, { code: 'Group[]' }, { code: '[]' }, 'The scrolling stack of products'],
            [{ code: 'footerItems' }, { code: 'FooterItem[]' }, { code: '[]' }, 'Account and admin links pinned to the bottom'],
            [{ code: 'activeId' }, { code: 'string' }, '—', 'Id of the current item — it gets highlighted'],
            [{ code: 'onSelect' }, { code: '(id, item) => void' }, '—', 'Runs when any item, overview, or portal link is clicked'],
            [{ code: 'className' }, { code: 'string' }, '—', 'Extra classes'],
          ],
        },
        {
          name: 'Group shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'A unique id that stays the same'],
            [{ code: 'label' }, { code: 'string' }, 'Product name'],
            [{ code: 'icon' }, { code: 'icon component' }, 'The product icon shown first'],
            [{ code: 'active' }, { code: 'boolean' }, 'The product the current page is in — gives it the filled toggle'],
            [{ code: 'collapsible' }, { code: 'boolean' }, 'The card can close; set false to keep it open'],
            [{ code: 'defaultOpen' }, { code: 'boolean' }, 'Whether it starts open (default true)'],
            [{ code: 'locked' }, { code: 'boolean' }, "You don't have this product — shows a flat teaser row with a padlock"],
            [{ code: 'lockHint' }, { code: 'string' }, 'Tooltip shown on a locked row'],
            [{ code: 'items' }, { code: 'Item[]' }, 'The sub-page rows inside the card'],
            [{ code: 'escape' }, { code: '{ id, label?, icon? }' }, 'A “full portal” link out to the full app'],
          ],
        },
        {
          name: 'Item / FooterItem shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'A unique id (compared to activeId)'],
            [{ code: 'label' }, { code: 'string' }, 'The text shown'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Icon shown first'],
            [{ code: 'badge' }, { code: 'string | number' }, 'A small count pill at the end (Item only)'],
            [{ code: 'trailingIcon' }, { code: 'icon component' }, 'A footer-only button at the end (e.g. log out)'],
            [{ code: 'onTrailingClick' }, { code: '(item) => void' }, 'What that footer-only button does'],
          ],
        },
      ]}
      accessibility={[
        <>The rail is a real <IC>{'<nav>'}</IC>; the overview entry, each card header, every sub-page row, and portal link is a <IC>{'<button>'}</IC> you can tab to, with a visible <IC>:focus-visible</IC> ring.</>,
        <>A card header you can open and close has <IC>aria-expanded</IC>; the current item has <IC>aria-current="page"</IC>.</>,
        <>Locked products give their padlock a label a screen reader can read — color alone never tells you it's locked.</>,
        <>The footer button at the end (log out) is its own labelled button, separate from where the row itself takes you.</>,
      ]}
    >
      <Section
        title="Anatomy"
        note="The full Symphony rail. IES is open; SafeSend is closed (click its header to open it); EDR is the current product — see the filled toggle. SAT and Archive are locked (you don't have them). Click any sub-page to move the highlight."
      >
        <Preview
          canvas={<Rail />}
          code={`<CurrentLeftNav
  brand={<SymphonyLockup />}
  overview={{ id: 'overview', label: 'Overview', icon: LayoutGrid }}
  activeId={page}
  onSelect={setPage}
  groups={[
    {
      id: 'ies', label: 'IES', icon: Mail,
      items: [
        { id: 'ies-logs', label: 'Message Logs', icon: ScrollText },
        { id: 'ies-threat', label: 'Threat Explorer', icon: Radar },
        { id: 'ies-config', label: 'Email Config.', icon: Settings },
      ],
      escape: { id: 'ies-portal', label: 'full portal' },
    },
    { id: 'safesend', label: 'SafeSend', icon: Send, defaultOpen: false, items: [/* … */] },
    { id: 'edr', label: 'EDR', icon: Laptop, active: true, items: [/* … */] },
    { id: 'sat', label: 'SAT', icon: GraduationCap, locked: true, lockHint: 'Not in your plan' },
  ]}
  footerItems={[
    { id: 'logs', label: 'Logs', icon: ScrollText },
    { id: 'profile', label: 'Profile', icon: User, trailingIcon: LogOut, trailingLabel: 'Sign out' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rail's rendered HTML with the vds- classes, for teams not using React. The look (always-navy, cards, locked rows) is pure CSS. Opening and closing a product card, the aria-expanded state, and moving the active highlight are JS you'd wire yourself."
      >
        <Code>{`<nav class="vds-clnav" aria-label="Primary">
  <div class="vds-clnav__header"><!-- brand / logo --></div>

  <div class="vds-clnav__scroll">
    <!-- standalone Overview entry -->
    <button type="button" class="vds-clnav__overview vds-clnav__overview--active" aria-current="page">
      <span class="vds-clnav__overview-icon"><svg class="vds-icon" width="20" height="20" aria-hidden="true">…</svg></span>
      <span class="vds-clnav__overview-label">Overview</span>
    </button>

    <div class="vds-clnav__stack">
      <!-- a product card. current product: add --active. closed: add --collapsed -->
      <div class="vds-clnav__card vds-clnav__card--active">
        <button type="button" class="vds-clnav__card-header" aria-expanded="true">
          <span class="vds-clnav__card-icon"><svg class="vds-icon" width="20" height="20" aria-hidden="true">…</svg></span>
          <span class="vds-clnav__card-title">EDR</span>
          <span class="vds-clnav__card-toggle vds-clnav__card-toggle--active"></span>
        </button>
        <div class="vds-clnav__card-body">
          <button type="button" class="vds-clnav__item vds-clnav__item--active" aria-current="page">
            <span class="vds-clnav__item-glyph"><svg class="vds-icon" width="16" height="16" aria-hidden="true">…</svg></span>
            <span class="vds-clnav__item-label">Devices</span>
            <span class="vds-clnav__item-badge">3</span>
          </button>
          <button type="button" class="vds-clnav__escape">
            <span class="vds-clnav__escape-icon">…</span>
            <span class="vds-clnav__escape-label">full portal</span>
          </button>
        </div>
      </div>

      <!-- a locked teaser row -->
      <div class="vds-clnav__locked" title="Not in your plan">
        <span class="vds-clnav__locked-icon">…</span>
        <span class="vds-clnav__locked-label">SAT</span>
        <svg class="vds-icon vds-clnav__locked-lock" width="14" height="14" role="img" aria-label="Locked">…</svg>
      </div>
    </div>
  </div>

  <!-- pinned footer -->
  <div class="vds-clnav__footer">
    <div class="vds-clnav__footer-item">
      <button type="button" class="vds-clnav__footer-main">
        <span class="vds-clnav__footer-icon">…</span>
        <span class="vds-clnav__footer-label">Profile</span>
      </button>
      <button type="button" class="vds-clnav__footer-trailing" aria-label="Sign out">…</button>
    </div>
  </div>
</nav>`}</Code>
      </Section>
    </ComponentPage>
  )
}
