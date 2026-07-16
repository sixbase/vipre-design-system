/* Documentation data — mirrors src/styles/_tokens.scss. Authored here so the
   token pages can show hex values, ref mappings, and usage descriptions.
   Keep in sync with _tokens.scss when ramps change. */

// Every ramp is the same 12-step scale: 50…950,1000. Pure white is the standalone
// --vds-white token, not a graphite step.
// ---- Neutrals ----
export const GRAPHITE = {
  50: '#f7f8fa', 100: '#eff1f5', 200: '#e2e6ed', 300: '#cbd2dd', 400: '#9aa4b4',
  500: '#6b7585', 600: '#4d5666', 700: '#3a424f', 800: '#262c36', 900: '#161b22',
  950: '#0d1117', 1000: '#05080d',
}
/* Midnight — the product's navy surface family, anchored so 950 = #0B192D
   (the real shipped background). Tokens: --vds-midnight-{step}. */
export const MIDNIGHT = {
  50: '#f3f7fc', 100: '#e3ecf7', 200: '#c4d6ed', 300: '#98b6dd', 400: '#618bc2',
  500: '#3d68a4', 600: '#2b5288', 700: '#1e3e6b', 800: '#152e51', 900: '#0f223d',
  950: '#0b192d', 1000: '#07101f',
}

/* Chromatic family — OKLCH, one shared lightness + chroma ladder, varying only
   hue. Ordered around the colour wheel (red → magenta). */
export const ROSE = { // danger — red (hue 25)
  50: '#fff4f3', 100: '#fee4e1', 200: '#ffccc7', 300: '#ffaaa2', 400: '#f0837b',
  500: '#d7615b', 600: '#b64340', 700: '#95312f', 800: '#742423', 900: '#571c1a',
  950: '#3f1513', 1000: '#290d0c',
}
export const CLAY = { // accent — terracotta (hue 54)
  50: '#fff5ee', 100: '#ffe6d6', 200: '#ffcfb0', 300: '#fbb07e', 400: '#e88e4e',
  500: '#cf6d1b', 600: '#a85504', 700: '#874201', 800: '#693200', 900: '#502502',
  950: '#3b1a01', 1000: '#271002',
}
export const AMBER = { // warning — gold (hue 80)
  50: '#fff6e7', 100: '#fbe9ca', 200: '#f6d59f', 300: '#e9bc6d', 400: '#d39c30',
  500: '#b48008', 600: '#906606', 700: '#735101', 800: '#593e03', 900: '#432e02',
  950: '#322100', 1000: '#211500',
}
export const LIME = { // accent — yellow-green (hue 128)
  50: '#f3f9ed', 100: '#e4f1d5', 200: '#cde4b2', 300: '#afd184', 400: '#8fb756',
  500: '#729a30', 600: '#587c18', 700: '#45630c', 800: '#354c08', 900: '#273906',
  950: '#1c2a05', 1000: '#111b02',
}
export const EMERALD = { // success — green (hue 152)
  50: '#edfbf0', 100: '#d6f4dd', 200: '#b4eac1', 300: '#8bd8a0', 400: '#5dbf7c',
  500: '#2ca45b', 600: '#008542', 700: '#006a34', 800: '#025227', 900: '#023e1c',
  950: '#022d13', 1000: '#031d0c',
}
export const HARBOR = { // info — teal (hue 185)
  50: '#e7fcf9', 100: '#cbf6ef', 200: '#9eebe1', 300: '#63dbcd', 400: '#0cc0b1',
  500: '#01a094', 600: '#068076', 700: '#00665e', 800: '#044f48', 900: '#003b36',
  950: '#002c27', 1000: '#001c19',
}
export const AZURE = { // brand accent — cerulean (hue 236)
  50: '#f0f8fe', 100: '#d7efff', 200: '#b4e1fe', 300: '#7cceff', 400: '#3eb3f0',
  500: '#0596d2', 600: '#0178a8', 700: '#005f87', 800: '#014969', 900: '#013750',
  950: '#00283c', 1000: '#001a28',
}
export const COBALT = { // accent — pure blue (hue 255), seeded from brand #0068cb
  50: '#eaf3ff', 100: '#d7e8ff', 200: '#bad8ff', 300: '#93c2ff', 400: '#5fa4fc',
  500: '#2085f4', 600: '#0068cb', 700: '#0252a1', 800: '#013e7d', 900: '#022e5e',
  950: '#002046', 1000: '#00132e',
}
export const PURPLE = { // accent — blue-violet (hue 296)
  50: '#f7f5ff', 100: '#ede7ff', 200: '#ddd3ff', 300: '#c9b6ff', 400: '#af94f1',
  500: '#9377d6', 600: '#775cb1', 700: '#5e4890', 800: '#493770', 900: '#362955',
  950: '#271d3e', 1000: '#19122a',
}
export const ORCHID = { // accent — violet (hue 320)
  50: '#fcf3ff', 100: '#f9e2fe', 200: '#f2cafb', 300: '#e3acf0', 400: '#cc8adc',
  500: '#b269c3', 600: '#944da4', 700: '#783a86', 800: '#5d2c68', 900: '#45214e',
  950: '#321838', 1000: '#210f25',
}
export const MAGENTA = { // accent — hot pink (hue 348)
  50: '#fff3f8', 100: '#ffe2ef', 200: '#ffc8e2', 300: '#f8a7d0', 400: '#e482b6',
  500: '#c7649a', 600: '#a44b7c', 700: '#843a63', 800: '#672b4c', 900: '#4e2039',
  950: '#39172a', 1000: '#260d1b',
}

export const PRIMITIVES = [
  // Neutrals first
  { name: 'Graphite', shades: GRAPHITE },
  { name: 'Midnight', shades: MIDNIGHT },
  // Chromatic family — colour-wheel order (red → orange → gold → lime → green →
  // teal → blue → purple → violet → magenta)
  { name: 'Rose', shades: ROSE },
  { name: 'Clay', shades: CLAY },
  { name: 'Amber', shades: AMBER },
  { name: 'Lime', shades: LIME },
  { name: 'Emerald', shades: EMERALD },
  { name: 'Harbor', shades: HARBOR },
  { name: 'Azure', shades: AZURE },
  { name: 'Cobalt', shades: COBALT },
  { name: 'Purple', shades: PURPLE },
  { name: 'Orchid', shades: ORCHID },
  { name: 'Magenta', shades: MAGENTA },
]

/* Semantic tokens, grouped by purpose. `ref` shows light → dark mapping. */
export const SEMANTIC_GROUPS = [
  {
    title: 'Surfaces',
    rows: [
      { token: '--vds-canvas', ref: 'graphite-50 → midnight-950', usage: 'Page background — graphite grey in light, the #0b192d product navy in dark' },
      { token: '--vds-surface', ref: 'white → midnight-900', usage: 'Cards, panels, inputs — surfaces that lift off the canvas' },
      { token: '--vds-surface-raised', ref: 'white → midnight-800', usage: 'Raised surfaces — popovers, menus, dropdowns' },
      { token: '--vds-surface-overlay', ref: 'white → midnight-700', usage: 'Highest float — overlays/sheets; light stays white (shadow-led)' },
      { token: '--vds-surface-disabled', ref: 'graphite-100 → midnight-900', usage: 'Inert control or field background — disabled inputs, buttons' },
      { token: '--vds-surface-sunken', ref: 'white → midnight-950', usage: 'Recessed wells — form-field fills (flush in light, recessed below the surface in dark)' },
    ],
  },
  {
    title: 'Interaction states',
    rows: [
      { token: '--vds-surface-hover', ref: 'graphite-100 → midnight-900', usage: 'Hover fill for rows, list & menu items, nav rails' },
      { token: '--vds-surface-selected', ref: 'graphite-200 → midnight-800', usage: 'Selected/active row background — a neutral chip from the rail’s own ramp' },
      { token: '--vds-surface-selected-hover', ref: 'graphite-300 → midnight-700', usage: 'A selected row while hovered' },
    ],
  },
  {
    title: 'Text',
    rows: [
      { token: '--vds-ink', ref: 'graphite-900 → midnight-50', usage: 'Primary text, headings, input values — maximum readability' },
      { token: '--vds-ink-muted', ref: 'graphite-600 → midnight-300', usage: 'Secondary labels, captions, supporting copy' },
      { token: '--vds-ink-subtle', ref: 'graphite-500 → midnight-400', usage: 'Placeholders, metadata, lowest-emphasis text' },
      { token: '--vds-ink-disabled', ref: 'graphite-400 → midnight-600', usage: 'Greyed-out labels on disabled controls' },
      { token: '--vds-ink-inverse', ref: 'graphite-50 → midnight-950', usage: 'Text on a dark/inverted chip (e.g. tooltip) — flips with the theme' },
    ],
  },
  {
    title: 'Borders',
    rows: [
      { token: '--vds-line-subtle', ref: 'graphite-100 → midnight-900', usage: 'Faintest hairline — zebra stripes, nested dividers' },
      { token: '--vds-line', ref: 'graphite-200 → midnight-800', usage: 'Card borders, dividers, table cell lines — subtle structure' },
      { token: '--vds-line-strong', ref: 'graphite-300 → midnight-700', usage: 'Input hover borders, selected outlines — more emphasis' },
    ],
  },
  {
    title: 'Brand & interactive',
    rows: [
      { token: '--vds-primary', ref: 'cobalt-600 (#0068cb) → 400', usage: 'The Vipre brand blue — primary button fill, active state, primary links' },
      { token: '--vds-primary-hover', ref: 'cobalt-700 → 300', usage: 'Hover state for primary actions' },
      { token: '--vds-primary-active', ref: 'cobalt-800 → 200', usage: 'Pressed/active state for primary actions' },
      { token: '--vds-on-primary', ref: 'white → cobalt-950', usage: 'Text/icons on a primary-colored background' },
      { token: '--vds-primary-soft', ref: 'cobalt-50 → cobalt@16%', usage: 'Tinted brand backgrounds — ghost hover, soft badges' },
      { token: '--vds-primary-soft-hover', ref: 'cobalt-100 → cobalt@24%', usage: 'Hover on a soft-brand fill' },
      { token: '--vds-focus-ring', ref: 'midnight-500 → 400', usage: 'Keyboard focus outline via :focus-visible — never decorative' },
    ],
  },
  {
    title: 'Status',
    rows: [
      { token: '--vds-success', ref: 'emerald-600 → 400', usage: 'Healthy, protected, success confirmations' },
      { token: '--vds-success-hover', ref: 'emerald-700 → 300', usage: 'Hover for a solid success fill' },
      { token: '--vds-success-active', ref: 'emerald-800 → 200', usage: 'Pressed/active state for a solid success fill' },
      { token: '--vds-on-success', ref: 'white → emerald-950', usage: 'Text/icons on a solid success fill' },
      { token: '--vds-success-soft', ref: 'emerald-50 → emerald@16%', usage: 'Tinted success background — badges, banners' },
      { token: '--vds-success-soft-hover', ref: 'emerald-100 → emerald@24%', usage: 'Hover on a soft success fill' },
      { token: '--vds-warning', ref: 'amber-400', usage: 'Needs attention but not broken — at-risk, low-stock' },
      { token: '--vds-warning-hover', ref: 'amber-500 → 300', usage: 'Hover for a solid warning fill' },
      { token: '--vds-warning-active', ref: 'amber-600 → 200', usage: 'Pressed/active state for a solid warning fill' },
      { token: '--vds-on-warning', ref: 'amber-950', usage: 'Dark ink on the bright gold warning fill' },
      { token: '--vds-on-warning-soft', ref: 'amber-600 → amber-400', usage: 'Warning text on a soft/tinted bg (bright amber-400 fails AA on the pale bg)' },
      { token: '--vds-warning-soft', ref: 'amber-50 → amber@16%', usage: 'Tinted warning background' },
      { token: '--vds-warning-soft-hover', ref: 'amber-100 → amber@24%', usage: 'Hover on a soft warning fill' },
      { token: '--vds-danger', ref: 'rose-600 → 400', usage: 'Errors, threats, destructive actions' },
      { token: '--vds-danger-hover', ref: 'rose-700 → 300', usage: 'Hover for a solid danger fill' },
      { token: '--vds-danger-active', ref: 'rose-800 → 200', usage: 'Pressed/active state for a solid danger fill' },
      { token: '--vds-on-danger', ref: 'white → rose-950', usage: 'Text/icons on a solid danger fill' },
      { token: '--vds-danger-soft', ref: 'rose-50 → rose@16%', usage: 'Tinted danger background' },
      { token: '--vds-danger-soft-hover', ref: 'rose-100 → rose@24%', usage: 'Hover on a soft danger fill' },
      { token: '--vds-info', ref: 'midnight-600 → 400', usage: 'Neutral informational notes and callouts' },
      { token: '--vds-info-hover', ref: 'midnight-700 → 300', usage: 'Hover for a solid info fill' },
      { token: '--vds-info-active', ref: 'midnight-800 → 200', usage: 'Pressed/active state for a solid info fill' },
      { token: '--vds-on-info', ref: 'white → midnight-950', usage: 'Text/icons on a solid info fill' },
      { token: '--vds-info-soft', ref: 'midnight-50 → midnight@16%', usage: 'Tinted info background' },
      { token: '--vds-info-soft-hover', ref: 'midnight-100 → midnight@24%', usage: 'Hover on a soft info fill' },
    ],
  },
  {
    title: 'Accents',
    rows: [
      { token: '--vds-accent-rose', ref: 'rose-600 → 400', usage: 'Categorical / data-viz accent — red (no danger meaning)' },
      { token: '--vds-accent-rose-soft', ref: 'rose-50 → rose@16%', usage: 'Soft red tint background' },
      { token: '--vds-accent-clay', ref: 'clay-600 → 400', usage: 'Categorical / data-viz accent — terracotta' },
      { token: '--vds-accent-clay-soft', ref: 'clay-50 → clay@16%', usage: 'Soft terracotta tint background' },
      { token: '--vds-accent-amber', ref: 'amber-600 → 400', usage: 'Categorical / data-viz accent — gold (no warning meaning)' },
      { token: '--vds-accent-amber-soft', ref: 'amber-50 → amber@16%', usage: 'Soft gold tint background' },
      { token: '--vds-accent-lime', ref: 'lime-600 → 400', usage: 'Categorical / data-viz accent — yellow-green lime' },
      { token: '--vds-accent-lime-soft', ref: 'lime-50 → lime@16%', usage: 'Soft lime tint background' },
      { token: '--vds-accent-emerald', ref: 'emerald-600 → 400', usage: 'Categorical / data-viz accent — green (no success meaning)' },
      { token: '--vds-accent-emerald-soft', ref: 'emerald-50 → emerald@16%', usage: 'Soft green tint background' },
      { token: '--vds-accent-harbor', ref: 'harbor-600 → 400', usage: 'Categorical / data-viz accent — teal' },
      { token: '--vds-accent-harbor-soft', ref: 'harbor-50 → harbor@16%', usage: 'Soft teal tint background' },
      { token: '--vds-accent-azure', ref: 'azure-600 → 400', usage: 'Categorical / data-viz accent — cerulean. Tags, chart series' },
      { token: '--vds-accent-azure-soft', ref: 'azure-50 → azure@16%', usage: 'Soft azure tint background' },
      { token: '--vds-accent-cobalt', ref: 'cobalt-600 → 400', usage: 'Categorical / data-viz accent — brand blue' },
      { token: '--vds-accent-cobalt-soft', ref: 'cobalt-50 → cobalt@16%', usage: 'Soft cobalt tint background' },
      { token: '--vds-accent-purple', ref: 'purple-600 → 400', usage: 'Categorical / data-viz accent — blue-violet purple' },
      { token: '--vds-accent-purple-soft', ref: 'purple-50 → purple@16%', usage: 'Soft purple tint background' },
      { token: '--vds-accent-orchid', ref: 'orchid-600 → 400', usage: 'Categorical / data-viz accent — violet' },
      { token: '--vds-accent-orchid-soft', ref: 'orchid-50 → orchid@16%', usage: 'Soft violet tint background' },
      { token: '--vds-accent-magenta', ref: 'magenta-600 → 400', usage: 'Categorical / data-viz accent — hot pink magenta' },
      { token: '--vds-accent-magenta-soft', ref: 'magenta-50 → magenta@16%', usage: 'Soft magenta tint background' },
    ],
  },
]

/* Type scale — mirrors $scale in _typography.scss. px / lh in pixels.
   display / title / heading are FLUID (clamp): the range shows the size at a
   320px viewport → full size (reached by ~1120–1280px). Small steps are fixed. */
export const TYPE_SCALE = [
  { token: 'text--display', name: 'display', kind: 'h', level: 'display', px: '24–30', lh: '30–36', weight: 600, tracking: '-0.022em', usage: 'Empty-state hero, large metric numbers · fluid' },
  { token: 'text--title', name: 'title', kind: 'h', level: 'title', px: '20–24', lh: '28–32', weight: 600, tracking: '-0.017em', usage: 'Page H1 — the primary title for a screen · fluid' },
  { token: 'text--heading', name: 'heading', kind: 'h', level: 'heading', px: '18–20', lh: '26–28', weight: 600, tracking: '-0.012em', usage: 'Section H2, panel titles · fluid' },
  { token: 'text--subheading', name: 'subheading', kind: 'h', level: 'subheading', px: 16, lh: 24, weight: 500, tracking: '-0.006em', usage: 'Card / panel titles, form section labels' },
  { token: 'text--body-lg', name: 'body-lg', kind: 't', variant: 'body-lg', px: 15, lh: 22, weight: 400, tracking: null, usage: 'Emphasized body, section intros' },
  { token: 'text--body', name: 'body', kind: 't', variant: 'body', px: 14, lh: 20, weight: 400, tracking: null, usage: 'Default UI text — the workhorse' },
  { token: 'text--caption', name: 'caption', kind: 't', variant: 'caption', px: 13, lh: 18, weight: 400, tracking: null, usage: 'Secondary text, supporting copy' },
  { token: 'text--detail', name: 'detail', kind: 't', variant: 'detail', px: 12, lh: 16, weight: 400, tracking: null, usage: 'Dense tables, metadata, timestamps' },
  { token: 'text--micro', name: 'micro', kind: 't', variant: 'micro', px: 11, lh: 14, weight: 500, tracking: null, usage: 'Badges, tight labels in dense lists' },
  { token: 'text--eyebrow', name: 'eyebrow', kind: 't', variant: 'eyebrow', px: 11, lh: 14, weight: 600, tracking: '0.04em', usage: 'Uppercase overlines above headings' },
  { token: 'text--nano', name: 'nano', kind: 't', variant: 'nano', px: 10, lh: 14, weight: 500, tracking: '0.03em', usage: 'Smallest tags, chart axis labels' },
]

/* Line-height ramp — mirrors --vds-leading-* in _tokens.scss. Unitless. */
export const LEADING = [
  { token: '--vds-leading-none', value: '1', usage: 'One-line things: numbers, icons, labels' },
  { token: '--vds-leading-tight', value: '1.2', usage: 'Big headings' },
  { token: '--vds-leading-snug', value: '1.35', usage: 'Small headings and packed lists' },
  { token: '--vds-leading-normal', value: '1.5', usage: 'Regular paragraphs — the usual pick' },
  { token: '--vds-leading-relaxed', value: '1.7', usage: 'Long blocks of reading' },
]

/* Spacing scale — mirrors --vds-space-* in _tokens.scss, with usage. */
export const SPACING = [
  { token: '--vds-space-1', px: '4px', usage: 'Icon-to-label gap, stacked metadata lines' },
  { token: '--vds-space-1-5', px: '6px', usage: 'Half-step for control chrome — Field gap, Textarea sm padding-y, SideNav row-pad-y' },
  { token: '--vds-space-2', px: '8px', usage: 'Default inline gap in buttons, checkbox-to-label' },
  { token: '--vds-space-2-5', px: '10px', usage: 'Half-step for control chrome — Input/Select/Textarea sm pad-x, SideNav row-pad-x/section-pad-y' },
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

/* Layout tokens — structural rhythm. Some step up with the viewport (see the
   Responsiveness page); the value shows base → widest. */
export const LAYOUT = [
  { token: '--vds-container', value: '1200px', usage: 'Max content width, centered' },
  { token: '--vds-gutter', value: '24px → 32px at lg', usage: 'Gap between grid columns — opens up on laptops and wider' },
  { token: '--vds-section', value: '48px → 64px at lg', usage: 'Vertical rhythm between major sections' },
  { token: '--vds-columns', value: '12', usage: 'Base grid column count' },
  { token: '--vds-page-pad', value: '16px → 24px at md → 32px at lg', usage: 'Page-edge padding — grows as the screen grows' },
  { token: '--vds-sidenav-w', value: '242px', usage: 'Expanded side navigation rail width' },
  { token: '--vds-sidenav-w-collapsed', value: '72px', usage: 'Collapsed (icon-only) side navigation rail width' },
  { token: '--vds-topbar-h', value: '56px', usage: 'Top bar height' },
  { token: '--vds-nav-accent', value: 'cobalt-600', usage: 'Brandable nav highlight — resellers re-point this one token' },
]

/* Breakpoints — mirror $breakpoints in _breakpoints.scss. The SCSS mixins are
   the styling API; the --vds-bp-* tokens are informational, for JS
   (CSS media queries cannot read custom properties). */
export const BREAKPOINTS = [
  { name: 'sm', token: '--vds-bp-sm', value: '640px', usage: 'Large phones, small tablets (portrait)' },
  { name: 'md', token: '--vds-bp-md', value: '768px', usage: 'Tablets — the sidenav can stay open from here' },
  { name: 'lg', token: '--vds-bp-lg', value: '1024px', usage: 'Laptops — the full shell fits comfortably' },
  { name: 'xl', token: '--vds-bp-xl', value: '1280px', usage: 'Desktops — fluid type reaches full size here' },
  { name: '2xl', token: '--vds-bp-2xl', value: '1536px', usage: 'Wide desktops and large monitors' },
]

/* Control metrics — shared xs/sm/md/lg/xl control heights + minimum touch target.
   Mirror the Tier 3 control tokens in _tokens.scss. */
export const CONTROLS = [
  { token: '--vds-control-h-xs', value: '28px', usage: 'Extra-small controls — dense table rows, toolbars' },
  { token: '--vds-control-h-sm', value: '32px', usage: 'Small controls — dense toolbars, table row actions' },
  { token: '--vds-control-h-md', value: '36px', usage: 'Default control height — most buttons, inputs, selects' },
  { token: '--vds-control-h-lg', value: '44px', usage: 'Large controls — hero forms; already a full touch target' },
  { token: '--vds-control-h-xl', value: '52px', usage: 'Extra-large controls — hero / marketing call-to-action' },
  { token: '--vds-tap-target', value: '44px', usage: 'Minimum hit area on coarse (touch) pointers' },
  { token: '--vds-border-w', value: '1px', usage: 'Control hairline border width — stays px on purpose, never rem' },
  { token: '--vds-control-ring-w', value: '2px', usage: 'Focus-ring thickness — shared by both ring recipes (outline + shadow)' },
  { token: '--vds-control-ring-offset', value: '2px', usage: 'Focus-ring outline-offset — outline recipe only (Button, Checkbox)' },
  { token: '--vds-control-ring-tint', value: '35%', usage: 'Focus-ring shadow tint, valid state — shadow recipe (Input, Select, Textarea)' },
  { token: '--vds-control-ring-tint-invalid', value: '30%', usage: 'Focus-ring shadow tint, invalid state — reads stronger than 35% at equal alpha' },
  { token: '--vds-control-hover-mix', value: '30%', usage: 'Border darken ratio on hover — field controls' },
  { token: '--vds-control-font-touch-min', value: '16px', usage: 'iOS zoom guard — minimum font-size on md text controls for coarse pointers' },
]

/* Radius scale — mirrors --vds-radius-* in _tokens.scss. */
export const RADIUS = [
  { token: '--vds-radius-sm', px: '4px', usage: 'Default for chrome controls — buttons, inputs, badges' },
  { token: '--vds-radius-md', px: '8px', usage: 'Cards, panels, menus, larger surfaces' },
  { token: '--vds-radius-lg', px: '12px', usage: 'Big cards, modals, drawers, hero tiles' },
  { token: '--vds-radius-xl', px: '16px', usage: 'Largest corners — full-bleed hero surfaces' },
]

/* Motion — mirrors the Tier 3 motion tokens in _tokens.scss. */
export const MOTION = [
  { token: '--vds-ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', usage: 'Default easing for small state changes' },
  { token: '--vds-ease-emphatic', value: 'cubic-bezier(0.2, 0, 0, 1)', usage: 'Emphasized decelerate — the MSP v2 nav curve; fast start, soft landing' },
  { token: '--vds-dur-fast', value: '120ms', usage: 'Hovers, color changes' },
  { token: '--vds-dur-base', value: '200ms', usage: 'Most transitions' },
  { token: '--vds-dur-slow', value: '240ms', usage: 'Larger moves — shell panels, sidenav collapse/expand' },
]

export const WEIGHTS = [
  { name: 'normal', value: 400, token: '--vds-weight-regular' },
  { name: 'medium', value: 500, token: '--vds-weight-medium' },
  { name: 'semibold', value: 600, token: '--vds-weight-semibold' },
  { name: 'bold', value: 700, token: '--vds-weight-bold' },
]

/* Font family — mirrors --vds-font-sans in _tokens.scss. */
export const FONT = [
  { token: '--vds-font-sans', value: "'Rubik', ui-sans-serif, system-ui, …", usage: 'The one UI typeface. Rubik with a system fallback stack' },
]

/* Elevation — the shadow ramp. Mirrors --vds-shadow-* in _tokens.scss. Every
   shadow is tinted with the Midnight navy for a cool cast. */
export const SHADOWS = [
  { token: '--vds-shadow-xs', usage: 'Faintest lift — resting cards, stat tiles' },
  { token: '--vds-shadow-sm', usage: 'Low float — raised cards, hover lift' },
  { token: '--vds-shadow-md', usage: 'Popovers, menus, dropdowns' },
  { token: '--vds-shadow-lg', usage: 'High float — modals, drawers' },
]

/* Stacking order — mirrors --vds-z-* in _tokens.scss. Reference one of these,
   never a hand-written z-index. Gaps leave room to slot layers in. */
export const ZINDEX = [
  { token: '--vds-z-base', value: '0', usage: 'Default in-flow content' },
  { token: '--vds-z-raised', value: '10', usage: 'In-component lift — e.g. the Table sticky header' },
  { token: '--vds-z-sticky', value: '100', usage: 'Page-level sticky toolbars / headers' },
  { token: '--vds-z-dropdown', value: '200', usage: 'Menus, selects, popovers, comboboxes' },
  { token: '--vds-z-drawer', value: '300', usage: 'Side drawers / sheets' },
  { token: '--vds-z-modal', value: '400', usage: 'Modal dialogs' },
  { token: '--vds-z-toast', value: '500', usage: 'Toasts / notifications' },
  { token: '--vds-z-tooltip', value: '600', usage: 'Tooltips — always on top' },
]

/* Effects — focus ring + scrim. Mirror the Focus & scrim block in _tokens.scss. */
export const EFFECTS = [
  { token: '--vds-focus-ring', ref: 'midnight-500 → 400', usage: 'Keyboard focus outline via :focus-visible — never decorative' },
  { token: '--vds-scrim', ref: 'midnight navy @ 45%', usage: 'Dims the page behind modals and drawers' },
]
