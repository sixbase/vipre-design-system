import { useState } from 'react'
import {
  Bell, Building2, KeyRound, LayoutGrid, Monitor,
  Radar, ScrollText, User, UserCog,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview } from '../primitives.jsx'
import { SideNav, ProductTile } from '../../components/index.js'
import { GLYPHS } from '../templateData.js'

/* ============================================================================
   MSP MENU — ISOLATED (pilot handoff artifact)
   Just the SideNav, on its own — no shell, no top bar, no page body. All the
   data it needs lives in this file. Docs copy is deliberately ELI10.
   ========================================================================== */

const MeridianTile = (
  <ProductTile><text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">M</text></ProductTile>
)
const AcmeTile = (
  <ProductTile><text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">A</text></ProductTile>
)

const MSP_SECTIONS = [
  {
    id: 'partners', label: 'Partners',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'customers', label: 'Customers', icon: Building2 },
    ],
  },
  {
    id: 'products', label: 'Products',
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

const CUSTOMER_SECTIONS = [
  {
    id: 'products', label: 'Products',
    items: [
      {
        id: 'ies', label: 'IES', glyph: GLYPHS.ies, defaultOpen: true,
        items: [
          { id: 'ies-overview', label: 'Overview', icon: LayoutGrid },
          { id: 'ies-logs', label: 'Message Logs', icon: ScrollText },
        ],
        escape: { id: 'ies-portal', label: 'Full portal' },
      },
      { id: 'edr', label: 'EDR', glyph: GLYPHS.edr, items: [{ id: 'edr-devices', label: 'Devices', icon: Monitor }] },
      { id: 'sat', label: 'SAT', glyph: GLYPHS.sat, locked: true, lockHint: 'Not subscribed' },
    ],
  },
]

const FOOTER_SECTIONS = [
  {
    id: 'other', label: 'Other',
    items: [
      { id: 'admins', label: 'Admins', icon: UserCog },
      { id: 'saml', label: 'SAML', icon: KeyRound },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
]

function MenuOnly() {
  const [scoped, setScoped] = useState(false)
  const [page, setPage] = useState('dashboard')
  const account = scoped
    ? { name: 'Acme Corp', typeLabel: 'Customer', tile: AcmeTile }
    : { name: 'Meridian Distribution', typeLabel: 'Distributor', tile: MeridianTile }
  return (
    <div style={{ height: 620, display: 'flex' }}>
      <SideNav
        aria-label="Product"
        account={account}
        onBack={scoped ? () => { setScoped(false); setPage('dashboard') } : undefined}
        parentName="Meridian Distribution"
        sections={scoped ? CUSTOMER_SECTIONS : MSP_SECTIONS}
        footerSections={FOOTER_SECTIONS}
        activeId={page}
        onSelect={(id) => {
          if (id === 'customers') { setScoped(true); setPage('ies-overview'); return }
          setPage(id)
        }}
      />
    </div>
  )
}

export function MspMenuPilotPage() {
  return (
    <ComponentPage
      title="MSP Menu"
      description="Just the side menu, on its own — no page around it. Click it; it really works. When you want it in your app, follow the Menu Quickstart."
      installCode={`import { SideNav, ProductTile } from 'vipre-design-system'`}
    >
      <Section title="Try it" note="Click a row. Open a product card. Press Collapse to shrink the rail. Click Customers to jump into a customer, then Back to pop out.">
        <Preview
          canvas={<MenuOnly />}
          code={`<SideNav
  account={account}      // who you're signed in as
  sections={sections}    // the rows + product cards
  activeId={page}        // which row is blue
  onSelect={setPage}     // runs when a row is clicked
/>`}
        />
      </Section>

      <Section title="Use it in your app" note="The menu is three pieces: a stylesheet, some markup, and one tiny script. Add them and it works — in React, Angular, or plain HTML.">
        <p className="vds-text vds-text--body" style={{ margin: 0 }}>
          Full steps (about 5 minutes):{' '}
          <a href="#/adoption/menu-quickstart"><strong>Menu Quickstart →</strong></a>
        </p>
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
          Want every prop, state, and the raw markup? See the full{' '}
          <a href="#/components/side-nav">Side Nav</a> page.
        </p>
      </Section>
    </ComponentPage>
  )
}
