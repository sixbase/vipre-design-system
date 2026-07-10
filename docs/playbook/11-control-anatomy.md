# 11 — Control Anatomy

> **Status: spec.** This is the grammar tokens can't hold by themselves — the reusable recipe
> for how any control (Button, Input, Select, Textarea, Checkbox, a future Radio/Switch/Chip,
> or anything an AI agent explores from scratch) composes foundation tokens into the Vipre
> look. Tokens name *values*; this doc names *how they combine*. Read it alongside
> `_tokens.scss` and the reference components (Button, Input, SideNav) — the three inputs any
> agent needs are named in §8.

Written to be **executable-precise**, not inspirational. Every recipe below is copy-pasteable
CSS. If you're building a new control and a decision here doesn't cover your case, that's a gap
— propose a token or an addition to this doc, don't invent a one-off value.

---

## 1 · The binding rule

**A component's custom properties (`--vds-{name}-*`) reference foundation tokens (Tier 1
primitive / Tier 2 semantic / Tier 3 scale). They never hold a raw value.**

```scss
// Right — component token points at a foundation token
--vds-button-pad-x-md: var(--vds-space-4);

// Wrong — a raw value hiding inside a component-scoped name
--vds-button-pad-x-md: 1rem;
```

The only exception is a value that is **genuinely not a design-scale value** — glyph geometry,
a platform compatibility hack, a mix ratio that's part of a documented recipe. Those may stay
literal, but **only with a comment explaining why**, right at the declaration:

```scss
// checkmark stroke is glyph geometry, not the ring width — must not
// thicken if --vds-control-ring-w ever changes (D5)
width: 0.3rem;
```

**If you hit a new value with no matching token, propose a foundation token. Do not inline it
"just this once."** A value used by two or more controls is a pattern; a pattern belongs in
`_tokens.scss`, Tier 3 (scale), not repeated as component-local literals. See §7 for the
process.

---

## 2 · Control anatomy — the shared slice

Every interactive control — action (Button, Checkbox) or field (Input, Select, Textarea) —
binds to the same seven-part skeleton. A new control starts here, then layers its own
tone/variant mechanics on top.

| Part | Foundation token(s) | Recipe |
| --- | --- | --- |
| **Height** | `--vds-control-h-sm` (32px) · `-md` (36px) · `-lg` (44px) | `height: var(--vds-control-h-{size})`. Fields that grow with content (Textarea) legitimately opt out — see §4 for the deviation rule. |
| **Radius** | `--vds-radius-sm` (4px) | `border-radius: var(--vds-radius-sm)`. Every chrome control agrees on this — zero divergence. |
| **Border** | `--vds-border-w` (1px, stays literal by design — see box below) + a color rule | `border: var(--vds-border-w) solid {color}`. Which color depends on control class — see §5. |
| **Text** | typescale step via `type.step()` — **not** a token, a pattern (D7) | sm → `detail` · md → `body` · lg → `body-lg`. Same mapping for every sized control. |
| **Internal gap** | `--vds-space-2` (8px) | Icon↔label, affix↔field, icon↔value — any "two things sitting inside one control" gap. `gap: var(--vds-space-2)`, referenced by name (not hand-written `0.5rem`). |
| **Motion** | `--vds-dur-fast` (120ms) + `--vds-ease-out` | `transition: {property} var(--vds-dur-fast) var(--vds-ease-out)`. Universal for hover/focus color and border-color changes (D8). Don't invent a new duration for a control state transition. |
| **Disabled** | literal `opacity: 0.5` + `pointer-events: none` | The one sanctioned literal in the whole system — CLAUDE.md mandates it byte-identical everywhere, never a new gray, never a token. |
| **Touch** | `--vds-tap-target` (44px) overlay + `--vds-control-font-touch-min` (1rem) | An invisible `::after` sized to `max(100%, var(--vds-tap-target))` widens the hit area on coarse pointers without changing the visual box. On md text controls, bump `font-size` to `var(--vds-control-font-touch-min)` under `bp.coarse` — this is a platform fix (dodges iOS auto-zoom on inputs under 16px), not a spacing value, so it does not come from the type scale. |

**Why `--vds-border-w` stays a literal `1px` (not `0.0625rem`):** hairline borders are
display-density-sensitive. A rem-based hairline can round away to 0px or double-render at
fractional device-pixel ratios. The token exists for documentation/consistency of *naming*, but
its value is pinned to `1px` on purpose — never convert it to rem.

---

## 3 · The two focus rings (D1)

There are **two** focus-ring recipes, kept deliberately separate. Do not try to unify them —
that's a rendering change (outline doesn't participate in border-radius clipping or stacking
context; box-shadow does), not a token rename, and it has already been evaluated and rejected.

### Action controls (Button, Checkbox) — hard outline

```scss
&:focus-visible {
  outline: var(--vds-control-ring-w) solid var(--vds-focus-ring);       // 2px
  outline-offset: var(--vds-control-ring-offset);                       // 2px
}
```

Reads clearly on any tone fill (solid/soft/outline/ghost, any tone) because it sits *outside*
the box, unaffected by the control's own background.

### Field controls (Input, Select, Textarea) — soft shadow ring

```scss
&:focus-within {
  border-color: var(--vds-input-border-focus); // = --vds-focus-ring
  box-shadow: 0 0 0 var(--vds-control-ring-w)
    color-mix(in oklab, var(--vds-focus-ring) var(--vds-control-ring-tint), transparent); // 35%
}

&--invalid:focus-within {
  border-color: var(--vds-danger);
  box-shadow: 0 0 0 var(--vds-control-ring-w)
    color-mix(in oklab, var(--vds-danger) var(--vds-control-ring-tint-invalid), transparent); // 30%
}
```

Reads as "an active editing surface" and pairs with the border-color change — a translucent
ring that sits *inside* the field's visual footprint, matching how text cursors and selections
already feel contained.

**When to use which:** does the control fire an action on click/press (Button, Checkbox,
future Switch/Chip-as-button)? → outline. Does it hold and edit a value (Input, Select,
Textarea, future Combobox/DatePicker)? → shadow. If a new control genuinely doesn't fit either
bucket, that's a §7 look-and-feel review question, not a coin flip.

### The 35% / 30% tint split (D2)

`--vds-control-ring-tint: 35%` (valid state) vs. `--vds-control-ring-tint-invalid: 30%`
(invalid state) — **two named tokens, not one you conditionally adjust.** Danger hues read
stronger than the midnight focus-ring hue at equal alpha, so the invalid ring drops 5 points to
balance perceived intensity. This has been checked for contrast in both themes. Do not unify
them into a single ratio — that would either wash out the valid ring or make the invalid ring
overpower the field.

---

## 4 · Pad rhythms (D3)

Buttons and fields use **different** horizontal padding scales — not an inconsistency, a
deliberate difference in job. A button pads a text *label*; a field pads a text *cursor*. Never
introduce a shared "control pad" token that tries to serve both.

| | sm | md | lg | Token family |
| --- | --- | --- | --- | --- |
| **Button** (`--vds-button-pad-x-*`) | `--vds-space-3` (12px) | `--vds-space-4` (16px) | `--vds-space-6` (24px) | Coarser jump — a label needs more visual weight around it. |
| **Field** (`--vds-input-pad-x-*` / `--vds-select-pad-x-*` / Textarea) | `--vds-space-2-5` (10px) | `--vds-space-3` (12px) | `--vds-space-4` (16px) | Tighter jump — a cursor sits close to the edge. |

Both are symmetric (`padding: 0 {pad-x}`) **except Select**, which is the worked example of a
principled deviation:

### Select's asymmetric right-tighter-for-caret rule

Select's *left* pad-x matches the field family exactly at every size (10/12/16px) — text starts
in the same place as Input. Its *right* pad-x is deliberately **one step tighter**, to leave
visual room for the caret icon without the value feeling cramped against it:

```scss
&--sm { padding: 0 var(--vds-space-2) 0 var(--vds-space-2-5); }  // 8px right / 10px left
&--md { padding: 0 var(--vds-space-2-5) 0 var(--vds-space-3); }  // 10px right / 12px left
&--lg { padding: 0 var(--vds-space-3) 0 var(--vds-space-4); }    // 12px right / 16px left
```

Note the CSS shorthand order is `top right bottom left`, not the more common `vertical
horizontal` — easy to misread. If this control is ever refactored to logical properties
(`padding-inline-start/end`), the physical "right = near the caret" meaning must be preserved
explicitly; the system does not currently support RTL, so a blind logical-property swap would
silently flip which side gets the tighter value.

**The pattern to copy:** when a control has an asymmetric internal element (a caret, a leading
icon that isn't a full affix slot, a counter badge), tighten the pad-x on that side by exactly
one step down the same scale the control already uses — don't invent a new fractional value.

---

## 5 · Border color rule (D4)

| Control class | Border color | Why |
| --- | --- | --- |
| **Action** (Button) | Tone-carrying — the tone's own line color (e.g. `--_btn-line` resolving to `--vds-primary`, `--vds-danger`, etc.) | Button's `outline`/`solid` variants are semantically *about* a tone (primary action, danger action) — the border is part of that signal. |
| **Field** (Input, Select, Textarea) | Always neutral — `--vds-line-strong` | A field's border is chrome, not a value judgment. It stays neutral regardless of what's typed into it; only the *invalid* state (a real, separate signal) recolors it to `--vds-danger`. |

Stated explicitly so nobody "fixes" the fields to carry tone, or "fixes" Button to go neutral —
both are the correct, final behavior for their control class.

**Hover darken ratio** (fields only, resting state, not focus/invalid):

```scss
--vds-input-border-hover: color-mix(in oklab, var(--vds-line-strong), var(--vds-ink) var(--vds-control-hover-mix)); // 30%
```

Shared by Input, Select (inherits Input's vars), Textarea, and Checkbox — one ratio, one token,
applied identically everywhere a field-class border needs to visibly react to hover.

---

## 6 · Composition patterns beyond controls

The same grammar extends past form controls into any composite surface.

### Concentric radius — the +2 nesting rule

From SideNav: when a shape wraps another shape with `n`px of padding between them, the
wrapper's radius = the inner shape's radius + `n`. Nested corners that share a center read as
one calm shape; equal radii on nested boxes read as a pinched mistake.

```
tile   radius 8   (--vds-radius-md)
pill   wraps tile with 2px padding → radius 8 + 2 = 10
card   wraps pill with 2px padding → radius 10 + 2 = 12  (--vds-radius-lg)
```

Apply this any time one token-radius shape nests inside another with a fixed gap — don't just
reuse the next size up in the radius scale and hope it lines up; compute it from the actual
nesting gap.

### Status tint pattern — soft fill + matching ink

From Badge: a status/tone surface pairs a tone's `-soft` background with that *same* tone's
foreground ink, never a neutral ink on a tinted background.

```scss
&--success { background-color: var(--vds-success-soft); color: var(--vds-success); }
&--danger  { background-color: var(--vds-danger-soft);  color: var(--vds-danger); }
```

Use this for any "quiet badge of meaning" — pills, chips, status dots with a label, inline
tags. The fill and the ink always come from the *same* tone pair; never mix e.g. a danger fill
with a neutral ink.

### Motion asymmetry — out-fast / in-late

From the MSP menu motion spec (`#/pilot/msp-menu`, §3 "Motion spec"): things leave fast and
arrive late, so the layout leads and the content follows. One easing curve
(`--vds-ease-emphatic`, emphasized-decelerate) drives the whole choreography; the asymmetry
comes from **sequencing and duration**, not from different curves per direction. Symmetric
in/out motion reads as cheap; this asymmetry is what makes a moving UI feel engineered. Any
control or shell that animates a collapse/expand, an enter/exit, or a reveal should follow this
shape — see the SideNav collapse choreography for a full worked example (rail width 220ms
emphatic, labels fade out fast and in late, icon column never moves).

---

## 7 · How to add a new control

A numbered checklist — follow it in order, don't skip to step 3.

1. **Look-and-feel review.** Before any token is written, agree on how the control should
   *look and behave* — states, sizes, whether it's action-class or field-class (§3 decides your
   focus ring), whether it needs an asymmetric internal element (§4). This is a design
   conversation, not a code review.
2. **Bind to the anatomy in §2.** Height, radius, border, text step, internal gap, motion,
   disabled, touch — pull every one of these from the shared slice before inventing anything
   control-specific. If your control doesn't need a part (e.g. Textarea has no fixed height),
   that's a legitimate, stated deviation — document why, don't silently omit it.
3. **Define `--vds-{name}-*` tokens that reference foundation only.** Every component-scoped
   custom property must resolve to a Tier 1/2/3 foundation token (§1). No raw values except a
   commented, justified literal (glyph geometry, a platform hack — see §1's example).
4. **Document the tokens + any motion spec.** Tokens-only docs format: a Tokens section
   (grouped PropsTable, see the SideNav page's for the model) and, if the control animates
   anything beyond the universal `dur-fast`/`ease-out` hover/focus transition, a written motion
   spec (see §6's MSP menu reference — a token names the beat, only prose can name the
   choreography).
5. **Flag true gaps as foundation proposals.** If step 2 or 3 surfaces a value with no matching
   token and it's used by more than one place (or is clearly going to be), propose it as a new
   Tier 3 token in `_tokens.scss` — don't let it live as a component-local literal "for now."
   One control's raw value is a shortcut; two controls' matching raw value is a missing token.

**Two-step review, restated:** (1) look-and-feel — does it match the aesthetic and behave
correctly — then, separately, (2) tokens — does every visual value trace back to a foundation
token. Don't collapse these into one pass; a control can look right and still be wired with raw
values underneath, and that's the failure mode this whole doc exists to prevent.

---

## 8 · For AI exploration

An agent exploring a new component needs exactly three inputs:

1. **The token file** — `src/styles/_tokens.scss`. The full vocabulary of values: primitives,
   semantics, scale. Every visual decision must resolve to something already in here, or a
   proposed addition to it (§7, step 5).
2. **This grammar** — the anatomy (§2), the two ring recipes (§3), the pad rhythms (§4), the
   border rule (§5), and the composition patterns (§6). This is the "how things combine" layer
   that no single token can express.
3. **2–3 reference components** — read, don't guess:
   - **SideNav** (`src/components/SideNav/SideNav.scss`) — the concentric radius rule, fixed
     product chrome vs. theme-following surfaces, and the fullest worked motion choreography
     in the system.
   - **Button** (`src/components/Button/Button.scss`) — the action-control recipe: outline
     focus ring, tone-carrying border, the `--_btn-*` per-tone mechanism.
   - **Input** (`src/components/Input/Input.scss`) — the field-control recipe: shadow focus
     ring, neutral border + hover darken, the touch zoom-guard.

**The one guardrail that overrides everything else: never inline a raw visual value.** If the
token file and this doc don't cover a case, that is itself the finding to report — propose the
token, don't work around the gap with a literal. An agent that produces pixel-perfect output by
hand-writing hex or px values has failed the actual brief, even if the screenshot matches.
