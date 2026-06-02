# Vipre Design System

A token-driven design system for Vipre's product UI — cool graphite neutrals, an iris brand accent, and the Rubik typescale. Built so Vipre's **front-end team can consume it** and **designers can contribute** to it.

🔗 **Live docs:** https://sixbase.github.io/vipre-design-system/

> Structure and delivery mirror `sixbase/claude-design-system` (3-tier tokens, semantic theming, component-as-source-of-truth, a living playbook, per-component docs). The **aesthetic is fresh** for Vipre. Will be used to build the MSP **scope navigator** prototype.

## Run the docs locally

```bash
npm install
npm run dev      # http://localhost:5173 — living docs + component reference
```

## Consume it in an app

Two delivery paths (see the **Installation** page in the docs for detail):

```bash
npm install ../vipre-design-system     # local link during the POC phase
npm run build:lib                      # build the consumable CSS bundles
```

**Tokens only** (the bridge the prototypes use today):
```css
@import "vipre-design-system/tokens.css";   /* --vds-* CSS variables */
```

**Tokens + components:**
```js
import "vipre-design-system/styles.css";
import { Button, Badge, Heading, Text } from "vipre-design-system";
```

Dark mode: add `class="dark"` to the root element — every semantic token flips.

## Repo structure

```
src/
  components/            One folder per component (the public API)
    Button/  Badge/  Text/   →  Component.jsx + Component.scss + index.js
    index.js              barrel — what consumers import
  styles/
    _tokens.scss          3-tier tokens → --vds-* custom properties
    _typography.scss      Rubik typescale ($scale map + step() mixin)
    _components.scss       aggregates each component's co-located styles
    tokens.entry.scss     → dist/vipre-tokens.css   (tokens only)
    styles.entry.scss     → dist/vipre.css          (tokens + components)
    main.scss             the docs app stylesheet (adds the showcase layout)
  docs/                   the documentation site (pages, router, primitives)
docs/playbook/            the living playbook — read before contributing
CLAUDE.md                 project rules for AI agents + engineers
CONTRIBUTING.md           how to add / edit a component
```

## Architecture (3 tiers)

1. **Primitive** — raw ramps (`--vds-graphite-*`, `--vds-iris-*`). Never used directly.
2. **Semantic** — intent tokens (`--vds-canvas`, `--vds-ink`, `--vds-primary`…) that flip light/dark.
3. **Scale** — Rubik typescale, spacing, radius, shadow, motion, layout.

**The one rule:** components reference *semantic* + *scale* tokens only — never primitives, never raw hex/px.

## What's here (foundation)

Foundations: Colors · Typography · Spacing · Layout. Components: Button · Badge · Text/Heading.
Next: the data-dense set for MSP — Table, Tabs, SideNav, Filters, Card, Input, Modal, Toast. See [`docs/playbook/01-planning.md`](docs/playbook/01-planning.md).
