/* ----------------------------------------------------------------------------
   Color usage — the single source of truth for "which color tokens does each
   component paint with". Consumed by:
     - each component's doc page (a "Colors" section, via ComponentPage)
     - the consolidated "Color usage" page (every component in one scroll)

   Each entry is { name, scope, rows } where `scope` is the component's root BEM
   class — the <ColorUsage> probe carries that class so component-local custom
   props (e.g. --vds-input-fill, --vds-scope-hover) and any `.dark .vds-x`
   overrides resolve to their real, live value in the current theme.

   Roles are kept DRY: semantic/primitive tokens get a shared default role from
   SEM/regex; only component-specific locals are spelled out in `overrides`.
   -------------------------------------------------------------------------- */

const SEM = {
  '--vds-canvas': 'Page / chrome background',
  '--vds-surface': 'Panel / card surface',
  '--vds-surface-raised': 'Raised surface',
  '--vds-surface-overlay': 'Popover / overlay surface',
  '--vds-surface-disabled': 'Disabled control surface',
  '--vds-surface-sunken': 'Recessed field fill',
  '--vds-surface-hover': 'Row / item hover fill',
  '--vds-surface-selected': 'Selected row fill',
  '--vds-surface-selected-hover': 'Selected row fill (hover)',
  '--vds-ink': 'Primary text / icon',
  '--vds-ink-muted': 'Secondary text',
  '--vds-ink-subtle': 'Tertiary / placeholder text',
  '--vds-ink-disabled': 'Disabled text',
  '--vds-ink-inverse': 'Text on inverted chip',
  '--vds-line-subtle': 'Faint hairline / zebra',
  '--vds-line': 'Border / divider',
  '--vds-line-strong': 'Hover / focus border',
  '--vds-primary': 'Accent — selected, links, focus',
  '--vds-primary-hover': 'Accent (hover)',
  '--vds-primary-active': 'Accent (pressed)',
  '--vds-primary-soft': 'Soft accent fill (selected bg)',
  '--vds-primary-soft-hover': 'Soft accent fill (hover)',
  '--vds-on-primary': 'Text / icon on accent fill',
  '--vds-focus-ring': 'Focus ring',
  '--vds-success': 'Success',
  '--vds-success-hover': 'Success (hover)',
  '--vds-on-success': 'Text on success fill',
  '--vds-success-soft': 'Success soft fill',
  '--vds-success-soft-hover': 'Success soft fill (hover)',
  '--vds-warning': 'Warning',
  '--vds-warning-hover': 'Warning (hover)',
  '--vds-on-warning': 'Text on warning fill',
  '--vds-on-warning-soft': 'Warning text on soft fill',
  '--vds-warning-soft': 'Warning soft fill',
  '--vds-warning-soft-hover': 'Warning soft fill (hover)',
  '--vds-danger': 'Danger / error',
  '--vds-danger-hover': 'Danger (hover)',
  '--vds-on-danger': 'Text on danger fill',
  '--vds-danger-soft': 'Danger soft fill',
  '--vds-danger-soft-hover': 'Danger soft fill (hover)',
  '--vds-info': 'Info',
  '--vds-info-hover': 'Info (hover)',
  '--vds-on-info': 'Text on info fill',
  '--vds-info-soft': 'Info soft fill',
  '--vds-info-soft-hover': 'Info soft fill (hover)',
  '--vds-accent-azure': 'Accent — azure',
  '--vds-accent-azure-soft': 'Accent azure soft fill',
  '--vds-accent-harbor': 'Accent — teal',
  '--vds-accent-harbor-soft': 'Accent teal soft fill',
  '--vds-accent-emerald': 'Accent — green',
  '--vds-accent-emerald-soft': 'Accent green soft fill',
  '--vds-accent-amber': 'Accent — gold',
  '--vds-accent-amber-soft': 'Accent gold soft fill',
  '--vds-accent-rose': 'Accent — red',
  '--vds-accent-rose-soft': 'Accent red soft fill',
  '--vds-accent-orchid': 'Accent — violet',
  '--vds-accent-orchid-soft': 'Accent violet soft fill',
  '--vds-accent-clay': 'Accent — clay',
  '--vds-accent-clay-soft': 'Accent clay soft fill',
  '--vds-accent-purple': 'Accent — purple',
  '--vds-accent-purple-soft': 'Accent purple soft fill',
  '--vds-accent-magenta': 'Accent — magenta',
  '--vds-accent-magenta-soft': 'Accent magenta soft fill',
  '--vds-accent-lime': 'Accent — lime',
  '--vds-accent-lime-soft': 'Accent lime soft fill',
  '--vds-white': 'White',
  '--vds-black': 'Black',
}

const FAMILY = /^--vds-(azure|harbor|emerald|amber|rose|orchid|clay|purple|magenta|lime|midnight|graphite)-(\d+)$/

function roleFor(token, overrides) {
  if (overrides && overrides[token]) return overrides[token]
  if (SEM[token]) return SEM[token]
  const m = token.match(FAMILY)
  if (m) return `${m[1]} ${m[2]} — primitive`
  return '—'
}

/* Build the {token, role}[] for a component. */
function rows(tokens, overrides) {
  return tokens.map((token) => ({ token, role: roleFor(token, overrides) }))
}

/* Shared local-var role sets (Input / Textarea / Select reuse the input chrome). */
const INPUT_LOCALS = {
  '--vds-input-fill': 'Field background',
  '--vds-input-border': 'Field border',
  '--vds-input-border-hover': 'Field border (hover)',
  '--vds-input-border-focus': 'Field border (focus)',
  '--vds-input-ring': 'Focus ring fill',
  '--vds-input-muted': 'Placeholder / affix',
}

/* Roles for component-LOCAL custom props (semantic + primitive tokens get their
   role from SEM / the family regex above). Names are component-unique, so one
   shared map is unambiguous. */
const LOCALS = {
  ...INPUT_LOCALS,
  '--vds-popover-item-hover': 'Menu item hover fill',
  '--vds-tf-hover': 'Segment / option hover fill',
  '--vds-nav-accent': 'Selected fill — the brandable nav highlight',
  '--vds-tile-accent': 'Product tile gradient accent (falls back to --vds-nav-accent)',
  '--vds-tile-edge': 'Product tile edge / bevel tint',
  '--vds-scope-hover': 'Subtle hover fill (10% ink)',
  '--vds-scope-hover-strong': 'Node / row hover fill (18% ink)',
  '--vds-metric-accent': 'Accent glyph (default = primary; shifts per tone)',
  '--vds-metric-soft': 'Accent soft fill (default = primary-soft; per tone)',
  '--vds-stat-accent': 'Accent glyph (default = primary; shifts per tone)',
  '--vds-stat-soft': 'Accent soft fill (default = primary-soft; per tone)',
}

export const COMPONENT_COLORS = {
  Badge: {
    scope: 'vds-badge',
    rows: rows(['--vds-canvas', '--vds-danger', '--vds-danger-soft', '--vds-info', '--vds-info-soft', '--vds-ink-muted', '--vds-line', '--vds-primary', '--vds-primary-soft', '--vds-success', '--vds-success-soft', '--vds-warning', '--vds-warning-soft'], LOCALS),
  },
  Button: {
    scope: 'vds-button',
    rows: rows(['--vds-canvas', '--vds-danger', '--vds-focus-ring', '--vds-ink', '--vds-ink-muted', '--vds-line-strong', '--vds-on-primary', '--vds-primary', '--vds-primary-hover', '--vds-primary-soft', '--vds-surface'], LOCALS),
  },
  Checkbox: {
    scope: 'vds-checkbox',
    rows: rows(['--vds-focus-ring', '--vds-ink', '--vds-line-strong', '--vds-on-primary', '--vds-primary', '--vds-surface-sunken'], LOCALS),
  },
  Divider: {
    scope: 'vds-divider',
    rows: rows(['--vds-line'], LOCALS),
  },
  Field: {
    scope: 'vds-field',
    rows: rows(['--vds-danger', '--vds-ink-muted'], LOCALS),
  },
  Icon: {
    scope: 'vds-icon',
    rows: rows(['--vds-danger', '--vds-info', '--vds-ink-muted', '--vds-ink-subtle', '--vds-primary', '--vds-success', '--vds-warning'], LOCALS),
  },
  Input: {
    scope: 'vds-input',
    rows: rows(['--vds-danger', '--vds-focus-ring', '--vds-ink', '--vds-ink-subtle', '--vds-input-border', '--vds-input-border-focus', '--vds-input-border-hover', '--vds-input-fill', '--vds-input-muted', '--vds-input-ring', '--vds-line-strong', '--vds-surface-sunken'], LOCALS),
  },
  MetricCard: {
    scope: 'vds-metric',
    rows: rows(['--vds-accent-azure', '--vds-danger', '--vds-danger-soft', '--vds-ink', '--vds-ink-muted', '--vds-ink-subtle', '--vds-line', '--vds-metric-accent', '--vds-metric-soft', '--vds-primary', '--vds-primary-soft', '--vds-success', '--vds-success-soft', '--vds-warning', '--vds-warning-soft'], LOCALS),
  },
  PageHeader: {
    scope: 'vds-page-header',
    rows: rows(['--vds-danger', '--vds-danger-soft', '--vds-info', '--vds-info-soft', '--vds-ink', '--vds-ink-muted', '--vds-ink-subtle', '--vds-line', '--vds-primary', '--vds-primary-soft', '--vds-success', '--vds-success-soft', '--vds-warning', '--vds-warning-soft'], LOCALS),
  },
  Popover: {
    scope: 'vds-popover__panel',
    rows: rows(['--vds-focus-ring', '--vds-ink', '--vds-popover-item-hover', '--vds-primary', '--vds-primary-soft'], LOCALS),
  },
  ScopeNavigator: {
    scope: 'vds-scope',
    rows: rows(['--vds-canvas', '--vds-focus-ring', '--vds-ink', '--vds-ink-muted', '--vds-ink-subtle', '--vds-line', '--vds-line-strong', '--vds-on-primary', '--vds-primary', '--vds-primary-soft', '--vds-scope-hover', '--vds-scope-hover-strong', '--vds-surface', '--vds-surface-overlay', '--vds-surface-raised'], LOCALS),
  },
  Select: {
    scope: 'vds-select',
    rows: rows(['--vds-danger', '--vds-focus-ring', '--vds-ink', '--vds-ink-subtle', '--vds-input-border', '--vds-input-border-hover', '--vds-input-fill', '--vds-input-muted', '--vds-line-strong', '--vds-surface-hover', '--vds-surface-sunken'], LOCALS),
  },
  SideNav: {
    scope: 'vds-sidenav',
    rows: rows(['--vds-midnight-950', '--vds-midnight-1000', '--vds-midnight-900', '--vds-midnight-800', '--vds-midnight-700', '--vds-midnight-500', '--vds-midnight-400', '--vds-midnight-300', '--vds-midnight-200', '--vds-nav-accent', '--vds-tile-accent', '--vds-tile-edge', '--vds-white', '--vds-focus-ring'], LOCALS),
  },
  Sparkline: {
    scope: 'vds-sparkline',
    rows: rows(['--vds-accent-amber', '--vds-accent-azure', '--vds-accent-clay', '--vds-accent-emerald', '--vds-accent-harbor', '--vds-accent-orchid', '--vds-accent-rose', '--vds-danger', '--vds-ink-subtle', '--vds-primary', '--vds-success', '--vds-warning'], LOCALS),
  },
  Spinner: {
    scope: 'vds-spinner',
    rows: rows(['--vds-primary'], LOCALS),
  },
  StatTile: {
    scope: 'vds-stat',
    rows: rows(['--vds-danger', '--vds-danger-soft', '--vds-ink', '--vds-ink-muted', '--vds-ink-subtle', '--vds-line', '--vds-line-strong', '--vds-primary', '--vds-primary-soft', '--vds-stat-accent', '--vds-stat-soft', '--vds-success', '--vds-success-soft', '--vds-warning', '--vds-warning-soft'], LOCALS),
  },
  Surface: {
    scope: 'vds-surface',
    rows: rows(['--vds-canvas', '--vds-ink', '--vds-line', '--vds-surface', '--vds-surface-overlay', '--vds-surface-raised'], LOCALS),
  },
  Switch: {
    scope: 'vds-switch',
    rows: rows(['--vds-focus-ring', '--vds-ink', '--vds-line-strong', '--vds-primary', '--vds-primary-hover', '--vds-white'], LOCALS),
  },
  Table: {
    scope: 'vds-table',
    rows: rows(['--vds-canvas', '--vds-focus-ring', '--vds-ink', '--vds-ink-muted', '--vds-ink-subtle', '--vds-line', '--vds-line-strong', '--vds-primary', '--vds-primary-soft'], LOCALS),
  },
  Textarea: {
    scope: 'vds-textarea',
    rows: rows(['--vds-danger', '--vds-focus-ring', '--vds-ink', '--vds-ink-subtle', '--vds-input-border', '--vds-input-border-focus', '--vds-input-border-hover', '--vds-input-fill', '--vds-input-muted', '--vds-input-ring', '--vds-line-strong', '--vds-surface-sunken'], LOCALS),
  },
  TimeframeSelect: {
    scope: 'vds-timeframe',
    rows: rows(['--vds-focus-ring', '--vds-ink', '--vds-ink-muted', '--vds-ink-subtle', '--vds-line', '--vds-on-primary', '--vds-primary', '--vds-primary-soft', '--vds-surface', '--vds-tf-hover', '--vds-white'], LOCALS),
  },
}

/* Display order for the consolidated page (primitives first, composites last). */
export const COLOR_USAGE_ORDER = [
  'Surface',
  'Divider',
  'Icon',
  'Badge',
  'Button',
  'Spinner',
  'Field',
  'Input',
  'Textarea',
  'Checkbox',
  'Switch',
  'Select',
  'Popover',
  'TimeframeSelect',
  'Table',
  'Sparkline',
  'StatTile',
  'MetricCard',
  'PageHeader',
  'SideNav',
  'ScopeNavigator',
]
