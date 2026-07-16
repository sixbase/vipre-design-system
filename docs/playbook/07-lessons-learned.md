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

## Optically centering text: nudge the ink, not the box

A label's line box can be dead-centered while the *letters* still sit high — fonts don't center their
ink in their em. So `getBoundingClientRect()` on the text (the line box) will lie to you; measure the
**ink** (canvas `actualBoundingBoxAscent/Descent` around the real baseline) and compare that to the
icon's center. When you nudge the label down to fix it, the line box will look slightly *low* on
purpose — that's the box compensating for high ink. Rubik runs ~0.5–0.9px high; worst at the smallest
button sizes where 1px is a big fraction of the height. All-caps demo labels exaggerate it (no
descenders), so test with a real sentence-case word too.

## A `width:100%` component still shrinks inside the centered Preview canvas

`.vds-preview__canvas` is `display:flex; align-items:center`, so a *single* child that isn't
`width:100%` becomes a flex item sized to its content — it shrinks to the columns' natural width, not
the canvas. A bare `<Table>` fills (it sets `width:100%` itself), but the moment you wrap it in a
demo shell (`Stack`, a toolbar `div`) that wrapper is the flex item and it collapses, dragging the
table in with it. Fix at the wrapper: `style={{ width: '100%' }}`. Don't change the canvas — most
component previews (Button, Badge) *want* the centering. Measure with `getBoundingClientRect()` per
section; a page of tables at 879px with three stragglers at ~350–460px is this bug, not the component.

## Right-align numbers, not text — including relative times

Right-alignment is for numeric *magnitudes* (counts, %, currency) so digits line up by place value;
the header inherits the column's align, so it sits right above the figures (the Table already does
this — don't "fix" it). A relative-time column ("2 min ago", "Yesterday", "—") is variable-length
*text*: right-aligning it just gives a ragged left edge and reads as weird next to left-aligned
columns. Left-align those. Actions/icon columns stay right (they hug the row's trailing edge).

## An overlay that isn't portaled will distort the scroll container it opens in

A `position: absolute` popover/menu/tooltip is still a *descendant* of its nearest scrolling ancestor.
Open one near the right edge of an `overflow-x: auto` box (a `.vds-table__scroll`, a horizontally
scrolling toolbar) and its width gets added to that box's scrollable area — you get a phantom
horizontal scrollbar and the content jumps. Clamping the panel to the *viewport* doesn't help; the
overflow is measured against the *container*. The fix is structural: **portal the panel to `<body>`
and position it `fixed`** against the viewport, so no ancestor's overflow can ever see it. Do this in
the base primitive (`Popover`) once — every Menu/Select/Combobox that composes it inherits the fix.
Two things move with the panel when you portal it: (1) placement coords become raw viewport values
(drop any wrapper-relative offset), and (2) outside-click dismissal must also check the panel's own
ref, since it's no longer inside the trigger wrapper — miss that and clicking an item reads as an
outside click and the menu closes before the action fires.

## Reading React state straight after a synthetic click lies to you

Firing `el.click()` in one `javascript_exec` and reading `aria-expanded` / `.vds-popover__panel` in the
*same* call shows the pre-click state — React hasn't committed the re-render yet, and the portaled
panel mounts in a later frame. Split it: click in one call, measure in the next. Also, two synchronous
clicks on the same toggle in one call both see the same stale `open` closure, so they cancel out (open
then open-again reads as still-closed). Verify overlay behaviour across separate tool calls, not within
one script.

## A live-value token table for a *composed* component needs the composed scope

The `TokenSpecTable` primitive resolves each `--vds-{name}-*` token by reading it off a hidden probe
that carries the component's root class (`scope`). That works for a standalone component, but a
component that *composes* another (TimeInput renders an Input: its real root is
`class="vds-input vds-timeinput"`, both on one element) has tokens that reference the parent's tokens —
`--vds-timeinput-icon: var(--vds-input-muted)`. A bare `scope="vds-timeinput"` probe can't resolve
`--vds-input-muted` (it's declared on `.vds-input`), so the Live value column silently shows `—`.
Fix: give the probe **both** classes exactly as the real DOM carries them —
`scope="vds-input vds-timeinput"` (className accepts the space-separated list). Rule of thumb: the
probe scope must be the literal class string on the component's root element, not just its own BEM block.

## `Inline` wraps — don't use it for count chips that must stay on one line

`Inline` defaults to `flex-wrap: wrap`. Drop three little `Icon`+number chips into it inside a narrow
table column and they silently stack to 2–3 lines — which quietly doubled a "compact" row from ~34px
to 67px, and the heights were all *equal* (every cell wrapped the same way), so it didn't look like a
wrapping bug at first. For a run of chips that should never break, use a plain
`display: inline-flex` span (flex-wrap defaults to `nowrap` there) with `white-space: nowrap`; the
cell then stays one line and the column just widens (the table scrolls sideways if it must). Also:
`innerText` on inline-flex items still shows `\n` between them even when they render on one line — that
newline is a serialization artifact, not proof of wrapping. Measure `getBoundingClientRect().height`
of the container to know for sure, and measure *per cell* to find which column is the tall one.

## Keep a compact row's controls from taxing its height

A single-line row's height is set by its tallest cell. An expand-caret `<button>` sized 1.375rem, or a
`Badge`/`Tag`, can quietly become that tallest thing and add a few px to every row. Give control
buttons a small negative block margin (`margin: -0.25rem 0`) so their box doesn't push the row taller
than its text line, and prefer `Icon size="xs"` (14px) over `sm` for in-cell chips. Verify by
measuring row height, not by eye — 34px vs 40px is invisible in a screenshot but real in a 50-row log.
