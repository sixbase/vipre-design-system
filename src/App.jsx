import { useEffect, useRef, useState } from 'react'
import { SearchInput, Text } from './components/index.js'
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

  /* ---- finding a page ---------------------------------------------------------------
     Sixty-odd entries across eight groups is more than a list you scan — you either know
     the name and want to jump, or you half-know it and want to see what is near it.

     Matches the PAGE NAME and its GROUP, so "form" surfaces everything under Forms &
     Inputs even though no page is called that, and a group whose own name matches keeps
     all its pages. Groups that empty are dropped rather than left as a heading with
     nothing under them.

     Not a router or a command palette: it filters the list in place, so the thing you
     were looking at stays on screen and the answer appears beside it. */
  const [navQuery, setNavQuery] = useState('')

  /* Cmd/Ctrl-K focuses the field and selects what is in it, so a second search does not
     need the field cleared first. Escape hands focus back rather than trapping it, and
     the hint chip is SearchInput's own — it disappears once the field has content, which
     is exactly when it stops being useful. */
  const navSearchRef = useRef(null)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        navSearchRef.current?.focus()
        navSearchRef.current?.select()
      }
      if (e.key === 'Escape' && document.activeElement === navSearchRef.current) {
        navSearchRef.current.blur()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  const q = navQuery.trim().toLowerCase()
  const navGroups = !q
    ? NAV
    : NAV
        .map((group) => group.group.toLowerCase().includes(q)
          ? group
          : { ...group, items: group.items.filter((i) => i.name.toLowerCase().includes(q)) })
        .filter((group) => group.items.length > 0)
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

        <div className="vds-sidebar__search">
          <SearchInput
            ref={navSearchRef}
            size="sm"
            shortcutHint="⌘K"
            value={navQuery}
            onChange={setNavQuery}
            onClear={() => setNavQuery('')}
            placeholder="Find a component"
            aria-label="Find a component"
          />
        </div>

        <nav>
          {navGroups.map((group) => (
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
          {navGroups.length === 0 && (
            <Text variant="detail" tone="subtle" className="vds-sidebar__no-matches" role="status">
              Nothing matches &ldquo;{navQuery.trim()}&rdquo;
            </Text>
          )}
        </nav>
      </aside>

      {/* ---- Content ---- */}
      <main className="vds-content">
        <Page />
      </main>
    </div>
  )
}
