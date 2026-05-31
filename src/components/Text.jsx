import { forwardRef } from 'react'
import { cx } from '../lib/cx.js'

/* ----------------------------------------------------------------------------
   Typography components — the ONLY way to render text in the system.
   They bind the Rubik typescale tokens (text-title, text-body…) to semantic
   ink colors, so callers never reach for raw font sizes or hex colors.
   -------------------------------------------------------------------------- */

const HEADING_SCALE = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
  subheading: 'text-subheading',
}

const TEXT_SCALE = {
  'body-lg': 'text-body-lg',
  body: 'text-body',
  caption: 'text-caption',
  detail: 'text-detail',
  micro: 'text-micro',
  eyebrow: 'text-eyebrow uppercase',
  nano: 'text-nano',
}

const TONE = {
  default: 'text-ink',
  muted: 'text-ink-muted',
  subtle: 'text-ink-subtle',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

/**
 * Heading — display / title / heading / subheading.
 * `as` controls the semantic element so heading hierarchy stays correct
 * independent of visual size.
 */
export const Heading = forwardRef(function Heading(
  { level = 'heading', as, tone = 'default', className, children, ...props },
  ref,
) {
  const Tag = as || 'h2'
  return (
    <Tag ref={ref} className={cx(HEADING_SCALE[level], TONE[tone], 'text-balance', className)} {...props}>
      {children}
    </Tag>
  )
})

/**
 * Text — body / caption / detail / micro / eyebrow / nano.
 * Defaults to <p>; pass `as="span"` for inline use.
 */
export const Text = forwardRef(function Text(
  { variant = 'body', as = 'p', tone = 'default', className, children, ...props },
  ref,
) {
  const Tag = as
  return (
    <Tag ref={ref} className={cx(TEXT_SCALE[variant], TONE[tone], className)} {...props}>
      {children}
    </Tag>
  )
})
