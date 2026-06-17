# Vipre Design Tokens — DTCG format (review proposal)

This folder is a **proposal** responding to the Vipre team's feedback on token
naming. It does not yet replace the live `src/styles/_tokens.scss` pipeline — it
runs alongside it so we can review the approach without breaking anything.

## What changed and why

The Vipre team raised two issues with the old tokens:

1. **Scope the names better** — a token should say what it *is*. `danger` →
   `color.text.danger`.
2. **Stop shipping CSS variables as the source of truth** — `--vds-*` CSS vars
   force every consuming team onto CSS. Author tokens in a neutral format instead.

This proposal adopts the **[W3C Design Tokens Community Group (DTCG)](https://tr.designtokens.org/)**
JSON format as the single source of truth, and uses
[Style Dictionary](https://styledictionary.com/) to *generate* CSS (and, later,
any other platform — iOS, Android, JS, Tailwind) from it.

## Naming convention

Three tiers, scoped by category. We chose **conventional** semantic names
(`text` / `surface` / `border` / `action` / `status`) over the old brand
nicknames (`ink` / `canvas` / `line`) so outside teams understand them without
learning our vocabulary.

| Tier | Example token path | Generated CSS var |
| --- | --- | --- |
| 1 · Palette (raw) | `palette.midnight.600` | `--vds-palette-midnight-600` |
| 2 · Semantic (intent) | `color.text.default` | `--vds-color-text-default` |
| 2 · Semantic (state) | `color.action.primary.hover` | `--vds-color-action-primary-hover` |
| 3 · Scale | `space.4`, `radius.md` | `--vds-space-4`, `--vds-radius-md` |

Old → new highlights: `--vds-ink` → `color.text.default`,
`--vds-canvas` → `color.surface.canvas`, `--vds-line` → `color.border.default`,
`--vds-primary` → `color.action.primary.default`,
`--vds-danger` → `color.status.danger.default`.

## Files

| File | Contents |
| --- | --- |
| `palette.tokens.json` | Tier 1 — raw color ramps (graphite, midnight, 10 chromatics, white) |
| `scale.tokens.json` | Tier 3 — radius, space, shadow, z-index, motion, layout, font |
| `semantic.light.tokens.json` | Tier 2 — light theme (the `:root` defaults) |
| `semantic.dark.tokens.json` | Tier 2 — dark theme overrides (the `.dark` block) |

DTCG has no standardized "modes" yet, so light/dark are modeled as two semantic
files. The build emits each as its own selector.

## Build

```bash
npm run build:tokens:dtcg
```

Generates `dist/vipre-tokens.dtcg.css` — `:root` (palette + scale + light) and
`.dark` (overrides), with semantic tokens referencing the palette vars. Any team
that can't consume CSS can instead transform the raw `.tokens.json` files with
their own Style Dictionary config (or any DTCG tool).

## Open questions for review

- **Q1 — dark soft tints.** The live SCSS builds dark "soft" fills with
  `color-mix(in oklab, <color> 16%, transparent)`. DTCG's `color` type can't
  express `color-mix()`, so they're modeled here as **8-digit hex** (color +
  alpha), which Style Dictionary emits as `rgba(...)`. This is portable and
  visually near-identical, but the blend moves from OKLab to sRGB — a
  *sub-perceptual* shift. Accept, or keep these few tokens as raw CSS strings?
- **Q2 — CSS variable prefix.** Output keeps a `--vds-` namespace prefix. The
  prefix itself was never the problem (the *format* was); confirm we want to keep
  it for collision safety.
- **Q3 — `shadow` / `cubicBezier` types.** Shadows are kept as full CSS strings
  for now; DTCG has richer composite `shadow` and `cubicBezier` types we could
  adopt if other platforms need them decomposed.
- **Q4 — rollout.** When adopted for real: keep generating the old `--vds-ink`
  style names as aliases for one release (zero consumer churn), then migrate
  consumers to the new `--vds-color-text-default` names in a follow-up.
