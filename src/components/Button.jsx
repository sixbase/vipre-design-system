import { forwardRef } from 'react'
import { cx } from '../lib/cx.js'

/* ----------------------------------------------------------------------------
   Button — variant × size. All colors/spacing/radius come from tokens.
   Focus ring uses --color-focus-ring; disabled uses opacity, not a new color.
   -------------------------------------------------------------------------- */

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium ' +
  'whitespace-nowrap select-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] ' +
  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-[var(--color-canvas)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-canvas',
  ghost: 'bg-transparent text-ink-muted hover:bg-primary-soft hover:text-primary',
  danger: 'bg-danger text-on-primary hover:opacity-90',
}

const SIZES = {
  sm: 'h-8 px-3 text-detail',
  md: 'h-9 px-4 text-body',
  lg: 'h-11 px-6 text-body-lg',
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', type = 'button', className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})
