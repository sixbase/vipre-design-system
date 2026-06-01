import { HomePage } from './pages/HomePage.jsx'
import { ColorsPage } from './pages/ColorsPage.jsx'
import { TypographyPage } from './pages/TypographyPage.jsx'
import { ButtonPage } from './pages/ButtonPage.jsx'
import { BadgePage } from './pages/BadgePage.jsx'

/* Single source of truth for both the sidebar nav and the hash router. */
export const NAV = [
  {
    group: 'Getting Started',
    items: [{ path: '/', name: 'Introduction', Page: HomePage }],
  },
  {
    group: 'Foundation',
    items: [
      { path: '/foundation/colors', name: 'Colors', Page: ColorsPage },
      { path: '/foundation/typography', name: 'Typography', Page: TypographyPage },
    ],
  },
  {
    group: 'Components',
    items: [
      { path: '/components/button', name: 'Button', Page: ButtonPage },
      { path: '/components/badge', name: 'Badge', Page: BadgePage },
    ],
  },
]

export const ROUTE_MAP = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((item) => [item.path, item]),
)
