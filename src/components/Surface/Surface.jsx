import { forwardRef } from 'react'
import { cx } from '../../lib/cx.js'

/**
 * Surface
 *
 * The panel primitive — a token-bound box that owns background, border, radius,
 * padding, and elevation. Cards, popovers, drawers, and table shells compose a
 * Surface rather than re-declaring those properties, so the "what a panel looks
 * like" decision lives in exactly one place.
 *
 * Props:
 * - as:        element/tag to render        (default 'div')
 * - padding:   spacing step 0–8, or null    (default 4 → --vds-space-4 / 16px)
 * - radius:    'sm' | 'md' | 'lg' | 'xl'     (default 'lg')
 * - bordered:  1px line border               (default true)
 * - elevation: 'none'|'xs'|'sm'|'md'|'lg'    (default 'none')
 * - raised:    use --vds-surface-raised bg   (default false)
 * - all native attributes (onClick, role, aria-*, …)
 *
 * @example
 * <Surface padding={6} elevation="sm">…</Surface>
 * <Surface as="section" radius="md" bordered={false} raised>…</Surface>
 */
export const Surface = forwardRef(function Surface(
  {
    as: Tag = 'div',
    padding = 4,
    radius = 'lg',
    bordered = true,
    elevation = 'none',
    raised = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx(
        'vds-surface',
        padding != null && `vds-surface--pad-${padding}`,
        `vds-surface--radius-${radius}`,
        bordered && 'vds-surface--bordered',
        elevation !== 'none' && `vds-surface--elev-${elevation}`,
        raised && 'vds-surface--raised',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
})

Surface.displayName = 'Surface'
