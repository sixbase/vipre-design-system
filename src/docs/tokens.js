/* Documentation data — mirrors src/styles/_tokens.scss. Authored here so the
   token pages can show hex values, ref mappings, and usage descriptions.
   Keep in sync with _tokens.scss when ramps change. */

// Every ramp is the same 11-step scale: 50…950. Pure white is the standalone
// --vds-white token, not a graphite step.
export const GRAPHITE = {
  50: '#f7f8fa', 100: '#eff1f5', 200: '#e2e6ed', 300: '#cbd2dd', 400: '#9aa4b4',
  500: '#6b7585', 600: '#4d5666', 700: '#3a424f', 800: '#262c36', 900: '#161b22',
  950: '#0d1117',
}

/* Unified chromatic family — OKLCH, one shared lightness + chroma ladder. */
export const EMERALD = {
  50: '#edfbf0', 100: '#d6f4dd', 200: '#b4eac1', 300: '#8bd8a0', 400: '#5dbf7c',
  500: '#2ca45b', 600: '#008542', 700: '#006a34', 800: '#025227', 900: '#023e1c',
  950: '#022d13',
}
export const AMBER = {
  50: '#fff6e7', 100: '#fbe9ca', 200: '#f6d59f', 300: '#e9bc6d', 400: '#d39c30',
  500: '#b48008', 600: '#906606', 700: '#735101', 800: '#593e03', 900: '#432e02',
  950: '#322100',
}
export const ROSE = {
  50: '#fff4f3', 100: '#fee4e1', 200: '#ffccc7', 300: '#ffaaa2', 400: '#f0837b',
  500: '#d7615b', 600: '#b64340', 700: '#95312f', 800: '#742423', 900: '#571c1a',
  950: '#3f1513',
}

/* Midnight — the product's navy surface family, anchored so 950 = #0B192D
   (the real shipped background). Tokens: --vds-midnight-{step}. */
export const MIDNIGHT = {
  50: '#f3f7fc', 100: '#e3ecf7', 200: '#c4d6ed', 300: '#98b6dd', 400: '#618bc2',
  500: '#3d68a4', 600: '#2b5288', 700: '#1e3e6b', 800: '#152e51', 900: '#0f223d',
  950: '#0b192d',
}

/* Azure — brand primary; a vivid cerulean (hue 237) kept distinct from the
   Midnight navy (257) by hue + chroma, on the shared OKLCH ladder. */
export const AZURE = {
  50: '#f0f8fe', 100: '#d7efff', 200: '#b4e1fe', 300: '#7cceff', 400: '#3eb3f0',
  500: '#0596d2', 600: '#0178a8', 700: '#005f87', 800: '#014969', 900: '#013750',
  950: '#00283c',
}

export const HARBOR = {
  50: '#e7fcf9', 100: '#cbf6ef', 200: '#9eebe1', 300: '#63dbcd', 400: '#0cc0b1',
  500: '#01a094', 600: '#068076', 700: '#00665e', 800: '#044f48', 900: '#003b36',
  950: '#002c27',
}
export const ORCHID = {
  50: '#fcf3ff', 100: '#f9e2fe', 200: '#f2cafb', 300: '#e3acf0', 400: '#cc8adc',
  500: '#b269c3', 600: '#944da4', 700: '#783a86', 800: '#5d2c68', 900: '#45214e',
  950: '#321838',
}
export const CLAY = {
  50: '#fff5ee', 100: '#ffe6d6', 200: '#ffcfb0', 300: '#fbb07e', 400: '#e88e4e',
  500: '#cf6d1b', 600: '#a85504', 700: '#874201', 800: '#693200', 900: '#502502',
  950: '#3b1a01',
}

export const PRIMITIVES = [
  // Neutrals
  { name: 'Graphite', shades: GRAPHITE },
  { name: 'Midnight', shades: MIDNIGHT },
  // Unified chromatic family (OKLCH ladder, varied hue)
  { name: 'Azure', shades: AZURE },
  { name: 'Harbor', shades: HARBOR },
  { name: 'Emerald', shades: EMERALD },
  { name: 'Amber', shades: AMBER },
  { name: 'Rose', shades: ROSE },
  { name: 'Orchid', shades: ORCHID },
  { name: 'Clay', shades: CLAY },
]

/* Semantic tokens, grouped by purpose. `ref` shows light → dark mapping. */
export const SEMANTIC_GROUPS = [
  {
    title: 'Surfaces',
    rows: [
      { token: '--vds-canvas', ref: 'graphite-50 → midnight-950', usage: 'Page background — graphite grey in light, the #0b192d product navy in dark' },
      { token: '--vds-surface', ref: 'white → midnight-900', usage: 'Cards, panels, inputs — surfaces that lift off the canvas' },
      { token: '--vds-surface-raised', ref: 'white → midnight-800', usage: 'Raised surfaces — popovers, menus, dropdowns' },
    ],
  },
  {
    title: 'Text',
    rows: [
      { token: '--vds-ink', ref: 'graphite-900 → midnight-50', usage: 'Primary text, headings, input values — maximum readability' },
      { token: '--vds-ink-muted', ref: 'graphite-600 → midnight-300', usage: 'Secondary labels, captions, supporting copy' },
      { token: '--vds-ink-subtle', ref: 'graphite-500 → midnight-400', usage: 'Placeholders, metadata, lowest-emphasis text' },
    ],
  },
  {
    title: 'Borders',
    rows: [
      { token: '--vds-line', ref: 'graphite-200 → midnight-800', usage: 'Card borders, dividers, table cell lines — subtle structure' },
      { token: '--vds-line-strong', ref: 'graphite-300 → midnight-700', usage: 'Input hover borders, selected outlines — more emphasis' },
    ],
  },
  {
    title: 'Brand & interactive',
    rows: [
      { token: '--vds-primary', ref: 'midnight-600 → 300', usage: 'Primary button fill, active state, primary links' },
      { token: '--vds-primary-hover', ref: 'midnight-700 → 200', usage: 'Hover state for primary actions' },
      { token: '--vds-on-primary', ref: 'white → midnight-950', usage: 'Text/icons on a primary-colored background' },
      { token: '--vds-primary-soft', ref: 'midnight-50 → midnight@16%', usage: 'Tinted brand backgrounds — ghost hover, soft badges' },
      { token: '--vds-focus-ring', ref: 'midnight-500 → 400', usage: 'Keyboard focus outline via :focus-visible — never decorative' },
    ],
  },
  {
    title: 'Status',
    rows: [
      { token: '--vds-success', ref: 'emerald-600 → 400', usage: 'Healthy, protected, success confirmations' },
      { token: '--vds-warning', ref: 'amber-600 → 400', usage: 'Needs attention but not broken — at-risk, low-stock' },
      { token: '--vds-danger', ref: 'rose-600 → 400', usage: 'Errors, threats, destructive actions' },
      { token: '--vds-info', ref: 'midnight-600 → 400', usage: 'Neutral informational notes and callouts' },
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
