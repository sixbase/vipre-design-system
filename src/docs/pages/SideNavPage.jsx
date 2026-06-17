import { useState } from 'react'
import {
  Mail, Send, Monitor, ScrollText, ShieldAlert, SlidersHorizontal,
  KeyRound, Users, Tag, Building2, User, ArrowUpRight,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { SideNav } from '../../components/index.js'
import { VipreLogo } from '../VipreLogo.jsx'

/* ----------------------------------------------------------------------------
   A faithful Vipre Symphony rail: the IES product expanded with its common
   links + a "full portal" escape, two locked (un-entitled) products, an
   account-admin footer cluster, and a footer slot. This is the layout the
   SideNav was built to represent.
   -------------------------------------------------------------------------- */
const GROUPS = [
  {
    id: 'ies',
    label: 'IES',
    icon: Mail,
    items: [
      { id: 'message-logs', label: 'Message Logs', icon: ScrollText },
      { id: 'threat-explorer', label: 'Threat Explorer', icon: ShieldAlert },
      { id: 'action-rules', label: 'Action Rules', icon: SlidersHorizontal },
    ],
    escape: { id: 'ies-portal', label: 'full portal', icon: ArrowUpRight },
  },
  { id: 'safesend', label: 'SafeSend', icon: Send, locked: true, lockHint: 'Not in your plan — contact sales to enable' },
  { id: 'edr', label: 'EDR', icon: Monitor, locked: true, lockHint: 'Not in your plan — contact sales to enable' },
]

const FOOTER_ITEMS = [
  { id: 'saml', label: 'SAML', icon: KeyRound },
  { id: 'admins', label: 'Admins', icon: Users },
  { id: 'roles', label: 'Roles', icon: Tag },
  { id: 'account', label: 'Account', icon: Building2 },
  { id: 'profile', label: 'Profile', icon: User },
]

/* The "section" variant — a flat, functional grouping (static eyebrow labels). */
const SECTION_GROUPS = [
  {
    id: 'overview', label: 'Overview', variant: 'section',
    items: [{ id: 'customers', label: 'Customers', icon: Building2 }],
  },
  {
    id: 'email', label: 'Email Security', variant: 'section',
    items: [
      { id: 'message-logs', label: 'Message Logs', icon: ScrollText },
      { id: 'analytics', label: 'Analytics', icon: ShieldAlert },
      { id: 'policies', label: 'Policies', icon: SlidersHorizontal, badge: '3' },
    ],
  },
]

function Rail({ groups, footerItems, footer, dark = true }) {
  const [active, setActive] = useState('message-logs')
  return (
    <div style={{ height: 540, display: 'flex' }}>
      <SideNav
        className={dark ? 'dark' : undefined}
        brand={<VipreLogo className="vds-logo" />}
        groups={groups}
        footerItems={footerItems}
        footer={footer}
        activeId={active}
        onSelect={(id) => setActive(id)}
      />
    </div>
  )
}

export function SideNavPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.SideNav}
      title="Side Nav"
      description="The product navigation rail — the left-hand chrome of an application shell. One data-driven composite owns the whole rail: a brand header, collapsible product groups (each with items, an optional “full portal” escape link, and a locked / no-entitlement state), an account-admin footer cluster, and an arbitrary footer slot. It follows the ambient theme, so pass className=&quot;dark&quot; to force the product navy. Composes Icon."
      installCode={`import { SideNav } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'brand' }, { code: 'node' }, '—', 'Header content (logo / wordmark)'],
            [{ code: 'groups' }, { code: 'Group[]' }, { code: '[]' }, 'The scrollable middle — products / sections'],
            [{ code: 'footerItems' }, { code: 'Item[]' }, { code: '[]' }, 'Account / admin cluster pinned to the bottom'],
            [{ code: 'footer' }, { code: 'node' }, '—', 'Slot below the footer items (e.g. a theme toggle)'],
            [{ code: 'activeId' }, { code: 'string' }, '—', 'Id of the active item (drives the highlight)'],
            [{ code: 'onSelect' }, { code: '(id, item) => void' }, '—', 'Fired on any item / escape-link click'],
            [{ code: 'className' }, { code: 'string' }, '—', "Extra classes — pass 'dark' to force the navy rail"],
          ],
        },
        {
          name: 'Group shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'Stable unique id'],
            [{ code: 'label' }, { code: 'string' }, 'Group / product name (omit for a headerless list)'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Leading icon (product variant)'],
            [{ code: 'variant' }, { code: "'product' | 'section'" }, "'product' = collapsible header; 'section' = static eyebrow label"],
            [{ code: 'collapsible' }, { code: 'boolean' }, 'Product groups collapse by default; set false to pin open'],
            [{ code: 'defaultOpen' }, { code: 'boolean' }, 'Initial expanded state (default true)'],
            [{ code: 'locked' }, { code: 'boolean' }, 'No entitlement — shows a padlock, hides items'],
            [{ code: 'lockHint' }, { code: 'string' }, 'Tooltip on a locked group'],
            [{ code: 'items' }, { code: 'Item[]' }, 'The group’s nav rows'],
            [{ code: 'escape' }, { code: 'Item' }, 'A trailing “full portal” link out of the curated set'],
          ],
        },
        {
          name: 'Item shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'Stable unique id (matched against activeId)'],
            [{ code: 'label' }, { code: 'string' }, 'Display label'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Leading icon'],
            [{ code: 'badge' }, { code: 'string | number' }, 'Trailing count pill'],
            [{ code: 'locked' }, { code: 'boolean' }, 'Disabled row with a padlock'],
          ],
        },
      ]}
      accessibility={[
        <>The rail is a real <IC>{'<nav>'}</IC>; every group header, item, and escape link is a focusable <IC>{'<button>'}</IC> with a visible <IC>:focus-visible</IC> ring.</>,
        <>A collapsible group header exposes <IC>aria-expanded</IC>; the active item carries <IC>aria-current="page"</IC>.</>,
        <>Locked products are disabled and their padlock has an accessible label — entitlement is never conveyed by color alone.</>,
        <>Decorative icons are <IC>aria-hidden</IC>; the lock icons expose a label.</>,
      ]}
    >
      <Section
        title="Anatomy"
        note="The full Vipre Symphony rail. IES is the entitled product — expand/collapse it from its header, click an item to make it active, or take the “full portal” door out to the legacy portal. SafeSend and EDR are locked (no entitlement). The account-admin cluster and a footer slot pin to the bottom. Rendered with className=&quot;dark&quot; to force the product navy."
      >
        <Preview
          canvas={<Rail groups={GROUPS} footerItems={FOOTER_ITEMS} footer={<div className="vds-text vds-text--detail vds-text--tone-subtle" style={{ padding: '0.375rem 0.5rem' }}>☾ Dark mode</div>} />}
          code={`<SideNav
  className="dark"
  brand={<VipreMark />}
  activeId={page}
  onSelect={setPage}
  groups={[
    {
      id: 'ies', label: 'IES', icon: Mail,
      items: [
        { id: 'message-logs', label: 'Message Logs', icon: ScrollText },
        { id: 'threat-explorer', label: 'Threat Explorer', icon: ShieldAlert },
        { id: 'action-rules', label: 'Action Rules', icon: SlidersHorizontal },
      ],
      escape: { id: 'ies-portal', label: 'full portal' },
    },
    { id: 'safesend', label: 'SafeSend', icon: Send, locked: true },
    { id: 'edr', label: 'EDR', icon: Monitor, locked: true },
  ]}
  footerItems={[
    { id: 'saml', label: 'SAML', icon: KeyRound },
    { id: 'profile', label: 'Profile', icon: User },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Light theme"
        note="The rail follows the ambient theme — omit className=&quot;dark&quot; and it renders as a light rail (canvas surface, dark ink, soft-blue active tint). The 1px right border keeps it separated from the content."
      >
        <Preview
          canvas={<Rail groups={GROUPS} footerItems={FOOTER_ITEMS} dark={false} footer={<div className="vds-text vds-text--detail vds-text--tone-subtle" style={{ padding: '0.375rem 0.5rem' }}>☀ Light mode</div>} />}
          code={`// No className="dark" — the rail follows the ambient theme
<SideNav brand={<VipreMark/>} groups={groups} footerItems={footer} … />`}
        />
      </Section>

      <Section
        title="Section variant"
        note="For a flat, functional grouping (no products / entitlements), set variant:'section' — a static uppercase eyebrow label that’s always expanded. Items still support icons, badges, and the active highlight."
      >
        <Preview
          canvas={<Rail groups={SECTION_GROUPS} footerItems={[{ id: 'settings', label: 'Settings', icon: SlidersHorizontal }]} />}
          code={`groups={[
  {
    id: 'overview', label: 'Overview', variant: 'section',
    items: [{ id: 'customers', label: 'Customers', icon: Building2 }],
  },
  {
    id: 'email', label: 'Email Security', variant: 'section',
    items: [
      { id: 'message-logs', label: 'Message Logs', icon: ScrollText },
      { id: 'policies', label: 'Policies', icon: SlidersHorizontal, badge: '3' },
    ],
  },
]}`}
        />
      </Section>
    </ComponentPage>
  )
}
