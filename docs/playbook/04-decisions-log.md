# 04 — Decisions Log

Every significant choice, with rationale. Append; don't rewrite history.

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
**Status:** active

---

### POC stack: single Vite app, no monorepo

**Phase:** v1
**Context:** Direction was "as basic as possible — this is a POC."
**Decision:** One Vite + React + Tailwind 4 app. No turbo/pnpm workspaces, no Storybook, no token
build step, no per-component test/story files. The showcase page doubles as the docs.
**Rationale:** Fastest path to something readable and runnable that can be pulled into the prototypes.
The heavier monorepo machinery (token JSON→CSS, test+story per component, publishing) is deferred
until/if the system graduates from POC.
**Status:** active
