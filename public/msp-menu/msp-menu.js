/* ============================================================================
   VIPRE MSP MENU — framework-agnostic behavior controller
   ----------------------------------------------------------------------------
   The LOOK of the menu is 100% CSS + markup (vipre.css + the vds-sidenav BEM
   classes). This file adds the four behaviors CSS can't do on its own. It has
   ZERO dependencies and touches nothing outside the nav you point it at.

   Usage (any framework, or none):
     import { initSideNav } from './msp-menu.js'
     const menu = initSideNav(document.querySelector('.vds-sidenav'))
     // later, if you remove the menu from the page:
     menu.destroy()

   Or drop <script src="msp-menu.js"></script> and it auto-initialises every
   .vds-sidenav on the page (see the bottom of this file).

   THE ENTIRE BEHAVIOR CONTRACT — this is all the JS ever does:
   1. Collapse   → toggle class  "vds-sidenav--collapsed" on the root <nav>.
   2. Accordion  → on a product header (.vds-sidenav__pill[aria-expanded]):
                     flip aria-expanded, toggle "vds-sidenav__reveal--open" on
                     the next .vds-sidenav__reveal, toggle
                     "vds-sidenav__chev--closed" on its chevron.
   3. Active     → on a leaf row click: set aria-current="page" on it, remove it
                     from every other row.
   4. Tooltips   → while collapsed, hovering/focusing any [title] or [data-tip]
                     row floats one .vds-sidenav__tip at the rail's right edge.

   Re-implement these four in your own framework if you'd rather; the class/attr
   names above are the contract. Everything else is styling you already have.
   ========================================================================== */

export function initSideNav(root) {
  if (!root || root.__vdsMenuBound) return null
  root.__vdsMenuBound = true

  /* --- 1. COLLAPSE ---------------------------------------------------------
     The bottom "Collapse" utility row toggles a single class on the root.
     CSS animates the width + fades the labels; JS only flips the class and the
     button's aria-expanded. */
  const collapseBtn = root.querySelector('.vds-sidenav__utilities .vds-sidenav__row')
  const setCollapsed = (next) => {
    root.classList.toggle('vds-sidenav--collapsed', next)
    if (collapseBtn) collapseBtn.setAttribute('aria-expanded', String(!next))
    if (next) hideTip()
  }
  const onCollapse = () => setCollapsed(!root.classList.contains('vds-sidenav--collapsed'))
  if (collapseBtn) collapseBtn.addEventListener('click', onCollapse)

  /* --- 2. ACCORDION (product cards) ---------------------------------------
     Each product header is a .vds-sidenav__pill that carries aria-expanded.
     Its sibling .vds-sidenav__reveal holds the sub-items; the chevron lives
     inside the header. Toggle all three in step. */
  const onPill = (pill) => {
    const open = pill.getAttribute('aria-expanded') === 'true'
    pill.setAttribute('aria-expanded', String(!open))
    const reveal = pill.parentElement.querySelector('.vds-sidenav__reveal')
    if (reveal) {
      reveal.classList.toggle('vds-sidenav__reveal--open', !open)
      reveal.querySelector('.vds-sidenav__reveal-clip')?.setAttribute('aria-hidden', open ? 'true' : 'false')
    }
    pill.querySelector('.vds-sidenav__chev')?.classList.toggle('vds-sidenav__chev--closed', open)
    // Collapsing while a rail card is open would trap focus off-screen — leave
    // it; the CSS hides the reveal in the collapsed rail anyway.
  }

  /* --- 3. ACTIVE ROW ------------------------------------------------------
     Any leaf row (not a product header, not the escape/"Full portal" link, not
     a locked pill) becomes the current page on click. */
  const isLeaf = (el) =>
    el.classList.contains('vds-sidenav__row') &&
    !el.classList.contains('vds-sidenav__row--escape') &&
    !el.closest('.vds-sidenav__utilities')
  const setActive = (row) => {
    root.querySelectorAll('.vds-sidenav__row--active').forEach((r) => {
      r.classList.remove('vds-sidenav__row--active')
      r.removeAttribute('aria-current')
    })
    row.classList.add('vds-sidenav__row--active')
    row.setAttribute('aria-current', 'page')
  }

  /* One delegated click handler covers accordion + active + collapse targets. */
  const onClick = (e) => {
    const pill = e.target.closest('.vds-sidenav__pill:not(.vds-sidenav__pill--locked)')
    if (pill && root.contains(pill)) { onPill(pill); return }
    const row = e.target.closest('.vds-sidenav__row')
    if (row && root.contains(row)) {
      if (row === collapseBtn) return          // handled by its own listener
      if (isLeaf(row)) setActive(row)
      // Emit a simple event so the host app can route on it — no coupling.
      root.dispatchEvent(new CustomEvent('sidenav:select', {
        detail: { id: row.getAttribute('data-id') || row.title || null, el: row },
        bubbles: true,
      }))
    }
  }
  root.addEventListener('click', onClick)

  /* --- 4. COLLAPSED-RAIL TOOLTIP ------------------------------------------
     Native title text is fine when expanded. When collapsed, labels are hidden,
     so we float ONE tooltip pinned to the right edge of the hovered/focused
     row. Fixed positioning lets it escape the rail's overflow. */
  let tipEl = null
  const showTip = (e) => {
    if (!root.classList.contains('vds-sidenav--collapsed')) return
    const el = e.target.closest?.('[title], [data-tip]')
    if (!el || !root.contains(el)) return hideTip()
    const label = el.getAttribute('data-tip') || el.getAttribute('title')
    if (!label) return hideTip()
    if (!tipEl) {
      tipEl = document.createElement('div')
      tipEl.className = 'vds-sidenav__tip'
      tipEl.setAttribute('role', 'tooltip')
      // Mount inside the nav (not <body>) so it inherits the rail's local custom
      // properties (--_nest etc.). Fixed positioning still lets it escape the
      // rail's overflow. This mirrors how the React component renders it.
      root.appendChild(tipEl)
    }
    tipEl.textContent = label
    const r = el.getBoundingClientRect()
    tipEl.style.left = `${r.right + 10}px`
    tipEl.style.top = `${r.top + r.height / 2}px`
    tipEl.style.opacity = '1'
  }
  const hideTip = () => { if (tipEl) tipEl.style.opacity = '0' }
  root.addEventListener('pointerover', showTip)
  root.addEventListener('focusin', showTip)
  root.addEventListener('pointerleave', hideTip)
  root.addEventListener('focusout', hideTip)

  /* --- teardown ----------------------------------------------------------- */
  const destroy = () => {
    if (collapseBtn) collapseBtn.removeEventListener('click', onCollapse)
    root.removeEventListener('click', onClick)
    root.removeEventListener('pointerover', showTip)
    root.removeEventListener('focusin', showTip)
    root.removeEventListener('pointerleave', hideTip)
    root.removeEventListener('focusout', hideTip)
    tipEl?.remove()
    tipEl = null
    root.__vdsMenuBound = false
  }

  return { root, setCollapsed, setActive, destroy }
}

/* Auto-init every .vds-sidenav already on the page. Runs whether this file is
   included as <script type="module" src>… or imported by a bundler. It is safe
   and idempotent (each nav binds once), so in a framework you can still import
   { initSideNav } and call it yourself for menus added later. */
if (typeof document !== 'undefined') {
  const boot = () => document.querySelectorAll('.vds-sidenav').forEach(initSideNav)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
}
