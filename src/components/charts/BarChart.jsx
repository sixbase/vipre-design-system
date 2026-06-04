import { forwardRef } from 'react'
import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { cx } from '../../lib/cx.js'
import { AXIS, GRID, ChartTooltip, resolveColor, LEGEND_STYLE } from './chartTheme.jsx'

/**
 * BarChart — token-themed recharts bar chart.
 *
 * Props:
 * - data:    array of row objects
 * - xKey:    the category key on each row (x axis)
 * - series:  [{ key, name?, color? }] — one bar series per entry
 * - height:  px (default 240)
 * - stacked: stack the bars (default false)
 * - legend:  show the legend (default false)
 *
 * @example
 * <BarChart data={rows} xKey="month" series={[{ key: 'added', name: 'Added' }, { key: 'churned', name: 'Churned' }]} />
 */
export const BarChart = forwardRef(function BarChart(
  { data = [], xKey, series = [], height = 240, stacked = false, legend = false, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx('vds-chart', className)} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <RBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey={xKey} {...AXIS} />
          <YAxis {...AXIS} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--vds-primary-soft)' }} />
          {legend && <Legend wrapperStyle={LEGEND_STYLE} />}
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name || s.key}
              fill={resolveColor(s, i)}
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
})

BarChart.displayName = 'BarChart'
