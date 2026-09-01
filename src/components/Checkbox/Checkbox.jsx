import { forwardRef, useEffect, useRef } from 'react'
import { cx } from '../../lib/cx.js'

/**
 * Checkbox
 *
 * A labelled checkbox with checked / unchecked / indeterminate states. Renders
 * a real <input type="checkbox"> (kept accessible) behind a styled box, wrapped
 * in a <label> so the text toggles it too.
 *
 * Props:
 * - indeterminate: boolean — the "some selected" dash (set imperatively on the input)
 * - tone: 'primary' | 'success'  (default 'primary') — the CHECKED fill only
 * - size: 'md' (default) | 'sm' — the compact step, for dense rows and toolbars
 * - children: optional label content
 * - all native checkbox attributes (checked, defaultChecked, onChange, disabled…)
 *
 * ---- When to use tone="success" ------------------------------------------
 * Default to 'primary'. Reach for 'success' when a tick means the thing is
 * IN — added to a set the user is assembling, and kept until they remove it:
 * a product picker, a cart, a build-your-own bundle. There the green is the
 * outcome ("this is in the order"), which is what green means everywhere else
 * in this system.
 *
 * Two places it's the wrong call:
 * - A filter, a settings toggle, a table's row selection. Nothing is being
 *   ACQUIRED, so green over-claims — it reads as "correct" or "passing".
 * - Progress. A finished step is not a success (see Stepper, which is
 *   deliberately one accent throughout).
 *
 * The second reason to use it is honest and worth saying: a surface that is
 * already brand-blue end to end — blue artwork, blue selected cards, blue
 * primary button — gains nothing from a blue tick, because everything on it
 * is emphasised and so nothing is. Green there is the only mark that reads as
 * a state rather than as more chrome. Use it for the whole control set on
 * that surface, not for one control in the middle of it.
 *
 * Accessibility:
 * - Native input keeps full keyboard + screen-reader behaviour.
 * - `indeterminate` is a visual/AT state only — remember to resolve it in state.
 *
 * @example
 * <Checkbox defaultChecked>Include archived</Checkbox>
 * <Checkbox indeterminate>Select all</Checkbox>
 * <Checkbox tone="success" checked={inCart}>Total Email Protection</Checkbox>
 */
export const Checkbox = forwardRef(function Checkbox(
  { indeterminate = false, tone = 'primary', size = 'md', disabled, className, children, ...props },
  ref,
) {
  const innerRef = useRef(null)

  // indeterminate can only be set via the DOM property, not an attribute.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  // merge the forwarded ref with our internal one
  const setRefs = (node) => {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <label
      className={cx(
        'vds-checkbox',
        tone !== 'primary' && `vds-checkbox--${tone}`,
        size === 'sm' && 'vds-checkbox--sm',
        disabled && 'vds-checkbox--disabled',
        className,
      )}
    >
      <input ref={setRefs} type="checkbox" className="vds-checkbox__input" disabled={disabled} {...props} />
      <span className="vds-checkbox__box" aria-hidden="true" />
      {children != null && <span className="vds-checkbox__label">{children}</span>}
    </label>
  )
})

Checkbox.displayName = 'Checkbox'
