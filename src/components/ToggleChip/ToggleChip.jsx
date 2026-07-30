import { forwardRef } from 'react'
import { cx } from '../../lib/cx.js'

/**
 * ToggleChip
 *
 * A chip that is ON or OFF. The multi-select counterpart to SegmentedControl,
 * and the stateful counterpart to Tag.
 *
 * Reach for it when the question is "which of these do you want?" and the answer
 * may be none, one, or several. The three neighbours and why they aren't this:
 * - SegmentedControl: exactly one, always one. It is radios, so it can't express
 *   "nothing picked" — which makes it wrong for an optional filter.
 * - Tag: can be clicked, but carries no on/off state.
 * - Checkbox: same job, different shape. Use a checkbox list when the options are
 *   long or need counts in a column; use chips when they're short and should wrap
 *   inline.
 *
 * Props:
 * - pressed:  boolean — the on/off state
 * - onChange: (nextPressed, event) => void
 * - count:    optional number shown after the label (a facet count)
 * - dot:      leading status dot — 'success' | 'warning' | 'danger' | 'info' | 'neutral'
 * - size:     'sm' | 'md'      (default 'md')
 * - disabled: boolean
 * - all native button attributes
 *
 * Accessibility:
 * - A real <button> carrying aria-pressed, so the on/off state is announced.
 *   (aria-pressed is right here BECAUSE several can be on — for a pick-exactly-one
 *   set, use SegmentedControl, which is radios.)
 * - The dot is decorative; the label always carries the meaning in words.
 *
 * @example
 * <ToggleChip pressed={on} onChange={setOn} count={186} dot="success">Active</ToggleChip>
 */
export const ToggleChip = forwardRef(function ToggleChip(
  { pressed = false, onChange, count, dot, size = 'md', disabled = false, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      className={cx(
        'vds-toggle-chip',
        `vds-toggle-chip--${size}`,
        pressed && 'vds-toggle-chip--on',
        className,
      )}
      onClick={(e) => onChange?.(!pressed, e)}
      {...props}
    >
      {dot && <span aria-hidden="true" className={cx('vds-toggle-chip__dot', `vds-toggle-chip__dot--${dot}`)} />}
      {children}
      {count != null && <span className="vds-toggle-chip__count">{count}</span>}
    </button>
  )
})

ToggleChip.displayName = 'ToggleChip'

/**
 * ToggleChipGroup
 *
 * The data-driven wrapper: hand it options and the picked values and it renders a
 * wrapping row of ToggleChips. `single` narrows it to at most one — which still
 * differs from SegmentedControl, because clicking the live chip clears it and the
 * group can sit empty.
 *
 * Props:
 * - options:  [{ value, label, count?, dot?, disabled? }]
 * - value:    string[] — the picked values
 * - onChange: (nextValues) => void
 * - single:   pick at most one            (default false)
 * - size:     'sm' | 'md'                 (default 'md')
 * - aria-label: name the group (it renders role="group")
 *
 * @example
 * <ToggleChipGroup aria-label="Status" options={STATUS} value={v} onChange={setV} />
 */
export const ToggleChipGroup = forwardRef(function ToggleChipGroup(
  { options = [], value = [], onChange, single = false, size = 'md', className, ...props },
  ref,
) {
  const toggle = (v) => {
    if (single) return onChange?.(value[0] === v ? [] : [v])
    onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }
  return (
    <div ref={ref} role="group" className={cx('vds-toggle-chips', className)} {...props}>
      {options.map((opt) => (
        <ToggleChip
          key={opt.value}
          pressed={value.includes(opt.value)}
          onChange={() => toggle(opt.value)}
          count={opt.count}
          dot={opt.dot}
          size={size}
          disabled={opt.disabled}
        >
          {opt.label}
        </ToggleChip>
      ))}
    </div>
  )
})

ToggleChipGroup.displayName = 'ToggleChipGroup'
