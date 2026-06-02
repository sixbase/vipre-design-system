/* Documentation data — mirrors src/styles/_tokens.scss. Authored here so the
   token pages can show hex values, ref mappings, and usage descriptions.
   Keep in sync with _tokens.scss when ramps change. */

export const GRAPHITE = {
  0: '#ffffff', 50: '#f7f8fa', 100: '#eff1f5', 200: '#e2e6ed', 300: '#cbd2dd',
  400: '#9aa4b4', 500: '#6b7585', 600: '#4d5666', 700: '#3a424f', 800: '#262c36',
  900: '#161b22', 950: '#0d1117',
}

export const IRIS = {
  50: '#f0f1fe', 100: '#e2e4fd', 200: '#c8cbfb', 300: '#a6a8f7', 400: '#8482f0',
  500: '#6963e8', 600: '#564ddb', 700: '#443bb8', 800: '#383293', 900: '#2f2c74',
}

export const EMERALD = { 50: '#ecfdf5', 500: '#10b981', 600: '#059669', 700: '#047857' }
export const AMBER = { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' }
export const ROSE = { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' }
export const SKY = { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' }

export const PRIMITIVES = [
  { name: 'Graphite', shades: GRAPHITE },
  { name: 'Iris', shades: IRIS },
  { name: 'Emerald', shades: EMERALD },
  { name: 'Amber', shades: AMBER },
  { name: 'Rose', shades: ROSE },
  { name: 'Sky', shades: SKY },
]

/* Semantic tokens, grouped by purpose. `ref` shows light → dark mapping. */
export const SEMANTIC_GROUPS = [
  {
    title: 'Surfaces',
    rows: [
      { token: '--vds-canvas', ref: 'graphite-50 → 950', usage: 'Page background — the base canvas everything sits on' },
      { token: '--vds-surface', ref: 'graphite-0 → 900', usage: 'Cards, panels, inputs — surfaces that lift off the canvas' },
      { token: '--vds-surface-raised', ref: 'graphite-0 → 800', usage: 'Raised surfaces — popovers, menus, dropdowns' },
    ],
  },
  {
    title: 'Text',
    rows: [
      { token: '--vds-ink', ref: 'graphite-900 → 50', usage: 'Primary text, headings, input values — maximum readability' },
      { token: '--vds-ink-muted', ref: 'graphite-600 → 400', usage: 'Secondary labels, captions, supporting copy' },
      { token: '--vds-ink-subtle', ref: 'graphite-500 → 500', usage: 'Placeholders, metadata, lowest-emphasis text' },
    ],
  },
  {
    title: 'Borders',
    rows: [
      { token: '--vds-line', ref: 'graphite-200 → 800', usage: 'Card borders, dividers, table cell lines — subtle structure' },
      { token: '--vds-line-strong', ref: 'graphite-300 → 700', usage: 'Input hover borders, selected outlines — more emphasis' },
    ],
  },
  {
    title: 'Brand & interactive',
    rows: [
      { token: '--vds-primary', ref: 'iris-600 → 500', usage: 'Primary button fill, active state, primary links' },
      { token: '--vds-primary-hover', ref: 'iris-700 → 400', usage: 'Hover state for primary actions' },
      { token: '--vds-on-primary', ref: 'white → graphite-950', usage: 'Text/icons on a primary-colored background' },
      { token: '--vds-primary-soft', ref: 'iris-50 → iris@16%', usage: 'Tinted brand backgrounds — ghost hover, soft badges' },
      { token: '--vds-focus-ring', ref: 'iris-500 → 400', usage: 'Keyboard focus outline via :focus-visible — never decorative' },
    ],
  },
  {
    title: 'Status',
    rows: [
      { token: '--vds-success', ref: 'emerald-600 → 500', usage: 'Healthy, protected, success confirmations' },
      { token: '--vds-warning', ref: 'amber-600 → 500', usage: 'Needs attention but not broken — at-risk, low-stock' },
      { token: '--vds-danger', ref: 'rose-600 → 500', usage: 'Errors, threats, destructive actions' },
      { token: '--vds-info', ref: 'sky-600 → 500', usage: 'Neutral informational notes and callouts' },
    ],
  },
]

/* Type scale — mirrors $scale in _typography.scss, with usage. */
export const TYPE_SCALE = [
  { token: 'text--display', kind: 'h', level: 'display', size: '30 / 36 · 600', usage: 'Empty-state hero, large metric numbers' },
  { token: 'text--title', kind: 'h', level: 'title', size: '24 / 32 · 600', usage: 'Page H1 — the primary title for a screen' },
  { token: 'text--heading', kind: 'h', level: 'heading', size: '20 / 28 · 600', usage: 'Section H2, panel titles' },
  { token: 'text--subheading', kind: 'h', level: 'subheading', size: '16 / 24 · 500', usage: 'Card / panel titles, form section labels' },
  { token: 'text--body-lg', kind: 't', variant: 'body-lg', size: '15 / 22 · 400', usage: 'Emphasized body, section intros' },
  { token: 'text--body', kind: 't', variant: 'body', size: '14 / 20 · 400', usage: 'Default UI text — the workhorse' },
  { token: 'text--caption', kind: 't', variant: 'caption', size: '13 / 18 · 400', usage: 'Secondary text, supporting copy' },
  { token: 'text--detail', kind: 't', variant: 'detail', size: '12 / 16 · 400', usage: 'Dense tables, metadata, timestamps' },
  { token: 'text--micro', kind: 't', variant: 'micro', size: '11 / 14 · 500', usage: 'Badges, tight labels in dense lists' },
  { token: 'text--eyebrow', kind: 't', variant: 'eyebrow', size: '11 · 600 · upper', usage: 'Uppercase overlines above headings' },
  { token: 'text--nano', kind: 't', variant: 'nano', size: '10 · 500', usage: 'Smallest tags, chart axis labels' },
]

/* Spacing scale — mirrors --vds-space-* in _tokens.scss, with usage. */
export const SPACING = [
  { token: '--vds-space-1', px: '4px', usage: 'Icon-to-label gap, stacked metadata lines' },
  { token: '--vds-space-2', px: '8px', usage: 'Default inline gap in buttons, checkbox-to-label' },
  { token: '--vds-space-3', px: '12px', usage: 'Input padding, dense table cell padding' },
  { token: '--vds-space-4', px: '16px', usage: 'Default card padding, gap between form fields' },
  { token: '--vds-space-5', px: '20px', usage: 'Medium gap between card sections' },
  { token: '--vds-space-6', px: '24px', usage: 'Gap between related groups; the grid gutter' },
  { token: '--vds-space-8', px: '32px', usage: 'Section padding, modal body padding' },
  { token: '--vds-space-10', px: '40px', usage: 'Large section gap' },
  { token: '--vds-space-12', px: '48px', usage: 'Section rhythm between major blocks' },
  { token: '--vds-space-16', px: '64px', usage: 'Major page divisions' },
  { token: '--vds-space-20', px: '80px', usage: 'Extra-large breaks, top-level page padding' },
  { token: '--vds-space-24', px: '96px', usage: 'Maximum — page top/bottom margins' },
]

/* Layout tokens — structural rhythm. */
export const LAYOUT = [
  { token: '--vds-container', value: '1200px', usage: 'Max content width, centered' },
  { token: '--vds-gutter', value: '24px · space-6', usage: 'Gap between grid columns' },
  { token: '--vds-section', value: '48px · space-12', usage: 'Vertical rhythm between major sections' },
  { token: '--vds-columns', value: '12', usage: 'Base grid column count' },
]

export const WEIGHTS = [
  { name: 'normal', value: 400 },
  { name: 'medium', value: 500 },
  { name: 'semibold', value: 600 },
  { name: 'bold', value: 700 },
]
