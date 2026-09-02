import { useState } from 'react'
import {
  Bell, Building2, FileText, KeyRound, LayoutGrid, Monitor,
  Radar, ScrollText, Settings, ShieldCheck, User, UserCog,
} from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from '../colorUsage.js'
import { Section, Preview, Kbd, IC, TokenSpecTable } from '../primitives.jsx'
import { SideNav, ProductTile } from '../../components/SideNav/index.js'
import { Button } from '../../components/Button/index.js'
import { GLYPHS } from '../templateData.js'

/* Live values resolve off a hidden .vds-sidenav probe. `bound` is taken verbatim
   from SideNav.scss; raw literals (label clamps, the 2px nest step, and the named
   motion beats) have no binding and show their computed value only. */
const SIDENAV_TOKEN_GROUPS = [
  {
    label: 'Color — the fixed navy look',
    tokens: [
      { token: '--vds-sidenav-bg', bound: 'var(--vds-midnight-950)', controls: 'Rail background' },
      { token: '--vds-sidenav-well', bound: 'var(--vds-midnight-1000)', controls: 'Card wells + dividers' },
      { token: '--vds-sidenav-ink', bound: 'var(--vds-midnight-200)', controls: 'Row labels' },
      { token: '--vds-sidenav-ink-dim', bound: 'var(--vds-midnight-300)', controls: 'Eyebrows, back row, account type' },
      { token: '--vds-sidenav-icon', bound: 'var(--vds-midnight-400)', controls: 'Resting row icons' },
      { token: '--vds-sidenav-icon-faint', bound: 'var(--vds-midnight-600)', controls: 'Escape-row ("Full portal") icon at rest' },
      { token: '--vds-sidenav-chev', bound: 'var(--vds-midnight-500)', controls: 'Product chevron at rest' },
      { token: '--vds-sidenav-hover', bound: 'var(--vds-midnight-800)', controls: 'Hover fill' },
      { token: '--vds-sidenav-press', bound: 'var(--vds-midnight-700)', controls: 'Pressed fill (one step brighter)' },
      { token: '--vds-sidenav-accent', bound: 'var(--vds-nav-accent)', controls: 'Selected fill — the one brandable value' },
      { token: '--vds-sidenav-accent-hover', bound: 'nav-accent 88% + midnight-1000', controls: 'Selected row, hovered' },
      { token: '--vds-sidenav-accent-press', bound: 'nav-accent 78% + midnight-1000', controls: 'Selected row, pressed' },
      { token: '--vds-sidenav-toplight', bound: 'white 10% → transparent', controls: 'Sheen gradient on selected fills' },
      { token: '--vds-sidenav-hairline', bound: 'inset white 8%', controls: 'Top hairline on selected fills' },
    ],
  },
  {
    label: 'Sizes',
    tokens: [
      { token: '--vds-sidenav-w', controls: 'Expanded rail width' },
      { token: '--vds-sidenav-w-collapsed', controls: 'Collapsed rail width (2 × the 36px icon column)' },
      { token: '--vds-sidenav-icon-size', bound: 'var(--vds-space-4)', controls: 'Row icon + lock badge box' },
      { token: '--vds-sidenav-tile-size', bound: 'var(--vds-space-8)', controls: 'Product / account tile' },
      { token: '--vds-sidenav-account-h', bound: 'var(--vds-control-h-md)', controls: 'Account header height (fixed, so collapse never shifts y)' },
      { token: '--vds-sidenav-back-h', bound: 'var(--vds-space-6)', controls: 'Back-row height' },
      { token: '--vds-sidenav-chev-size', bound: 'var(--vds-space-6)', controls: 'Chevron hit box' },
      { token: '--vds-sidenav-label-max', controls: 'Row label clamp before ellipsis' },
      { token: '--vds-sidenav-label-max-pill', controls: 'Product / account label clamp' },
    ],
  },
  {
    label: 'Spacing',
    tokens: [
      { token: '--vds-sidenav-nest', controls: 'Concentric padding step (tile → pill → card)' },
      { token: '--vds-sidenav-pad-x', bound: 'var(--vds-space-4)', controls: "Rail's base horizontal padding" },
      { token: '--vds-sidenav-section-pad-y', bound: 'var(--vds-space-2-5)', controls: 'Section top / bottom padding' },
      { token: '--vds-sidenav-section-gap', bound: 'var(--vds-space-1)', controls: 'Gap between rows in a section' },
      { token: '--vds-sidenav-row-pad-x', bound: 'var(--vds-space-2-5)', controls: 'Row inner x padding' },
      { token: '--vds-sidenav-row-pad-y', bound: 'var(--vds-space-1-5)', controls: 'Row inner y padding' },
      { token: '--vds-sidenav-label-gap', bound: 'var(--vds-space-2)', controls: 'Icon → label lead margin (acts as the gap)' },
    ],
  },
  {
    label: 'Radius — the concentric +2 rule',
    tokens: [
      { token: '--vds-sidenav-r-tile', bound: 'var(--vds-radius-md)', controls: 'Tiles (the 32px product / account tiles)' },
      { token: '--vds-sidenav-r-pill', bound: 'r-tile + nest', controls: 'Pills / rows / account (tile + 2px)' },
      { token: '--vds-sidenav-r-card', bound: 'r-pill + nest', controls: 'Product cards (pill + 2px)' },
    ],
  },
  {
    label: 'Typography — weights (sizes come from the text-size steps)',
    tokens: [
      { token: '--vds-sidenav-weight-label', bound: 'var(--vds-weight-medium)', controls: 'Row labels' },
      { token: '--vds-sidenav-weight-pill', bound: 'var(--vds-weight-semibold)', controls: 'Product name + account name' },
      { token: '--vds-sidenav-weight-quiet', bound: 'var(--vds-weight-regular)', controls: '"Full portal" + account type' },
    ],
  },
  {
    label: 'Not-subscribed badge — the "go get this" corner arrow',
    tokens: [
      { token: '--vds-sidenav-unsub-disc', bound: 'var(--vds-midnight-600)', controls: 'The little disc behind the arrow' },
      { token: '--vds-sidenav-unsub-ring', bound: 'var(--vds-midnight-950)', controls: "Ring around the disc — the rail's own navy, so it cuts a clean hole in the tile" },
      { token: '--vds-sidenav-unsub-ink', bound: 'var(--vds-midnight-100)', controls: 'The arrow' },
      { token: '--vds-sidenav-unsub-stroke', controls: 'How thick the arrow is drawn' },
    ],
  },
  {
    label: 'Edge handle — the round button on the rail\'s outer edge',
    tokens: [
      { token: '--vds-sidenav-edge-size', bound: 'var(--vds-space-6)', controls: 'The round button' },
      { token: '--vds-sidenav-edge-glyph', bound: 'var(--vds-space-4)', controls: 'The arrow inside it' },
      { token: '--vds-sidenav-edge-bg', bound: 'var(--vds-nav-accent)', controls: 'Its fill — follows the brand, like every selected row' },
      { token: '--vds-sidenav-edge-ink', bound: 'var(--vds-white)', controls: 'Its arrow' },
      { token: '--vds-sidenav-edge-ring', bound: 'white, 2px', controls: 'The white ring that lifts it off both sides of the edge' },
      { token: '--vds-sidenav-edge-lift', bound: 'var(--vds-shadow-md)', controls: 'Its shadow at rest' },
      { token: '--vds-sidenav-edge-lift-hover', bound: 'var(--vds-shadow-lg)', controls: 'Its shadow when you point at it' },
      { token: '--vds-sidenav-edge-press-scale', controls: 'How far it squashes when pressed' },
      { token: '--vds-sidenav-edge-stroke', controls: 'How thick its arrow is drawn' },
    ],
  },
  {
    label: 'Motion — one easing + named beats',
    tokens: [
      { token: '--vds-sidenav-ease', bound: 'var(--vds-ease-emphatic)', controls: 'One curve for every nav motion' },
      { token: '--vds-sidenav-dur-collapse', controls: 'Rail width + label slide' },
      { token: '--vds-sidenav-dur-hover-in', controls: 'Hover fill lands (near-instant)' },
      { token: '--vds-sidenav-dur-hover-out', controls: 'Hover fill releases (slow)' },
      { token: '--vds-sidenav-dur-press', controls: 'Tile settle on press' },
      { token: '--vds-sidenav-dur-label-out', controls: 'Label / eyebrow / badge fade out on collapse' },
      { token: '--vds-sidenav-delay-label-in', controls: 'Label fade-in delay on expand (width leads first)' },
      { token: '--vds-sidenav-dur-accordion', bound: 'var(--vds-dur-slow)', controls: 'Product card open / close' },
      { token: '--vds-sidenav-delay-item-in', controls: 'Card items fade in a beat after the card' },
      { token: '--vds-sidenav-dur-item-out', controls: 'Card items drop out on close' },
      { token: '--vds-sidenav-dur-tip', controls: 'Collapsed-rail tooltip fade + slide' },
      { token: '--vds-sidenav-dur-edge', controls: 'Edge handle fades in as the cursor nears' },
      { token: '--vds-sidenav-dur-shimmer', controls: 'Loading skeleton shimmer loop' },
    ],
  },
]


/* Entity avatars for the account header — any node works; here a ProductTile
   with a letter drawn on its 32×32 grid. */
const MelvinTile = (
  <ProductTile>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">M</text>
  </ProductTile>
)
const AcmeTile = (
  <ProductTile>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">A</text>
  </ProductTile>
)

const SECTIONS = [
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
          { id: 'ies-threat', label: 'Threat Explorer', icon: Radar },
          { id: 'ies-config', label: 'Email Config', icon: Settings },
        ],
        escape: { id: 'ies-portal', label: 'Full portal' },
      },
      {
        id: 'safesend', label: 'SafeSend', glyph: GLYPHS.safesend,
        items: [
          { id: 'ss-reports', label: 'Reports', icon: FileText },
          { id: 'ss-policies', label: 'Policies', icon: ShieldCheck },
        ],
      },
      {
        id: 'edr', label: 'EDR', glyph: GLYPHS.edr,
        items: [
          { id: 'edr-devices', label: 'Devices', icon: Monitor },
          { id: 'edr-incidents', label: 'Incidents', icon: Bell, badge: 3 },
        ],
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

/* The full rail with local state: pick pages, scope in/out, collapse. */
function FullRail() {
  const [active, setActive] = useState('ies-logs')
  const [scoped, setScoped] = useState(true)
  const account = scoped
    ? { name: 'Acme Corp', typeLabel: 'Customer', tile: AcmeTile }
    : { name: 'Melvin Industries', typeLabel: 'Distributor', tile: MelvinTile }
  return (
    <div style={{ height: 620, display: 'flex' }}>
      <SideNav
        aria-label="Product"
        account={account}
        onBack={scoped ? () => setScoped(false) : undefined}
        parentName="Melvin Industries"
        sections={SECTIONS}
        footerSections={FOOTER_SECTIONS}
        activeId={active}
        onSelect={setActive}
      />
    </div>
  )
}

function CollapsedRail() {
  const [active, setActive] = useState('edr-devices')
  return (
    <div style={{ height: 480, display: 'flex' }}>
      <SideNav
        aria-label="Product"
        defaultCollapsed
        account={{ name: 'Melvin Industries', typeLabel: 'Distributor', tile: MelvinTile }}
        sections={SECTIONS}
        activeId={active}
        onSelect={setActive}
      />
    </div>
  )
}

function LoadingRail() {
  const [loading, setLoading] = useState(true)
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ height: 420, display: 'flex' }}>
        <SideNav
          aria-label="Product"
          account={{ name: 'Acme Corp', typeLabel: 'Customer', tile: AcmeTile }}
          sections={[SECTIONS[1]]}
          loading={loading}
          collapseToggle={false}
          activeId="ies-logs"
        />
      </div>
      <Button size="sm" variant="outline" tone="neutral" onClick={() => setLoading((l) => !l)}>
        {loading ? 'Finish loading' : 'Load again'}
      </Button>
    </div>
  )
}

/* An account with nothing to manage. The section says why rather than sitting
   blank under its eyebrow. */
function UnmanagedRail() {
  return (
    <div style={{ height: 300, display: 'flex' }}>
      <SideNav
        aria-label="Product"
        account={{ name: 'Bell & Sons', typeLabel: 'Customer', tile: AcmeTile }}
        sections={[
          { id: 'products', label: 'Products', items: [], empty: 'No managed products — this account is unmanaged.' },
        ]}
        collapseToggle={false}
      />
    </div>
  )
}

/* The handle lives ON the seam, so the demo needs a slab of "page" beside the
   rail — there is no seam without something on the other side. */
function EdgeHandleRail() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ height: 420, display: 'flex', backgroundColor: 'var(--vds-canvas)' }}>
      <SideNav
        aria-label="Product"
        edgeHandle
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        account={{ name: 'Melvin Industries', typeLabel: 'Distributor', tile: MelvinTile }}
        sections={[SECTIONS[0]]}
        activeId="dashboard"
      />
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <p className="vds-text vds-text--detail" style={{ margin: 0, color: 'var(--vds-ink-subtle)' }}>
          Move your cursor toward the rail&rsquo;s edge.
        </p>
      </div>
    </div>
  )
}

export function SideNavPage() {
  return (
    <ComponentPage
      title="Side Nav"
      description="The navy menu rail on the left of every product screen. You give it data — an account, sections, products — and it draws the whole thing: product cards that open and close, locked products, a loading shimmer, a collapse button, and tooltips when the rail is thin. The navy never changes with the theme; it is a fixed frame, not a page surface. The blue highlight follows one token, --vds-nav-accent, so a reseller can re-brand it."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own rail against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      colors={COMPONENT_COLORS.SideNav}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'account' }, { code: '{ name, typeLabel?, tile? }' }, '—', 'Who is signed in — shown at the top. tile is an image URL or any node'],
            [{ code: 'onBack' }, { code: '() => void' }, '—', 'Shows a "Back to …" row above the account'],
            [{ code: 'parentName' }, { code: 'string' }, '—', 'Names the back target'],
            [{ code: 'sections' }, { code: 'Section[]' }, { code: '[]' }, 'The scrolling middle, split by thin lines'],
            [{ code: 'footerSections' }, { code: 'Section[]' }, { code: '[]' }, 'Sections pinned to the bottom'],
            [{ code: 'utilities' }, { code: 'Item[]' }, { code: '[]' }, 'Small rows at the very bottom (give each an onClick)'],
            [{ code: 'collapseToggle' }, { code: 'boolean' }, { code: 'true' }, 'Show the built-in Collapse row'],
            [{ code: 'edgeHandle' }, { code: 'boolean' }, { code: 'false' }, "Also show a round button on the rail's outer edge that appears when the cursor comes near. A mouse shortcut only — the Collapse row is still the keyboard way"],
            [{ code: 'collapsed' }, { code: 'boolean' }, '—', 'You own the collapse state (controlled)'],
            [{ code: 'defaultCollapsed' }, { code: 'boolean' }, { code: 'false' }, 'Start collapsed (uncontrolled)'],
            [{ code: 'onCollapsedChange' }, { code: '(collapsed) => void' }, '—', 'Runs when the rail opens or closes'],
            [{ code: 'activeId' }, { code: 'string' }, '—', 'Id of the current page — it gets the blue fill'],
            [{ code: 'onSelect' }, { code: '(id, item) => void' }, '—', 'Runs when any row is clicked'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Swap section items for shimmering placeholders'],
          ],
        },
        {
          name: 'Section shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'A unique id'],
            [{ code: 'label' }, { code: 'string' }, 'The small uppercase eyebrow (optional)'],
            [{ code: 'items' }, { code: 'Item[]' }, 'What the section holds — see the item shapes below'],
            [{ code: 'empty' }, { code: 'string | node' }, 'Shown when the section has no items — say why it is empty (e.g. an account with nothing to manage). Hidden on the collapsed rail, where there is no room for a sentence'],
          ],
        },
        {
          name: 'Item shapes (three kinds, all in sections[].items)',
          headers: ['Kind', 'Fields', 'Description'],
          rows: [
            ['Bare row', { code: '{ id, label, icon?, badge?, onClick? }' }, 'A plain link: 16px icon + label + an optional count pill'],
            ['Tile row', { code: '{ id, label, tile | glyph }' }, 'A 32px tile + label, no children (like Dashboard)'],
            ['Product group', { code: '{ id, label, tile | glyph, items, escape?, locked?, lockHint?, defaultOpen? }' }, 'A darker card that opens and closes. escape is the "Full portal" link out. locked mutes the tile, adds the little corner arrow, and hides the items'],
          ],
        },
        {
          name: 'ProductTile',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'glyph' }, { code: 'string' }, '—', 'An SVG path drawn on the 32×32 grid — the tile centers it for you'],
            [{ code: 'children' }, { code: 'node' }, '—', 'Custom SVG content instead of glyph'],
            [{ code: 'muted' }, { code: 'boolean' }, { code: 'false' }, 'The flat navy "not subscribed" look'],
            [{ code: 'size' }, { code: 'number' }, { code: '32' }, 'Rendered size in px'],
            [{ code: 'label' }, { code: 'string' }, '—', 'Accessible name; without it the tile is decorative'],
          ],
        },
      ]}
      accessibility={[
        <>The rail is a real <IC>{'<nav>'}</IC> — give it an <IC>aria-label</IC>. Every row is a <IC>{'<button>'}</IC> you can <Kbd>Tab</Kbd> to; the focus ring is mixed from white and the accent so it shows on navy.</>,
        <>Product cards set <IC>aria-expanded</IC>; the current page gets <IC>aria-current="page"</IC>. Closed card items are hidden from the tab order.</>,
        <>Collapsed, every row shows a <IC>role="tooltip"</IC> label on hover <em>and</em> keyboard focus. Expanded, rows carry a native <IC>title</IC> instead.</>,
        <>Products you have not bought are not clickable, and the little corner arrow means color alone never says so.</>,
        <>The edge handle is a mouse shortcut, so it is hidden from screen readers and skipped by <Kbd>Tab</Kbd> on purpose — it does the same job as the Collapse row, and meeting the same button twice is confusing. Everyone can still collapse the rail from that row.</>,
        <><IC>prefers-reduced-motion</IC> turns off all the animation — collapse and cards snap, shimmer freezes.</>,
      ]}
    >
      <Section title="Tokens only" note="The design system ships this rail's look-and-feel and its tokens — not the component. Each team builds the menu in its own framework (React / Angular / Bootstrap) and hooks it up to the --vds-sidenav-* variables below. The React build on this page just renders these demos; it is not published (a package you can install may come later — the tokens won't change).">
        <p className="vds-text vds-text--body" style={{ margin: 0 }}>
          Start with the pilot spec — look-and-feel, tokens, and the motion spec in one place:{' '}
          <a href="#/pilot/msp-menu"><strong>MSP Menu pilot →</strong></a>
        </p>
      </Section>
      <Section
        title="Anatomy"
        note="Everything at once: a back row and account header (click Back to step out of Acme Corp), two sections with eyebrows, product cards you can open and close, a locked product (SAT), a count badge on Incidents, a pinned Other section, and the built-in Collapse row. Click things — the page state lives in this docs page."
      >
        <Preview canvas={<FullRail />} />
      </Section>

      <Section
        title="Collapsed rail"
        note="Collapse squeezes the rail to an icon column. The icons never slide sideways — only the labels fold away. Hover or focus any icon to get its tooltip at the rail's edge. Here it starts collapsed with defaultCollapsed; pass collapsed + onCollapsedChange to own the state yourself."
      >
        <Preview canvas={<CollapsedRail />} />
      </Section>

      <Section
        title="Loading"
        note="While you're loading which products an account has, set loading — the sections show shimmering placeholder cards, so the change reads as loading, not a flicker."
      >
        <Preview canvas={<LoadingRail />} />
      </Section>

      <Section
        title="Product tiles"
        note="ProductTile is the 32px gradient square in front of a product. One glyph draws both looks: the bright gradient when you have the product, and the flat muted navy when you don't. The gradient's colors are tokens (--vds-tile-accent falls back to --vds-nav-accent), so a re-brand re-tints every tile."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--vds-midnight-950)', borderRadius: 'var(--vds-radius-md)' }}>
              <ProductTile glyph={GLYPHS.ies} label="IES" />
              <ProductTile glyph={GLYPHS.safesend} label="SafeSend" />
              <ProductTile glyph={GLYPHS.edr} label="EDR" />
              <ProductTile glyph={GLYPHS.sat} muted label="SAT (locked)" />
            </div>
          }
        />
      </Section>

      <Section
        title="Nothing to manage"
        note="Some accounts have no products. Say so in plain words instead of leaving an empty space under the heading — a blank gap reads as something failed to load. Pass empty on the section. It hides when the rail is collapsed, because 72px cannot hold a sentence."
      >
        <Preview canvas={<UnmanagedRail />} />
      </Section>

      <Section
        title="Edge handle"
        note="An extra way to close the rail: a round button that rides the outer edge and fades in when your cursor comes near it, then follows your pointer up and down. It is a mouse shortcut only — the Collapse row at the bottom still does the same job for keyboards and screen readers. Turn it on with edgeHandle. Do not clip overflow on the box around the rail, or you will cut the button in half."
      >
        <Preview canvas={<EdgeHandleRail />} />
      </Section>

      <Section
        title="Tokens"
        note="Every visual value is a --vds-sidenav-* variable set on the .vds-sidenav root — so the whole rail is easy to grab and override. Re-set any of them on your own selector to re-color or re-space the menu; nothing else in the system changes. Colors point at the fixed navy ramp (so the rail stays navy in both themes); motion is one shared curve plus named beats."
      >
        <TokenSpecTable scope="vds-sidenav" prefix="--vds-sidenav-" groups={SIDENAV_TOKEN_GROUPS} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.75rem' }}>
          Type sizes are text-size steps, not raw values: eyebrow &amp; account type = <IC>nano</IC>,
          escape row = <IC>micro</IC>, row label = <IC>detail</IC>, sub-row &amp; account name = <IC>caption</IC>,
          product label = <IC>body</IC>. All motion is disabled under <IC>prefers-reduced-motion</IC> —
          collapse and cards snap, the shimmer freezes.
        </p>
      </Section>
    </ComponentPage>
  )
}
