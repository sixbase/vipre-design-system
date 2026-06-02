# 01 — Tokens

Authored in **SCSS** ([`src/styles/_tokens.scss`](../../src/styles/_tokens.scss)) and
emitted as **CSS custom properties**, in three tiers. Primitive ramps are SCSS
maps looped into custom properties; everything theme-dependent is a custom
property so it can flip at runtime (compile-time SCSS variables can't).

## Tier 1 — Primitive

Raw, named values. Never referenced directly by components.

- **Graphite** (`--vds-graphite-0` … `-950`) — cool neutral ramp.
- **Iris** (`--vds-iris-50` … `-900`) — indigo-violet brand accent.
- **Status** — `emerald`, `amber`, `rose`, `sky` (50 / 500 / 600 / 700 each).

Defined as SCSS maps and emitted via the `emit-ramp()` mixin:

```scss
$iris: (50: #f0f1fe, 100: #e2e4fd, /* … */ 900: #2f2c74);
:root { @include emit-ramp(iris, $iris); }   // → --vds-iris-50 … --vds-iris-900
```

Because they're emitted by a loop (not "used" detection), **every** primitive is
always present — no tree-shaking gaps when a token is only referenced via `var()`.

## Tier 2 — Semantic

Intent-mapped. These are what components use. Bound to primitives in `:root`
(light) and overridden in `.dark`.

| Token | Light | Dark |
| --- | --- | --- |
| `--vds-canvas` | graphite-50 | graphite-950 |
| `--vds-surface` | graphite-0 | graphite-900 |
| `--vds-surface-raised` | graphite-0 | graphite-800 |
| `--vds-line` / `-strong` | graphite-200 / 300 | graphite-800 / 700 |
| `--vds-ink` / `-muted` / `-subtle` | graphite-900 / 600 / 500 | graphite-50 / 400 / 500 |
| `--vds-primary` / `-hover` | iris-600 / 700 | iris-500 / 400 |
| `--vds-on-primary` | white | graphite-950 |
| `--vds-primary-soft` | iris-50 | iris-500 @16% |
| `--vds-success/warning/danger/info` (+ `-soft`) | *-600 / *-50 | *-500 / *-500 @16% |
| `--vds-focus-ring` | iris-500 | iris-400 |

Soft status backgrounds in dark use `color-mix(in oklab, … 16%, transparent)`.

## Tier 3 — Scale

- **Type** — see [03-typography.md](03-typography.md). The `$scale` map + `step()` mixin.
- **Radius** — `--vds-radius-sm/md/lg/xl` = 6 / 8 / 12 / 16px.
- **Shadow** — `--vds-shadow-xs/sm/md/lg`, tuned on graphite-950 so they read in both themes.
- **Motion** — `--vds-ease-out`, `--vds-dur-fast` (120ms), `--vds-dur-base` (200ms).

## Adding or renaming a token

CSS variables fail silently. After any rename, `grep -r "old-token-name" src/`.
Add the rationale to [06-decisions-log.md](06-decisions-log.md) if it's a real choice.
