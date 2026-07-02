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
      description="The left-side menu bar for an app. One component builds the whole rail: a logo at the top, product groups you can open and close (each with links, an optional “full portal” link out, and a locked state when you don't have that product), an account and admin cluster pinned to the bottom, and a spare slot below it. It matches the current theme, so pass className=&quot;dark&quot; to force the navy look. Uses Icon."
      installCode={`import { SideNav } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'brand' }, { code: 'node' }, '—', 'What goes at the top (logo or name)'],
            [{ code: 'groups' }, { code: 'Group[]' }, { code: '[]' }, 'The scrolling middle — your products or sections'],
            [{ code: 'footerItems' }, { code: 'Item[]' }, { code: '[]' }, 'Account and admin links pinned to the bottom'],
            [{ code: 'footer' }, { code: 'node' }, '—', 'A spare slot below those links (like a theme toggle)'],
            [{ code: 'activeId' }, { code: 'string' }, '—', 'Id of the current item — it gets highlighted'],
            [{ code: 'onSelect' }, { code: '(id, item) => void' }, '—', 'Runs when any item or portal link is clicked'],
            [{ code: 'className' }, { code: 'string' }, '—', "Extra classes — pass 'dark' to force the navy rail"],
          ],
        },
        {
          name: 'Group shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'A unique id that stays the same'],
            [{ code: 'label' }, { code: 'string' }, 'Group or product name (leave out for a list with no header)'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Icon shown first (product style)'],
            [{ code: 'variant' }, { code: "'product' | 'section'" }, "'product' = a header you can open and close; 'section' = a fixed label"],
            [{ code: 'collapsible' }, { code: 'boolean' }, 'Product groups can close; set false to keep it open'],
            [{ code: 'defaultOpen' }, { code: 'boolean' }, 'Whether it starts open (default true)'],
            [{ code: 'locked' }, { code: 'boolean' }, "You don't have this product — shows a padlock and hides its items"],
            [{ code: 'lockHint' }, { code: 'string' }, 'Tooltip shown on a locked group'],
            [{ code: 'items' }, { code: 'Item[]' }, 'The links inside the group'],
            [{ code: 'escape' }, { code: 'Item' }, 'A “full portal” link out to the full app'],
          ],
        },
        {
          name: 'Item shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'A unique id (compared to activeId)'],
            [{ code: 'label' }, { code: 'string' }, 'The text shown'],
            [{ code: 'icon' }, { code: 'icon component' }, 'Icon shown first'],
            [{ code: 'badge' }, { code: 'string | number' }, 'A small count pill at the end'],
            [{ code: 'locked' }, { code: 'boolean' }, 'Greyed-out row with a padlock'],
          ],
        },
      ]}
      accessibility={[
        <>The rail is a real <IC>{'<nav>'}</IC>; every group header, item, and portal link is a <IC>{'<button>'}</IC> you can tab to, with a visible <IC>:focus-visible</IC> ring.</>,
        <>A group header you can open and close has <IC>aria-expanded</IC>; the current item has <IC>aria-current="page"</IC>.</>,
        <>Locked products are turned off and their padlock has a label a screen reader can read — color alone never tells you it's locked.</>,
        <>Icons that are just for looks are <IC>aria-hidden</IC>; the lock icons have a label.</>,
      ]}
    >
      <Section
        title="Anatomy"
        note="The full Vipre Symphony rail. IES is the product you have — open or close it from its header, click an item to select it, or take the “full portal” door out to the old portal. SafeSend and EDR are locked (you don't have them). The account and admin cluster and a spare slot sit at the bottom. Shown with className=&quot;dark&quot; to force the navy look."
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
        note="The rail matches the current theme — leave out className=&quot;dark&quot; and it turns light (light background, dark text, soft-blue highlight). A 1px border on the right keeps it separate from the content."
      >
        <Preview
          canvas={<Rail groups={GROUPS} footerItems={FOOTER_ITEMS} dark={false} footer={<div className="vds-text vds-text--detail vds-text--tone-subtle" style={{ padding: '0.375rem 0.5rem' }}>☀ Light mode</div>} />}
          code={`// No className="dark" — the rail follows the ambient theme
<SideNav brand={<VipreMark/>} groups={groups} footerItems={footer} … />`}
        />
      </Section>

      <Section
        title="Section variant"
        note="For a plain grouping (no products or locks), set variant:'section' — a fixed uppercase label that's always open. Items still get icons, badges, and the highlight."
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
