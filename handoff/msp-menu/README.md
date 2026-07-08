# MSP Menu — framework-agnostic handoff

The Vipre MSP product rail (the navy side menu), packaged so **any** front-end
team can use it — React, Vue, Angular, Svelte, or plain HTML. No build step, no
framework, no dependencies.

Open **`index.html`** in a browser to see it working.

## What's in the box

| File | What it is | You need it? |
|------|------------|--------------|
| `index.html` | The menu's **HTML markup** + a small demo frame | Copy the markup |
| `vipre.css`  | The Vipre design-system **stylesheet** (tokens + all components) | Yes — load once |
| `msp-menu.js`| The **behavior** in plain JavaScript (~120 lines, zero deps) | Yes, or re-implement it |
| `README.md`  | This file | — |

The menu is three things: **markup** (the `vds-sidenav` HTML), **style**
(`vipre.css`), and **behavior** (`msp-menu.js`). The markup and style are already
framework-agnostic — they're just HTML and CSS. This package makes the *behavior*
agnostic too, by writing it once in vanilla JS instead of React.

## Use it right away

### Plain HTML
Copy all three files into a folder and add this to your page:

```html
<link rel="stylesheet" href="vipre.css">
<!-- paste the <nav class="vds-sidenav">…</nav> block from index.html here -->
<script type="module" src="msp-menu.js"></script>
```

That's it. The script auto-finds every `.vds-sidenav` and wires it up.

### React
```jsx
import { useEffect, useRef } from 'react'
import { initSideNav } from './msp-menu.js'
import './vipre.css'

function Menu() {
  const ref = useRef(null)
  useEffect(() => initSideNav(ref.current)?.destroy, [])
  return <nav ref={ref} className="vds-sidenav" aria-label="Product">{/* markup */}</nav>
}
```
(Or just use the real `<SideNav>` React component from the design system — this
package is for teams **not** on React.)

### Vue
```vue
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { initSideNav } from './msp-menu.js'
import './vipre.css'
const el = ref(null); let menu
onMounted(() => { menu = initSideNav(el.value) })
onBeforeUnmount(() => menu?.destroy())
</script>
<template><nav ref="el" class="vds-sidenav" aria-label="Product"><!-- markup --></nav></template>
```

### Angular
Put the markup in your template, add `CUSTOM_ELEMENTS_SCHEMA` isn't needed (these
are plain elements). In the component:
```ts
import { initSideNav } from './msp-menu.js'
ngAfterViewInit() { this.menu = initSideNav(this.el.nativeElement.querySelector('.vds-sidenav')) }
ngOnDestroy() { this.menu?.destroy() }
```

## Listen for clicks

When someone clicks a menu row, the nav fires a `sidenav:select` event so you can
route:

```js
document.querySelector('.vds-sidenav').addEventListener('sidenav:select', (e) => {
  console.log('clicked', e.detail.id, e.detail.el)   // route to that page
})
```
Give each row a `data-id="…"` in the markup and it comes back as `e.detail.id`.

## The behavior contract (if you'd rather re-implement it)

The look is 100% CSS. The JavaScript only ever does these **four** things. Wire
them in your own framework and you don't need `msp-menu.js` at all — these
class/attribute names are the whole contract:

1. **Collapse** — toggle the class `vds-sidenav--collapsed` on the root `<nav>`.
   CSS animates the width (242px → 72px) and fades the labels.
2. **Accordion** (product cards) — on a product header
   (`.vds-sidenav__pill[aria-expanded]`): flip its `aria-expanded`, toggle
   `vds-sidenav__reveal--open` on the following `.vds-sidenav__reveal`, and toggle
   `vds-sidenav__chev--closed` on its chevron.
3. **Active row** — on a leaf row click: add `vds-sidenav__row--active` +
   `aria-current="page"` to it, remove them from the previously active row.
4. **Collapsed tooltips** — while collapsed, on hover/focus of a row read its
   `title` (or `data-tip`) and show one `<div class="vds-sidenav__tip">` pinned to
   the right edge of that row. (Only needed in the collapsed rail.)

Everything else — colors, spacing, the gradient product tiles, locked states, the
collapse animation, focus rings, dark-mode-proof navy — is styling you already
have in `vipre.css`.

## The markup shape

The menu is data-driven. Each part maps to a class:

| Region | Element |
|--------|---------|
| Account header | `.vds-sidenav__account` (tile + name + type) |
| Section label | `.vds-sidenav__eyebrow` (e.g. "Partners") |
| Simple row | `button.vds-sidenav__row` (icon + `.vds-sidenav__label`) |
| Product card | `.vds-sidenav__card` → header `.vds-sidenav__pill` + `.vds-sidenav__reveal` |
| Locked product | `.vds-sidenav__card--locked` + `.vds-sidenav__pill--locked` |
| Badge (e.g. "3") | `.vds-sidenav__badge` inside a row |
| Pinned footer | `.vds-sidenav__footer` |

Icons are inline `<svg>` (Material Symbols) — no icon font to install. Swap them
for your own 16×16 SVGs inside `.vds-sidenav__row-icon`.

## What this package does NOT include

- **Data wiring.** The markup here is one static example (an MSP distributor view).
  In production you generate this markup from your own data — product entitlements
  decide which cards are locked, routing decides the active row.
- **Scope switching.** Stepping into a customer (swapping the whole menu to their
  products) is an app concern: re-render the markup with the new sections and a
  "Back" row. The demo doesn't include it to keep the menu self-contained.
- **The mobile drawer.** Off-canvas behavior on small screens lives in the
  design-system `AppShell`, not in the menu itself.

## Keeping in sync

This is a **snapshot** of the `SideNav` component. If the design system's menu
changes, regenerate `vipre.css` (`npm run build:styles`) and re-copy the markup.
The four-point behavior contract above is stable and rarely changes.
