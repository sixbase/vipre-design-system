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
      { token: '--vds-sidenav-dur-shimmer', controls: 'Loading skeleton shimmer loop' },
    ],
  },
]

/* ----------------------------------------------------------------------------
   Product glyphs — SVG path strings drawn on the tile's 32×32 grid. In a real
   app these ship with your product config; the SideNav itself has no icon set.
   -------------------------------------------------------------------------- */
const GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
  sat: 'M17 26.2115L8.25 21.3558V11.6443L17 6.7885L25.75 11.6443V21.3558L17 26.2115ZM14.148 14.0578C14.5122 13.6449 14.941 13.3238 15.4345 13.0943C15.9282 12.8648 16.45 12.75 17 12.75C17.55 12.75 18.0718 12.8648 18.5655 13.0943C19.059 13.3238 19.4878 13.6449 19.852 14.0578L23.4098 12.075L17 8.5115L10.5903 12.075L14.148 14.0578ZM16.25 24.073V20.1828C15.3692 19.9878 14.649 19.548 14.0895 18.8635C13.5298 18.1788 13.25 17.391 13.25 16.5C13.25 16.2975 13.2632 16.1074 13.2895 15.9298C13.3157 15.7523 13.3602 15.5705 13.423 15.3845L9.75 13.327V20.4693L16.25 24.073ZM18.5953 18.0953C19.0318 17.6588 19.25 17.127 19.25 16.5C19.25 15.873 19.0318 15.3413 18.5953 14.9048C18.1588 14.4683 17.627 14.25 17 14.25C16.373 14.25 15.8413 14.4683 15.4048 14.9048C14.9683 15.3413 14.75 15.873 14.75 16.5C14.75 17.127 14.9683 17.6588 15.4048 18.0953C15.8413 18.5318 16.373 18.75 17 18.75C17.627 18.75 18.1588 18.5318 18.5953 18.0953ZM17.75 24.073L24.25 20.4693V13.327L20.577 15.3845C20.6398 15.5705 20.6843 15.7523 20.7105 15.9298C20.7368 16.1074 20.75 16.2975 20.75 16.5C20.75 17.391 20.4702 18.1788 19.9105 18.8635C19.351 19.548 18.6308 19.9878 17.75 20.1828V24.073Z',
}

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
          ],
        },
        {
          name: 'Item shapes (three kinds, all in sections[].items)',
          headers: ['Kind', 'Fields', 'Description'],
          rows: [
            ['Bare row', { code: '{ id, label, icon?, badge?, onClick? }' }, 'A plain link: 16px icon + label + an optional count pill'],
            ['Tile row', { code: '{ id, label, tile | glyph }' }, 'A 32px tile + label, no children (like Dashboard)'],
            ['Product group', { code: '{ id, label, tile | glyph, items, escape?, locked?, lockHint?, defaultOpen? }' }, 'A darker card that opens and closes. escape is the "Full portal" link out. locked mutes the tile, adds a padlock, and hides the items'],
          ],
        },
        {
          name: 'ProductTile',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'glyph' }, { code: 'string' }, '—', 'An SVG path drawn on the 32×32 grid'],
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
        <>Locked products are not clickable, and the padlock badge means color alone never says "locked".</>,
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
