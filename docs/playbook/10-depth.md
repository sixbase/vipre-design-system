# 10 — Depth & Elevation

> **Status: built.** The token contract (`--vds-surface-overlay`, the `--vds-z-*` scale,
> `--vds-scrim`) is live in `_tokens.scss`, the semantic `Surface` `elevation` API is shipped,
> and both are demonstrated at `/foundation/depth` (the ladder there is real `<Surface>`
> components). The only carry-over is migrating remaining call sites off the deprecated
> `elevation` values (see below). See [06-decisions-log.md](06-decisions-log.md).

How Vipre shows that one surface sits *above* another. Vipre is calm, precise, data-dense
SaaS, so depth is **restrained** — it earns attention only where something genuinely floats.

## The priority order (non-negotiable)

Reach for these tools **in order**. Don't skip to a heavier one when a lighter one separates
the surfaces well enough.

1. **Tone** — a raised surface uses a different background (`canvas` → `surface` → `surface-raised` → `surface-overlay`).
2. **Line** — a 1px `--vds-line` border separates resting surfaces before any shadow.
3. **Shadow** — resting surfaces get only a whisper (`shadow-xs`); reserve `shadow-md`+ for
   elements that *float free* of the page (menus, modals, toasts).
4. **Stack order** (`z-index`) — decides which floating thing wins when two overlap.

> Rule of thumb: if it's resting *on* the page, separate it with tone + line + a whisper
> shadow-xs. If it's floating *over* the page, add a real shadow (md/lg) and a z-index.

## The elevation ladder

Elevation is **semantic — named by role, not by look.** A component picks the level that
matches what it *is*; the level decides surface, border, shadow, and stack order together.

| Level | Role | Surface token | Border | Light shadow | Dark cue | z-index | Components |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **0** | `flat` | `--vds-canvas` | none | none | none | base | page background, inline table cells |
| **1** | `resting` | `--vds-surface` | `--vds-line` | `shadow-xs` (whisper) | surface 1 step lighter than canvas | — | Card, Panel, Table shell, StatTile, MetricCard |
| **2** | `raised` | `--vds-surface-raised` | `--vds-line` | `shadow-md` | surface lighter + hairline | `dropdown` † | Menu, Select, Popover, Combobox, hover Card |
| **3** | `overlay` | `--vds-surface-overlay` | `--vds-line` | `shadow-lg` + **scrim** | surface lighter still + scrim | `drawer` / `modal` | Drawer, Modal, Dialog |

† The z column is **not** ranked by level — `dropdown` (400) deliberately sits above `drawer`/`modal`
so a Select opened inside a Modal isn't buried by it. See *Stack order is not the elevation ladder*.
| **4** | `floating` | `--vds-surface-raised` | none | `shadow-lg` | surface lift | `toast` / `tooltip` | Toast, Tooltip |

## Light vs. dark: the core rule

Depth is communicated **differently per mode** — this is the part most systems get wrong.

- **Light mode → shadow-led.** Backgrounds barely change (most surfaces are white); the page
  reads depth from drop-shadows and 1px lines.
- **Dark mode → lightness-led.** *Higher = lighter.* Midnight-tinted drop-shadows nearly
  vanish on the graphite-950 canvas, so each level steps the surface lighter. Shadow stays as
  a faint reinforcement only; the real signal is tone. (We already do this — dark
  `surface-raised` = graphite-800, a step above `surface` = graphite-900. The ladder just
  formalizes and extends it.)

**Dark surface ladder:** canvas `midnight-950` → surface `midnight-900` → surface-raised
`midnight-800` → surface-overlay `midnight-700`. Each rung is one perceptible step lighter.
(Dark neutrals are the **Midnight** navy ramp, not graphite — graphite is light-mode only.)

## Proposed tokens (Tier 3 + Tier 2)

Nothing here is built yet — this is the contract to implement after review.

### Surface ladder (Tier 2 · semantic, per-mode flip)

| Token | Light | Dark | Status |
| --- | --- | --- | --- |
| `--vds-canvas` | graphite-50 | midnight-950 | exists |
| `--vds-surface` | white | midnight-900 | exists |
| `--vds-surface-raised` | white | midnight-800 | exists |
| `--vds-surface-overlay` | white | midnight-700 | **new** |

### Shadows (Tier 3 · keep as-is)

`--vds-shadow-xs / sm / md / lg` — already defined, Midnight-tinted. No change. In dark mode
they're intentionally near-invisible; depth comes from the surface ladder, not these.

### Z-index scale (Tier 3 · theme-independent) — **new**

A single source of truth for stacking. Components never invent a `z-index`; they reference one.

| Token | Value | For |
| --- | --- | --- |
| `--vds-z-base` | 0 | default flow |
| `--vds-z-raised` | 10 | in-component lift (e.g. Table sticky header — replaces the stray `z-index: 1`) |
| `--vds-z-sticky` | 100 | page-level sticky toolbars / headers |
| `--vds-z-drawer` | 200 | side drawers / sheets |
| `--vds-z-modal` | 300 | modal dialogs |
| `--vds-z-dropdown` | 400 | menus, selects, popovers, comboboxes — **above** drawer/modal |
| `--vds-z-toast` | 500 | toasts / notifications |
| `--vds-z-tooltip` | 600 | tooltips (always on top) |

Gaps of 100 (10 at the low end) leave room to slot a layer in later without renumbering.

#### Stack order is not the elevation ladder

The two look alike and are not the same question:

- **Elevation** = how high a surface *looks* (tone + border + shadow). A Popover is level 2 `raised`.
- **Stack order** = who *wins* when two floating layers overlap.

They come apart for anything **spawned from an overlay**. A `Select` inside a `Modal` is level 2
by look, but the Modal that opened it is level 3 — and because `Popover` portals to `<body>`, the
two land as siblings where document order can't help. Ordering z by elevation level therefore
renders the dropdown *behind* the modal that owns it, which is why `dropdown` sits above
`drawer`/`modal` here while staying level 2 in the ladder above.

Read the scale as **"who was opened by whom"**, not "how high it floats". The inversion is safe:
a page-level dropdown is never open *behind* a modal, because opening an overlay dismisses it —
and the overlay's scrim blocks the page regardless.

> **Why Popover portals at all:** `.vds-modal__body` scrolls (`overflow-y: auto`), so a popover
> rendered inside the panel would be clipped by it. Portaling escapes the clip; the z-scale is what
> pays for that escape.

### Scrim (Tier 2 · semantic, per-mode) — **new**

The dim behind overlays (level 3).

| Token | Light | Dark |
| --- | --- | --- |
| `--vds-scrim` | `rgb(11 25 45 / 0.45)` (Midnight navy) | `rgb(2 6 12 / 0.65)` |

### Backdrop blur (Tier 3) — **deferred**

A glass blur behind modals (`--vds-blur-overlay: 2px`) is *possible* but deliberately **left
out for now** — it reads richer than "restrained." Revisit only if a design calls for it.

## Component → level mapping

| Component | Level | Notes |
| --- | --- | --- |
| Card / Panel / StatTile / MetricCard | 1 `resting` | tone + line + whisper `shadow-xs`; interactive ones lift to `shadow-md` on hover |
| Table shell | 1 `resting` | sticky header uses `--vds-z-raised` |
| Menu / Select / Popover | 2 `raised` | shadow-md (light) over `surface-raised`; `z-dropdown` |
| Drawer | 3 `overlay` | `surface-overlay` + scrim; `z-drawer` |
| Modal / Dialog | 3 `overlay` | `surface-overlay` + scrim; `z-modal` |
| Toast | 4 `floating` | shadow-lg; `z-toast` |
| Tooltip | 4 `floating` | shadow-lg; `z-tooltip` (top of everything) |

## `Surface` `elevation` API (shipped)

`Surface` used to take `elevation="none|xs|sm|md|lg"` — presentational (it named the shadow).
It now takes the **semantic ladder**:

```jsx
// before (presentational)
<Surface elevation="md" raised />

// now (semantic) — default is "resting"
<Surface elevation="raised" />   // surface-raised + shadow-md, one decision
<Surface elevation="overlay" />  // surface-overlay + shadow-lg (modals / drawers)
```

`elevation` is `'flat' | 'resting' | 'raised' | 'overlay' | 'floating'` (default `'resting'`).
The level drives surface token + shadow together, so it implies the surface — the separate
`raised` boolean is **deprecated**. Back-compat: the old values `none|xs|sm|md|lg` still render
(shadow-only, surface unchanged) for one cycle, so scope-navigator is unaffected.

**Data-tile alignment (done):** `Card`, `StatTile`, and `MetricCard` are now all level-1
`resting` and look like siblings — `--vds-surface` + `--vds-line` + a whisper `shadow-xs`.
Previously they had drifted apart (StatTile = borderless + `shadow-sm`; MetricCard = borderless
+ `raised`/`shadow-md`). Interactive `StatTile`/`MetricCard` lift on hover (MetricCard → `shadow-md`).

**Carry-over (not blocking):** re-vendor into scope-navigator (`src/vds/` source + rebuilt
`src/vipre.css`) only when the prototype actually needs the new tokens/levels — not required today.

## Rules

- **Resting surfaces get only a whisper.** A card at rest is tone + line + `shadow-xs` — never
  `shadow-md`+ (that reads as floating). Lift to a real shadow only on hover or when it floats.
- **One scrim at a time.** Stacking two overlays (modal over drawer) shares a single scrim; the
  topmost owns it.
- **Never hand-write `z-index`.** Use a `--vds-z-*` token. A magic number is a bug.
- **Shadow is not the only depth signal** (a11y): dark mode and high-contrast users may not see
  it, so tone + line must always carry the separation on their own.
- **Scrim contrast:** the scrim must keep underlying text from competing with overlay content;
  the 0.45 / 0.65 values are tuned for that — don't lighten them ad hoc.
