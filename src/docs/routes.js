import { HomePage } from './pages/HomePage.jsx'
import { InstallationPage } from './pages/InstallationPage.jsx'
import { ColorsPage } from './pages/ColorsPage.jsx'
import { TypographyPage } from './pages/TypographyPage.jsx'
import { SpacingPage } from './pages/SpacingPage.jsx'
import { LayoutPage } from './pages/LayoutPage.jsx'
import { IconPage } from './pages/IconPage.jsx'
import { InputPage } from './pages/InputPage.jsx'
import { CheckboxPage } from './pages/CheckboxPage.jsx'
import { SwitchPage } from './pages/SwitchPage.jsx'
import { SelectPage } from './pages/SelectPage.jsx'
import { SpinnerPage } from './pages/SpinnerPage.jsx'
import { ButtonPage } from './pages/ButtonPage.jsx'
import { BadgePage } from './pages/BadgePage.jsx'

/* Single source of truth for both the sidebar nav and the hash router. */
export const NAV = [
  {
    group: 'Getting Started',
    items: [
      { path: '/', name: 'Introduction', Page: HomePage },
      { path: '/getting-started/installation', name: 'Installation', Page: InstallationPage },
    ],
  },
  {
    group: 'Foundation',
    items: [
      { path: '/foundation/colors', name: 'Colors', Page: ColorsPage },
      { path: '/foundation/typography', name: 'Typography', Page: TypographyPage },
      { path: '/foundation/spacing', name: 'Spacing', Page: SpacingPage },
      { path: '/foundation/layout', name: 'Layout', Page: LayoutPage },
    ],
  },
  {
    group: 'Primitives',
    items: [
      { path: '/primitives/icon', name: 'Icon', Page: IconPage },
      { path: '/primitives/input', name: 'Input', Page: InputPage },
      { path: '/primitives/checkbox', name: 'Checkbox', Page: CheckboxPage },
      { path: '/primitives/switch', name: 'Switch', Page: SwitchPage },
      { path: '/primitives/select', name: 'Select', Page: SelectPage },
      { path: '/primitives/spinner', name: 'Spinner', Page: SpinnerPage },
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
