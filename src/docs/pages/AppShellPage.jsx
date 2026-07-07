import { useState } from 'react'
import { Bell, FileText, LayoutGrid, Monitor, ScrollText } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, Kbd, IC } from '../primitives.jsx'
import { AppShell, AppShellNavTrigger } from '../../components/AppShell/index.js'
import { TopBar } from '../../components/TopBar/index.js'
import { SideNav } from '../../components/SideNav/index.js'
import { Heading } from '../../components/Text/index.js'
import { Button } from '../../components/Button/index.js'

const NAV_SECTIONS = [
  {
    id: 'main',
    label: 'Email Security',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutGrid },
      { id: 'logs', label: 'Message Logs', icon: ScrollText },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'devices', label: 'Devices', icon: Monitor },
      { id: 'alerts', label: 'Alerts', icon: Bell, badge: 2 },
    ],
  },
]

const PAGE_TITLES = {
  overview: 'Overview',
  logs: 'Message Logs',
  reports: 'Reports',
  devices: 'Devices',
  alerts: 'Alerts',
}

/* A placeholder content card so the frame has something to hold. */
function Ghost({ height = 96 }) {
  return (
    <div
      style={{
        height,
        background: 'var(--vds-surface)',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-md)',
      }}
    />
  )
}

function ShellDemo() {
  const [page, setPage] = useState('logs')
  return (
    <div
      style={{
        width: '100%',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* The shell normally fills the viewport (100dvh); an inline height
          confines this demo. */}
      <AppShell
        style={{ height: 460 }}
        nav={
          <SideNav
            aria-label="Product"
            sections={NAV_SECTIONS}
            activeId={page}
            onSelect={setPage}
          />
        }
        topBar={
          <TopBar
            leading={<AppShellNavTrigger />}
            trailing={<Button size="sm">New rule</Button>}
          >
            <Heading level="subheading" as="h2">{PAGE_TITLES[page]}</Heading>
          </TopBar>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vds-space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--vds-space-4)' }}>
            <div style={{ flex: 1 }}><Ghost /></div>
            <div style={{ flex: 1 }}><Ghost /></div>
            <div style={{ flex: 1 }}><Ghost /></div>
          </div>
          <Ghost height={180} />
          <Ghost height={180} />
        </div>
      </AppShell>
    </div>
  )
}

export function AppShellPage() {
  return (
    <ComponentPage
      title="App Shell"
      description="The frame every product screen sits in. It holds three things: your nav rail on the left, an optional top bar, and your page content. The shell fills the screen and pins the chrome — only the content scrolls. On small screens the rail tucks away and slides in as a drawer."
      installCode={`import { AppShell, AppShellNavTrigger } from 'vipre-design-system'`}
      props={[
        {
          name: 'AppShell',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'nav' }, { code: 'node' }, '—', 'The left rail — usually a SideNav'],
            [{ code: 'topBar' }, { code: 'node' }, '—', 'Sits above the content — usually a TopBar'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The page content (the only part that scrolls)'],
            [{ code: 'navOpen' }, { code: 'boolean' }, '—', 'You own the mobile drawer state (controlled)'],
            [{ code: 'defaultNavOpen' }, { code: 'boolean' }, { code: 'false' }, 'Drawer starts open (uncontrolled)'],
            [{ code: 'onNavOpenChange' }, { code: '(open) => void' }, '—', 'Runs when the drawer opens or closes'],
          ],
        },
        {
          name: 'AppShellNavTrigger',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'aria-label' }, { code: 'string' }, { code: "'Open navigation'" }, 'Its accessible name'],
            ['(native)', { code: 'button props' }, '—', 'onClick, className, … all pass through'],
          ],
        },
      ]}
      accessibility={[
        <>The content sits in a real <IC>{'<main>'}</IC>; the nav slot is separate, so a screen reader can jump between them.</>,
        <>The drawer closes on <Kbd>Esc</Kbd> and on a scrim click. While it is open the page behind cannot scroll.</>,
        <>Opening the drawer moves focus into the nav; closing it puts focus back on the hamburger.</>,
        <>While closed on mobile, the nav is <IC>aria-hidden</IC> and out of the tab order — you cannot tab into something you cannot see.</>,
        <>The hamburger reports state with <IC>aria-expanded</IC>. Reduced motion makes the drawer appear and disappear instantly.</>,
      ]}
    >
      <Section
        title="The frame"
        note="Nav on the left, top bar over the content, content below it. The nav column has no width of its own — it hugs the SideNav, so when the rail collapses, the content slides over with the same easing, for free. Click Collapse in the rail to feel it. The content area gets --vds-canvas, --vds-page-pad padding, and its own scrollbar."
      >
        <Preview
          canvas={<ShellDemo />}
          code={`<AppShell
  nav={<SideNav sections={sections} activeId={page} onSelect={setPage} />}
  topBar={
    <TopBar leading={<AppShellNavTrigger />} trailing={<Button size="sm">New rule</Button>}>
      <Heading level="subheading" as="h2">Message Logs</Heading>
    </TopBar>
  }
>
  <PageContent />
</AppShell>`}
        />
      </Section>

      <Section
        title="Mobile drawer"
        note="Below the lg breakpoint (1024px) the rail leaves the layout. The hamburger (AppShellNavTrigger) appears — put it in your TopBar's leading slot and forget it; it hides itself on wide screens. Tapping it slides the nav in from the left over a scrim, on the same emphasized curve as the Drawer component. Esc, a scrim tap, or growing the window past lg closes it. Shrink this window to try it. State is uncontrolled by default; pass navOpen + onNavOpenChange to own it."
      >
        <Code>{`// Uncontrolled — the trigger and the shell handle everything
<AppShell nav={<SideNav … />} topBar={<TopBar leading={<AppShellNavTrigger />} … />}>

// Controlled — e.g. close the drawer after a route change
const [navOpen, setNavOpen] = useState(false)
<AppShell navOpen={navOpen} onNavOpenChange={setNavOpen} … >`}</Code>
      </Section>

      <Section
        title="Container queries"
        note="The content area is a size container (container-type: inline-size). Style your page with @container rules and it responds to the space it actually has — which changes when the rail collapses — not the window width."
      >
        <Code>{`/* in a page's css */
@container (min-width: 800px) {
  .my-grid { grid-template-columns: 1fr 1fr 1fr; }
}`}</Code>
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. JS you must supply yourself: toggle vds-appshell--nav-open (plus render the scrim) below lg, close on Esc and scrim click, and lock body scroll while the drawer is open."
      >
        <Code>{`<div class="vds-appshell">                       <!-- add vds-appshell--nav-open on mobile -->
  <!-- scrim: only rendered while the mobile drawer is open -->
  <div class="vds-appshell__scrim"></div>

  <div class="vds-appshell__nav">
    <nav class="vds-sidenav" aria-label="Product">…</nav>
  </div>

  <div class="vds-appshell__main">
    <div class="vds-appshell__topbar">
      <header class="vds-topbar vds-topbar--surface">
        <div class="vds-topbar__leading">
          <button class="vds-appshell-trigger" aria-label="Open navigation"
                  aria-expanded="false"><svg>…</svg></button>
        </div>
        <div class="vds-topbar__body">…</div>
      </header>
    </div>
    <main class="vds-appshell__content">
      …the page…
    </main>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
