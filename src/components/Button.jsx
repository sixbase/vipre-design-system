import { forwardRef } from 'react'
import { cx } from '../lib/cx.js'

/* ----------------------------------------------------------------------------
   Button — variant × size. All styling lives in styles/components/_button.scss;
   this just assembles BEM classes and forwards native button props.
   -------------------------------------------------------------------------- */

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', type = 'button', className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('vds-button', `vds-button--${variant}`, `vds-button--${size}`, className)}
      {...props}
    >
      {children}
    </button>
  )
})
