import { createContext, forwardRef, useContext, useId, useMemo, useState } from 'react'
import { ChevronDown, Filter as FilterIcon } from '@icons'
import { cx } from '../../lib/cx.js'
import { Popover } from '../Popover/Popover.jsx'
import { Button } from '../Button/Button.jsx'
import { Icon } from '../Icon/Icon.jsx'
import { Checkbox } from '../Checkbox/Checkbox.jsx'
import { SearchInput } from '../SearchInput/SearchInput.jsx'
import { Badge } from '../Badge/Badge.jsx'
import { Tag } from '../Tag/Tag.jsx'
import { Text } from '../Text/Text.jsx'
import { NumberInput } from '../NumberInput/NumberInput.jsx'
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.jsx'
import { ToggleChipGroup } from '../ToggleChip/ToggleChip.jsx'

/* Lets FilterGroup/FilterFooter reach the panel's close() without prop drilling. */
const FilterCtx = createContext({ close: () => {} })

/**
 * Filter
 *
 * The filter popover for a table or list: a trigger button that carries a count
 * of what's on, and a panel of filter controls with a footer that says how many
 * rows survive.
 *
 * It is a SHELL, not a fixed set of filters — you compose the controls yourself
 * from `FilterGroup` plus any DS input (SegmentedControl, Select, Slider,
 * DatePicker, Switch…) or the filter-specific `FilterPills` / `FilterCheckList`
 * below. That keeps one filter surface across the product while each table asks
 * for whatever it actually needs.
 *
 * Two commit models, chosen by whether you pass `onApply`:
 * - LIVE (no onApply): every change filters the table immediately. Best for
 *   cheap client-side filtering — the result count updates as you click.
 * - APPLY (onApply given): changes are staged and land on the button. Use when
 *   filtering costs a request, or when a half-built filter would be confusing.
 *
 * Props:
 * - label:        trigger text                        (default 'Filter')
 * - activeCount:  how many filters are on — shown as a badge on the trigger and
 *                 as the "Clear all" affordance in the header
 * - resultCount / totalCount: the footer's "Showing X of Y"
 * - onClearAll:   () => void — header "Clear all" (hidden when no activeCount)
 * - onReset:      () => void — footer Reset (falls back to onClearAll)
 * - onApply:      () => void — footer Apply. Its PRESENCE switches to the apply
 *                 model; omit it for live filtering.
 * - applyLabel:   footer primary label                (default 'Apply')
 * - size:         trigger button size, 'xs'|'sm'|'md'|'lg'|'xl'  (default 'md').
 *                 Match it to the other controls in the toolbar — a filter next to
 *                 an `sm` SearchInput needs `sm`, or the two sit at different heights.
 * - width:        panel width, any CSS length         (default 22rem). The default is
 *                 sized off the FOOTER, not the filter controls: "Showing 1,539 of 1,539"
 *                 plus Reset and the primary button is the widest fixed row in the panel,
 *                 and it must not wrap — a count that reflows to two lines changes the
 *                 panel's height as you filter. Override only to go WIDER.
 * - placement:    Popover placement                   (default 'bottom-start')
 * - trigger:      replace the built-in trigger button entirely
 * - open / defaultOpen / onOpenChange: controlled / uncontrolled panel state
 * - footer:       replace the whole footer (pass null to drop it)
 * - children:     the filter controls, or a render-prop `({ close }) => node`
 *
 * @example
 * <Filter activeCount={2} resultCount={42} totalCount={210} onClearAll={reset}>
 *   <FilterGroup label="Status">
 *     <FilterPills value={status} onChange={setStatus} options={STATUS} />
 *   </FilterGroup>
 * </Filter>
 */
export const Filter = forwardRef(function Filter(
  {
    label = 'Filter',
    activeCount = 0,
    resultCount,
    totalCount,
    onClearAll,
    onReset,
    onApply,
    applyLabel = 'Apply',
    resetLabel = 'Reset',
    size = 'md',
    width = '22rem',
    placement = 'bottom-start',
    trigger,
    footer,
    children,
    className,
    ...props
  },
  ref,
) {
  const hasCount = resultCount != null && totalCount != null
  const showFooter = footer !== null && (hasCount || onApply || onReset || onClearAll)

  const defaultTrigger = (
    <Button
      variant="outline"
      tone="neutral"
      size={size}
      // --counted lets the SCSS tighten the trailing pad only when the chip is there, so a
      // countless trigger keeps the Button's normal text padding.
      className={cx('vds-filter__trigger', activeCount > 0 && 'vds-filter__trigger--counted')}
      leading={<Icon as={FilterIcon} size="sm" />}
    >
      {label}
      {activeCount > 0 && (
        <Badge tone="primary" className="vds-filter__count">
          {activeCount}
        </Badge>
      )}
    </Button>
  )

  return (
    <Popover
      ref={ref}
      role="dialog"
      aria-label={label}
      placement={placement}
      trigger={trigger ?? defaultTrigger}
      panelClassName={cx('vds-filter', className)}
      surfaceProps={{ style: { width } }}
      {...props}
    >
      {({ close }) => (
        <FilterCtx.Provider value={{ close }}>
          <div className="vds-filter__head">
            <span className="vds-filter__title">{label}</span>
            {activeCount > 0 && onClearAll && (
              <Button variant="ghost" tone="neutral" size="xs" onClick={onClearAll}>
                Clear all
              </Button>
            )}
          </div>

          <div className="vds-filter__body">
            {typeof children === 'function' ? children({ close }) : children}
          </div>

          {showFooter &&
            (footer ?? (
              <div className="vds-filter__foot">
                {hasCount && (
                  <span className="vds-filter__result">
                    Showing <b>{resultCount.toLocaleString()}</b> of {totalCount.toLocaleString()}
                  </span>
                )}
                <div className="vds-filter__actions">
                  {(onReset || onClearAll) && (
                    <Button
                      variant="ghost"
                      tone="neutral"
                      size="sm"
                      onClick={onReset ?? onClearAll}
                    >
                      {resetLabel}
                    </Button>
                  )}
                  {onApply ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        onApply()
                        close()
                      }}
                    >
                      {applyLabel}
                    </Button>
                  ) : (
                    <Button variant="outline" tone="neutral" size="sm" onClick={close}>
                      Done
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </FilterCtx.Provider>
      )}
    </Popover>
  )
})

Filter.displayName = 'Filter'

/**
 * FilterGroup
 *
 * One labelled block inside a Filter panel. Set `collapsible` when the panel has
 * more groups than fit comfortably — collapsed groups keep the panel scannable
 * while still saying what they hold. A `count` shows how many picks are live in
 * this group, so a collapsed group still reports itself.
 *
 * Props:
 * - label:       the group heading
 * - count:       active picks in this group (badge next to the label)
 * - hint:        small muted line under the label
 * - collapsible: render as a disclosure         (default false)
 * - defaultOpen: initial state when collapsible (default true)
 * - children:    the control(s)
 */
export const FilterGroup = forwardRef(function FilterGroup(
  { label, count = 0, hint, collapsible = false, defaultOpen = true, children, className, ...props },
  ref,
) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()
  const shown = collapsible ? open : true

  const heading = (
    <span className="vds-filter-group__label">
      {label}
      {count > 0 && <Badge tone="primary">{count}</Badge>}
    </span>
  )

  return (
    <div ref={ref} className={cx('vds-filter-group', className)} {...props}>
      {label &&
        (collapsible ? (
          <button
            type="button"
            className="vds-filter-group__head vds-filter-group__head--button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((o) => !o)}
          >
            {heading}
            <Icon
              as={ChevronDown}
              size="sm"
              className={cx('vds-filter-group__chev', open && 'vds-filter-group__chev--open')}
            />
          </button>
        ) : (
          <div className="vds-filter-group__head">{heading}</div>
        ))}
      {hint && shown && <p className="vds-filter-group__hint">{hint}</p>}
      <div id={bodyId} className="vds-filter-group__body" hidden={!shown}>
        {children}
      </div>
    </div>
  )
})

FilterGroup.displayName = 'FilterGroup'

/**
 * FilterPills — the filter-flavoured name for `ToggleChipGroup`.
 *
 * The chip itself is a general primitive (tag pickers and category selectors want
 * it too), so it lives in ToggleChip and this is a thin alias. Same props.
 * Prefer importing ToggleChipGroup directly outside a filter panel.
 */
export const FilterPills = ToggleChipGroup

/**
 * FilterCheckList
 *
 * A checkbox facet list with counts — the workhorse for "which of these
 * categories" when there are more than a few. Turn on `searchable` past ~8
 * options and `selectAll` when picking most of them is common.
 *
 * The counts are the point: they tell you what a pick is worth BEFORE you make
 * it, and an option with 0 rows reads as disabled rather than disappearing (a
 * list that reshuffles under the cursor is worse than one with dead entries).
 *
 * Props:
 * - options:    [{ value, label, count?, disabled? }]
 * - value:      string[] — checked values
 * - onChange:   (nextValues) => void
 * - searchable: filter the options with a search field  (default false)
 * - selectAll:  show the select-all / clear row         (default false)
 * - maxHeight:  scroll past this height                 (default '11rem')
 * - emptyText:  shown when a search matches nothing
 */
export const FilterCheckList = forwardRef(function FilterCheckList(
  {
    options = [],
    value = [],
    onChange,
    searchable = false,
    selectAll = false,
    maxHeight = '11rem',
    emptyText = 'No matches',
    searchPlaceholder = 'Search',
    className,
    ...props
  },
  ref,
) {
  const [q, setQ] = useState('')
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return needle ? options.filter((o) => o.label.toLowerCase().includes(needle)) : options
  }, [options, q])

  const selectable = shown.filter((o) => !o.disabled)
  const allOn = selectable.length > 0 && selectable.every((o) => value.includes(o.value))

  const toggle = (v) =>
    onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  const toggleAll = () => {
    const ids = selectable.map((o) => o.value)
    onChange?.(allOn ? value.filter((v) => !ids.includes(v)) : [...new Set([...value, ...ids])])
  }

  return (
    <div ref={ref} className={cx('vds-filter-list', className)} {...props}>
      {searchable && (
        <SearchInput
          size="sm"
          value={q}
          onChange={setQ}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      )}
      {selectAll && selectable.length > 0 && (
        <div className="vds-filter-list__all">
          <Button variant="ghost" tone="neutral" size="xs" onClick={toggleAll}>
            {allOn ? 'Clear' : 'Select all'}
          </Button>
          {value.length > 0 && (
            <span className="vds-filter-list__picked">{value.length} picked</span>
          )}
        </div>
      )}
      <div className="vds-filter-list__scroll" style={{ maxHeight }}>
        {shown.length === 0 ? (
          <Text as="p" variant="detail" tone="subtle" className="vds-filter-list__empty">
            {emptyText}
          </Text>
        ) : (
          shown.map((opt) => (
            <label
              key={opt.value}
              className={cx('vds-filter-row', opt.disabled && 'vds-filter-row--off')}
            >
              <Checkbox
                checked={value.includes(opt.value)}
                disabled={opt.disabled}
                onChange={() => toggle(opt.value)}
              />
              <span className="vds-filter-row__label">{opt.label}</span>
              {opt.count != null && <span className="vds-filter-row__count">{opt.count}</span>}
            </label>
          ))
        )}
      </div>
    </div>
  )
})

FilterCheckList.displayName = 'FilterCheckList'

/**
 * FilterChips
 *
 * The applied-filters bar that sits ABOVE a table — one removable chip per live
 * filter, plus a "Clear all". It is the honest answer to "why am I seeing these
 * rows?", and it belongs outside the popover: a filter you can't see from the
 * table is a filter you forget you set.
 *
 * Props:
 * - items:      [{ id, label, value }] — `label` names the field, `value` the pick
 * - onRemove:   (item) => void
 * - onClearAll: () => void — trailing clear-all (hidden when only one chip)
 */
export const FilterChips = forwardRef(function FilterChips(
  { items = [], onRemove, onClearAll, className, ...props },
  ref,
) {
  if (!items.length) return null
  return (
    <div ref={ref} className={cx('vds-filter-chips', className)} {...props}>
      {items.map((item) => (
        // Tag owns the chip: its dismiss button already carries a "Remove …" label
        // AND grows to the 44px tap target on touch, which a hand-rolled ✕ misses.
        // dismissLabel is passed explicitly because the children aren't plain text.
        <Tag
          key={item.id}
          tone="cobalt"
          size="sm"
          onDismiss={onRemove ? () => onRemove(item) : undefined}
          dismissLabel={`Remove ${item.label ? `${item.label} ` : ''}${item.value}`}
        >
          {item.label && <span className="vds-filter-chip__key">{item.label}</span>}
          {item.value}
        </Tag>
      ))}
      {onClearAll && items.length > 1 && (
        <Button variant="ghost" tone="neutral" size="xs" onClick={onClearAll}>
          Clear all
        </Button>
      )}
    </div>
  )
})

FilterChips.displayName = 'FilterChips'

/**
 * FilterCompare
 *
 * A numeric comparator — an operator next to a number ("Seats ≥ 250"). Reach for
 * this instead of a slider when the field has no meaningful ceiling (spend,
 * seats, device count): a slider has to invent a maximum, and the invented one
 * is always wrong for somebody.
 *
 * Props:
 * - op / value:  the comparator and the number
 * - onChange:    ({ op, value }) => void
 * - ops:         [{ value, label }]  (default ≥ / ≤ / =)
 * - unit:        suffix shown inside the field (e.g. 'seats')
 */
const DEFAULT_OPS = [
  { value: 'gte', label: '≥' },
  { value: 'lte', label: '≤' },
  { value: 'eq', label: '=' },
]

export const FilterCompare = forwardRef(function FilterCompare(
  { op = 'gte', value = '', onChange, ops = DEFAULT_OPS, unit, placeholder = '0', className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx('vds-filter-compare', className)} {...props}>
      {/* SegmentedControl, not toggle buttons: the operators are mutually
          exclusive, so this is radios. (aria-pressed would claim each one is an
          independent on/off — the wrong story for a pick-exactly-one set.) */}
      <SegmentedControl
        aria-label="Comparison"
        size="sm"
        value={op}
        onChange={(next) => onChange?.({ op: next, value })}
        options={ops}
      />
      {/* NumberInput brings steppers, min/max clamping and the invalid state that
          a bare <input type="number"> has none of.
          NOTE: unlike Input, NumberInput has no prefix/suffix slot — so the unit
          rides alongside as a label rather than inside the border. Logged as a DS
          gap; if NumberInput gains suffix, move it in. */}
      <NumberInput
        size="sm"
        min={0}
        value={value}
        placeholder={placeholder}
        aria-label={unit ? `Value in ${unit}` : 'Value'}
        onChange={(next) => onChange?.({ op, value: next })}
        className="vds-filter-compare__field"
      />
      {unit && (
        <Text as="span" variant="micro" tone="subtle" className="vds-filter-compare__unit">
          {unit}
        </Text>
      )}
    </div>
  )
})

FilterCompare.displayName = 'FilterCompare'

/* Re-exported so a consumer can close the panel from a custom footer/control. */
export function useFilterPanel() {
  return useContext(FilterCtx)
}
