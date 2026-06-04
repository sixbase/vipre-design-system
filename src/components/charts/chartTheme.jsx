/* Shared chart theming — colors, axis/grid props, and a tokenized tooltip.
   Colors are CSS custom properties so series stay on-brand and the chrome
   (axes, grid) flips with light/dark. Consumed by Area/Bar/Line charts. */

// Categorical series palette (the OKLCH chromatic family, brand-first).
export const CHART_SERIES = [
  'var(--vds-azure-500)',
  'var(--vds-harbor-500)',
  'var(--vds-emerald-500)',
  'var(--vds-amber-500)',
  'var(--vds-rose-500)',
  'var(--vds-orchid-500)',
  'var(--vds-clay-500)',
]

export const resolveColor = (s, i) => s.color || CHART_SERIES[i % CHART_SERIES.length]

// Axis + grid styling, token-driven so they adapt per theme.
export const AXIS = {
  tickLine: false,
  axisLine: { stroke: 'var(--vds-line)' },
  tick: { fill: 'var(--vds-ink-muted)', fontSize: 11 },
  stroke: 'var(--vds-line)',
}

export const GRID = { stroke: 'var(--vds-line)', strokeDasharray: '3 3', vertical: false }

/* A tokenized tooltip card — replaces recharts' default white box. */
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="vds-chart__tooltip">
      {label != null && <div className="vds-chart__tooltip-label">{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey} className="vds-chart__tooltip-row">
          <span className="vds-chart__tooltip-dot" style={{ backgroundColor: p.color }} />
          <span className="vds-chart__tooltip-name">{p.name}</span>
          <span className="vds-chart__tooltip-value">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export const LEGEND_STYLE = { fontSize: 12, fontFamily: 'var(--vds-font-sans)', color: 'var(--vds-ink-muted)' }
