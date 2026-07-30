import { forwardRef, useEffect, useMemo, useRef } from 'react'
import * as echarts from 'echarts/core'
import { SankeyChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cx } from '../../lib/cx.js'

echarts.use([SankeyChart, TooltipComponent, CanvasRenderer])

// The categorical node palette, in a pleasant rotation. Each entry is a token
// NAME — we resolve it to a live hex at render time so the chart re-themes with
// the rest of the system (light ↔ dark) instead of baking a color in. Order is
// tuned so adjacent flows contrast; extend/replace via the `palette` prop.
const DEFAULT_PALETTE = [
  '--vds-accent-azure',
  '--vds-accent-emerald',
  '--vds-accent-amber',
  '--vds-accent-orchid',
  '--vds-accent-rose',
  '--vds-accent-harbor',
  '--vds-accent-clay',
  '--vds-accent-cobalt',
  '--vds-accent-purple',
  '--vds-accent-magenta',
  '--vds-accent-lime',
]

// Tone aliases so `palette={['primary','success',…]}` reads like the rest of the
// system. Anything already looking like a token (`--vds-…`) passes through.
const TONE_TOKEN = {
  primary: '--vds-primary',
  success: '--vds-success',
  warning: '--vds-warning',
  danger: '--vds-danger',
  muted: '--vds-ink-subtle',
}

const toToken = (name) =>
  name.startsWith('--') ? name : TONE_TOKEN[name] || `--vds-accent-${name}`

/**
 * Sankey
 *
 * A flow diagram built on Apache ECharts, themed entirely from `--vds-*` tokens
 * so it stays on-brand and flips with light/dark automatically. Nodes take the
 * categorical accent palette; links draw as a soft source→target gradient and
 * light up their whole path on hover.
 *
 * Props:
 * - data:      { nodes: {name}[], links: {source,target,value}[] } — the flow graph
 * - height:    number (px) of the drawing box                        (default 420)
 * - orient:    'horizontal' | 'vertical' — flow direction            (default 'horizontal')
 * - nodeAlign: 'justify' | 'left' | 'right' — terminal-node packing   (default 'justify')
 * - curveness: 0–1 link curvature                                     (default 0.5)
 * - palette:   string[] of token names or tone/accent aliases to color nodes
 * - valueFormatter: (value, name) => string — tooltip value text
 * - label:     accessible name for the chart (required for a11y)
 *
 * @example
 * <Sankey
 *   label="Scope coverage by product"
 *   data={{
 *     nodes: [{ name: 'Endpoints' }, { name: 'Covered' }, { name: 'At risk' }],
 *     links: [
 *       { source: 'Endpoints', target: 'Covered', value: 820 },
 *       { source: 'Endpoints', target: 'At risk', value: 140 },
 *     ],
 *   }}
 * />
 */
export const Sankey = forwardRef(function Sankey(
  {
    data,
    height = 420,
    orient = 'horizontal',
    nodeAlign = 'justify',
    curveness = 0.5,
    palette = DEFAULT_PALETTE,
    valueFormatter,
    label,
    className,
    style,
    ...props
  },
  ref,
) {
  const hostRef = useRef(null)
  const chartRef = useRef(null)
  const renderRef = useRef(() => {})
  // Keep the latest inputs in a ref so the theming effect can rebuild the option
  // on a dark-mode flip without tearing down and re-initing the chart instance.
  const cfg = useRef({})
  cfg.current = { data, orient, nodeAlign, curveness, palette, valueFormatter }

  const paletteTokens = useMemo(() => palette.map(toToken), [palette])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const chart = echarts.init(host, null, { renderer: 'canvas' })
    chartRef.current = chart

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Resolve a token to its live hex against the host (custom properties inherit,
    // so this picks up the current theme and any scoped override).
    const readVars = () => {
      const cs = getComputedStyle(host)
      const get = (t) => cs.getPropertyValue(t).trim()
      return {
        get,
        ink: get('--vds-ink') || '#0b192d',
        inkMuted: get('--vds-ink-muted'),
        line: get('--vds-line'),
        surface: get('--vds-surface') || '#ffffff',
        font: get('--vds-font-sans') || 'Rubik, sans-serif',
        radius: parseFloat(get('--vds-radius-sm')) * 16 || 4,
        // Tooltip is a DOM node (not canvas), so these stay as CSS strings.
        tooltipRadius: get('--vds-radius-md') || '0.5rem',
        shadow: get('--vds-shadow-lg') || '0 12px 28px -6px rgb(11 25 45 / 0.20)',
      }
    }

    const render = () => {
      const { data, orient, nodeAlign, curveness, palette, valueFormatter } = cfg.current
      if (!data || !data.nodes) return
      const v = readVars()
      const colors = palette.map((t) => v.get(t)).filter(Boolean)
      const colorOf = (name, i) => colors[i % colors.length] || v.ink
      const horizontal = orient !== 'vertical'

      const nodes = data.nodes.map((node, i) => ({
        ...node,
        itemStyle: {
          color: node.color ? v.get(toToken(node.color)) || node.color : colorOf(node.name, i),
          borderColor: v.surface,
          borderWidth: 1,
          borderRadius: v.radius,
        },
      }))

      chart.setOption(
        {
          textStyle: { fontFamily: v.font, color: v.ink },
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: v.surface,
            borderColor: v.line,
            borderWidth: 1,
            padding: [8, 12],
            textStyle: { color: v.ink, fontFamily: v.font, fontSize: 13 },
            extraCssText: `border-radius:${v.tooltipRadius}; box-shadow:${v.shadow};`,
            formatter: (p) => {
              const fmt = (val) => (valueFormatter ? valueFormatter(val, p.name) : val)
              if (p.dataType === 'edge') {
                return `<b>${p.data.source}</b> → <b>${p.data.target}</b><br/>${fmt(p.data.value)}`
              }
              return `<b>${p.name}</b>${p.value != null ? `<br/>${fmt(p.value)}` : ''}`
            },
          },
          series: [
            {
              type: 'sankey',
              orient,
              nodeAlign,
              // Reserve a right gutter so the last column's labels (drawn to the
              // right of each node) sit in open space instead of clipping the edge.
              left: horizontal ? '1%' : '3%',
              right: horizontal ? '12%' : '10%',
              top: 16,
              bottom: horizontal ? 16 : 28,
              nodeWidth: 14,
              nodeGap: 14,
              draggable: false,
              emphasis: { focus: 'adjacency' },
              data: nodes,
              links: data.links,
              label: {
                color: v.ink,
                fontFamily: v.font,
                fontSize: 13,
                fontWeight: 500,
                position: 'right',
              },
              lineStyle: {
                color: 'gradient',
                opacity: 0.42,
                curveness,
              },
              itemStyle: { borderWidth: 0 },
            },
          ],
          animationDuration: reduceMotion ? 0 : 700,
          animationEasing: 'cubicOut',
        },
        { notMerge: true },
      )
    }

    renderRef.current = render
    render()

    // Re-theme when the <html> theme class flips.
    const mo = new MutationObserver(render)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Keep the canvas sized to its container.
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(host)

    return () => {
      mo.disconnect()
      ro.disconnect()
      chart.dispose()
      chartRef.current = null
    }
    // Re-init only on structural inputs; theme + data changes flow through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Push data / option changes into the live instance without re-initing. cfg
  // already holds the fresh inputs; just re-run the render closure.
  useEffect(() => {
    if (chartRef.current) renderRef.current()
  }, [data, orient, nodeAlign, curveness, paletteTokens, valueFormatter])

  return (
    <div
      ref={ref}
      className={cx('vds-sankey', className)}
      style={{ height, ...style }}
      role="img"
      aria-label={label}
      {...props}
    >
      <div ref={hostRef} className="vds-sankey__canvas" />
    </div>
  )
})

Sankey.displayName = 'Sankey'
