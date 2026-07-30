import { forwardRef } from 'react'
import { cx } from '../../lib/cx.js'

/**
 * MetricRow
 *
 * The KPI strip a dashboard opens with: a responsive row of MetricCards whose
 * hero values all sit on the same line.
 *
 * Why it exists. A MetricCard is content-sized, so in a plain grid a title that
 * wraps to two lines ("Package Adoption") pushes its value a line below its
 * single-line neighbours. The wrap point moves with the container width, so the
 * row's numbers appear to jump around from breakpoint to breakpoint — the row
 * stops reading as one set of figures. MetricRow reserves `titleLines` lines of
 * title on every card it contains, so the header block is the same height
 * whether a title wraps or not and the values share a line at every width.
 *
 * Layout is intrinsic — `repeat(auto-fit, minmax(min, 1fr))` — so the row
 * reflows on its own width with no media queries: cards drop from N-across to
 * fewer as space runs out and never fall below `min`. Rows are equal height, so
 * a wrapped row's cards match the one above it. When you need exact track counts
 * at exact breakpoints (a five-card row that pairs up rather than stranding its
 * last card, say), pass `className` and override `grid-template-columns` there —
 * the alignment guarantee survives, because it rides on a custom property, not
 * on the grid.
 *
 * One thing it does NOT absorb: a `period` that wraps. The reservation covers
 * title lines, so a two-line period pushes its own card's value down again.
 * Keep periods to the short qualifier they're meant to be ("Licensed", "Last
 * 24h") and don't let `min` drop below the width one line of that needs.
 *
 * Every knob is a custom property with a default in the stylesheet, and a prop
 * only writes one when you pass it. That ordering matters: leave a prop unset and
 * a consumer's own CSS can still change it per breakpoint, which an inline style
 * would have made impossible.
 *
 * Props:
 * - min:        smallest card width before the row reflows (default 220px)
 * - titleLines: title lines reserved on every card in the row (default 2).
 *               Raise it if your titles are long enough to wrap three ways;
 *               1 opts out and lets each card size to its own content.
 * - gap:        grid gap (default: --vds-space-4)
 * - as:         element to render (default 'div')
 * - all native attributes
 *
 * @example
 * <MetricRow min="240px">
 *   <MetricCard icon={Store}  title="Customers"        period="All accounts"    value={324} delta="+6" />
 *   <MetricCard icon={Users}  title="Seats"            period="Licensed"        value={50848} delta="+3%" />
 *   <MetricCard icon={Boxes}  title="Package Adoption" period="Across products" value={47} suffix="%" />
 * </MetricRow>
 */
const px = (v) => (typeof v === 'number' ? `${v}px` : v)

export const MetricRow = forwardRef(function MetricRow(
  { min, titleLines, gap, as: As = 'div', className, style, children, ...props },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx('vds-metric-row', className)}
      style={{
        ...(min != null ? { '--vds-metric-row-min': px(min) } : null),
        ...(titleLines != null ? { '--vds-metric-title-lines': titleLines } : null),
        ...(gap != null ? { '--vds-metric-row-gap': px(gap) } : null),
        ...style,
      }}
      {...props}
    >
      {children}
    </As>
  )
})

MetricRow.displayName = 'MetricRow'
