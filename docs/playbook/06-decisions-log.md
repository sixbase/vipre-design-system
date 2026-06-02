# 06 — Decisions Log

Every significant choice, with rationale. Append; don't rewrite history.

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
