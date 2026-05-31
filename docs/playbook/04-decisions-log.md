# 04 — Decisions Log

Every significant choice, with rationale. Append; don't rewrite history.

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
