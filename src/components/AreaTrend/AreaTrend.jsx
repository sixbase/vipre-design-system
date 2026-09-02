import { useCallback, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useThemeTick, readVar, hexToRgba, attachTipDismiss, tooltipShell, tooltipSwatch, TOOLTIP_TYPE } from './chartTokens.js'

/* ── Why this much of ECharts and no more ─────────────────────────────────────
   Registered à la carte, same as Donut: core + LineChart + Grid + Tooltip +
   CanvasRenderer. Everything else — legend, toolbox, dataZoom, markLine — is
   deliberately absent rather than merely unused, so one trend line doesn't drag
   the whole library into the bundle. */
echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

/* ── What "minimal" means here, concretely ────────────────────────────────────
   Every default this chart turns OFF is a decision, so they're listed rather
   than left as absences to rediscover:

     · No axis LINES and no ticks. The plot is a shape read left to right; a box
       drawn round it adds two rules that carry nothing. What's left is three
       faint horizontal splitLines, which are the only chrome that actually helps
       you judge a height.
     · No point markers at rest. Twelve dots on twelve points is twelve pieces of
       ink saying what the line already says; the marker appears under the
       pointer instead, where it's answering a question.
     · No y-axis zero. The series is a book of seats that never approaches zero,
       so anchoring the axis there would flatten a year of movement into a band
       at the top of the plot. `scale: true` fits the axis to the data — the
       figure above the chart carries the magnitude.
     · A gradient that lands at fully transparent, not at a pale tint. A fill
       with a hard bottom edge reads as a second series; one that dissolves reads
       as weight under the line, which is all an area fill is for.

   The tooltip is the one place detail is welcome, because it's the only place
   the reader has asked for it. */

/**
 * AreaTrend — a single-series area chart with a crosshair tooltip.
 *
 * @param {Array<{label: string, value: number}>} data  Ordered oldest → newest.
 * @param {string}   [colorVar]   Token to draw in. Resolved per theme.
 * @param {number}   [height]     Plot height in px.
 * @param {Function} [format]     Value formatter for the tooltip — exact figures.
 * @param {Function} [axisFormat] Value formatter for the y axis — see below.
 * @param {string}   [valueLabel] What one point IS ("seats under management").
 * @param {boolean}  [bare]       Micro variant: plot only. See below.
 */
/* ── `bare`, and why it's a flag rather than a second component ────────────────
   The KPI cards carry the same twelve months as the card below them, at 44px and
   about a fifth of the width. At that size every piece of chrome the full chart
   earns stops paying: three gridlines in 44px are a hatch, six month labels under
   a 200px plot are a smear, and a y axis costs a third of the width to say what
   the hero figure already says in 28px type.

   So `bare` strips the plot to the line, the fill and the crosshair — and keeps
   the tooltip, because the tooltip is the only part that costs nothing until it's
   wanted. One component and not two, because the things that MUST match between
   the strip and the chart below it are exactly the things a second implementation
   would drift on: the easing, the gradient stops, the smoothing, the shape of the
   tooltip. Density is the only difference, so density is the only prop. */
/* The axis and the tooltip round differently ON PURPOSE. An axis label is a ruler: you
   read it to place a height, and "48K" does that in half the ink of "48,000" — four
   labels of exact figures turn the left edge into a column of numbers competing with
   the line. The tooltip is the opposite: it exists because someone asked for one point,
   and the answer to that should be the actual seat count, not a rounding of it. */
const axisCompact = (n) =>
  n >= 1e6 ? `${Math.round(n / 1e5) / 10}M` : n >= 1e4 ? `${Math.round(n / 1e2) / 10}K` : n.toLocaleString()

/* EXACTLY THREE RUNGS: a floor, a ceiling and the middle.

   `splitNumber` is a hint, not an instruction — ECharts weighs it against finding a round
   interval and will happily return seven ticks for a plot 130px tall, which is what this
   axis was doing (50K 60K 70K 80K 90K 100K 110K behind a single curve). Setting min, max
   and interval by hand is the only way to actually get three, so this picks a round step
   big enough that two of them span the data, and floors the baseline onto it.

   Nice steps only (1 / 2 / 2.5 / 5 × a power of ten), so the labels stay numbers a person
   would say out loud, and the step doubles rather than shrinking the padding if the data
   won't fit inside two of them. */
function threeRungScale(values) {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null
  // A flat series still needs a scale, or the line sits on the floor with no room above.
  if (hi === lo) {
    const s = Math.max(1, Math.abs(hi) || 1)
    return { min: lo >= 0 ? Math.max(0, hi - s) : hi - s, max: hi + s, interval: s }
  }
  const pad = (hi - lo) * 0.15
  const target = (hi - lo + pad * 2) / 2
  const mag = 10 ** Math.floor(Math.log10(target))
  let step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= target) || mag * 10
  const floorTo = (s) => {
    const m = Math.floor((lo - pad) / s) * s
    // Never dip under zero for counts — a mail volume axis starting at −10K is nonsense.
    return lo >= 0 && m < 0 ? 0 : m
  }
  let min = floorTo(step)
  for (let i = 0; i < 12 && min + step * 2 < hi; i += 1) {
    step *= 2
    min = floorTo(step)
  }
  return { min, max: min + step * 2, interval: step }
}

/* ---- The shape floor ---------------------------------------------------------------
   A TREND IS A SHAPE, and a shape needs height. Every plot here is given a height in
   pixels and a width by whatever tile it landed in — which means the same chart is
   well-proportioned in one tile and a hairline in another, and nothing in the code says
   so. Trials is the case that proved it: 38px tall, correct beside a 573px row-mate, and
   drawn across 1043px the moment the tile went full width. 27:1. A twelve-month series
   with real movement in it renders as a straight line at that ratio.

   So height stops being a fixed number and becomes a FLOOR expressed as a ratio: a plot
   may never be flatter than MAX_RATIO, whatever it was asked for.

   6:1 is read off the charts that already work rather than picked. The family runs 2.4:1
   (an analytics figure plot) through 4.2:1 (a hero trend) to 6.8:1 (a KPI spark on a
   three-up strip) — and 6.8 is the flattest anyone has called acceptable. 6 sits just
   inside it, so every chart that reads well today keeps the height it has and only the
   ones past the line move.

   BOUNDS on both ends. MIN_H is the smallest a bare spark can be and still show a shape;
   MAX_H stops a 1400px hero from claiming a third of the fold to say one thing.

   It is a MINIMUM, not an assignment: a caller asking for 160 gets 160 until the ratio
   asks for more. Nothing here shrinks a chart. */
const MAX_RATIO = 6
const MIN_H = 44
const MAX_H = 200
const fitHeight = (asked, w) =>
  !w ? asked : Math.min(MAX_H, Math.max(asked, MIN_H, Math.round(w / MAX_RATIO)))

export function AreaTrend({
  data,
  colorVar = '--vds-azure-500',
  height = 220,
  format = (n) => n.toLocaleString(),
  axisFormat = axisCompact,
  valueLabel = '',
  bare = false,
}) {
  const host = useRef(null)
  const chartRef = useRef(null)
  const lastW = useRef(0)
  const lastH = useRef(0)
  const theme = useThemeTick()
  /* Only for the pixel case. A caller can also hand this a CSS length — Trials passes
     '100%' so the plot takes a flex row's slack — and there the box's height isn't ours
     to compute; its floor is CSS's job (see .msp-sell-spark). */
  const fixed = typeof height === 'number'
  const [plotH, setPlotH] = useState(height)
  /* Measuring the box we just sized would loop, except that it can't: the input is the
     WIDTH, and setting a height doesn't change it. A second callback recomputes the same
     number and setState bails. */
  /* Memoised on the two things it actually reads, so it can be a dependency of the chart
     effect without rebuilding the canvas on every render. */
  const applyFit = useCallback((w) => {
    if (!fixed) return
    const next = fitHeight(height, w)
    setPlotH((prev) => (prev === next ? prev : next))
  }, [fixed, height])

  useEffect(() => {
    const el = host.current
    if (!el || !data?.length) return
    const chart = echarts.init(el, null, { renderer: 'canvas' })

    const accent = readVar(el, colorVar) || '#0596d2'
    const line = readVar(el, '--vds-line')
    const inkSubtle = readVar(el, '--vds-ink-subtle')
    const surface = readVar(el, '--vds-surface') || '#fff'
    /* The fill is the accent faded to nothing. hexToRgba hands back its input when the
       token isn't a hex — so if a palette step ever becomes oklch()/color(), the top stop
       would be the flat, opaque accent and the plot would fill with a solid slab. The
       guard: when parsing didn't happen, fade with `transparent` and carry the alpha on
       areaStyle instead. Same picture, no silent block of colour. */
    const rungs = bare ? null : threeRungScale(data.map((d) => d.value))
    const fillTop = hexToRgba(accent, 0.22)
    const parsed = fillTop !== accent
    const fillBottom = parsed ? hexToRgba(accent, 0) : 'transparent'

    chart.setOption({
      animationDuration: 700,
      animationEasing: 'cubicOut',
      /* Tight, and asymmetric on purpose: the left inset is the widest y label,
         the right is half an x label so the last month isn't clipped, and the
         bottom is one line of labels. No title, so the top only clears the
         highest point's hover ring.

         Bare has no labels to contain, so it's full bleed but for 3px of air top
         and bottom — the stroke is 1.5 wide and centred on the value, so a peak
         at the very top of the range would otherwise be shaved in half. */
      /* ROOM FOR THE HOVER BEAD. The insets used to be sized for the LINE — 3px, which is
         all a 1.5px stroke centred on the value needs to avoid being shaved at a peak. The
         bead is much bigger than the line: 9px scaled 1.5 with a 3px ring is about 17px
         across, so a marker on the series maximum had its top third cut off by the plot
         edge, and one on the first or last point lost a side.

         Half the bead, near enough, on every side. It costs a few pixels of plot height
         and buys a marker that is never clipped wherever it lands. Paired with `clip:
         false` on the series below, which stops the grid rect itself doing the cutting. */
      grid: bare
        ? { top: 10, left: 8, right: 8, bottom: 10, containLabel: false }
        : { top: 16, left: 4, right: 10, bottom: 4, containLabel: true },
      tooltip: {
        trigger: 'axis',
        // A dashed vertical rule, no shadow band: the band highlights a slab of
        // the plot and reads as a selection; the rule just says "here".
        axisPointer: {
          type: 'line',
          // Drawn in the LINE colour but at full strength, and behind the marker: the rule
          // says which column you're on, the bead says which reading. At --vds-line the
          // rule was invisible over the area fill, which left the marker doing both jobs.
          lineStyle: { color: readVar(el, '--vds-line-strong') || line, width: 1, type: [4, 4] },
          // Snap the label off — the date is already the tooltip's first line.
          label: { show: false },
        },
        // ECharts' own tooltip chrome off entirely, replaced by DS markup below.
        // The tooltip is a DOM node, so it CAN use var(--vds-…) directly.
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        extraCssText: 'box-shadow:none;',
        appendToBody: true,
        /* Zero, because the default 100ms hide TIMER is how tooltips got stuck on the
           page: dispose a chart inside that window (a tile remount under the cursor) and
           the timer dies with it, leaving the <body>-appended node visible with nothing
           left alive to hide it. At 0 the hide is synchronous, so the pre-dispose hideTip
           in attachTipDismiss's cleanup actually lands. */
        hideDelay: 0,
        formatter: (params) => {
          const p = Array.isArray(params) ? params[0] : params
          const i = p.dataIndex
          const prev = i > 0 ? data[i - 1].value : null
          const diff = prev == null ? null : data[i].value - prev
          const pct = prev ? Math.round((diff / prev) * 1000) / 10 : null
          // Direction, not judgement: this component doesn't know whether a fall
          // is bad, so the arrow follows the sign and the colour stays ink.
          const arrow = diff == null ? '' : diff > 0 ? '↑' : diff < 0 ? '↓' : '→'
          const deltaRow =
            diff == null
              ? ''
              : `<div style="display:flex;justify-content:space-between;gap:var(--vds-space-4);padding-top:6px;border-top:1px solid var(--vds-line-subtle)">
                   <span style="color:var(--vds-ink-subtle)">vs ${data[i - 1].label}</span>
                   <span style="color:var(--vds-ink-muted);font-variant-numeric:tabular-nums">${arrow} ${format(Math.abs(diff))}${pct == null ? '' : ` (${pct > 0 ? '+' : ''}${pct}%)`}</span>
                 </div>`
          // The CARD is shared with SegmentTrend (see tooltipShell); only this body is ours.
          return tooltipShell(`
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:var(--vds-space-1)">
              ${tooltipSwatch(accent)}
              <span style="font-size:${TOOLTIP_TYPE.title};font-weight:600;color:var(--vds-ink)">${p.axisValueLabel}</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:var(--vds-space-4);margin-bottom:${deltaRow ? '6px' : '0'}">
              <span style="font-size:${TOOLTIP_TYPE.hero};font-weight:600;color:var(--vds-ink);font-variant-numeric:tabular-nums">${format(p.value)}</span>
              ${valueLabel ? `<span style="align-self:flex-end;color:var(--vds-ink-muted)">${valueLabel}</span>` : ''}
            </div>
            ${deltaRow}`)
        },
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.label),
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        /* Every other month, and fewer than that if even those collide. `interval: 1`
           sets the ceiling — twelve labels at 11px are a smear well before the card
           gets narrow, and a trend line doesn't need every tick named to be read.
           `hideOverlap` is the floor: in a 5-track cell on a phone there isn't room
           for six either, and ECharts drops them rather than overprinting. Without
           it the axis renders "NovMarJul" as one word. */
        /* EVERY FOURTH MONTH. At `interval: 1` a twelve-month series printed six labels —
           Aug Oct Dec Feb Apr Jun — which is a date ruler under a shape whose job is the
           shape. Three or four anchors is all anyone reads off a trend, and the tooltip
           carries the exact month for the point you actually care about. */
        axisLabel: bare
          ? { show: false }
          : { color: inkSubtle, fontSize: 11, fontFamily: 'inherit', interval: 3, hideOverlap: true, margin: 12 },
      },
      /* The floor, the ceiling and the middle — see threeRungScale for why the bounds are
         computed rather than asked for. Only the labelled axis takes them: a bare
         sparkline has nothing to line up with, and letting it auto-scale keeps its spikes
         at full height instead of padding them flat. */
      yAxis: {
        type: 'value',
        ...(bare || !rungs ? { scale: true } : rungs),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: bare
          ? { show: false }
          : { color: inkSubtle, fontSize: 11, fontFamily: 'inherit', formatter: axisFormat, margin: 10 },
        splitLine: bare ? { show: false } : { lineStyle: { color: line, width: 1 } },
      },
      series: [
        {
          type: 'line',
          /* ABOVE THE AXIS POINTER — and the number has to clear 50, not 10.

             The dashed rule was crossing over the top of the hover bead: a line drawn
             through the middle of the very marker it points at. The rule locates the
             column, the bead is the reading, and the reading goes on top.

             The first attempt used z: 12 on the assumption the pointer sat at z 10. It
             doesn't — ECharts' axisPointer component defaults to z: 50, so 12 was still
             underneath it and nothing visibly changed. 60 clears it with room to spare.
             (z, not zlevel: zlevel would put the series on its own canvas layer, which
             costs a second canvas per chart and would paint the area fill over the rule
             as well.) */
          z: 60,
          /* A line series clips to the grid rect by default, which decapitates a hover
             bead sitting on the highest point. The line itself never leaves the rect, so
             there is nothing else here for clipping to protect against. */
          clip: false,
          data: data.map((d) => d.value),
          /* SHARP at micro size, gently curved at full size — and the reason isn't
             taste, it's that smoothing is a claim about data you don't have.

             A spline through twelve monthly points invents every value between them
             and, at 0.35, overshoots past the real minimum and maximum on any sharp
             turn. At 220px that's forgivable: the axis, the gridlines and the hover
             marker are all there to check it against, and the curve reads as the shape
             of a year rather than as twelve readings.

             At 34px in a table row there is nothing to check it against — no axis, no
             labels, no room to inspect a point — so the curve stops being a reading aid
             and becomes the only thing on offer, rounded into a blob that says "roughly
             upward" whatever the series did. A polyline through the actual points is
             both sharper to look at and the more honest of the two. */
          smooth: bare ? 0 : 0.35,
          // Just past a hairline: thin enough to stay quiet, thick enough that
          // the gradient underneath doesn't swallow it. Bare drops to 1.5 and a
          // smaller marker — the plot is a fifth of the width, so the same stroke
          // would read twice as heavy against it.
          lineStyle: { color: accent, width: bare ? 1.5 : 1.75 },
          showSymbol: false,
          symbol: 'circle',
          symbolSize: bare ? 8 : 9,
          /* THE HOVER MARKER, and it is deliberately loud.

             It used to be a 6px dot with a 2.5px ring and `scale: false` — the same size
             resting as hovered, which on a 30-point daily series put a marker barely wider
             than the line it sat on. The tooltip told you which day you were on; the plot
             did not, so the eye had to hold the tooltip's date and hunt for the point.

             Now: a larger dot with a thick ring in the tile's own ground, so it reads as a
             bead sitting ON the line rather than a hole punched through it, scaled up
             again on emphasis.

             NO shadowBlur. A soft accent halo was the obvious way to make the bead carry
             against a busy area fill, and it is the one thing that cannot be done here:
             ECharts repaints the region the symbol occupies, the blur paints OUTSIDE that
             region, and what is left behind is a grey smear along the whole path the
             pointer took. Contrast has to come from geometry — size, and a ring wide
             enough to cut the bead out of whatever is behind it. */
          emphasis: {
            scale: 1.5,
            itemStyle: {
              color: accent,
              borderColor: surface,
              borderWidth: 3,
            },
          },
          areaStyle: {
            opacity: parsed ? 1 : 0.22,
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
              { offset: 0, color: fillTop },
              { offset: 1, color: fillBottom },
            ] },
          },
        },
      ],
      backgroundColor: 'transparent',
    })

    /* A canvas is sized IMPERATIVELY, so it can fall out of step with the box CSS gave
       it. ResizeObserver is the right primary signal: it catches a tile reflowing when
       nothing about the window changed, which is most of what happens here — the nav rail
       collapsing, a drawer opening, a tile moving between grid rows.

       The window listener and the per-render check below are backups, not replacements.
       They cost an integer compare and they close the gap if a single RO callback is ever
       missed or delivered late, which matters because a stale canvas isn't cosmetic: it
       used to set the intrinsic width of its ancestors, so one under-sized plot could
       push a 1195px tile to 1293 and break the grid. The wrapper in the render below now
       makes that specific failure impossible; these keep the PICTURE correct. */
    /* Deferred a frame, deliberately: a `resize` event can fire before the CSS reflow it
       triggers has settled, and resizing synchronously would read the tile's OLD width.
       One rAF puts the read after layout. Coalesced, so a drag that fires fifty resize
       events still costs one chart resize per frame. */
    let raf = 0
    const resize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        // Height first: the chart should be resized once, to its final box.
        applyFit(el.clientWidth)
        lastW.current = el.clientWidth
        lastH.current = el.clientHeight
        chart.resize()
      })
    }
    chartRef.current = chart
    lastW.current = el.clientWidth
    lastH.current = el.clientHeight
    applyFit(el.clientWidth)
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    window.addEventListener('resize', resize)

    /* DISMISS THE TOOLTIP ON SCROLL, and listen in the CAPTURE phase.

       The tooltip is appended to <body> so it can escape the tile's bounds, which means
       nothing about the tile clips it or takes it away. ECharts hides it on mouseout — but
       scrolling the page out from under a stationary cursor fires no mouseout, so the
       tooltip is simply left behind, pinned at the coordinates it opened at. Scroll
       through a page of trend charts and you collect one per chart you passed.

       `capture: true` matters: scroll events don't bubble, and the thing that actually
       scrolls here is the dashboard canvas, not the window. Capturing at the window sees
       every scroll in the tree, whichever element produced it. */
    // Keeps this tooltip from stranding when the page scrolls under a stationary
    // cursor — the whole story is in attachTipDismiss.
    const detachTip = attachTipDismiss(chart, el)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resize)
      detachTip()
      chart.dispose()
      chartRef.current = null
    }
    // `theme` is a dependency on purpose: a light/dark flip has to rebuild the
    // canvas with newly resolved tokens (see useThemeTick).
  }, [data, colorVar, format, axisFormat, valueLabel, bare, theme, applyFit])

  /* The cheapest of the three signals, and the one that needs no browser cooperation.

     Every layout change that matters here is driven by a React render — the rail
     collapsing, the drawer opening, a tile changing span. Comparing the host's width
     after each render therefore catches those directly, without depending on an RO
     callback arriving or a resize event firing.

     Deliberately no dependency array (it must run on EVERY render), and guarded on a real
     size change, so the common case is two integer compares and nothing else.

     HEIGHT IS CHECKED TOO, and it wasn't always. While every plot was given a height in
     pixels, the box's height was this component's own output and could only change when
     the width did — so watching the width was watching both. That stopped being true the
     moment a caller could pass `height="100%"` and let a flex row decide (see the seats
     trend, which now takes its row-mate's slack as plot height): the tile's width holds
     steady and the box grows 140px underneath a canvas that is still 160 tall, leaving
     the line drawn across the top third of an empty plot. */
  useEffect(() => {
    const el = host.current
    const chart = chartRef.current
    if (!el || !chart) return
    const w = el.clientWidth
    const h = el.clientHeight
    if ((w && w !== lastW.current) || (h && h !== lastH.current)) {
      lastW.current = w
      lastH.current = h
      // The width changed, so the shape floor may have too — see fitHeight.
      applyFit(w)
      chart.resize()
    }
  })

  /* The canvas is taken OUT of flow: the wrapper owns the box the layout gave it, and the
     ECharts host fills it absolutely. That inverts the dependency — the plot can no longer
     contribute intrinsic width, so however stale the canvas is, it can only ever be
     clipped, never widen its parent. Before this, a 281px canvas inside a 162px cell made
     the cell report 281 and every ancestor grew with it. */
  return (
    <div className={bare ? 'vds-area vds-area--bare' : 'vds-area'} style={{ height: fixed ? plotH : height }}>
      <div ref={host} className="vds-area__canvas" />
    </div>
  )
}
