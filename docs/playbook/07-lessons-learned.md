# 07 — Lessons Learned

Gotchas and better approaches discovered during the build. If you hit something twice, write it down.

## SCSS emits every token — no tree-shake gap

Emitting primitives from a SCSS loop (`@each` → custom properties) means **every** token is always present, even if only referenced via `var()` at runtime. This avoids the kind of tree-shaking gap where unused theme variables get dropped from the build. The token pages can safely read any `--vds-*` directly.

## Dark mode needs CSS custom properties, not SCSS variables

SCSS variables are compile-time and can't flip at runtime. Semantic tokens must be **CSS custom properties** swapped under `.dark`. SCSS is used only to *author/emit* them (maps, loops, the `step()` mixin).

## Co-located component styles + the import path

When a component's `.scss` lives in `src/components/{Name}/`, the path to the typescale mixin is `@use '../../styles/typography' as type;` (two levels up). Component JSX does **not** import its own `.scss` — styles are aggregated globally via `_components.scss` and shipped as one bundle, matching the consumer model (`import 'vipre-design-system/styles.css'`).

## Renaming files breaks links and var refs silently

- Renaming a playbook/doc file? Update every cross-link (`grep -rn "old-name" docs/`).
- Renaming a token? `grep -r "old-token-name" src/` — a missing CSS variable fails silently (renders as nothing), it doesn't error.
- Moving a component folder? Update both the barrel (`src/components/index.js`) and the style aggregate (`src/styles/_components.scss`).

## Doc data mirrors the tokens — keep them in sync

`src/docs/tokens.js` duplicates hex values + usage for the foundation pages. It is documentation data, **not** the source of truth (`_tokens.scss` is). When a ramp changes, update both.

## Hash routing for static hosting

The docs use a tiny hash router (`#/components/button`). Hash routes need zero server config on GitHub Pages — no 404 rewrites, no `base` headaches for navigation. Kept dependency-free (no react-router) per the lean mandate.

## Composites with overlays need a `popover` preview escape hatch

The docs `Preview` box is `overflow: hidden` (clean rounded corners, clipped code strip). That
silently **clips any absolutely-positioned overlay** — a dropdown/menu opened inside the demo just
vanishes below the fold. When documenting a component with popovers (e.g. `ScopeNavigator`), pass
`<Preview popover reserve={420}>`: `--popover` flips the box to `overflow: visible` + top-aligns the
canvas, and `reserve` gives the open overlay vertical room. Verifying the overlay's *content* is
still best done via DOM (`preview_inspect` / `preview_eval`), not the clipped screenshot.

## Fixed-chrome surfaces: tint with `color-mix` on a token, never raw rgba

The ScopeNavigator bar is always navy in both themes (product chrome). Its light-on-navy overlays
(translucent borders/hover fills) are expressed as `color-mix(in oklab, var(--vds-white) 15%,
transparent)` — token-bound, not `rgba(255,255,255,.15)`. Keeps the "no raw values" rule intact even
for a surface that deliberately ignores the light/dark flip.
