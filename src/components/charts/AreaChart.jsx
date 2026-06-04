import { forwardRef } from 'react'
import {
  ResponsiveContainer,
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { cx } from '../../lib/cx.js'
import { AXIS, GRID, ChartTooltip, resolveColor, LEGEND_STYLE } from './chartTheme.jsx'

/**
 * AreaChart — token-themed recharts area chart.
 *
 * Props:
 * - data:    array of row objects
 * - xKey:    the category key on each row (x axis)
 * - series:  [{ key, name?, color? }] — one area per entry
 * - height:  px (default 240)
 * - stacked: stack the areas (default false)
 * - legend:  show the legend (default false)
 *
 * @example
 * <AreaChart data={rows} xKey="month" series={[{ key: 'added', name: 'Added' }]} />
 */
export const AreaChart = forwardRef(function AreaChart(
  { data = [], xKey, series = [], height = 240, stacked = false, legend = false, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx('vds-chart', className)} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <RAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey={xKey} {...AXIS} />
          <YAxis {...AXIS} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--vds-line-strong)' }} />
          {legend && <Legend wrapperStyle={LEGEND_STYLE} />}
          {series.map((s, i) => {
            const color = resolveColor(s, i)
            return (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name || s.key}
                stroke={color}
                fill={color}
                fillOpacity={0.15}
                strokeWidth={2}
                stackId={stacked ? 'stack' : undefined}
              />
            )
          })}
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  )
})

AreaChart.displayName = 'AreaChart'
