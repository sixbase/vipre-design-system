import { forwardRef } from 'react'
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { cx } from '../../lib/cx.js'
import { AXIS, GRID, ChartTooltip, resolveColor, LEGEND_STYLE } from './chartTheme.jsx'

/**
 * LineChart — token-themed recharts line chart.
 *
 * Props:
 * - data:   array of row objects
 * - xKey:   the category key on each row (x axis)
 * - series: [{ key, name?, color? }] — one line per entry
 * - height: px (default 240)
 * - legend: show the legend (default false)
 *
 * @example
 * <LineChart data={rows} xKey="month" series={[{ key: 'p95', name: 'p95 latency' }]} />
 */
export const LineChart = forwardRef(function LineChart(
  { data = [], xKey, series = [], height = 240, legend = false, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx('vds-chart', className)} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey={xKey} {...AXIS} />
          <YAxis {...AXIS} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--vds-line-strong)' }} />
          {legend && <Legend wrapperStyle={LEGEND_STYLE} />}
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name || s.key}
              stroke={resolveColor(s, i)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  )
})

LineChart.displayName = 'LineChart'
