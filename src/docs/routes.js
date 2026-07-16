import { HomePage } from './pages/HomePage.jsx'
import { InstallationPage } from './pages/InstallationPage.jsx'
import { ColorsPage } from './pages/ColorsPage.jsx'
import { ColorUsagePage } from './pages/ColorUsagePage.jsx'
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
import { SideNavPage } from './pages/SideNavPage.jsx'
import { CurrentLeftNavPage } from './pages/CurrentLeftNavPage.jsx'
import { PageHeaderPage } from './pages/PageHeaderPage.jsx'
import { ScopeNavigatorPage } from './pages/ScopeNavigatorPage.jsx'
import { TimeframeSelectPage } from './pages/TimeframeSelectPage.jsx'
import { ProductDashboardPage } from './pages/ProductDashboardPage.jsx'
import { CurrentNavShellPage } from './pages/CurrentNavShellPage.jsx'
import { ResponsivenessPage } from './pages/ResponsivenessPage.jsx'
import { RadioPage } from './pages/RadioPage.jsx'
import { SliderPage } from './pages/SliderPage.jsx'
import { SegmentedControlPage } from './pages/SegmentedControlPage.jsx'
import { SearchInputPage } from './pages/SearchInputPage.jsx'
import { ComboboxPage } from './pages/ComboboxPage.jsx'
import { VisuallyHiddenPage } from './pages/VisuallyHiddenPage.jsx'
import { ModalPage } from './pages/ModalPage.jsx'
import { DrawerPage } from './pages/DrawerPage.jsx'
import { ToastPage } from './pages/ToastPage.jsx'
import { TooltipPage } from './pages/TooltipPage.jsx'
import { MenuPage } from './pages/MenuPage.jsx'
import { CommandPalettePage } from './pages/CommandPalettePage.jsx'
import { TabsPage } from './pages/TabsPage.jsx'
import { AccordionPage } from './pages/AccordionPage.jsx'
import { BreadcrumbPage } from './pages/BreadcrumbPage.jsx'
import { PaginationPage } from './pages/PaginationPage.jsx'
import { StepperPage } from './pages/StepperPage.jsx'
import { KbdPage } from './pages/KbdPage.jsx'
import { AlertPage } from './pages/AlertPage.jsx'
import { ProgressPage } from './pages/ProgressPage.jsx'
import { SkeletonPage } from './pages/SkeletonPage.jsx'
import { AvatarPage } from './pages/AvatarPage.jsx'
import { TagPage } from './pages/TagPage.jsx'
import { EmptyStatePage } from './pages/EmptyStatePage.jsx'
import { DescriptionListPage } from './pages/DescriptionListPage.jsx'
import { AppShellPage } from './pages/AppShellPage.jsx'
import { TopBarPage } from './pages/TopBarPage.jsx'
import { MspShellTemplatePage } from './pages/MspShellTemplatePage.jsx'
import { CustomerListTemplatePage } from './pages/CustomerListTemplatePage.jsx'
import { DeviceListTemplatePage } from './pages/DeviceListTemplatePage.jsx'
import { PolicyListTemplatePage } from './pages/PolicyListTemplatePage.jsx'
import { EntityDetailTemplatePage } from './pages/EntityDetailTemplatePage.jsx'
import { TextareaPage } from './pages/TextareaPage.jsx'
import { MspMenuPilotPage } from './pages/MspMenuPilotPage.jsx'
import { KickoffPage } from './pages/KickoffPage.jsx'
import { ControlAnatomyPage } from './pages/ControlAnatomyPage.jsx'
import { PasswordInputPage } from './pages/PasswordInputPage.jsx'
import { NumberInputPage } from './pages/NumberInputPage.jsx'
import { DatePickerPage } from './pages/DatePickerPage.jsx'
import { TimeInputPage } from './pages/TimeInputPage.jsx'
import { FileUploadPage } from './pages/FileUploadPage.jsx'
import { PinInputPage } from './pages/PinInputPage.jsx'
import { TagsInputPage } from './pages/TagsInputPage.jsx'
import { MeetingGuidePage } from './pages/MeetingGuidePage.jsx'
import { MenuQuickstartPage } from './pages/MenuQuickstartPage.jsx'
import { TokensPage } from './pages/TokensPage.jsx'
import { GradientExplorerPage } from './pages/GradientExplorerPage.jsx'

/* Single source of truth for both the sidebar nav and the hash router.
   Group ORDER and item order are intentional (a learn-then-reference flow),
   NOT alphabetical — App.jsx renders NAV verbatim. The flow is:
     Getting Started → Foundations → the component families (Forms, Actions,
     Data Display, Feedback, Navigation, Overlays) → App Chrome → Utilities →
     Templates → Adoption → Pilot.
   Component families are grouped by what a component DOES, so the label tells
   you where to look. (The home route is resolved via ROUTE_MAP['/'].) */
export const NAV = [
  {
    group: 'Getting Started',
    items: [
      { path: '/', name: 'Introduction', Page: HomePage },
      { path: '/getting-started/installation', name: 'Installation', Page: InstallationPage },
    ],
  },
  {
    // The design language — tokens + principles every component is built on.
    group: 'Foundations',
    items: [
      { path: '/foundation/tokens', name: 'Token Reference', Page: TokensPage },
      { path: '/foundation/colors', name: 'Colors', Page: ColorsPage },
      { path: '/foundation/color-usage', name: 'Color usage', Page: ColorUsagePage },
      { path: '/foundation/gradient-explorer', name: 'Gradient Explorer', Page: GradientExplorerPage },
      { path: '/foundation/typography', name: 'Typography', Page: TypographyPage },
      { path: '/foundation/spacing', name: 'Spacing', Page: SpacingPage },
      { path: '/foundation/layout', name: 'Layout', Page: LayoutPage },
      { path: '/foundation/depth', name: 'Depth', Page: DepthPage },
      { path: '/foundation/responsiveness', name: 'Responsiveness', Page: ResponsivenessPage },
      { path: '/foundation/control-anatomy', name: 'Control Anatomy', Page: ControlAnatomyPage },
    ],
  },
  {
    // Everything a user types or picks into — the form controls.
    group: 'Forms & Inputs',
    items: [
      { path: '/primitives/field', name: 'Field', Page: FieldPage },
      { path: '/primitives/input', name: 'Input', Page: InputPage },
      { path: '/primitives/textarea', name: 'Textarea', Page: TextareaPage },
      { path: '/primitives/select', name: 'Select', Page: SelectPage },
      { path: '/primitives/combobox', name: 'Combobox', Page: ComboboxPage },
      { path: '/primitives/checkbox', name: 'Checkbox', Page: CheckboxPage },
      { path: '/primitives/radio', name: 'Radio', Page: RadioPage },
      { path: '/primitives/switch', name: 'Switch', Page: SwitchPage },
      { path: '/primitives/slider', name: 'Slider', Page: SliderPage },
      { path: '/primitives/segmented-control', name: 'Segmented Control', Page: SegmentedControlPage },
      { path: '/primitives/search-input', name: 'Search Input', Page: SearchInputPage },
      { path: '/primitives/password-input', name: 'Password Input', Page: PasswordInputPage },
      { path: '/primitives/number-input', name: 'Number Input', Page: NumberInputPage },
      { path: '/primitives/date-picker', name: 'Date Picker', Page: DatePickerPage },
      { path: '/primitives/time-input', name: 'Time Input', Page: TimeInputPage },
      { path: '/primitives/pin-input', name: 'Pin Input', Page: PinInputPage },
      { path: '/primitives/file-upload', name: 'File Upload', Page: FileUploadPage },
      { path: '/primitives/tags-input', name: 'Tags Input', Page: TagsInputPage },
    ],
  },
  {
    // Controls that trigger something.
    group: 'Actions',
    items: [
      { path: '/components/button', name: 'Button', Page: ButtonPage },
    ],
  },
  {
    // Showing data + identity. Includes the KPI tiles (was "Metrics") and Icon.
    group: 'Data Display',
    items: [
      { path: '/components/avatar', name: 'Avatar', Page: AvatarPage },
      { path: '/components/badge', name: 'Badge', Page: BadgePage },
      { path: '/components/tag', name: 'Tag', Page: TagPage },
      { path: '/components/card', name: 'Card', Page: CardPage },
      { path: '/components/table', name: 'Table', Page: TablePage },
      { path: '/components/description-list', name: 'Description List', Page: DescriptionListPage },
      { path: '/components/sparkline', name: 'Sparkline', Page: SparklinePage },
      { path: '/metrics/stat-tile', name: 'Stat Tile', Page: StatTilePage },
      { path: '/metrics/metric-card', name: 'Metric Card', Page: MetricCardPage },
      { path: '/components/kbd', name: 'Kbd', Page: KbdPage },
      { path: '/primitives/icon', name: 'Icon', Page: IconPage },
    ],
  },
  {
    // Telling the user what's happening — status & loading.
    group: 'Feedback',
    items: [
      { path: '/components/alert', name: 'Alert', Page: AlertPage },
      { path: '/components/toast', name: 'Toast', Page: ToastPage },
      { path: '/components/progress', name: 'Progress', Page: ProgressPage },
      { path: '/primitives/spinner', name: 'Spinner', Page: SpinnerPage },
      { path: '/components/skeleton', name: 'Skeleton', Page: SkeletonPage },
      { path: '/components/empty-state', name: 'Empty State', Page: EmptyStatePage },
    ],
  },
  {
    // Wayfinding — moving through pages, steps, and long lists.
    group: 'Navigation',
    items: [
      { path: '/components/breadcrumb', name: 'Breadcrumb', Page: BreadcrumbPage },
      { path: '/components/tabs', name: 'Tabs', Page: TabsPage },
      { path: '/components/accordion', name: 'Accordion', Page: AccordionPage },
      { path: '/components/stepper', name: 'Stepper', Page: StepperPage },
      { path: '/components/pagination', name: 'Pagination', Page: PaginationPage },
    ],
  },
  {
    // Floating layers — everything on the z-index scale above the page.
    group: 'Overlays',
    items: [
      { path: '/components/modal', name: 'Modal', Page: ModalPage },
      { path: '/components/drawer', name: 'Drawer', Page: DrawerPage },
      { path: '/primitives/popover', name: 'Popover', Page: PopoverPage },
      { path: '/components/tooltip', name: 'Tooltip', Page: TooltipPage },
      { path: '/components/menu', name: 'Menu', Page: MenuPage },
      { path: '/components/command-palette', name: 'Command Palette', Page: CommandPalettePage },
    ],
  },
  {
    // The app frame — chrome that wraps every product page.
    group: 'App Chrome',
    items: [
      { path: '/components/app-shell', name: 'App Shell', Page: AppShellPage },
      { path: '/components/top-bar', name: 'Top Bar', Page: TopBarPage },
      { path: '/components/side-nav', name: 'Side Nav', Page: SideNavPage },
      { path: '/components/current-left-nav', name: 'Current Left Nav', Page: CurrentLeftNavPage },
      { path: '/components/page-header', name: 'Page Header', Page: PageHeaderPage },
      { path: '/components/scope-navigator', name: 'Scope Navigator', Page: ScopeNavigatorPage },
      { path: '/components/timeframe-select', name: 'Timeframe Select', Page: TimeframeSelectPage },
    ],
  },
  {
    // Low-level helpers that render for assistive tech, not for looks.
    group: 'Utilities',
    items: [
      { path: '/primitives/visually-hidden', name: 'Visually Hidden', Page: VisuallyHiddenPage },
    ],
  },
  {
    // Page templates — full-screen compositions of the components above. A
    // template is documented by its regions/slots; the body is swappable.
    group: 'Templates',
    items: [
      { path: '/templates/msp-shell', name: 'MSP Shell', Page: MspShellTemplatePage },
      { path: '/templates/current-nav-shell', name: 'Current Nav Shell', Page: CurrentNavShellPage },
      { path: '/templates/customer-list', name: 'Customer Directory', Page: CustomerListTemplatePage },
      { path: '/templates/device-list', name: 'Device List', Page: DeviceListTemplatePage },
      { path: '/templates/policy-list', name: 'Policy List', Page: PolicyListTemplatePage },
      { path: '/templates/entity-detail', name: 'Entity Detail', Page: EntityDetailTemplatePage },
      { path: '/templates/product-dashboard', name: 'Product Dashboard', Page: ProductDashboardPage },
    ],
  },
  {
    // Adoption — how teams consume + maintain the system. Shareable team brief.
    group: 'Adoption',
    items: [
      { path: '/adoption/kickoff', name: 'Kickoff & Notes', Page: KickoffPage },
      { path: '/adoption/meeting-guide', name: 'Meeting Guide', Page: MeetingGuidePage },
      { path: '/adoption/menu-quickstart', name: 'Menu Quickstart', Page: MenuQuickstartPage },
    ],
  },
  {
    // Pilot — isolated artifacts staged for an engineering handoff. Temporary.
    group: 'Pilot',
    items: [
      { path: '/pilot/msp-menu', name: 'MSP Menu (isolated)', Page: MspMenuPilotPage },
    ],
  },
]

export const ROUTE_MAP = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((item) => [item.path, item]),
)
