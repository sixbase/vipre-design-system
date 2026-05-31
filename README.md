# Vipre Design System

A fresh, token-first foundation for Vipre's product UI. This is a **POC**: deliberately lightweight (single Vite + React app, **SCSS** for styling, no monorepo) so it's easy to read, run, and eventually pull into the prototypes.

🔗 **Live preview:** https://sixbase.github.io/vipre-design-system/

> Methodology borrowed from `sixbase/claude-design-system` (3-tier tokens, semantic theming, component-as-source-of-truth, a living playbook). The **aesthetic is designed fresh** for Vipre — cool graphite neutrals, an iris indigo-violet brand accent, and the **Rubik** typescale.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 — living token + component showcase
```

## Architecture

Styling is **SCSS**, compiled to a single stylesheet. Tokens are authored as SCSS
maps and emitted as **CSS custom properties** (so they stay live for light/dark
theming, which compile-time SCSS variables can't do). See
[`src/styles/_tokens.scss`](src/styles/_tokens.scss).

Three token tiers:

1. **Primitive** — raw ramps (`--vds-graphite-*`, `--vds-iris-*`). Never used directly in components.
2. **Semantic** — intent-mapped tokens (`--vds-canvas`, `--vds-ink`, `--vds-primary`…) that flip between light and dark via `:root` / `.dark`.
3. **Scale** — the Rubik typescale (`_typography.scss`), plus radius, shadow, and motion tokens.

Components are plain React + BEM classes (`vds-button`, `vds-button--primary`).
All styling lives in `src/styles/components/*.scss` — components only assemble class names.

**The one rule:** reference *semantic* and *scale* tokens only — never primitives, never raw hex/px. Missing a value? Add a token; don't inline it.

## What's here (v1 — foundation)

| Layer | Status |
| --- | --- |
| Tokens (color, type, radius, shadow, motion) | ✅ |
| Rubik typescale (11 steps) | ✅ |
| Light / dark theming | ✅ |
| `Text` / `Heading` | ✅ |
| `Button` (4 variants × 3 sizes) | ✅ |
| `Badge` (6 tones) | ✅ |
| Living showcase / docs page | ✅ |

## Next

Data-dense SaaS components the product needs: Table, Tabs, Nav, Filters, Card, Input, Modal, Toast. See [`docs/playbook/`](docs/playbook/).
