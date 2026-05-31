import { forwardRef } from 'react'
import { cx } from '../lib/cx.js'

/* ----------------------------------------------------------------------------
   Badge — compact status pill. Styling in styles/components/_badge.scss.
   -------------------------------------------------------------------------- */

export const Badge = forwardRef(function Badge(
  { tone = 'neutral', dot = false, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx('vds-badge', `vds-badge--${tone}`, className)} {...props}>
      {dot && <span className="vds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
})
