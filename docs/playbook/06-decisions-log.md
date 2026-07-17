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

---

**The all-screen-sizes overhaul (July 2026) — responsive foundation + ~30 new components + the MSP v2 rail.**
One coordinated pass (multi-agent, disjoint file ownership, orchestrator wires the shared registries).
The decisions that matter going forward:

- **Breakpoints are SCSS mixins, not runtime tokens.** `src/styles/_breakpoints.scss` (`bp.up/down/between/coarse/motion-ok`,
  sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536). CSS custom properties can't drive media queries, so the map is the
  source of truth; informational `--vds-bp-*` tokens are emitted for JS consumers (AppShell reads `--vds-bp-lg` so JS
  and SCSS can't drift).
- **Container-first stays the law; viewport queries are for chrome + coarse pointers.** Components adapt to their own
  width (`container-type: inline-size` + `@container`; the root is the container, layout lives in an `__in` wrapper).
  Viewport breakpoints govern shells (AppShell/docs drawer below lg), overlay sizing (<sm full-width modals/drawers),
  and `bp.coarse` tap targets (`--vds-tap-target: 44px` via invisible hit-area overlays).
- **Fluid type for the big steps only.** display/title/heading are `clamp()` between 320px and desktop; body sizes fixed.
- **The v2 SideNav replaces the old theme-following rail** (breaking API: `sections/footerSections/utilities/account/
  onBack` replace `brand/groups/footerItems`). Fixed midnight chrome in both themes; selection brandable via
  `--vds-nav-accent` only; concentric radii tile 8 / pill 10 / card 12 (+2 nesting rule); collapse choreography is
  220ms `--vds-ease-emphatic` with asymmetric label fades and an icon column that never moves (x=36). The old shipped
  nav lives on, frozen, as `CurrentLeftNav`.
- **AppShell owns responsiveness of the frame**: nav column ↔ off-canvas drawer below lg (scrim, Escape, scroll lock,
  focus return); content is a size container so page components respond to the rail collapsing, not the viewport.
- **Overlay stack is complete and composed**: Modal/Drawer own dialog semantics (trap, lock, return); Menu/Select/
  Combobox/Breadcrumb-ellipsis compose Popover; Tooltip is its own light primitive on `--vds-z-tooltip`; Toast is a
  provider + hook. CommandPalette is deliberately self-contained (own scrim/trap) so it never depends on Modal.
- **Table `responsive` (opt-in)**: below ~640px of container width rows become labelled stacked cards via
  `data-label`/`::before`; the header row stays in the AT tree. Default table unchanged.
- **Docs are ELI10 + framework-agnostic**: every component page carries a "Markup" section (the rendered vds- BEM HTML)
  so the CSS bundle is usable without React; docs site itself is responsive (off-canvas sidebar below lg).
- **New tokens**: `--vds-ease-emphatic`, `--vds-dur-slow`, `--vds-page-pad` (16→24→32), `--vds-sidenav-w(-collapsed)`,
  `--vds-topbar-h`, `--vds-nav-accent`, `--vds-control-h-sm/md/lg`, `--vds-tap-target`, `--vds-accent-cobalt(-soft)`.

## 2026-07-09 · Pivot to tokens-only (MSP menu pilot)

- **The design system is TOKENS, not components.** Alignment with the dev teams: the DS ships the
  framework-agnostic token contract (color, spacing, radius, type, transitions/micro-animations) as `--vds-*`
  CSS variables; each product team OWNS its components and binds to those variables. Works across React,
  Angular, and Bootstrap because everything is a CSS custom property.
- **The React component library is now a REFERENCE implementation, not a product.** It renders the docs' live
  previews and proves the tokens produce the intended look — it is not published or installed. Do NOT delete
  it: it is the seed of a future versioned, installable package (see below).
- **Door left open for a versioned package.** Vipre is moving toward an agentic workflow and intends to make
  the DS installable + consumable with deliberate, versioned updates later. Because the token contract stays
  identical, the reference components can graduate to a package without a rewrite. Keep component code and the
  token names stable.
- **Code snippets come OUT of the docs.** No `import { … }` install lines, no copyable component code. Docs =
  look-and-feel reference + token tables (+ a written motion spec). "Installation" = link `vipre-tokens.css`.
- **Two-step review for new components**: (1) align on look-and-feel, then (2) define + document the tokens.
  This maps onto each doc page: a look-and-feel reference section + a Tokens section.
- **Motion needs a spec, not just tokens.** A token names a beat (duration/easing); it can't capture the
  choreography (which property animates, the asymmetric out-fast/in-late sequencing). Every motion-bearing
  component documents a written motion spec alongside its tokens. See the MSP Menu pilot.
- **Icons: Font Awesome first**; custom SVG (from Figma) only when FA falls short (e.g. brand product tiles).
- **Figma keeps full-page layouts + one-offs**; reusable patterns + tokens live in the DS docs.

## 2026-07-09 · Control foundation + Button/Field proof (tokens-only, phase 2)

- **New foundation tokens**: spacing half-steps `--vds-space-1-5` (6px) / `--vds-space-2-5` (10px);
  weights `--vds-weight-regular/medium/semibold/bold`; `--vds-border-w: 1px` (stays px — rem hairlines
  break at fractional DPRs); control-ring family `--vds-control-ring-w/-offset/-tint/-tint-invalid`;
  `--vds-control-hover-mix`; `--vds-control-font-touch-min`.
- **TWO focus-ring recipes, kept deliberately**: action controls (Button/Checkbox) = hard outline;
  field controls (Input/Select/Textarea) = soft shadow ring. The 35%/30% tint split is intentional
  (danger reads stronger at equal alpha). See docs/playbook/11-control-anatomy.md.
- **Component token sets bound ONLY to foundation**: `--vds-button-*` (14) and `--vds-input-*`/
  `--vds-field-*`. Button pad rhythm (space-3/4/6) ≠ field pad rhythm (space-2-5/3/4), by design.
- **SideNav bind-down**: 14 of its token definitions now reference foundation tokens (account-h =
  control-h-md); bespoke motion beats stay literal with comments.
- **Verified**: 96-probe computed-style diff (light+dark, all variants) = ZERO changes; siblings
  proof = flipping --vds-control-h-md/--vds-radius-sm moves Button AND Input together.
- **New pattern doc**: docs/playbook/11-control-anatomy.md + /foundation/control-anatomy — the
  grammar for building new controls; explicitly written to feed AI component exploration
  (inputs: tokens + grammar + reference components).
- **Fast-follows**: bind Select/Textarea/Checkbox to the same contract; add --vds-control-box-size
  with the Checkbox work.

## 2026-07-13 · Button label optical centering + Icon set docs

- **Button `.vds-button__label` wrapper + `--vds-button-label-optical`**: the leading icon is
  geometrically centered, but Rubik's glyphs sit ~0.5–0.9px high in their line box — most visible at
  **xs (0.85px)** and **md (0.90px)**, where the label read as floating above the icon. Fix: wrap the
  text in `.vds-button__label` (inline-flex, so a transform applies) and push it down via a new token,
  set to `0.5px` at xs/md and `0` elsewhere. Measured after: all sizes land within ±0.25px of the icon
  center. Icon-only buttons stay unwrapped. Markup + anatomy docs updated to show the label span.
- **Icons stay outline-only**: Material Symbols via `@iconify-json/material-symbols` ships the FILLED
  shape under the base name; a few outlined glyphs Google shows (e.g. `domain`, `apartment`) aren't in
  the iconify data at all. For `Building2` we embed Google's official **outlined `domain`** SVG by hand
  in `src/icons.jsx` (`_Domain`, native 0 -960 960 960 viewBox). `Database` uses `database-outline`.
- **Icon page** gained "Using Material Symbols" (where icons come from + the add-a-new-icon recipe) and
  a searchable **Library** grid that reads straight from the `@icons` barrel.

## 2026-07-13 · Badge gains an icon slot

- **`Badge` `icon` prop + `.vds-badge__icon`**: a leading icon alternative to the dot (icon wins if both
  set). Decorative (`aria-hidden`), sized in em (1.1em) so it tracks the label. Optically centered by a
  measured `translateY(-0.08em)` — the icon nudges UP to the text's high ink center, the OPPOSITE of the
  dot (which nudges down toward the lowercase body). Verified: icon center within 0.06px of text ink.

## 2026-07-16 · Field gains public text-color tokens

- **`--vds-field-label-color` / `--vds-field-help-color` / `--vds-field-error-color`**: Field previously
  exposed only `--vds-field-gap` and inlined its colors (`--vds-ink-muted`, `--vds-danger`) straight into
  the label/help/error rules. A reviewer (Allan) flagged the thin token surface — every other control
  exposes a full `--vds-<name>-*` family. Promoted the three colors to public custom properties on the
  `.vds-field` root, each bound to a semantic token per the control contract, so consumers can re-point
  them without touching markup. Docs (FieldPage Tokens section) gained a "Text color" group. Defaults are
  unchanged — the semantic tokens still flip light/dark on their own, so no re-theming needed.

## 2026-07-16 · Table docs — six new examples (compose-only)

- Added six example sections to `TablePage.jsx`, all built by **composing existing primitives** — no
  changes to the `Table` component, its SCSS, or tokens. New sections:
  - **Sticky header** — fills a real doc gap: `stickyHeader` + `maxHeight` were documented in the props
    table but never shown live. Uses a new 12-row `FLEET` fixture so the scroll actually happens.
  - **Rich cells** — owner as an `Avatar` (deterministic initials/tint) + name; risk as a `Progress`
    bar whose tone tracks the score (`≥80` danger, `≥40` warning, else success) with a tabular %.
  - **Row menu** — kebab `Menu` in the actions column (`MoreHorizontal` trigger) as the scalable
    alternative to a wall of icon Buttons once a row has >2–3 actions.
  - **Bulk actions** — selection driving a contextual toolbar that swaps in above the table while any
    row is picked (Export / Quarantine / Delete / Clear).
  - **Pagination** — `Table` + `Pagination` over `FLEET`, page state owned by the demo (slice the rows
    yourself), with an "N–M of T" range readout.
  - **Rich empty state** — `EmptyState` (inset, `Search` icon, title + action) passed to the `empty`
    prop, showing it takes any node, not just a string.
- Rationale: the page already covered the mechanics (sort/select/density/responsive); the gap was
  **real-world composition** patterns. Keeping them page-level respects "pages compose, don't invent."

## 2026-07-16 · Radius + Motion get foundation reference tables

- **Gap**: a reviewer (Allan) asked where the tokens in the Button "Bound to" column are defined. Most
  resolved (space → Spacing, weights → Typography, control heights/border/ring → Control Anatomy), but
  `--vds-radius-*` had no dedicated docs table (only `radius-sm` mentioned in passing) and the `MOTION`
  scale (`--vds-dur-*` / `--vds-ease-*`) only rendered on a Pilot page.
- **Fix**: added a **Radius scale** section to Foundation → Depth (live corner chips + token table, new
  `RADIUS` array in `tokens.js`) and a **Motion scale** section to Foundation → Control Anatomy (renders
  the existing `MOTION` array, sits right under the anatomy table that already cites `--vds-dur-fast`).
- **Placement rationale**: radius is surface/shape chrome → Depth; motion is where controls bind their
  `--vds-{name}-dur/-ease` → Control Anatomy. No new page — kept the foundation nav flat. Source of truth
  is still `_tokens.scss`; `tokens.js` mirrors it.

## 2026-07-16 · Table docs — "User management" capstone example

- Added a **User management** section to `TablePage.jsx` — a self-contained people table composed from
  existing primitives (no component/token changes). It's the capstone that ties the earlier examples
  together, and doubles as the reference pattern for user-management tables in the DS.
- Composition + the semantic call it teaches:
  - **Identity** = `Avatar` (deterministic initials/tint) + name over email (`Stack` of `Text`).
  - **Role** = `Tag` — a *category*, so it uses chromatic tones (`ROLE_TONE`: Owner→amber, Admin→emerald,
    Member/Viewer→neutral). Deliberately NOT a Badge: roles carry no good/bad meaning.
  - **Status** = `Badge` dot — a *health signal*, so it uses status tones (active→success,
    invited→warning, suspended→danger). This Tag-vs-Badge split is the reusable lesson.
  - **Last active** = muted `Text`, with an em dash for invited users who never signed in.
  - **Row menu** = state-aware `Menu`: invited users gain "Resend invite"; suspended users show
    "Reactivate" instead of "Suspend". Wrapped in a `stopPropagation` span so it's row-click-safe.
  - **Bulk bar** = selection-driven toolbar (Change role / Suspend / Remove / Clear) on the table's top
    edge; when nothing is selected it shows the member count + an "Invite people" primary action.
- Verified live: 8 rows render with all cell types; selection toggles the bar; the menu items shift per
  state (Active→Suspend, Suspended→Reactivate, Invited→+Resend invite). No console errors.

## 2026-07-16 · Docs sidebar — reordered + regrouped by function

- **Problem**: groups were ordered *alphabetically*, so Getting Started landed 6th and Foundation 5th
  (below team-process "Adoption" and a vague catch-all "Components"). "Components" told you nothing
  (everything is a component), and "Primitives" was really form inputs plus strays (Popover, Spinner,
  Visually Hidden) filed in the wrong place.
- **Fix** (in `src/docs/routes.js` — `App.jsx` renders `NAV` verbatim, no runtime sort): switched to an
  intentional **learn-then-reference flow** and grouped components by *what they do*:
  Getting Started → Foundations → Forms & Inputs → Actions → Data Display → Feedback → Navigation →
  Overlays → App Chrome → Utilities → Templates → Adoption → Pilot.
- **Regrouping** (paths/pages unchanged — only `group` labels + order): dissolved "Components" (Button→
  Actions; Avatar/Badge/Tag/Card/Table/Description List/Sparkline/Kbd→Data Display); renamed "Primitives"
  → "Forms & Inputs" (18 form controls); merged "Metrics" (Stat Tile, Metric Card) into Data Display;
  moved Icon→Data Display, Spinner + Toast→Feedback, Popover→Overlays; added a small **Utilities** group
  for Visually Hidden (an a11y helper that fit nowhere else — flagged to Alvin as the one judgment call).
- Verified live: 76 items before and after (no page dropped), group order matches the approved outline,
  every stray landed in its new home, no console errors.
- **Note for future**: item order within a group is now hand-authored intent, NOT alphabetical — the
  previous convention (commit 15b231b) is superseded. Add new items where they belong in the flow.

## 2026-07-16 · New "Token Reference" page (all tokens, one lookup)

- Added `src/docs/pages/TokensPage.jsx` — a single flat, scannable reference for every `--vds-*` token,
  grouped the way a dev reaches for them: **How tokens layer → Color (semantic → primitive ramps) →
  Typography (scale, weight, leading, font) → Spacing → Radius → Elevation/shadow → Motion → Layout &
  grid → Breakpoints → Z-index → Controls & focus → Effects → Using a token**. Registered at
  `/foundation/tokens` as the FIRST item in Foundations (the reference entry point).
- Division of labour: the teaching pages (Colors, Typography, Spacing, Depth, Responsiveness) own the
  "why"; this page is the "what + value". To avoid duplicating the 144-swatch Colors grid, primitive
  ramps render as compact 12-step strips (hover = hex) with a pointer to the Colors page.
- Composes only existing pieces: `DocPage` + `Section` + a local `RefTable` reusing the `.vds-ref-table`
  shell, plus small token-bound preview swatches (colour chip, radius corner, shadow box, spacing bar)
  and live `Text`/`Heading` samples for the type scale. No new component or token values invented.
- **tokens.js additions (mirror of _tokens.scss — kept in sync):** `SHADOWS` (--vds-shadow-xs…lg),
  `ZINDEX` (--vds-z-base…tooltip), `EFFECTS` (--vds-focus-ring, --vds-scrim), and `FONT`
  (--vds-font-sans). These existed in `_tokens.scss` but had no docs mirror until now.
- Verified live: 15 sections render, swatches resolve real theme colours (--vds-canvas → rgb(247,248,250)),
  shadow/radius/spacing previews and type samples paint, no console/compile errors.

## 2026-07-16 · Popover panels now portal to `<body>` (fixed positioning)

- **Change:** `Popover` (the base every Menu / Select / Combobox / picker composes) now renders its
  panel through `createPortal(..., document.body)` with `position: fixed`, positioned against the
  viewport. Previously the panel was `position: absolute` inside the `.vds-popover` wrapper.
- **Why:** an absolutely-positioned panel is a descendant of whatever scroll container it opens in.
  Inside a `.vds-table__scroll` (which is `overflow-x: auto`), opening a row's kebab menu enlarged the
  scrollable area and forced a spurious horizontal scrollbar — the table visibly jumped. Portaling to
  `<body>` takes the panel out of every ancestor's overflow, so it can never distort (or get clipped
  by) a scrolling parent. Fixes it once for all overlay consumers, not just the table.
- **Follow-on fixes in the same change:** placement math now stores raw viewport coords (no
  wrap-relative offset); outside-click dismissal checks `panelRef` too (the panel is no longer inside
  `wrapRef`, so a click on a menu item must not read as "outside"). Existing viewport flip/clamp,
  scroll/resize reposition, Escape, and focus-return are unchanged and still apply.
- **Verified live:** Row-menu kebab opens at trigger (top = trigger bottom + 6px gap), clamps to the
  viewport's right edge, `.vds-table__scroll` shows **no** overflow (scrollWidth == clientWidth before
  and after opening); clicking an item selects and closes; panel sits in `document.body` at
  `position: fixed`. No new console errors.

## 2026-07-16 · Table auto-aligns columns by data type; Avatar tint deepened

- **Table — infer column alignment from the data.** `align` was left-default and had to be hand-set to
  `'right'` on every numeric column; forgetting it left numbers ragged-left, which reads oddly (and the
  header floats away from its data). Added `alignOf(col, data)` in `Table.jsx`: an explicit `align` still
  wins, otherwise the column samples its first non-null `row[col.key]` and goes **right for `number`,
  left for everything else**. Custom-`render` columns can't be sniffed (output type is unknown), so they
  stay left unless `align` is set — set it explicitly for rendered numerics (e.g. `` `${r.risk}%` ``).
  Applied to the header, body, and skeleton cells so header + data share one alignment. Backward
  compatible (explicit `align` unchanged); dropped the now-redundant `align:'right'` from the Sortable
  demo's plain `risk` column to exercise the inference. Verified: `risk` header + cells compute
  `text-align: right` with no `align` prop.
- **Avatar — a touch more saturated.** Identity chips filled with the bare `--vds-accent-<fam>-soft`
  (≈50 step) read almost white. Deepened to `color-mix(in oklab, <fam>-soft, <fam> 15%)` — both are
  tokens, so it still flips per theme. Verified: tint chroma rose ~0.006 → ~0.033 while staying light
  (oklab L ≈ 0.91); initials-ink contrast unchanged.

## 2026-07-16 · Zebra stripe lifts (not sinks) in dark mode so status badges stay visible

- **Problem:** Status `Badge`s use a ~16%-opacity soft tint. The zebra stripe reused `--vds-canvas`,
  which in dark mode is `midnight-950` — *darker* than the `midnight-900` surface. On those darker
  striped rows the translucent badge fill washed out toward black and the pills got hard to read.
- **Fix:** Added a `--vds-table-zebra` token (in `_tokens.scss`, both themes). Light keeps the faint
  recess (`--vds-canvas`, graphite-50 — unchanged, light badges already read). Dark flips to a subtle
  **lift** (`--vds-surface-raised` = `midnight-800`, one step *above* the surface) instead of sinking
  below it. `Table.scss`'s zebra rule now reads the token. Chose "lighter zebra" over reworking the
  badge tint because the badge tokens are shared system-wide; the stripe is the local cause.
- **Verified:** Dark zebra row `midnight-950 → midnight-800` (rgb 11,25,45 → 21,46,81; relative
  luminance ~24 → ~43), now lighter than the surface so badges sit on a lighter base. Light-mode zebra
  unchanged (graphite-50). Build passes.

## 2026-07-16 · Consolidated the docs token tables + tokens-only (no code)

- **Problem**: the docs had four+ parallel table implementations — the shared `PropsTable`, a
  `RefTable` on the new Token Reference page, a live-value `TokenTable` copy-pasted in Button AND Input,
  a `TokenTables` variant in NumberInput/PasswordInput, and `TokenGroup` copied into 6 pages. The dev
  team also wants tokens documented, not component code, for now.
- **Fix**: two shared primitives in `src/docs/primitives.jsx`:
  - `RefTable({ headers, rows })` — the one dense node-in-cell table (replaces the per-page RawTable/RefTable copies).
  - `TokenSpecTable({ scope, prefix, groups })` — the ONE canonical component-token table: Token / Bound
    to / Live value / What it controls. Self-probing: renders a hidden element with the component's root
    class (`scope`) and reads each `--vds-{name}-*` token's live computed value off it; tokens outside
    `prefix` resolve on `<html>`. Re-resolves on theme flip (MutationObserver on the html class), so the
    values stay honest in light and dark. Data shape: `groups: [{ label, tokens: [{token, bound, controls}] }]`.
- **Applied** to Button, Input, and every component page that documents `--vds-{name}-*` tokens
  (Field, SideNav, DatePicker, FileUpload, PinInput, TagsInput, NumberInput, PasswordInput). Each page
  now declares a single `{NAME}_TOKEN_GROUPS` const and renders one `<TokenSpecTable>`.
- **Tokens-only**: removed the code-oriented sections from these pages — "Reference implementation" /
  "Markup" sections and standalone `<Code>` blocks in the token/reference area. Interactive playgrounds,
  Props, Accessibility, and the tokens-CSS install line stay. Code "may come later" per the dev team.
- **Token Reference** (`/foundation/tokens`) now imports the shared `RefTable`, dropped its "Using a
  token" code block, and gained a "Component tokens" section that documents the per-component
  `--vds-{name}-*` namespaces and links to each component page's live spec table.

## 2026-07-16 · Docs voice → "explain like I'm 5" + gentle spacing tighten

- **Ask**: make all docs copy concise + ELI5, and improve layout/spacing across the system.
- **Voice**: simplify PROSE only (page `description`, Section `note`, a11y bullets, body `<p>`/`<Text>`
  paragraphs). Leave lookup facts intact — prop/column tables, token names/values, and code snippets
  are reference, not story. Banned jargon: token-first, typescale, chrome, fluid type, breakpoint
  mixins, compile, reference implementation, token contract, "custom property" (say "variable"),
  matrix, choreography, orthogonal, invariant. Voice guide saved to session scratchpad
  (eli5-voice-guide.md) for future pages.
- **Layout**: tightened section rhythm (`.vds-section-h`) from 4rem+2.75rem to space-12+space-8 (~108px
  → 80px between sections) and moved those values onto spacing tokens so the docs eat their own food;
  added line-height 1.6 to `.vds-page__desc`. In `_showcase.scss`.
- **Rollout**: phase 1 by hand (Home, the shared Colors note in ComponentPage.jsx that shows on every
  component page, Button exemplar). Then 8 parallel subagents over the other ~75 pages, one file-set
  each (no collisions), then a 9th sweep for the dev-facing "Reference implementation" body `<p>`s.
  Finding: most pages were already near this voice, so total edits were modest (~80 strings).
- **Verified**: `npm run build` green after both the main pass and the cleanup sweep (290 modules); live
  spot-checks (Home, Button, SideNav, Token Reference) render with no error overlay.
- **Left alone on purpose**: ButtonPage.jsx body prose (user was live-editing it — one "typescale"
  remains there); a couple of jargon hits inside `<Code>` snippets and one anatomy-table data row.

## 2026-07-16 · Table gains expandable detail rows + a compact audit-log pattern

- **Component:** `Table` now takes `renderDetail(row, i)`. When set, each row gets a leading expand
  caret (an inline chevron, no icon dep — like SortGlyph) that reveals the returned node in a
  full-width `colSpan` drawer beneath the row. Open state is `expandedKeys`/`onExpandedChange`
  (controlled) or `defaultExpandedKeys` (uncontrolled — the common case), mirroring Popover's
  open/defaultOpen split. The caret is a real `<button>` with `aria-expanded` + `aria-controls`; it
  stops propagation so it never fires `onRowClick`. `totalCols` accounts for the extra column so
  loading/empty colSpans stay correct. Non-expandable tables are byte-for-byte unchanged.
- **Why:** dense, multi-dimension rows (a DLP audit log) are tall because 2–3 columns each stack
  several lines. The fix is to make the row a one-line summary and move the verbose breakdown into a
  drawer — which needs first-class expandable rows, so it belongs in the component, not a page.
- **Docs pattern (`TablePage` → "Compact audit log"):** `density="compact"` + inline count chips.
  Recipients / attachments / DLP-outcomes each collapse to a single line of tinted `Icon`+number
  chips (semantic-token colors: `--vds-primary` internal, `--vds-on-warning-soft` external,
  `--vds-danger` forbidden/removals). Status is one `Badge`. Result: rows dropped from ~67px to
  **~34px** (roughly half the source screenshot's height) with nothing lost — the full sentence-form
  breakdown lives in the drawer. The 10-column table scrolls horizontally by design (dense log).
- **Verified live:** 34–35px summary rows, caret toggles a colSpan=10 drawer showing all six fields,
  glyph rotates on open, keyboard/ARIA wired, Basic (7 cols)/Selection (4 cols) tables unaffected.

## 2026-07-16 · Tooltip reveal made elegant (direction-aware ease-out)

- Reworked the tooltip enter animation from a flat 120ms 2px rise to a direction-aware reveal: fade +
  `scale(0.96)→1` that blooms from the trigger's edge (`transform-origin` per placement) and slides in
  from the trigger's direction (`--_tt-from` set per `.vds-tooltip--{side}`). Runs on `--vds-dur-base`
  (200ms) with `--vds-ease-out` (the soft expo curve) for a fast start and calm landing. Token-bound;
  `prefers-reduced-motion` still kills it.
- **No exit transition:** the chip unmounts the instant `open` flips false (`{open && createPortal(...)}`),
  so an out-animation would need a JS closing-state lifecycle. Left as a deliberate follow-up — the
  enter refinement is the elegance win without risking hover-flicker on close.
- Verified via compiled `dist/vipre.css` (classifier outage blocked live DOM checks): per-side
  `--_tt-from` values, `scale(0.96)` in the keyframe, and `dur-base`/`ease-out` all present. Build passes.

## 2026-07-16 · Z-scale: `dropdown` moved ABOVE `drawer`/`modal`

- **Bug:** every Popover-based component (Select, Menu, Combobox, DatePicker, TimeframeSelect) was
  invisible inside a `Modal`. `Popover` portals to `<body>`, `Modal` portals to `<body>`, so the two
  land as siblings and z-index alone decides — and `dropdown` (200) lost to `modal` (400). The open
  listbox rendered at full opacity, behind the panel. Found by the first real consumer of `Modal`
  (scope-navigator's `ProvisioningModal`); the DS had shipped `Modal` with no adopter, so a
  Select-in-Modal had never been exercised. No showcase page covered the combination either.
- **Root cause (the interesting part):** the z-scale was ordered by the *elevation ladder* — level 2
  `raised` → `dropdown`, level 3 `overlay` → `modal`. But elevation ("how high does it look") and
  stack order ("who wins when they overlap") are different questions, and they come apart for
  anything **spawned from an overlay**. A Select inside a Modal is level 2 by look, yet must paint
  over the level-3 surface that opened it. Ranking z by level guarantees this bug.
- **Fix:** reordered so stack order reads *"who was opened by whom"* — drawer 200, modal 300,
  **dropdown 400** (was: dropdown 200, drawer 300, modal 400). base/raised/sticky/toast/tooltip
  unchanged. Safe because a page-level dropdown is never open behind a modal (opening an overlay
  dismisses it, and the scrim blocks the page anyway). Every consumer references the tokens by name
  — no hardcoded z-index in `src/` — so renumbering the values is a no-op for callers.
- **Considered and rejected:** portaling Popover into the nearest overlay ancestor instead of `<body>`.
  Conceptually tidier, but `.vds-modal__body` is `overflow-y: auto`, so an in-panel popover gets
  clipped by the scroll container — which is why it portals in the first place.
- Playbook `10-depth.md` updated: new *"Stack order is not the elevation ladder"* section, corrected
  scale table, and a footnote on the ladder's z column so the two never get re-conflated.

## 2026-07-16 · `--vds-focus-ring` bound to `--vds-primary` (was a stale navy pin)

- **Bug:** the focus ring rendered **navy** (`midnight-500` #3d68a4) while the brand rendered
  **cobalt** (`--vds-primary` = `cobalt-600` #0068cb) — visible on every focused Input/Select in the
  provisioning modal, and reported from the prototype. Every control's SCSS already calls this "the
  unified BRAND ring" (see `Input.scss`), so the paint contradicted the contract.
- **Root cause:** `--vds-focus-ring` was pinned to `midnight-500` back when `--vds-primary` was
  *also* midnight — they matched by construction, so nothing looked wrong. When primary moved to
  cobalt (Vipre brand blue), the ring silently kept the **old brand**. Nothing failed; it just
  quietly became the previous identity. The only focus entry ever logged (2026-07-09) governs the
  ring's SHAPE (hard outline vs soft ring), never its colour — so the navy was never a decision.
- **Fix:** `--vds-focus-ring: var(--vds-primary)` in BOTH `:root` and `.dark`. Binding rather than
  re-pinning to `cobalt-600`/`cobalt-400`: primary is already per-mode, so dark lightening comes for
  free, and a future rebrand carries the ring automatically. Re-pinning would fix today's value and
  leave the *class* of bug in place — this was the second stale-pin found in one session (cf. the
  z-scale entry above), so the pattern, not the value, is the thing to kill.
- **If focus ever genuinely needs to differ from primary**, that's a NEW token — not a re-pin of
  this one.
- **Playbook `02-tokens.md` was two generations stale** and corrected in the same pass: it listed
  `--vds-primary`/`-soft`/`focus-ring` as **iris** (a ramp deleted in the OKLCH regeneration) and the
  whole dark column as **graphite** when dark neutrals are **midnight**. Rows now carry verified
  values; the focus-ring row documents the binding and says not to re-pin it.
- **Blast radius:** every `:focus-visible` ring system-wide (Button, Checkbox, Input, Select,
  Textarea, and the prototype's own `.prov-*` rows, which bind the same token). Intended.

## 2026-07-16 · SideNav catches up to the MSP v2 rail (badge, empty state, edge handle)

The DS `SideNav` was extracted from `MspShellV2.jsx` on 2026-07-15 (`6203dad`), then tokenized
(`6d9032b`). The prototype kept moving afterwards, so the rail gained three things the DS never had.
Alvin's call: **the MSP v2 nav is the latest — the DS takes it, but rebuilt to DS rules.** That
qualifier is the whole entry. The prototype expresses this nav as 179 inline `style={{}}` objects and
raw px; a straight port would have dragged that in and undone the tokenization. So each feature was
re-derived, not pasted.

- **Not-subscribed badge: padlock → "expand out" arrow.** The prototype's comment is the argument —
  the arrow *"reads as 'add / go get this'"*. A padlock only says no, which is the wrong note for a
  product the customer can buy. Same disc + ring geometry, so it drops onto the tile corner
  identically. The prototype hardcodes `#4D5666 / #0A192C / #E2E6ED`; those are just
  `midnight-600 / -950 / -100`, which the DS `LockBadge` already used — so the port **changed the
  glyph only** and kept the tokens. New: `--vds-sidenav-unsub-{disc,ring,ink,stroke}`.
- **Corner position was raw px in the DS too** (`left: 20px; top: 20px`) — a pre-existing violation
  the rewrite removed. 20 isn't a number anyone chose; it's `tile(32) − badge(16) + overhang(4)`.
  Now written as that calc, so the corner survives a change to either size. Verified still 20px.
- **Empty section (`section.empty`).** An unmanaged account has no products; the rail used to render
  a bare eyebrow over a void, which reads as "failed to load" rather than "nothing here". Fades on
  collapse rather than unmounting — same rule as the eyebrow, so section heights never jump.
- **Edge handle (`edgeHandle`, default false).** The round chevron riding the nav/content seam,
  fading in on cursor proximity and tracking its y.
  - **It listens on `window`, not on a parent.** The prototype puts the listener on the shell row
    that wraps nav + content — the cursor approaches *across the content*, which the rail doesn't
    own. Taking that shape would have made the handle a contract on whoever renders the shell. The
    rail measures its **own** `getBoundingClientRect().right` instead, so it stays a drop-in.
  - **`left: 100%`, not `right: 0`** — the rail's width animates on collapse, and a percentage left
    rides that animation for free instead of needing its own `left` transition.
  - **Inert at rest** (`pointer-events: none`, not just `opacity: 0`) — otherwise an invisible 24px
    disc sits on the seam eating clicks meant for the page.
  - **`aria-hidden` + `tabIndex={-1}` ON PURPOSE.** It duplicates the footer's Collapse row, which is
    already tabbable and announced. Exposing both makes a screen reader meet the same control twice.
    It is a **pointer shortcut layered on top of** the row, never a replacement — the prototype ships
    both (`MspShellV2.jsx:674` + the handle), and that pairing is the accessible half of the design.
  - Reduced motion drops the fade, never the control — proximity *is* the affordance.
- **Reach is asymmetric** (26px into the rail, 18px into the content) — carried from the prototype.
  Sliding out of the rail means "I want the edge"; drifting in from the page usually doesn't. Kept in
  JS as behaviour (hit-testing), not tokenized — it isn't a visual value.

**Contract change:** `.vds-sidenav__lock` → `.vds-sidenav__unsub` (+ `__unsub-disc` / `__unsub-arrow`).
Class names ARE the contract under the tokens-only model, so a name that says "lock" over an arrow is
a real defect, not cosmetic. Cheap to fix now: the only consumer, `scope-navigator`, doesn't render
the DS `SideNav` at all. `handoff/msp-menu/` is a Jul 8 snapshot and is **already** stale (it predates
the cobalt repoint) — it needs a regenerate regardless.

**Verified** (docs site, real computed values): badge corner `left/top: 20px` from the calc; disc
`rgb(43,82,136)` = midnight-600, ring `rgb(11,25,45)` = midnight-950; handle centre-x **555 = the
rail's right edge 555**, so it truly straddles the seam; `--vds-sidenav-edge-bg` resolves to
**#0068cb** (the cobalt chain holds end-to-end); at rest `opacity: 0` + `pointer-events: none`; build
clean, no console errors.

**NOT verified — the cursor-proximity fade.** The preview pane never painted (`document.hidden ===
true`), so `requestAnimationFrame` is paused and the handler that the throttle sits behind never runs.
Patching rAF from `javascript_tool` doesn't help — it evaluates in an isolated world and can't reach
the page's own globals. Static facts hold (the button only renders when `edgeHandle` is true, and it
is in the DOM, so prop + effect are both live), but the live fade wants a human with a real cursor.
**Lesson for the next agent: a blank screenshot + a 30s `javascript_tool` timeout on an rAF await are
the same symptom — check `document.visibilityState` first rather than hunting a phantom bug.**

**Still open — the account switcher.** The fourth and biggest MSP v2 delta is untouched. The DS
`account` prop is static data (`{ name, typeLabel?, tile? }`); the prototype's is an interactive
sibling-picker with a popover, search, managed/unmanaged filter chips and a radio list. That is an API
change, not a style port, and it wants `Popover` to learn **right-side placement** — today `Popover`
only flips top/bottom and clamps horizontally (`Popover.jsx`, the `compute()` in the placement
effect). `Popover` is composed by Menu / Select / Combobox / TimeframeSelect, so that lands as its own
change with its own regression pass, rather than riding in on a SideNav commit.
