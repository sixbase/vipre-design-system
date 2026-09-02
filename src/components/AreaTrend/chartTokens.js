/* ── Shared plumbing for the dashboard's ECharts canvases ─────────────────────
   ECharts draws to a 2D context, and a canvas knows nothing about `var(--vds-…)`.
   Every chart on this dashboard therefore has the same two problems — resolve the
   design tokens to real values, and redo that whenever the theme flips — so they
   live here once rather than once per chart.

   The tooltips are the exception and stay in each chart: those are DOM nodes, so
   they can use the custom properties directly and need none of this. */

import { useEffect, useState } from 'react'

/* Re-render on a light/dark flip. Watches the class attribute on <html>, which is
   what App.jsx actually toggles — so this can't drift out of step with however the
   toggle ends up wired. The returned number is meaningless on its own; it exists to
   be a dependency, so a chart effect re-runs and re-reads its colours. */
export function useThemeTick() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const obs = new MutationObserver(() => setTick((t) => t + 1))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return tick
}

/* ---- Tooltip dismissal ---------------------------------------------------------
   Every ECharts tooltip on this dashboard is `appendToBody: true`, so it can escape the
   tile it belongs to instead of being clipped by it. The cost is that the tooltip is no
   longer a child of anything that scrolls: when the tile slides out from under a
   STATIONARY cursor, no mouseout fires, ECharts never hides the tip, and it stays pinned
   to the page at the coordinates it was born at. Scroll a page of eighteen charts and you
   collect eighteen of them.

   A stranded tooltip is not only ugly — it makes the PAGE longer. The node is a
   position:absolute child of <body> placed with a transform, so it counts toward the
   document's scrollable overflow: one stray tip 1400px down grew the document from 720 to
   1498 and let you scroll most of a screen past the end of the app. (Measured. The shell
   is exactly viewport-height, so every one of those pixels was empty.) index.css now locks
   the document as well, which is belt to this braces — but the tooltip is the cause and
   this is where it gets fixed.

   Three earlier attempts each got part of it:

     1. hideTip on every chart on every scroll event. Correct, and it repainted every
        canvas on the page dozens of times a second — the flicker.
     2. The same, gated behind an `armed` flag that a dismissal cleared. That killed the
        flicker and reopened the leak: `armed` went false on the first scroll, but the
        cursor was still sitting on the chart, so ECharts happily re-showed the tip on its
        next internal render and nothing was left willing to hide it.
     3. `armed` cleared only by pointerleave. Better, and still a heuristic about the
        POINTER standing in for a fact about the TOOLTIP. Anything that shows a tip
        without the host seeing a pointermove first — a re-show landing after
        pointerleave, a tip that outlives the pointer, touch — is invisible to it, and an
        unarmed chart is never swept. That is the artifact still on screen.

   ---- What this does instead ----
   Ask the question that actually matters: IS A TOOLTIP VISIBLE RIGHT NOW? Every one of
   them is an absolutely-positioned child of <body>, and ECharts hides one by setting
   `visibility:hidden` and `opacity:0` on it — so "is anything showing" is a cheap look at
   a handful of body children, needing no pointer bookkeeping and no ECharts internals.

   Test VISIBILITY, not size. A hidden tooltip keeps its box: `visibility:hidden` leaves
   offsetHeight at its full 98px, so a height test reads "showing" forever and would sweep
   on every frame of every scroll — attempt 1's flicker, reintroduced through the back
   door. (It also means a hidden tip still occupies layout where it last stood, which is
   the other half of why index.css locks the document.)

   On scroll: if nothing is showing (overwhelmingly the common case) do nothing at all, so
   attempt 1's flicker cannot come back. If something IS showing, sweep hideTip across
   every live chart. The sweep runs once and then nothing is showing, so it costs one
   dispatch per scroll gesture rather than one per event — and because it asks about
   tooltips rather than about pointers, it cannot be defeated by a chart the pointer
   bookkeeping never armed. */
const liveCharts = new Set()
let dismissScheduled = false
let scrollBound = false

/* Is any <body>-level tooltip node visible? Only body's direct children are examined —
   there are a couple of dozen at most, and this runs once per animation frame at the very
   worst. `visibility` and `opacity` are what ECharts actually toggles; height is not (see
   above), so height is not consulted. */
function anyTipVisible() {
  for (const node of document.body.children) {
    if (node.tagName !== 'DIV') continue
    const cs = getComputedStyle(node)
    if (cs.position !== 'absolute') continue
    if (cs.visibility !== 'hidden' && cs.opacity !== '0') return true
  }
  return false
}

function dismissAll() {
  dismissScheduled = false
  if (!anyTipVisible()) return
  liveCharts.forEach((chart) => {
    // A chart disposed between the scroll and the frame is not an error, just gone.
    if (!chart.isDisposed || !chart.isDisposed()) chart.dispatchAction({ type: 'hideTip' })
  })
}

function onScrollCapture() {
  if (dismissScheduled || liveCharts.size === 0) return
  dismissScheduled = true
  requestAnimationFrame(dismissAll)
}

/**
 * Keep `chart`'s tooltip from stranding when the page scrolls under the cursor.
 * Call inside the chart's effect; the returned function is the cleanup.
 *
 * @param {object} chart  an initialised ECharts instance
 * @param {HTMLElement} el  the chart's host element
 * @returns {() => void} cleanup
 */
export function attachTipDismiss(chart, el) {
  liveCharts.add(chart)

  /* Still worth hiding the moment the pointer leaves, rather than waiting for a scroll:
     it's the common, deliberate way out of a chart and it should feel immediate. This is
     now a nicety on top of a guarantee, though, not the mechanism the guarantee rests on. */
  const leave = () => {
    if (!chart.isDisposed || !chart.isDisposed()) chart.dispatchAction({ type: 'hideTip' })
  }
  el.addEventListener('pointerleave', leave)
  el.addEventListener('mouseleave', leave)

  /* One set of listeners for the whole page, captured at the window: scroll does not
     bubble, and the scroller here is the dashboard canvas rather than the document.

     `wheel` as well as `scroll`, deliberately. They cover each other's gaps: wheel fires
     the moment the user turns the wheel or swipes the trackpad, before the scroll has
     happened, and it fires even when the container turns out not to scroll; `scroll`
     covers the paths wheel never sees — dragging the scrollbar, Page Down, and anything
     that moves the container programmatically. Belt and braces on purpose: this bug has
     already been "fixed" three times, and the failure mode is a tooltip stuck on the page. */
  if (!scrollBound) {
    window.addEventListener('scroll', onScrollCapture, true)
    window.addEventListener('wheel', onScrollCapture, { capture: true, passive: true })
    scrollBound = true
  }

  return () => {
    el.removeEventListener('pointerleave', leave)
    el.removeEventListener('mouseleave', leave)
    /* Drop it from the registry BEFORE the caller disposes, and hide first: a tooltip
       showing at the moment its chart is disposed is the other way one of these gets
       orphaned in <body> with nothing left alive to hide it.

       This also only works because every tooltip here sets `hideDelay: 0`: ECharts hides
       its HTML tooltip on a timer otherwise, and chart.dispose() on the next line kills
       the timer before it fires — which leaves the <body>-level node visible forever.
       That was the stuck-popup bug, verified live. */
    liveCharts.delete(chart)
    if (!chart.isDisposed || !chart.isDisposed()) {
      chart.dispatchAction({ type: 'hideTip' })
    }
  }
}

/* Resolved value of a custom property, read from the chart's own element so it picks
   up any scope that redefines the token above it. */
export const readVar = (el, name) => getComputedStyle(el).getPropertyValue(name).trim()

/* `#rrggbb` (or `#rgb`) → `rgba(…)`, for gradient stops and soft fills.
   Returns the input untouched if it isn't a hex — the palette tokens are all hex
   today, but a token that turns into oklch() shouldn't silently become black. The
   caller can still fall back to areaStyle.opacity in that case. */
export function hexToRgba(hex, alpha) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim())
  if (!m) return hex
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/* ── The tooltip shell, shared by every chart in the shell ─────────────────────
   ECharts tooltips are HTML STRINGS, which is the whole problem: there is no class to
   put them in and no stylesheet that reaches them, so every chart ends up carrying its
   own copy of the card's geometry inline. AreaTrend and SegmentTrend had exactly that —
   two independent copies of `padding:10px 12px; border-radius:10px; font-size:11px;
   background:var(--vds-surface-overlay); border:1px solid var(--vds-line); box-shadow:…`
   — and they had already drifted by a `min-width` and a `line-height` before anyone
   noticed, because nothing makes two inline strings disagree loudly.

   So the SHELL is shared and the BODY is not. The two charts genuinely say different
   things inside the card (one value and its change; or one row per plotted series), and
   forcing those into one signature would be the wrong kind of reuse. What they have no
   business disagreeing about is what a tooltip looks like.

   Everything that has a DS token uses it. The three that don't are named here rather than
   scattered: see TOOLTIP_TYPE for the type sizes (the DS has no type scale yet) and
   TOOLTIP_RADIUS for the corner (the DS radius ramp jumps 8 → 12 and this sits between).
   One place to change them, and one place to delete from when the DS grows the tokens. */

// DS GAP: no type-scale tokens exist, so chart type is stated here rather than inline
// in two components. Sizes match the app's own micro-label ramp (see LABEL/CAPTION in
// kpiTile.jsx) — if those move, these move with them.
export const TOOLTIP_TYPE = { body: '11px', title: '12px', hero: '15px' }
// DS GAP: --vds-radius-md is 8px and --vds-radius-lg is 12px; an overlay this small wants
// the step between them. Kept as one constant so both charts round identically.
export const TOOLTIP_RADIUS = '10px'

/** The 8px identity chip that precedes a series name or a title. */
export const tooltipSwatch = (color) =>
  `<span style="width:8px;height:8px;border-radius:var(--vds-radius-sm);background:${color};flex:none"></span>`

/**
 * Wrap a tooltip body in the shared card.
 * @param {string} body     inner HTML
 * @param {{minWidth?: number}} opts
 */
export const tooltipShell = (body, { minWidth = 184 } = {}) => `
  <div style="min-width:${minWidth}px;padding:var(--vds-space-2) var(--vds-space-3);
              border-radius:${TOOLTIP_RADIUS};font-family:var(--vds-font-sans);
              font-size:${TOOLTIP_TYPE.body};line-height:1.5;
              background:var(--vds-surface-overlay);border:1px solid var(--vds-line);
              box-shadow:var(--vds-shadow-md)">${body}</div>`
