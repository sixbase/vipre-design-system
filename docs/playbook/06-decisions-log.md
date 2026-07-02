# 06 — Decisions Log

Every significant choice, with rationale. Append; don't rewrite history.

---

### Button split into `variant` × `tone`; added `loading`, `fullWidth`, `:active`

**Phase:** v2 / component API
**Context:** The new color buildout (#6) shipped full `success`/`warning`/`danger`/`info`
families (solid·hover·on·soft·soft-hover), but `Button` predated it and conflated emphasis +
intent into a single 4-value `variant` (`primary`/`secondary`/`ghost`/`danger`) — so only one
status color (`danger`) was reachable and the `-soft` tokens went unused by any component.
**Decision:**
- **Two orthogonal axes:** `variant` = emphasis (`solid`·`soft`·`outline`·`ghost`) × `tone` =
  intent (`primary`·`neutral`·`success`·`warning`·`danger`·`info`). Any pair is valid.
- **SCSS pattern:** each **tone** class sets local `--_btn-*` custom props (fill/hover/active/on/
  soft/soft-hover/text/line); each **variant** class consumes them. Keeps the rule count at
  *(variants + tones)*, not *(variants × tones)*, and every value stays token-bound.
- **Backward-compatible:** legacy `variant` values map internally —
  `primary→solid/primary`, `secondary→outline/neutral`, `ghost→ghost/primary`,
  `danger→solid/danger`. An explicit `tone` always overrides the legacy default tone. `neutral`
  reuses the surface/ink ramps (canvas→surface-hover) so `outline/neutral` stays pixel-identical
  to the old `secondary`.
- **`loading`** swaps in the existing `Spinner` (the JSDoc used to show this hand-rolled), sets
  `aria-busy`, and disables the control; for `iconOnly` the spinner replaces the icon.
- **`fullWidth`** stretches to 100%.
- **Two token fixes folded in:** `danger`'s hover was a raw `filter: brightness(.95)` (a
  non-token escape hatch) → now uses `--vds-danger-hover`; and no variant had a `:active` state
  though `--vds-primary-active` existed. Added `--vds-{success,warning,danger,info}-active`
  (light 800 / dark 200 steps; warning 600/200) in both `_tokens.scss` and `docs/tokens.js`, and
  wired `:active` on `solid` (fill-active) and `soft`/`outline`/`ghost` (soft-hover).
- **Scoped out:** polymorphic `as`/link rendering (a11y + ref complexity) — deferred as a
  follow-up; accent palette deliberately NOT exposed as button tones (data-viz only, would
  dilute action hierarchy).
**Verified:** in-browser computed styles for every variant + tone resolve through the token
chain; `loading` exposes `aria-busy`/disabled/spinner; `--vds-danger-active` resolves to rose-800;
`npm run build:lib` emits the new classes + tokens into both bundles.
**Status:** active

---

### More vibrant palette + Azure pulled off the Midnight hue; purged utility-CSS refs

**Phase:** v2 / palette refinement
**Context:** Azure (primary) and Midnight (navy neutral) felt too similar — they were the *same
hue* (both ≈257° OKLCH), differing only in lightness. The palette also read a touch flat.
**Decision:**
- **Azure → vivid cerulean at hue 237°** (was 256°), so it's clearly distinct from the
  Midnight navy (257°) by hue *and* chroma. Harbor nudged to 185° (greener teal) so primary
  and info don't crowd. `azure-500` is now `#0596d2` vs Midnight's muted `#3d68a4`.
- **Raised chroma across the whole chromatic family** (OKLCH peak C 0.116 → 0.150) for a more
  vibrant feel; neutrals (graphite, midnight) untouched.
- Re-verified WCAG AA on every status/primary pair — all ≥4.5 (status 4.7–5.4; primary 4.9
  light / 7.5 dark).
- **Purged every reference to the prior utility-CSS framework** across the system (install
  docs now show framework-agnostic plain-`var()` usage; CLAUDE.md, principles, lessons, and
  this log genericized). The DS was already pure SCSS with no such dependency or config.
**Status:** active

---

### Unified the chromatic palette in OKLCH — one ladder, every hue

**Phase:** v2 / palette refinement
**Context:** The palette had two clashing systems: a muted Midnight-derived family
(harbor/pine/orchid/brass/clay) next to vivid generic stock status (emerald/amber/rose/sky).
Pine≈emerald and brass≈amber were near-duplicates, and amber/rose didn't feel part of the family.
**Decision:** Regenerated **every chromatic ramp in OKLCH** (perceptually uniform) on ONE shared
**lightness + chroma ladder**, varying only hue — sophisticated/muted, and because OKLCH lightness
tracks perceived lightness, WCAG contrast stays consistent across hues. Final ramps: **azure**
(primary), **harbor** (info/teal), **emerald** (success), **amber** (warning), **rose** (danger),
**orchid** + **clay** (accents). **Removed iris, pine, brass** (redundant/unused). Neutrals
(graphite, midnight) unchanged.
**Why OKLCH, not one HSL ladder:** an earlier shared-HSL-ladder attempt failed AA — warm/teal
mid-steps were too luminous to read as text. OKLCH fixes this; the 600 step is tuned dark enough
that even amber passes 4.5:1 on white.
**Primary:** light azure-600 + white text (5.05); dark = bright azure-400 + dark (midnight-950)
text (7.35) so it pops on the navy canvas.
**A11y:** every status/primary pair re-verified — all ≥4.5 (status 4.8–5.4 light, 4.9–5.4 dark).
**Supersedes** the "Midnight-derived family (S+L rotation)" and "Accent = Azure (Midnight
electrified)" notes — azure is now part of the unified OKLCH family at the navy hue.
**Status:** active

---

### Re-anchored the theme on Midnight — the DS look & feel is now the Vipre navy

**Phase:** v2 / brand reconciliation
**Context:** The DS shipped with graphite (near-neutral charcoal) neutrals + iris accent,
but the actual Vipre product is a deep navy (#0b192d). Direction: base the whole look & feel
on Midnight.
**Decision:** Rebound the **neutral** semantic tokens from graphite → **midnight** in both
themes. Light: canvas midnight-50, ink midnight-950, ink-muted 700, ink-subtle 500, line
200/300. Dark: **canvas = midnight-950 (the literal shipped #0b192d background)**, surface 900,
raised 800, line 800/700, ink 50, ink-muted 300, ink-subtle 400. Shadows tinted with the navy
(rgb 11 25 45) for a cool cast. **Status colors stay conventional** (emerald/amber/rose/sky —
they must read as state, not brand).
**Accent = Azure (aligned primary):** primary/links/focus use **azure** — a bespoke ramp built
from *Midnight's own lightness ladder* with boosted saturation at hue 212, i.e. "Midnight
electrified" (a luminous version of the brand navy, not a generic stock blue). Light primary
azure-600 (7.38), dark azure-500 (5.35); hover azure-700/600; white text both modes. `info` is
**Harbor** (teal) so it stays distinct from the blue primary. The generic **`sky` ramp was
removed** (redundant with azure); **iris** kept as a primitive but unused in semantics.
(First tried mapping the whole palette onto one shared lightness ladder for max harmony — it
broke AA for warm/teal mid-steps as text, so neutrals=midnight, accents/status keep per-hue
tuning.)
**A11y:** every text/surface + accent pair re-checked vs WCAG AA — all ≥4.5.
**Docs:** Colors-page swatches are now click-to-copy (accessible `<button>`s + a hex toast).
**Graphite:** still defined as a primitive ramp (available cool-neutral), just no longer the
semantic neutral.
**Rationale:** Makes the DS unmistakably Vipre's; dark mode now equals the real product surface,
closing the gap the token bridge exposed.
**Status:** active

---

### Added `midnight` ramp (50→950, 950 = #0B192D) — the product navy family

**Phase:** v2 / reconciling DS with the shipped product
**Context:** The shipped Vipre product's background is a deep navy `#0B192D` (HSL 215°, 61%,
11%). The DS dark canvas was `--vds-graphite-950` (#0d1117) — a near-neutral charcoal, much
less saturated. The two didn't match, and the prototypes needed the real product surface as a
usable color family.
**Decision:** Added a full **`midnight` primitive ramp** `$midnight` → `--vds-midnight-{50…950}`,
anchored so **950 = #0B192D** (the shipped background) with lighter navy tints rising to a pale
`#f3f7fc` at 50. Hue held ~214–215° across the ramp; lighter steps are good for soft
backgrounds/borders, deep steps for surfaces. Mirrored in `docs/tokens.js` (`MIDNIGHT`, in the
`PRIMITIVES` list — renders as a full ramp on the Colors page). Rebuilt the token bridge
(`build:tokens` → `dist/vipre-tokens.css`). First consumer **scope-navigator** vendors the ramp
and maps the whole scale into its own theme layer (`--color-midnight-{step}` → `bg-midnight-950`
etc.).
**Not done (deliberately):** did **not** rewire `--vds-canvas`/dark theme to midnight — that
larger reconciliation (making DS dark mode equal the product) is a separate, explicit call.
**Rationale:** A coherent ramp (not a lone value) lets surfaces, borders, and tints all come
from one navy family while keeping the theming decision open.
**Status:** active

---

### Restructured to mirror Mason as a deliverable, contributable package

**Phase:** v1 / structure pass
**Context:** Goal clarified: the DS will be handed to Vipre's front-end team to build the MSP
scope navigator, while designers and others contribute/edit components. Needed Mason's
*delivery + structure*, not its e-commerce styling or full turbo/Storybook/Shopify machinery.
**Decision:**
- **Consumable package** — `package.json` exports `.` (components), `./tokens.css`, `./styles.css`.
  Two SCSS entries: `tokens.entry.scss` → `dist/vipre-tokens.css` (tokens only, the prototype
  bridge) and `styles.entry.scss` → `dist/vipre.css` (tokens + typescale + all component styles).
  Components ship as source JSX + one global CSS bundle (BEM); `react`/`react-dom` are peers.
- **Per-component folders** — `src/components/{Name}/{Name}.jsx + {Name}.scss + index.js`
  (co-located, like Mason's 4-file rule minus tests/stories for the POC). Barrel at
  `src/components/index.js`; styles aggregated in `src/styles/_components.scss`.
- **Component quality** — `displayName`, JSDoc `@example`, built-in a11y (e.g. status `Badge`
  tones get `role="status"`).
- **Docs parity** — added Getting Started › Installation, Foundation › Spacing + Layout
  (with new `--vds-space-*` and layout tokens). Skipped the Examples section for now.
- **Contribution-ready** — added root `CLAUDE.md` + `CONTRIBUTING.md`; expanded the playbook
  to Mason's numbering (01-planning, 05-workflows, 07-lessons-learned, 09-layout-grid; renamed
  tokens/typography/components/decisions to 02/03/04/06).
**Stayed lean:** single Vite app (no turbo/Storybook/Shopify/changesets) per the POC mandate;
hash router and source-JSX delivery keep it dependency-light.
**Rationale:** ~all of Mason's *delivery look + structure + conventions* for a fraction of the
machinery — enough for the FE team to consume and for designers to contribute, without
e-commerce/CI weight the product doesn't need.
**Status:** active

---

### Prototypes consume the DS via the token layer (CSS-var bridge), not components

**Phase:** v1 / consumption
**Context:** The prototypes (`scope-navigator`, `action-rules`, `banner-modal`,
`marketing-overview`, `vipre-prototypes`) are all built on a **utility-CSS framework** with inline utility
classes and the Inter font. The DS is **SCSS/BEM** emitting `--vds-*` custom properties.
Direct component import would mean rewriting prototype markup into BEM — too heavy for a POC.
**Decision:** Share the **tokens**, not the components (yet). The DS now exports a
token-only stylesheet: `src/styles/tokens.entry.scss` (`@use 'tokens'`) compiled by
`npm run build:tokens` → `dist/vipre-tokens.css` (just the `:root{--vds-*}` + `.dark{}`
custom properties — no component/typography classes). `package.json` exposes it via
`exports: { "./tokens.css": "./dist/vipre-tokens.css" }`. Prototypes add a local
`file:` dependency on the DS, `@import "vipre-design-system/tokens.css"`, then map the
semantic tokens into the prototype's theme layer (`--color-primary: var(--vds-primary)`, etc.)
and set `--font-sans: var(--vds-font-sans)`. This creates **additive** semantic utilities
(`bg-surface`, `text-ink`, `text-primary`, `border-line`, `text-success`…) that resolve to
DS tokens and flip in dark mode automatically. First adopter: `scope-navigator`.
**Rationale:** ~80% of brand consistency (color, type, radius, shadow) for ~5% of the churn.
The bridge works precisely because the DS's *output* is plain CSS custom properties, which
the theme layer can reference directly. Components (Button/Badge) get imported later, only
where they earn it. Note: the framework generates a semantic utility (and emits its
`--color-*` var) only when the class appears in scanned source — so existing palette classes
stay untouched and migrate incrementally.
**Status:** active

---

### Foundation pages follow Mason's token-page structure

**Phase:** v1 / docs
**Context:** The Colors and Typography pages used plain swatch/specimen grids — different
from how Mason organizes token pages.
**Decision:** Match Mason. **Colors:** semantic tokens first (grouped Surfaces / Text /
Borders / Brand & interactive / Status) as a detailed table (swatch + token + light→dark
ref + usage), tagged "Use these"; primitive ramps second as palette grids with hex,
tagged "Reference only". **Typography:** Font family → annotated type-scale rows
(token + size + usage + live preview) tagged "Use this" → Font weights → semantic
mapping table → usage. Doc data lives in `src/docs/tokens.js`.
**Note:** `src/docs/tokens.js` **mirrors** `src/styles/_tokens.scss` (hex + usage). Keep
them in sync when ramps change — it's documentation data, not the source of truth.
**Rationale:** Semantic-first with usage descriptions teaches *which* token to reach for,
not just what colors exist — the whole point of the token layer.
**Status:** active

---

### Per-component docs pages (matching Mason) + hash router

**Phase:** v1 / docs
**Context:** Mason/Claude gives every component its own dedicated page with a fixed
anatomy (title → description → Installation → example sections → Props → Accessibility),
plus separate foundation pages. Vipre's docs were a single anchor-scrolled page.
**Decision:** Split the showcase into one page per topic under `src/docs/pages/`, driven by
a `ComponentPage` layout that reproduces the Mason anatomy and a `DocPage` shell for
foundation pages. Navigation is a tiny dependency-free **hash router** in `App.jsx`
(`#/components/button`), with `src/docs/routes.js` as the single source for both the
sidebar and the route map.
**Rationale:** Matches Mason's organization, scales as components are added (new page =
new route entry), and hash routing needs zero server config on GitHub Pages. Stayed
dependency-free per the POC "as basic as possible" mandate (no react-router).
**Status:** active

---

### SCSS instead of a utility-CSS framework

**Phase:** v1 / foundation (revision)
**Context:** Initial POC used a utility-CSS framework (`@theme` tokens + utility classes). Direction
changed to "avoid the utility-CSS framework, go with SCSS."
**Decision:** Removed the utility-CSS framework. Styling is now SCSS compiled to one stylesheet. Tokens are
SCSS maps emitted as CSS custom properties (`--vds-*`); components use BEM classes
(`vds-button--primary`) defined in `src/styles/components/*.scss`; the typescale is a
`$scale` map + `step()` mixin. Light/dark still flips via `:root` / `.dark` custom props.
**Rationale:** Client preference. Bonus: emitting primitives from a SCSS loop removes the prior framework's "tree-shake unused theme vars" gap entirely (every token is always present), and
the bundle shrank (~21kB → ~9kB CSS). The `--vp-*` indirection that the framework's static
utilities required is no longer needed — semantic tokens bind to primitives directly.
**Supersedes:** the "`--vp-*` indirection" and the utility-framework parts of the "POC stack" entries below.
**Status:** active

---

### Fresh aesthetic rather than porting Claude DS

**Phase:** v1 / foundation
**Context:** The Vipre system was seeded from the methodology of `sixbase/claude-design-system`.
That system is premium/warm/editorial e-commerce — `stone` earth tones, Ancizar **serif**,
golden-ratio scales — and explicitly defines itself *against* "clinical SaaS blues and greys."
**Decision:** Keep the **methodology** (3-tier tokens, semantic theming, component-as-source-of-truth,
living playbook, a11y gate) but design the **aesthetic from scratch** for Vipre's domain.
**Rationale:** Vipre is exactly the cool, data-dense SaaS the source system avoids. Porting its
palette/font would fight the product. Per direction, this is a separate fresh design task; tokens
will be pulled into the prototypes later.
**Status:** active

---

### Rubik as the typeface

**Phase:** v1
**Context:** A typescale was first drafted on Inter; the client is standardizing on Rubik.
**Decision:** Rubik (400/500/600/700 + 400 italic), with tracking eased off vs. the Inter draft
(Rubik is already open) and the `subheading` step set to weight 500 (Rubik 500 reads as strong as
Inter 600).
**Rationale:** Client standard; geometric and legible at the 11–14px sizes this product relies on.
**Status:** active

---

### Iris (indigo-violet) as the single brand accent

**Phase:** v1
**Context:** Needed one accent that signals trust/action for a security product without leaning on
the generic "SaaS blue."
**Decision:** A custom `iris` ramp (indigo with a violet lean), distinct from a generic stock indigo.
Status colors stay conventional (emerald/amber/rose/sky) so they read as state, not brand.
**Rationale:** One confident accent keeps the UI calm; a slightly violet indigo is distinctive while
still reading as trustworthy.
**Status:** active

---

### `--vp-*` indirection for dark mode

**Phase:** v1
**Context:** the framework `@theme` generates static utilities, which can't themselves respond to a
`.dark` class.
**Decision:** `@theme` semantic tokens point at `--vp-*` variables; the `--vp-*` values are swapped
under `.dark`. Soft status backgrounds in dark use `color-mix(... 16%, transparent)`.
**Rationale:** Keeps full `bg-primary` / `text-ink` utility ergonomics while theming from one place.
**Status:** changed — superseded by the SCSS switch (top of file). No longer using that framework,
so the indirection is gone; semantic `--vds-*` tokens bind to primitives directly.

---

### POC stack: single Vite app, no monorepo

**Phase:** v1
**Context:** Direction was "as basic as possible — this is a POC."
**Decision:** One Vite + React app (~~a utility-CSS framework~~ → **SCSS**, see top of file). No turbo/pnpm
workspaces, no Storybook, no token build step, no per-component test/story files. The showcase page
doubles as the docs. Deployed to GitHub Pages via Actions for a shareable preview link.
**Rationale:** Fastest path to something readable and runnable that can be pulled into the prototypes.
The heavier monorepo machinery (token JSON→CSS, test+story per component, publishing) is deferred
until/if the system graduates from POC.
**Status:** active (stack still single-app + no monorepo; styling tech changed to SCSS)

---

### Layout primitives (Surface / Stack / Inline / Divider) as the composition base

**Phase:** v2 / harvesting components from the prototype
**Context:** To pull the MSP scope-navigator's complex components (stat tiles, package-adoption
table, scope summary strip, entity drawer) into the DS *precisely*, we need a layer below the
domain components. A complex component is ~90% composition of small building blocks + ~10% layout
glue; the styling precision belongs in those building blocks, not re-declared per composite. Depends
on the new **spacing** scale (`--vds-space-*`, 4px grid) — without it, layout glue would still be
raw `gap`/`padding` values.
**Decision:** Added four token-bound layout primitives under `src/components/`, same folder
convention as Button:
- **Surface** — the panel box (background, optional 1px `--vds-line` border, radius, `pad-{n}`
  padding from the spacing scale, `elev-{x}` shadow, `raised`). Every card / popover / table-shell
  composes this instead of re-declaring bg + border + radius.
- **Stack** — vertical flex, `gap-{n}` from the spacing scale (replaces `flex flex-col gap-*`).
- **Inline** — horizontal flex, `gap-{n}` + `wrap` + align/justify (replaces `flex items-center gap-*`).
- **Divider** — 1px hairline in `--vds-line`, horizontal/vertical, `role="separator"`.
Gap/padding modifiers are generated with an `@each` loop over a step list, each referencing
`var(--vds-space-#{n})`, so spacing stays token-driven with **no inline styles** (rule #6).
Registered in `src/components/index.js` + `src/styles/_components.scss`; `build:lib` green.
**Rationale:** Establishes the composition base so domain components harvested from MSP are mostly
assembly. Class-based gap modifiers (not inline `style={{gap}}`) keep the no-inline-style rule intact.
**Next:** first harvest target is **StatTile** (Surface + Stat/Meter + Text/Badge). Docs pages,
`routes.js` entries, and the `01-planning.md` status table for these four primitives are still to be
added (deferred to avoid colliding with in-flight edits in those files).
**Status:** active

---

## Chromatic Sparkline tones + StatTile `trendTone` (2026-06-04)
**Context:** Dogfooding StatTile in the scope-navigator prototype (the descendant rollup tiles:
Distributors / Resellers / Customers, each with a trend sparkline). These are a **categorical**
series — the entity type carries no good/bad meaning — so StatTile's default sparkline coloring
(delta-driven success/danger, else `muted`) flattened all three to the same neutral line, losing the
per-type distinction the prototype had with raw brand hexes.
**Decision:**
- **Sparkline** gains the seven chromatic family tones (`azure`, `harbor`, `emerald`, `amber`,
  `rose`, `orchid`, `clay`) alongside the existing semantic ones. Light uses the `600` step; a
  `.dark .vds-sparkline--{family}` block flips to the vivid `400` step — same per-mode treatment the
  status tones get, so light/dark parity holds (rule: never ship a light-only change).
- **StatTile** gains a `trendTone` prop that overrides the derived sparkline tone (passes straight
  through to `<Sparkline tone>`). Default behavior unchanged when omitted.
**Rationale:** Keeps the precision in the primitive + tokens (no raw hex in the consumer): the
prototype maps type→DS family (distributor→azure, reseller→rose, customer→emerald) and the DS owns
the actual color + dark-mode flip. A categorical-but-token-bound coloring path the DS lacked.
**Status:** active

**Addendum (same day):** extended the chromatic treatment to **StatTile's `tone`** too (not just
`trendTone`). The 7 families now set `--vds-stat-accent` (icon glyph) + `--vds-stat-soft` (chip),
with a `.dark` block flipping to the 400 step. So `tone="azure"` colors the **icon glyph AND the
sparkline** together (sparkTone derives from tone) — the right call for a categorical tile whose
whole identity is one hue. `trendTone` stays for the rarer case of coloring only the sparkline. The
scope-navigator rollup tiles now pass `tone={family}` (distributor→azure, reseller→rose,
customer→emerald), restoring the per-type icon+line color the prototype had before, in DS tokens.

---

### Depth & elevation defined as a system area (spec, paper-first)

**Phase:** v2 / foundations
**Context:** "Depth" existed only as four raw shadow tokens (`--vds-shadow-xs/sm/md/lg`) and a
presentational `Surface elevation="xs|sm|md|lg"` prop. No semantic ladder, no dark-mode depth
strategy (Midnight-tinted shadows vanish on the graphite-950 canvas), no z-index scale (one
stray `z-index: 1` in Table), no scrim token, no documented rule for when to use shadow vs.
tone vs. line. The principles file already declared the intent ("Depth: Restrained — surfaces
separated by tone and 1px lines before shadow") but it was never built out.
**Decision:** Authored a depth spec in [10-depth.md](10-depth.md) (restrained feel, per user).
Key choices:
- **Priority order** tone → line → shadow → z-index. Resting surfaces get tone + line, never a
  drop-shadow; shadow is reserved for elements that float free of the page.
- **Semantic elevation ladder** named by role: `flat` / `resting` / `raised` / `overlay` /
  `floating`. Each level binds surface token + shadow + stack order as one decision.
- **Per-mode depth rule:** light = shadow-led (backgrounds barely change); dark = lightness-led
  (higher = lighter surface, shadow only reinforces). Formalizes the existing dark
  `surface-raised`=graphite-800 choice into a full ladder: 950→900→800→700.
- **Proposed new tokens:** `--vds-surface-overlay` (Tier 2), a `--vds-z-*` scale
  (base/raised/sticky/dropdown/drawer/modal/toast/tooltip = 0/10/100/200/300/400/500/600),
  `--vds-scrim` (Tier 2, per-mode 0.45 light / 0.65 dark). Shadows kept as-is. Backdrop blur
  explicitly **deferred** (reads richer than "restrained").
- **Proposed `Surface` API migration** from presentational `elevation` values to the semantic
  ladder, retiring the separate `raised` boolean (the level implies the surface), with old
  values kept as deprecated aliases one cycle so scope-navigator doesn't break.
**Status:** active / built. Tokens (`--vds-surface-overlay`, `--vds-z-*` scale, `--vds-scrim`)
in `_tokens.scss`; `/foundation/depth` showcase page; and the semantic `Surface` `elevation` API
(`flat|resting|raised|overlay|floating`, default `resting`) all shipped and verified light + dark.
Old `elevation` values (`none|xs|sm|md|lg`) + the `raised` boolean kept as deprecated, shadow-only
back-compat for one cycle (so scope-navigator's vendored copy is unaffected). Remaining: migrate
`StatTile` off the deprecated `elevation="sm"` (a design call — `resting` carries no shadow).

---

### ScopeNavigator harvested into the DS (the flagship composite)

**Phase:** v2 / components
**Context:** the scope-navigator prototype's hierarchy breadcrumb (`ScopeNavigator.jsx`) is the
single most-defining surface of the product — the bar that walks the distributor → reseller →
customer account tree, drills into any level via a searchable/sortable/filterable dropdown, and
collapses a deep trail into a "…" menu. It lived in the prototype hard-coupled to `./config`
(entity `typeConfig` / `statusConfig`), `./data` (the mock tree), and Tailwind classes. This is the
first **composite** graduated into the DS proper (not just tokens/primitives).

**Decisions:**
- **Preserve the logic, strip the coupling.** Kept verbatim: the deterministic width-estimated
  responsive collapse (no measure-flicker), the `useLayoutEffect` viewport-clamp that shifts the
  popover's real `left` (not a transform) so auto-focusing search never scrolls the page sideways,
  the drill-down vs. switch dropdown semantics, and current-scope handling. Dropped: all `./config`
  / `./data` imports and every Tailwind class.
- **Data-driven, Vipre defaults baked in.** Entities are `{ id, name, type, status, children? }`;
  `typeConfig` (type → `{label, icon, tone}`) and `statusConfig` (status → `{label, tone,
  description}`) are **props with the Vipre taxonomy as defaults** (`defaultTypeConfig` /
  `defaultStatusConfig` / `defaultSortOptions` exported alongside). Map **key order** drives the
  "Level" / "Status" sorts and which statuses appear in the filter — no hardcoded ordering. Works
  out of the box for Vipre (the DS's stated reason to exist), reusable for any tree.
- **Composes primitives:** popovers are `Surface elevation="overlay"` (theme-following), search is
  `Input` with a leading `Icon`, all glyphs are `Icon`. ~90% composition + layout glue, per the
  harvest methodology.
- **Fixed-chrome bar, theme-following popovers.** The bar is **always the Midnight navy in both
  themes** (a product-chrome surface, like the sidebar) — its own local `--vds-scope-*` tokens map
  to the midnight ramp; light-on-navy content uses `color-mix` on `--vds-white` for the alpha
  overlays (never raw rgba — stays token-bound). The dropdowns, by contrast, are real Surfaces and
  flip per theme. Verified: light = white popover under navy bar; dark = midnight-overlay popover.
- **Type icon chip** is a filled `family-600` square (white glyph), tinted by a per-element
  `--vds-scope-chip-bg` CSS var set from the config `tone` — closest DS analog to the prototype's
  saturated `bg-{color}-600` chips. Status = a color-only dot (`--vds-scope-dot` from the status
  tone) carrying a `title` with the meaning (never color-alone).
- **Generalized the domain bits:** the prototype's bespoke "Future State" Zap toggle → a generic
  `actions` slot; the ⌘K palette → an optional `onSearch` trigger. Consumers drop product controls
  in without the DS knowing about them.

**Docs:** new `ScopeNavigatorPage` (`/components/scope-navigator`) with a live demo tree and four
sections (root / drilled-in / search+actions / responsive collapse). Required a small **shared docs
primitive** change: `Preview` gained a `popover` modifier (+`reserve` min-height) so absolutely-
positioned dropdowns escape the otherwise `overflow:hidden` preview box — added `.vds-preview--popover`
to `_showcase.scss`.

**Status:** built + verified (light + dark; drill-down, search filter, responsive "…" collapse all
exercised in-browser). Registered in the barrel (under a new **Composites** section) and
`_components.scss`. Not yet dogfooded back into the prototype (the prototype still runs its local
`ScopeNavigator.jsx`); re-vendoring `src/vds/` + rebuilt `vipre.css` would close that loop when desired.

**Refinement (same day — dark-default + container-responsive):** two follow-ups after first review.
1. **The bar now scopes `.dark` onto its own root** (matching the prototype's `className="dark …"`),
   so the whole bar AND its popovers render light-on-navy **even when the page is in light mode** —
   the product runs the scope bar on the dark Midnight surface regardless of theme. This let the SCSS
   drop the bespoke `--vds-scope-*` navy tokens and use plain semantic tokens (`--vds-canvas` bar /
   `--vds-surface` active pill / `--vds-surface-overlay` popover / `--vds-ink*` / `--vds-line`) — the
   `.dark` cascade does the theming. Verified: light page → navy bar + midnight-700 (`#1e3e6b`)
   dropdown. 2. **Responsiveness is now CONTAINER-based, not viewport-based.** The first cut used CSS
   `@media (min-width:768px)` for the row/stack switch, so in a narrow *container* on a wide *viewport*
   the search stayed inline and **collided with the trail** (the reported bug). Fixed by toggling a
   `.vds-scope--stack` class off the already-measured bar width (`navWidth < 768`) — the search stacks
   below the trail whenever the *bar* is narrow, correct inside any layout. Also threaded `min-width: 0`
   through `__crumb` / `__crumb-main` so the active label truncates instead of pushing into the search,
   and added a **`window` resize listener** alongside the `ResizeObserver` (belt-and-suspenders for
   envs that throttle RO delivery). Verified row-mode at 1020px: search inline at 200px, 12px gap, zero
   crumb/search overlap; stacked-mode at 658px: search full-width below the trail.

## Popover primitive + TimeframeSelect (2026-06-04)

Added a reusable **`Popover`** primitive and a **`TimeframeSelect`** component built on it.

**Why a primitive first.** Audited the existing `ScopeNavigator` dropdown and found its placement
only clamps **horizontally** (it always opens *downward*, never flips), has **no Escape-to-close**,
and **never returns focus** to the trigger. Fine for a bar pinned to the top of the screen, but a
timeframe control can live anywhere (page header, card, near the viewport bottom) and would clip.
Rather than copy a flawed pattern, the placement/dismissal/focus/ARIA logic now lives once in
`Popover`:
- **Placement:** opens on `placement` (bottom/top × start/end), **flips to the opposite side** when
  there isn't room, **clamps left/right** into the viewport, and **caps panel height** to the
  available space (scrolls instead of overflowing). Recomputes on scroll + resize.
- **Dismissal/focus:** outside-`mousedown` and `Escape` both close; Escape (and the render-prop
  `close()`) **return focus to the trigger**. Focus moves into the panel's first focusable on open.
- **ARIA:** clones the trigger to wire `aria-haspopup` / `aria-expanded` / `aria-controls` to the
  panel's `id` + `role` (`dialog|menu|listbox`). Composes `Surface elevation="overlay"`.
Registered under **Controls** (`Popover`); docs at `/primitives/popover`.

**TimeframeSelect — the common patterns in one component.** `variant="dropdown"` (default) is a pill
trigger (Calendar + label + chevron) → preset menu (`role="menu"` of `menuitemradio`, arrow-key
roving focus, check on the active item) built on `Popover`; `variant="segmented"` is an inline
quick-toggle (`role="group"` of `aria-pressed` buttons) for wide toolbars. `allowCustom` adds a
start/end range (two DS `Input type="date"` + Apply). Presets are `{ id, label }`; the component
**resolves the concrete `{ start, end }` Dates** from the id at selection time (`resolveTimeframe`,
relative to now) so `onChange` hands consumers real dates without hardcoding. Ships
`DEFAULT_TIMEFRAMES` (rolling 24h/7d/30d/90d/12mo) + `CALENDAR_TIMEFRAMES` (Today/WTD/MTD/YTD…).
Registered under **Composites**; docs at `/components/timeframe-select`. Verified in-browser
light+dark: open/flip/clamp/select/close, `aria-checked`, dark tokens flip (trigger `midnight-900`
surface, panel overlay surface). **Not yet dogfooded into the prototype** (and `ScopeNavigator` not
yet migrated onto `Popover`) — both are follow-ups; re-vendor `src/vds/` + rebuilt `vipre.css` to
close the loop when desired.

**Addendum (resting = whisper shadow; data tiles aligned):** chose to define level-1 `resting`
as tone + line **+ a whisper `shadow-xs`** (not shadowless) — a touch of lift so data tiles feel
placed, not painted on, while staying restrained. `Surface`'s `--elev-resting` now carries
`shadow-xs` (so it's the default for every resting surface, incl. Card). Aligned the three data
tiles that had drifted onto different levels: **StatTile** (was borderless + `shadow-sm`) and
**MetricCard** (was borderless + `raised`/`shadow-md`) both dropped to `elevation="resting"` with
the default border — so Card/StatTile/MetricCard are now visual siblings. MetricCard's hover lift
retuned `shadow-lg → shadow-md` (resting xs → raised md). 10-depth.md updated to match.

**Typography — line-height ramp + tabular numerals (leading was undefined; numerals unaligned).**
The typescale bakes an optical line-height into each `$scale` step (large text tight, small text
looser), but there was **no reusable line-height token** and the docs specimens were single-line
`nowrap` — so leading was invisible and un-overridable when copy wrapped. Added a **`--vds-leading-*`
unitless ramp** (`none 1 · tight 1.2 · snug 1.35 · normal 1.5 · relaxed 1.7`) in the scale tier of
`_tokens.scss`, exposed as `.vds-text--leading-*` utilities and a **`leading` prop** on `Text`/`Heading`
for multi-line overrides — additive, the baked per-step values are unchanged (no ripple through
components). The Typography page gained a **Line height** section: the ramp table (wrapping specimen
so leading reads) + a **combination matrix** (3 scales × tight/normal/relaxed) that shows how much air
a line needs shifting with size. Also added **tabular numerals** — `.vds-text--tabular` (+ `tabular`
prop) applying `font-variant-numeric: tabular-nums` — a real gap for a data-dense DS where table/metric
figures must column-align and not jitter as they update; documented with a proportional-vs-tabular demo.
Completed the **Semantic mapping** table (had omitted `body-lg`/`caption`/`micro`/`nano`). `tokens.js`
gained `LEADING` to mirror the ramp. Verified in-browser (matrix computes 20px×1.2/1.5/1.7 = 24/30/34px;
tabular column right-aligns) and both CSS bundles rebuild clean.
