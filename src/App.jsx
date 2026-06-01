import { useEffect, useState } from 'react'
import { Heading, Text } from './components/Text.jsx'
import { NAV, ROUTE_MAP } from './docs/routes.js'

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
  const [dark, setDark] = useState(true)
  const path = useHashRoute()
  const route = ROUTE_MAP[path] || ROUTE_MAP['/']
  const Page = route.Page

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="vds-layout">
      {/* ---- Sidebar ---- */}
      <aside className="vds-sidebar">
        <div className="vds-sidebar__header">
          <a href="#/" className="vds-sidebar__brand" style={{ textDecoration: 'none' }}>
            <Text variant="eyebrow" tone="primary">
              Vipre
            </Text>
            <Heading level="subheading" as="div">
              Design System
            </Heading>
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
