import { HomePage } from './pages/HomePage.jsx'
import { InstallationPage } from './pages/InstallationPage.jsx'
import { ColorsPage } from './pages/ColorsPage.jsx'
import { TypographyPage } from './pages/TypographyPage.jsx'
import { SpacingPage } from './pages/SpacingPage.jsx'
import { LayoutPage } from './pages/LayoutPage.jsx'
import { DepthPage } from './pages/DepthPage.jsx'
import { IconPage } from './pages/IconPage.jsx'
import { FieldPage } from './pages/FieldPage.jsx'
import { InputPage } from './pages/InputPage.jsx'
import { CheckboxPage } from './pages/CheckboxPage.jsx'
import { SwitchPage } from './pages/SwitchPage.jsx'
import { SelectPage } from './pages/SelectPage.jsx'
import { PopoverPage } from './pages/PopoverPage.jsx'
import { SpinnerPage } from './pages/SpinnerPage.jsx'
import { ButtonPage } from './pages/ButtonPage.jsx'
import { BadgePage } from './pages/BadgePage.jsx'
import { CardPage } from './pages/CardPage.jsx'
import { StatTilePage } from './pages/StatTilePage.jsx'
import { MetricCardPage } from './pages/MetricCardPage.jsx'
import { SparklinePage } from './pages/SparklinePage.jsx'
import { TablePage } from './pages/TablePage.jsx'
import { ScopeNavigatorPage } from './pages/ScopeNavigatorPage.jsx'
import { TimeframeSelectPage } from './pages/TimeframeSelectPage.jsx'

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
      { path: '/foundation/depth', name: 'Depth', Page: DepthPage },
    ],
  },
  {
    group: 'Primitives',
    items: [
      { path: '/primitives/icon', name: 'Icon', Page: IconPage },
      { path: '/primitives/field', name: 'Field', Page: FieldPage },
      { path: '/primitives/input', name: 'Input', Page: InputPage },
      { path: '/primitives/checkbox', name: 'Checkbox', Page: CheckboxPage },
      { path: '/primitives/switch', name: 'Switch', Page: SwitchPage },
      { path: '/primitives/select', name: 'Select', Page: SelectPage },
      { path: '/primitives/popover', name: 'Popover', Page: PopoverPage },
      { path: '/primitives/spinner', name: 'Spinner', Page: SpinnerPage },
    ],
  },
  {
    group: 'Components',
    items: [
      { path: '/components/button', name: 'Button', Page: ButtonPage },
      { path: '/components/badge', name: 'Badge', Page: BadgePage },
      { path: '/components/card', name: 'Card', Page: CardPage },
      { path: '/components/sparkline', name: 'Sparkline', Page: SparklinePage },
      { path: '/components/table', name: 'Table', Page: TablePage },
      { path: '/components/scope-navigator', name: 'Scope Navigator', Page: ScopeNavigatorPage },
      { path: '/components/timeframe-select', name: 'Timeframe Select', Page: TimeframeSelectPage },
    ],
  },
  {
    // One KPI family, two densities: Stat Tile (compact) and Metric Card (hero).
    // Shared visual language — soft icon chip, 12px corners, resting elevation.
    group: 'Metrics',
    items: [
      { path: '/metrics/stat-tile', name: 'Stat Tile', Page: StatTilePage },
      { path: '/metrics/metric-card', name: 'Metric Card', Page: MetricCardPage },
    ],
  },
]

export const ROUTE_MAP = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((item) => [item.path, item]),
)
