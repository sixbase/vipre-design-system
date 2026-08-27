import { forwardRef } from 'react'
import { cx } from '../../lib/cx.js'

/** Tones that convey live status and should announce via role="status". */
const STATUS_TONES = new Set(['success', 'warning', 'danger'])

/**
 * Badge
 *
 * A compact status pill with six tones and an optional leading status dot.
 * Soft-tinted background paired with matching ink, sized off the small end of
 * the typescale so it reads as a label.
 *
 * Props:
 * - tone: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'  (default 'neutral')
 * - icon: leading icon node (e.g. <Icon as={CircleCheck} />). Sized + optically
 *         centered by the badge; decorative (aria-hidden). Wins over `dot`.
 * - dot:  boolean — show a leading status dot  (default false)
 * - all native span attributes
 *
 * Use this rather than hand-rolling a tinted <span>. Each tone pairs a soft
 * background with the *ink* step meant to be read on it — for warning that is
 * --vds-on-warning-soft (amber-600), NOT --vds-warning (amber-400), which is a
 * fill colour for dots and marks and measures 2.29:1 as text on amber-50 against
 * the 4.5:1 small text requires. Both steps flip correctly in dark mode. A chip
 * built by hand from `bg-*-soft` + `text-*` utilities gets none of that, compiles
 * fine, and ships unreadable.
 *
 * Accessibility:
 * - Status tones (success/warning/danger) auto-apply role="status" so changes
 *   are announced; pass an explicit `role` to override.
 * - The dot is decorative (aria-hidden) — meaning lives in the text.
 * - Don't rely on color alone; keep the label explicit ("At risk", not just amber).
 *
 * @example
 * <Badge tone="success" dot>Protected</Badge>
 * <Badge tone="danger" dot>Threat</Badge>
 * <Badge tone="success" icon={<Icon as={CircleCheck} />}>Protected</Badge>
 * <Badge tone="danger" icon={<Icon as={TriangleAlert} />}>Threat</Badge>
 */
export const Badge = forwardRef(function Badge(
  { tone = 'neutral', icon, dot = false, role, className, children, ...props },
  ref,
) {
  const resolvedRole = role ?? (STATUS_TONES.has(tone) ? 'status' : undefined)
  return (
    <span
      ref={ref}
      role={resolvedRole}
      className={cx('vds-badge', `vds-badge--${tone}`, className)}
      {...props}
    >
      {/* An icon takes the leading slot; fall back to the dot only when no icon. */}
      {icon ? (
        <span className="vds-badge__icon" aria-hidden="true">{icon}</span>
      ) : (
        dot && <span className="vds-badge__dot" aria-hidden="true" />
      )}
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'
