# 01 — Tokens

All tokens live in [`src/styles/tokens.css`](../../src/styles/tokens.css), in three tiers.

## Tier 1 — Primitive

Raw, named values. Never referenced directly by components.

- **Graphite** (`--color-graphite-0` … `-950`) — cool neutral ramp.
- **Iris** (`--color-iris-50` … `-900`) — indigo-violet brand accent.
- **Status** — `emerald`, `amber`, `rose`, `sky` (50 / 500 / 600 / 700 each).

## Tier 2 — Semantic

Intent-mapped. These are what components use. Defined as `@theme` tokens that point
at live theme variables, then bound to primitives in `:root` (light) and `.dark`.

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `canvas` | `bg-canvas` | graphite-50 | graphite-950 |
| `surface` | `bg-surface` | graphite-0 | graphite-900 |
| `surface-raised` | `bg-surface-raised` | graphite-0 | graphite-800 |
| `line` / `line-strong` | `border-line` | graphite-200 / 300 | graphite-800 / 700 |
| `ink` / `ink-muted` / `ink-subtle` | `text-ink…` | graphite-900 / 600 / 500 | graphite-50 / 400 / 500 |
| `primary` / `primary-hover` | `bg-primary` | iris-600 / 700 | iris-500 / 400 |
| `on-primary` | `text-on-primary` | white | graphite-950 |
| `primary-soft` | `bg-primary-soft` | iris-50 | iris-500 @16% |
| `success` / `warning` / `danger` / `info` (+ `-soft`) | `text-success`… | *-600 / *-50 | *-500 / *-500 @16% |
| `focus-ring` | — | iris-500 | iris-400 |

**Why the `--vp-*` indirection?** Tailwind 4 `@theme` generates *static* utilities. To make
`bg-primary` respond to dark mode, the `@theme` token points at a `--vp-*` variable whose value
is swapped under `.dark`. One place to retheme, full utility ergonomics.

## Tier 3 — Scale

- **Type** — see [02-typography.md](02-typography.md).
- **Radius** — `--radius-sm/md/lg/xl` = 6 / 8 / 12 / 16px.
- **Shadow** — `--shadow-xs/sm/md/lg`, tuned on graphite-950 so they read in both themes.
- **Motion** — `--ease-out`, `--duration-fast` (120ms), `--duration-base` (200ms).

## Adding or renaming a token

CSS variables fail silently. After any rename, `grep -r "old-token-name" src/`.
Add the rationale to [04-decisions-log.md](04-decisions-log.md) if it's a real choice.
