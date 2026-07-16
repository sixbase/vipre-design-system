import { useState } from 'react'
import {
  Bell, Building2, KeyRound, LayoutGrid, Monitor,
  Radar, ScrollText, User, UserCog,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, PropsTable, IC } from '../primitives.jsx'
import { SideNav, ProductTile } from '../../components/index.js'
import { GLYPHS } from '../templateData.js'

/* ============================================================================
   MSP MENU — the tokens-only pilot.
   The design system ships the LOOK-AND-FEEL + the TOKENS that define this menu,
   not the component code. Each product team builds the menu in its own stack
   (React / Angular / Bootstrap) and binds to the same --vds-sidenav-* CSS
   variables. The React build below is a REFERENCE that renders these demos —
   it is not published (see "How this ships").
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

/* The written choreography — the part a token list can't capture on its own. */
const MOTION = [
  ['Collapse / expand rail', 'Rail width animates; the icon column never shifts x (label lead-margin animates away, not a flex gap).', 'width · --vds-sidenav-dur-collapse (220ms) · --vds-sidenav-ease'],
  ['Labels', 'Slide (max-width + left-margin) on the shared curve; opacity is ASYMMETRIC — out fast, in late — so the width leads and words arrive after.', 'out --vds-sidenav-dur-label-out (90ms) · in --vds-dur-base after --vds-sidenav-delay-label-in (70ms)'],
  ['Eyebrows & badges', 'Fade only — they never unmount, so section heights stay identical and nothing jumps vertically.', 'same label-out / label-in beats'],
  ['Product card open / close', 'Card height animates 0fr→1fr; the items reveal as a SECOND stage — fade in a beat after the card starts opening, drop out fast on close. Closed items leave the tab order.', 'card --vds-sidenav-dur-accordion (240ms) · items in after --vds-sidenav-delay-item-in (60ms), out --vds-sidenav-dur-item-out (110ms)'],
  ['Chevron', 'Shrinks + fades in step with the labels; the arrow flips 180° on open.', 'flip --vds-dur-base · --vds-sidenav-ease'],
  ['Row hover', 'Fill fades IN fast and OUT slow — the pointer feels tracked, not chased.', 'in --vds-sidenav-dur-hover-in (50ms) / out --vds-sidenav-dur-hover-out (280ms)'],
  ['Row press', 'Instant, one step brighter than hover — tactile, not murky.', '0ms → --vds-sidenav-press'],
  ['Product tile', 'Lifts on hover (scale 1.05), settles under the finger on press (scale 0.97).', 'press settle --vds-sidenav-dur-press (80ms) · --vds-sidenav-ease'],
  ['Collapsed-rail tooltip', 'One floating chip fades + slides 4px out from the rail edge; re-keyed per row so it replays as you move.', '--vds-sidenav-dur-tip (140ms) · --vds-sidenav-ease'],
  ['Loading skeleton', 'Shimmer sweep loops across the placeholder cards.', '--vds-sidenav-dur-shimmer (1.15s) linear infinite'],
  ['Reduced motion', 'Everything snaps — collapse, cards, tooltips — and the shimmer freezes.', 'honors prefers-reduced-motion'],
]

export function MspMenuPilotPage() {
  return (
    <ComponentPage
      title="MSP Menu"
      description="The first try at our tokens-only design system. We don't ship this menu as code. We ship its look and feel plus the tokens that define it, and each team builds the menu in React, Angular, or Bootstrap tied to those tokens. This page is the whole guide: match the look, use the tokens, follow the motion notes."
      installCode={`<!-- One file, every framework. Link the design tokens once; -->
<!-- then bind your own components to the --vds-* CSS variables. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
    >
      <Section title="1 · Look and feel" note="The one to match. Click a row, open a product card, press Collapse, click Customers to step into a customer, then Back to pop out. Build your menu to look and act like this.">
        <Preview canvas={<MenuOnly />} />
      </Section>

      <Section title="2 · Tokens — the spec" note="Everything visual is a --vds-sidenav-* variable: color, sizes, spacing, radius, type weight, and motion. They are plain CSS variables, so React, Angular, and Bootstrap all use the exact same values. These are the numbers your build must hit.">
        <p className="vds-text vds-text--body" style={{ margin: 0 }}>
          Full token reference (48 tokens, grouped by Color / Sizes / Spacing / Radius / Typography / Motion):{' '}
          <a href="#/components/side-nav"><strong>Side Nav → Tokens →</strong></a>
        </p>
      </Section>

      <Section title="3 · Motion spec" note="A token sets the timing (how long, what easing). This part sets the dance — which thing moves, in what order, and why. You need both to get the feel right: the tokens alone won't tell you that labels fade out fast but in late. One curve drives all of it — --vds-sidenav-ease (starts brisk, lands soft).">
        <PropsTable
          headers={['Interaction', 'What moves', 'Tokens & timing']}
          rows={MOTION.map(([a, b, c]) => [a, b, { code: c }])}
        />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.6rem' }}>
          The main idea: motion is <strong>lopsided on purpose</strong> — things leave fast and
          arrive late, so the layout leads and the content follows. Keep that and the menu feels well-made;
          make it even and it feels cheap.
        </p>
      </Section>

      <Section title="4 · Icons" note="Use Font Awesome for row and utility icons — it covers the common cases and every team already has it. Reach for a custom SVG (drawn in Figma) only when Font Awesome falls short.">
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The product <IC>tiles</IC> here are the exception that proves the rule: they're brand glyphs no
          icon library carries, so they're custom SVG on a 32×32 grid. Everything else — Dashboard, Devices,
          Admins — is a Font Awesome icon.
        </p>
      </Section>

      <Section title="How this ships" note="Tokens today; a component package later — the door stays open.">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.6rem', maxWidth: 720 }}>
          <p style={{ margin: 0 }}>
            <strong>Today:</strong> link <IC>vipre-tokens.css</IC> and build the menu in your framework,
            binding to the tokens above. Your team owns the component.
          </p>
          <p style={{ margin: 0 }}>
            <strong>The React build in this repo is an example</strong>, not a package — it renders the demos
            and shows the tokens produce the intended look. It is not something you install.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Later:</strong> as Vipre's agentic workflow matures, that example becomes
            <em> a package you can install</em> and update on your own schedule. The tokens
            stay exactly the same either way — so nothing you build against the tokens now is throwaway.
          </p>
        </div>
      </Section>
    </ComponentPage>
  )
}
