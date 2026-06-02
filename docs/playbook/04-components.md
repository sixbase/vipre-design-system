# 04 — Components

## File convention

Each component is a **folder** under `src/components/{Name}/` (co-located, like Mason):

```
Button/
├── Button.jsx     ← implementation
├── Button.scss    ← styles (BEM, token-bound)
└── index.js       ← re-export
```

Then register it in two places:
- `src/components/index.js` — the barrel consumers import (`import { Button } from 'vipre-design-system'`)
- `src/styles/_components.scss` — the style aggregate (`@use '../components/Button/Button'`), pulled into both the docs app (`main.scss`) and the consumer bundle (`styles.entry.scss`)

Text/Heading are the exception — no component `.scss`; they use the typescale classes from `_typography.scss`.

## Conventions

- `forwardRef` with `displayName`; ref points at the real root element.
- Spreads native props (`...props` onto the root) so callers get `onClick`, `aria-*`, `id` for free.
- `variant` / `size` / `tone` have **defaults in the signature**; JSDoc with an `@example`.
- Classes assembled with the `cx()` helper (array + filter), never string templates.
- **BEM with a `vds-` prefix:** `.vds-button`, `.vds-button--primary`, `.vds-badge__dot`.
- Token-bound only: colors via `var(--vds-primary)` / `var(--vds-ink)`, sizing via the `step()` type mixin, spacing/radius via `var(--vds-*)`. No raw hex/px in component SCSS.
- Disabled = `opacity: 0.5` + `pointer-events: none`, never a new gray.
- Visible `:focus-visible` outline using `--vds-focus-ring`.
- Sensible built-in ARIA (e.g. status `Badge` tones auto-apply `role="status"`).

See [05-workflows.md](05-workflows.md) for the step-by-step "add a component" recipe. Current
status + roadmap live in [01-planning.md](01-planning.md).
