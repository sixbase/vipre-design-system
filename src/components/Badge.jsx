import { forwardRef } from 'react'
import { cx } from '../lib/cx.js'

/* ----------------------------------------------------------------------------
   Badge — compact status pill. Soft-tinted background + matching ink.
   Uses the eyebrow/nano end of the typescale so it reads as a label.
   -------------------------------------------------------------------------- */

const BASE =
  'inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-0.5 ' +
  'text-micro font-medium whitespace-nowrap'

const TONES = {
  neutral: 'bg-canvas text-ink-muted border border-line',
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
}

export const Badge = forwardRef(function Badge(
  { tone = 'neutral', dot = false, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx(BASE, TONES[tone], className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
})
