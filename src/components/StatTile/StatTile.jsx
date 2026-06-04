import { forwardRef } from 'react'
import { cx } from '../../lib/cx.js'
import { Surface } from '../Surface/Surface.jsx'
import { Icon } from '../Icon/Icon.jsx'
import { Sparkline } from '../Sparkline/Sparkline.jsx'

/**
 * StatTile
 *
 * A KPI tile. A prominent tabular value with a label, optional icon, optional
 * delta (e.g. a Badge), and an optional `trend` sparkline. `tone` colors the
 * value/icon/trend for threshold states; `size` scales the value; `layout`
 * switches between a stacked card and a compact row. Composes Surface + Icon +
 * Sparkline. Pass `onClick` to make it a drill-in button.
 *
 * Props:
 * - value:  the metric (string|number) — tabular-nums
 * - label:  the metric name
 * - icon:   optional leading icon component
 * - tone:   'default' | 'primary' | 'success' | 'warning' | 'danger'
 * - size:   'sm' | 'md' | 'lg'   (value size; default 'md')
 * - layout: 'stacked' | 'row'    (default 'stacked')
 * - delta:  node shown top-right (stacked) / right (row), e.g. a Badge
 * - trend:  number[] — renders a Sparkline tinted to match the tone
 * - onClick: makes the tile a button
 * - all Surface props pass through (padding, elevation, radius…)
 *
 * @example
 * <StatTile icon={Shield} value="1,192" label="Protected" tone="success" trend={[4,6,5,8,7,9]} />
 * <StatTile layout="row" size="sm" value="64%" label="Utilization" tone="warning" />
 */
export const StatTile = forwardRef(function StatTile(
  { value, label, icon, tone = 'default', size = 'md', layout = 'stacked', delta, trend, onClick, className, ...props },
  ref,
) {
  const interactive = typeof onClick === 'function'
  const sparkTone = tone === 'default' ? 'muted' : tone
  const hasTrend = Array.isArray(trend) && trend.length >= 2

  const iconEl = icon && (
    <span className="vds-stat__icon" aria-hidden="true">
      <Icon as={icon} size={size === 'lg' ? 'md' : 'sm'} />
    </span>
  )
  const deltaEl = delta != null && <span className="vds-stat__delta">{delta}</span>
  const valueEl = <span className="vds-stat__value">{value}</span>
  const labelEl = <span className="vds-stat__label">{label}</span>

  return (
    <Surface
      ref={ref}
      as={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      padding={size === 'lg' ? 5 : 4}
      className={cx(
        'vds-stat',
        `vds-stat--${layout}`,
        `vds-stat--size-${size}`,
        `vds-stat--${tone}`,
        interactive && 'vds-stat--interactive',
        className,
      )}
      {...props}
    >
      {layout === 'row' ? (
        <>
          {iconEl}
          <span className="vds-stat__body">
            {valueEl}
            {labelEl}
          </span>
          {hasTrend && <Sparkline className="vds-stat__spark" data={trend} tone={sparkTone} width={72} height={28} />}
          {deltaEl}
        </>
      ) : (
        <>
          {(iconEl || deltaEl) && (
            <span className="vds-stat__top">
              {iconEl}
              {deltaEl}
            </span>
          )}
          {valueEl}
          {labelEl}
          {hasTrend && <Sparkline className="vds-stat__spark" data={trend} tone={sparkTone} width={120} height={32} />}
        </>
      )}
    </Surface>
  )
})

StatTile.displayName = 'StatTile'
