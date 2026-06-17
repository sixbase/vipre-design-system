import { useState } from 'react'
import {
  LayoutGrid, Mail, ScrollText, Radar, Settings, Send, FileText, ShieldCheck,
  Laptop, Monitor, Bell, GraduationCap, Database, UserCog, User, ArrowRight, LogOut,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
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
      description="The VIPRE product navigation rail as it ships today, captured as a component. A data-driven composite that owns the whole rail: a centered brand lockup, a standalone Overview entry, a stack of product cards (each a bordered translucent panel with a brand glyph, collapsible sub-pages and a “full portal” escape link), locked teaser rows for un-entitled products, and a pinned account/admin footer. Unlike SideNav it is intentionally NOT theme-following — it reproduces the production navy chrome, driven entirely by local --vds-clnav-* knobs. Composes Icon."
      installCode={`import { CurrentLeftNav } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'brand' }, { code: 'node' }, '—', 'Centered header content (logo / wordmark)'],
            [{ code: 'overview' }, { code: '{ id, label, icon }' }, '—', 'Optional standalone top item'],
            [{ code: 'groups' }, { code: 'Group[]' }, { code: '[]' }, 'The scrollable product stack'],
            [{ code: 'footerItems' }, { code: 'FooterItem[]' }, { code: '[]' }, 'Account / admin cluster pinned to the bottom'],
            [{ code: 'activeId' }, { code: 'string' }, '—', 'Id of the active item (drives the row highlight)'],
            [{ code: 'onSelect' }, { code: '(id, item) => void' }, '—', 'Fired on any item / overview / escape-link click'],
            [{ code: 'className' }, { code: 'string' }, '—', 'Extra classes'],
          ],
        },
        {
          name: 'Group shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'Stable unique id'],
            [{ code: 'label' }, { code: 'string' }, 'Product name'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Leading brand glyph'],
            [{ code: 'active' }, { code: 'boolean' }, 'The product the current page lives in — gives the filled accent toggle'],
            [{ code: 'collapsible' }, { code: 'boolean' }, 'Card collapses by default; set false to pin open'],
            [{ code: 'defaultOpen' }, { code: 'boolean' }, 'Initial expanded state (default true)'],
            [{ code: 'locked' }, { code: 'boolean' }, 'No entitlement — renders a flat teaser row with a padlock'],
            [{ code: 'lockHint' }, { code: 'string' }, 'Tooltip on a locked row'],
            [{ code: 'items' }, { code: 'Item[]' }, 'The card’s sub-page rows'],
            [{ code: 'escape' }, { code: '{ id, label?, icon? }' }, 'A trailing “full portal” link out of the curated set'],
          ],
        },
        {
          name: 'Item / FooterItem shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'Stable unique id (matched against activeId)'],
            [{ code: 'label' }, { code: 'string' }, 'Display label'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Leading icon'],
            [{ code: 'badge' }, { code: 'string | number' }, 'Trailing count pill (Item only)'],
            [{ code: 'trailingIcon' }, { code: 'icon component' }, 'Footer-only trailing action (e.g. log out)'],
            [{ code: 'onTrailingClick' }, { code: '(item) => void' }, 'Footer-only trailing action handler'],
          ],
        },
      ]}
      accessibility={[
        <>The rail is a real <IC>{'<nav>'}</IC>; the overview entry, each card header, every sub-page row and escape link is a focusable <IC>{'<button>'}</IC> with a visible <IC>:focus-visible</IC> ring.</>,
        <>A collapsible card header exposes <IC>aria-expanded</IC>; the active item carries <IC>aria-current="page"</IC>.</>,
        <>Locked products expose their padlock with an accessible label — entitlement is never conveyed by color alone.</>,
        <>The footer trailing action (log out) is its own labelled button, separate from the row’s primary navigation target.</>,
      ]}
    >
      <Section
        title="Anatomy"
        note="The full Symphony rail. IES is expanded; SafeSend is collapsed (click its header to open it); EDR is the active product — note the filled accent toggle. SAT and Archive are locked (no entitlement). Click any sub-page to move the active highlight."
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
    </ComponentPage>
  )
}
