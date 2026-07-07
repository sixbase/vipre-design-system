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
   ----------------------------------------------------------------------------
   This is ONLY the product rail (the `SideNav` component). No AppShell, no
   TopBar, no page body. Everything the menu needs — account identity, the two
   section states (MSP list vs. scoped-into-a-customer), the pinned footer, the
   active-page state, scope in/out, and collapse — lives in THIS file.

   The delivery vehicle for this to engineering is still being decided; this
   page exists so we have one concrete thing to point at while we align.
   ========================================================================== */

const MeridianTile = (
  <ProductTile>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">M</text>
  </ProductTile>
)
const AcmeTile = (
  <ProductTile>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">A</text>
  </ProductTile>
)

/* Unscoped MSP view: partner pages first, then the product cards. */
const MSP_SECTIONS = [
  {
    id: 'partners',
    label: 'Partners',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'customers', label: 'Customers', icon: Building2 },
    ],
  },
  {
    id: 'products',
    label: 'Products',
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

/* Scoped into one customer: only that customer's products. */
const CUSTOMER_SECTIONS = [
  {
    id: 'products',
    label: 'Products',
    items: [
      {
        id: 'ies', label: 'IES', glyph: GLYPHS.ies, defaultOpen: true,
        items: [
          { id: 'ies-overview', label: 'Overview', icon: LayoutGrid },
          { id: 'ies-logs', label: 'Message Logs', icon: ScrollText },
        ],
        escape: { id: 'ies-portal', label: 'Full portal' },
      },
      {
        id: 'edr', label: 'EDR', glyph: GLYPHS.edr,
        items: [{ id: 'edr-devices', label: 'Devices', icon: Monitor }],
      },
      { id: 'sat', label: 'SAT', glyph: GLYPHS.sat, locked: true, lockHint: 'Not subscribed' },
    ],
  },
]

const FOOTER_SECTIONS = [
  {
    id: 'other',
    label: 'Other',
    items: [
      { id: 'admins', label: 'Admins', icon: UserCog },
      { id: 'saml', label: 'SAML', icon: KeyRound },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
]

/* ---- The isolated menu ----------------------------------------------------- */

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
          // "Customers" is the drill-in affordance in this isolated demo.
          if (id === 'customers') { setScoped(true); setPage('ies-overview'); return }
          setPage(id)
        }}
      />
    </div>
  )
}

/* ---- Page ------------------------------------------------------------------ */

export function MspMenuPilotPage() {
  return (
    <ComponentPage
      title="MSP Menu (isolated)"
      description="Only the product rail — no shell, no top bar, no page body. This is the exact SideNav from the MSP Shell template, pulled out on its own so we can pilot handing just the menu to engineering. Everything the menu needs is self-contained: account identity, the MSP vs. scoped-customer section states, the pinned footer, active-page state, scope in/out, and collapse."
      installCode={`import { SideNav, ProductTile } from 'vipre-design-system'`}
    >
      <Section
        title="The menu, alone"
        note="Click rows to move the active state. Open and close the product cards. Collapse the rail with the bottom row. Click 'Customers' to scope into Acme Corp — the account header and sections swap and a Back row appears. Click Back to climb out."
      >
        <Preview
          canvas={<MenuOnly />}
          code={`<SideNav
  aria-label="Product"
  account={scoped ? acmeAccount : mspAccount}   // { name, typeLabel, tile }
  onBack={scoped ? () => setScoped(false) : undefined}
  parentName="Meridian Distribution"
  sections={scoped ? customerSections : mspSections}
  footerSections={otherSections}
  activeId={page}
  onSelect={setPage}
/>`}
        />
      </Section>
    </ComponentPage>
  )
}
