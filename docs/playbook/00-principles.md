# 00 — Principles

## Aesthetic DNA

Vipre is a security / device-management product: the UI should feel **calm, precise, and trustworthy** — confident modern SaaS, not playful, not clinical-cold.

| Dimension | Direction | Specifics |
| --- | --- | --- |
| **Color** | Cool & quiet | `graphite` neutral ramp (blue-tinted grays) carries 90% of the UI. One brand accent: `iris` (indigo-violet) signals trust and action. Status colors stay conventional (emerald / amber / rose / sky). |
| **Typography** | Rubik | Geometric, friendly, highly legible at small sizes — right for data-dense screens. An 11-step semantic typescale, weighted toward the small end. |
| **Shape** | Lightly rounded | 6 / 8 / 12 / 16px radii — modern but not bubbly. |
| **Density** | Compact | Default body is 14px, dense data is 12px. Tight line-heights on a 4px grid. |
| **Depth** | Restrained | Subtle elevation; surfaces separated by tone and 1px lines before shadow. |

## The Rules (non-negotiable)

1. **Tokens only.** No raw hex, no raw px in components. If a value is missing, add a token — don't inline it.
2. **Semantic over primitive.** Components reference semantic tokens (`canvas`, `ink`, `primary`) and scale tokens (`text-body`, `radius-md`), never primitive ramps directly. Primitives are bound to intent in exactly one place: `:root` / `.dark`.
3. **Components are the source of truth.** All styling lives in the component. Pages and demos compose — they never restyle a component. If it looks wrong somewhere, fix the component.
4. **Typography goes through `<Text>` / `<Heading>`.** Never raw `<p>`/`<h1>` with ad-hoc sizes.
5. **Accessibility is a gate, not a polish.** Visible focus rings (`--color-focus-ring`), WCAG AA contrast (4.5:1 body / 3:1 large), keyboard support, `prefers-reduced-motion` honored.
6. **No overrides.** No `!important`, no inline styles (except token-driven swatch demos), no CSS that undoes the system.

## POC scope note

This is intentionally a single Vite + React app styled with **SCSS** — no monorepo, no
Storybook, no utility-CSS framework. Tokens are SCSS maps emitted as CSS custom properties. The
token JSON→CSS pipeline, per-component test + story files, and package publishing can
come later if the system graduates from POC.
