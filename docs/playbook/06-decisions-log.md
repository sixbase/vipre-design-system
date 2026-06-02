# 06 — Decisions Log

Every significant choice, with rationale. Append; don't rewrite history.

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
`marketing-overview`, `vipre-prototypes`) are all **Tailwind 4** with inline utility
classes and the Inter font. The DS is **SCSS/BEM** emitting `--vds-*` custom properties.
Direct component import would mean rewriting prototype markup into BEM — too heavy for a POC.
**Decision:** Share the **tokens**, not the components (yet). The DS now exports a
token-only stylesheet: `src/styles/tokens.entry.scss` (`@use 'tokens'`) compiled by
`npm run build:tokens` → `dist/vipre-tokens.css` (just the `:root{--vds-*}` + `.dark{}`
custom properties — no component/typography classes). `package.json` exposes it via
`exports: { "./tokens.css": "./dist/vipre-tokens.css" }`. Prototypes add a local
`file:` dependency on the DS, `@import "vipre-design-system/tokens.css"`, then map the
semantic tokens into Tailwind's `@theme` (`--color-primary: var(--vds-primary)`, etc.)
and set `--font-sans: var(--vds-font-sans)`. This creates **additive** semantic utilities
(`bg-surface`, `text-ink`, `text-primary`, `border-line`, `text-success`…) that resolve to
DS tokens and flip in dark mode automatically. First adopter: `scope-navigator`.
**Rationale:** ~80% of brand consistency (color, type, radius, shadow) for ~5% of the churn.
The bridge works precisely because the DS's *output* is plain CSS custom properties, which
Tailwind `@theme` can reference directly. Components (Button/Badge) get imported later, only
where they earn it. Note: Tailwind v4 generates a semantic utility (and emits its
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

### SCSS instead of Tailwind

**Phase:** v1 / foundation (revision)
**Context:** Initial POC used Tailwind 4 (`@theme` tokens + utility classes). Direction
changed to "avoid Tailwind, go with SCSS."
**Decision:** Removed Tailwind. Styling is now SCSS compiled to one stylesheet. Tokens are
SCSS maps emitted as CSS custom properties (`--vds-*`); components use BEM classes
(`vds-button--primary`) defined in `src/styles/components/*.scss`; the typescale is a
`$scale` map + `step()` mixin. Light/dark still flips via `:root` / `.dark` custom props.
**Rationale:** Client preference. Bonus: emitting primitives from a SCSS loop removes the
Tailwind "tree-shake unused theme vars" gap entirely (every token is always present), and
the bundle shrank (~21kB → ~9kB CSS). The `--vp-*` indirection that Tailwind's static
utilities required is no longer needed — semantic tokens bind to primitives directly.
**Supersedes:** the "`--vp-*` indirection" and Tailwind parts of the "POC stack" entries below.
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
**Decision:** A custom `iris` ramp (indigo with a violet lean), distinct from stock Tailwind indigo.
Status colors stay conventional (emerald/amber/rose/sky) so they read as state, not brand.
**Rationale:** One confident accent keeps the UI calm; a slightly violet indigo is distinctive while
still reading as trustworthy.
**Status:** active

---

### `--vp-*` indirection for dark mode

**Phase:** v1
**Context:** Tailwind 4 `@theme` generates static utilities, which can't themselves respond to a
`.dark` class.
**Decision:** `@theme` semantic tokens point at `--vp-*` variables; the `--vp-*` values are swapped
under `.dark`. Soft status backgrounds in dark use `color-mix(... 16%, transparent)`.
**Rationale:** Keeps full `bg-primary` / `text-ink` utility ergonomics while theming from one place.
**Status:** changed — superseded by the SCSS switch (top of file). No longer using Tailwind/`@theme`,
so the indirection is gone; semantic `--vds-*` tokens bind to primitives directly.

---

### POC stack: single Vite app, no monorepo

**Phase:** v1
**Context:** Direction was "as basic as possible — this is a POC."
**Decision:** One Vite + React app (~~Tailwind 4~~ → **SCSS**, see top of file). No turbo/pnpm
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
