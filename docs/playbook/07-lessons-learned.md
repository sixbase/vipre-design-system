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

## Overlay placement: always solve BOTH axes (flip + clamp), in a shared primitive

The first dropdown (`ScopeNavigator`) only clamped its popover **horizontally** and always opened
**downward**. That's invisible-fine for a top-pinned bar (there's always room below) but is a latent
bug the moment the same pattern is reused lower on the page — the panel clips off the bottom. The fix
isn't per-component tweaks; it's a single **`Popover` primitive** that flips vertically when room is
tight, clamps both axes, caps its height, and owns Escape + focus-return + ARIA. New overlays should
**compose `Popover`** rather than re-position by hand. (Migrating `ScopeNavigator` onto it is the
natural next step — its bespoke `useLayoutEffect` clamp predates the primitive.)

## Verifying popovers in-browser: dispatch a real MouseEvent, and read state inside one eval

Two gotchas QA-ing the timeframe dropdown in the headless preview: (1) the popover's outside-`mousedown`
listener closes it whenever the harness's pointer lands elsewhere **between** tool calls, so an
`open` from one call is often already closed by the next — verify **open + interact + assert inside a
single `preview_eval`**. (2) `element.click()` was flaky at triggering React's synthetic `onClick`;
`el.dispatchEvent(new MouseEvent('click', { bubbles: true, view: window }))` is reliable. A screenshot
taken right after an opening `eval` *does* preserve the open state (read-only), so eval-then-screenshot
is the way to capture an open overlay.

## Container queries can't restyle the container — put layout in an `__in` wrapper

An element with `container-type: inline-size` cannot be the target of its own `@container` rules. The recipe
(StatTile, MetricCard, DescriptionList): the component ROOT declares the container; all queryable layout (padding,
gap, flex direction) moves onto a `__in` wrapper just inside it. Costs one div, keeps the public API unchanged.

## Coarse-pointer tap targets: grow the hit area, not the control

`@include bp.coarse` + an invisible `::after` overlay (or growing the hidden native input) brings small controls to
`--vds-tap-target` (44px) without bloating the desktop design. For adjacent segments (SegmentedControl, TimeframeSelect)
make the overlay vertical-only so it can't swallow the neighbor's taps.

## Scroll-driven edge fades are the progressive way to say "there's more"

Table shell shadows and PageHeader tab masks ride a named `scroll-timeline`; when the timeline is inactive (content
fits) the base state hides the affordance, and unsupported browsers simply scroll with no fade. No JS, no resize
observers.

## Preview screenshots lie about window-scrolled sticky layouts

In the headless preview, a screenshot taken after `window.scrollTo(...)` on a page with a sticky sidebar can composite
the layout wrong (content bottom-anchored, phantom whitespace) even though `getBoundingClientRect()` reports the truth.
Verify scrolled/sticky layouts with rect measurements in `preview_eval`; trust screenshots only at scroll 0.

## Docs can force interaction states with showcase-only classes

To SHOW `:hover`/`:active`/`:focus-visible` without a live pointer, add docs-only classes
(`.vds-demo-state--hover` / `--active` / `--focus`) in `_showcase.scss` that reuse the component's
OWN private state vars (e.g. Button's `--_btn-hover`) — mirror its exact state declarations, don't
invent values. These live in the docs bundle only; **never add showcase to `styles.entry.scss`**
or the forcing classes would ship to consumers.

## Optical corrections are real design tokens too

An optical nudge — an icon slot pulled a few px toward its edge because the glyph carries internal
whitespace — is a design decision, so it gets a **named token** (`--vds-button-icon-nudge`), not a
hand-tuned margin repeated per use. Name it once, halve it at small sizes in the size rule, and
every button inherits the same correction. And **measure** these — `getBoundingClientRect()` on the
edges before/after tells you the real gap; eyeballing a 2px optical shift is how you ship a 6px one.

## Multi-agent edits: nobody touches the registries

When several agents build components concurrently, the three shared files (`components/index.js`,
`styles/_components.scss`, `docs/routes.js`) must be owned by ONE integrator; builders ship a manifest of exact
export/@use/route lines instead. Same for the playbook — builders suggest entries, the integrator writes them.
