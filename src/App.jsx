import { useEffect, useState } from 'react'
import { Text } from './components/index.js'
import { NAV, ROUTE_MAP } from './docs/routes.js'
import { VipreLogo } from './docs/VipreLogo.jsx'

/* Tiny dependency-free hash router. Reads window.location.hash (e.g.
   "#/components/button"), defaults to "/", and re-renders on hashchange.
   Hash routing works on static hosts like GitHub Pages with no config. */
function useHashRoute() {
  const read = () => window.location.hash.replace(/^#/, '') || '/'
  const [path, setPath] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setPath(read())
      document.querySelector('.vds-content')?.scrollTo(0, 0)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export function App() {
  const [dark, setDark] = useState(false) // light is the default theme
  const [navOpen, setNavOpen] = useState(false) // mobile off-canvas sidebar
  const path = useHashRoute()
  const route = ROUTE_MAP[path] || ROUTE_MAP['/']
  const Page = route.Page

  // Keep the <html> class in sync with state (covers initial mount + toggles).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Mobile drawer: close whenever navigation happens (link tap → hash change).
  useEffect(() => {
    setNavOpen(false)
  }, [path])

  // While the drawer is open: Escape closes it, the page behind stops
  // scrolling (the drawer itself still scrolls its own nav), and growing the
  // viewport past lg — where the sidebar is always visible — lets it go so the
  // scroll lock can't outlive the drawer.
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const bpLg =
      getComputedStyle(document.documentElement).getPropertyValue('--vds-bp-lg').trim() || '1024px'
    const mq = window.matchMedia(`(min-width: ${bpLg})`)
    const onResize = () => {
      if (mq.matches) setNavOpen(false)
    }
    mq.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      mq.removeEventListener('change', onResize)
    }
  }, [navOpen])

  function toggleTheme() {
    setDark((d) => !d)
  }

  return (
    <div className="vds-layout">
      {/* ---- Mobile top bar (hidden on desktop — the sidebar is always there) ---- */}
      <header className="vds-topbar">
        <button
          type="button"
          className="vds-topbar__menu"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="vds-docs-sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <a href="#/" className="vds-topbar__brand" aria-label="Vipre Design System home">
          <VipreLogo className="vds-logo vds-logo--topbar" />
        </a>
      </header>

      {/* ---- Drawer scrim (mobile only; click closes) ---- */}
      {navOpen && (
        <div className="vds-layout__scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />
      )}

      {/* ---- Sidebar ---- */}
      <aside id="vds-docs-sidebar" className={`vds-sidebar${navOpen ? ' is-open' : ''}`}>
        <div className="vds-sidebar__header">
          <a href="#/" className="vds-sidebar__brand" aria-label="Vipre Design System home">
            <VipreLogo className="vds-logo" />
            <Text variant="eyebrow" tone="subtle" className="vds-sidebar__brand-sub">
              Design System
            </Text>
          </a>
          <button
            type="button"
            className="vds-sidebar__toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {dark ? '☀' : '☾'}
          </button>
        </div>

        <nav>
          {NAV.map((group) => (
            <div key={group.group} className="vds-sidebar__section">
              <Text variant="eyebrow" tone="muted" className="vds-sidebar__label">
                {group.group}
              </Text>
              {group.items.map((item) => (
                <a
                  key={item.path}
                  href={`#${item.path}`}
                  className={`vds-sidebar__link${item.path === route.path ? ' is-active' : ''}`}
                  aria-current={item.path === route.path ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ---- Content ---- */}
      <main className="vds-content">
        <Page />
      </main>
    </div>
  )
}
