import { forwardRef } from 'react'
import { cx } from '../../lib/cx.js'
import { Surface } from '../Surface/Surface.jsx'
import { Icon } from '../Icon/Icon.jsx'

/**
 * StatTile
 *
 * A KPI tile: a big tabular value with a label, an optional leading icon in a
 * tinted box, and an optional delta slot (e.g. a Badge). `tone` colors the
 * value + icon for threshold states. Pass `onClick` to make it an interactive
 * button (hover + focus ring) for drill-in tiles.
 *
 * Composes Surface + Icon. Props:
 * - value:  the metric (string|number) — rendered tabular-nums
 * - label:  the metric name
 * - icon:   optional leading icon component (e.g. a lucide icon)
 * - tone:   'default' | 'primary' | 'success' | 'warning' | 'danger'
 * - delta:  optional node shown on the right (e.g. <Badge tone="success">+12%</Badge>)
 * - onClick: makes the tile a button
 * - all Surface props pass through (padding, elevation, radius…)
 *
 * @example
 * <StatTile icon={Shield} value="1,284" label="Protected devices" tone="success" />
 * <StatTile value="92%" label="Avg utilization" delta={<Badge tone="warning">-4%</Badge>} onClick={drill} />
 */
export const StatTile = forwardRef(function StatTile(
  { value, label, icon, tone = 'default', delta, onClick, className, ...props },
  ref,
) {
  const interactive = typeof onClick === 'function'
  return (
    <Surface
      ref={ref}
      as={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      padding={4}
      className={cx('vds-stat', `vds-stat--${tone}`, interactive && 'vds-stat--interactive', className)}
      {...props}
    >
      {icon && (
        <span className="vds-stat__icon" aria-hidden="true">
          <Icon as={icon} size="sm" />
        </span>
      )}
      <span className="vds-stat__body">
        <span className="vds-stat__value">{value}</span>
        <span className="vds-stat__label">{label}</span>
      </span>
      {delta != null && <span className="vds-stat__delta">{delta}</span>}
    </Surface>
  )
})

StatTile.displayName = 'StatTile'
