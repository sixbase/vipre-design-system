import { Fragment, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import { cx } from '../../lib/cx.js'
import { Surface } from '../Surface/Surface.jsx'
import { Checkbox } from '../Checkbox/Checkbox.jsx'

/* Read a row's stable key. `getRowKey` wins; otherwise fall back to row.id,
   then the index (last resort — fine for static data). */
function rowKeyOf(row, index, getRowKey) {
  if (typeof getRowKey === 'function') return getRowKey(row, index)
  if (row != null && row.id != null) return row.id
  return index
}

/* Read a cell's value: a column `render` wins, else the row's value at `key`. */
function cellOf(col, row, index) {
  if (typeof col.render === 'function') return col.render(row, index)
  return row?.[col.key]
}

/* Resolve a column's alignment. An explicit `align` always wins. Otherwise the
   alignment follows the DATA TYPE: numeric columns read best flush-right (the
   digits line up place-by-place, and the header sits over them), everything
   else stays left. Custom-`render` columns can't be sniffed (the output could
   be anything), so they fall back to left unless `align` is set. */
function alignOf(col, data) {
  if (col.align) return col.align
  if (typeof col.render === 'function') return 'left'
  const sample = data.find((row) => row?.[col.key] != null)
  return sample && typeof sample[col.key] === 'number' ? 'right' : 'left'
}

/* Plain-text column label for the responsive mode's data-label attribute.
   Node headers can't live in an attribute, so those fall back to the key. */
function labelOf(col) {
  const header = col.header ?? col.key
  return typeof header === 'string' || typeof header === 'number' ? String(header) : String(col.key)
}

/* The sort glyph — ONE arrow (DS ships no icons), drawn pointing up and rotated 180°
   for `desc` by the `--desc` modifier. One arrow, not a pair: a pair has to say "this
   one is on, that one is off" through opacity, which at 8px is a difference of a few
   grey pixels. A single arrow states the direction by pointing, which survives the size.
   Unsorted columns show it dimmed — the affordance stays visible, so you can tell a
   sortable column from a fixed one before you touch it.

   An arrow rather than a bare caret: the tail is what says which way the rows will MOVE. */
function SortGlyph({ direction }) {
  return (
    <span
      className={cx('vds-table__sort', direction && `vds-table__sort--${direction}`)}
      aria-hidden="true"
    >
      {/* Height is the HEADER'S CAP HEIGHT, not a generic icon box: the header is 11px
          Rubik, whose caps measure 7.7px, so the arrow spans 8px and sits level with the
          letters beside it. WIDTH is not tied to that — the head is 6 wide against a 3-tall
          rise, because a head narrower than about twice its rise stops reading as a head at
          this size and turns back into a tick. Stroke is 1.5: at 1 the arrow disappeared
          into the header rule next to 11px text. Round caps match the app's icon family. */}
      <svg width="9" height="8" viewBox="0 0 9 8" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Drawn SYMMETRICALLY about the box's centre (tip at y .75, tail at 7.25, so the
            ink centres on y 4 exactly, matching the box). The desc state is this same path
            rotated 180°, so any offset between the two centres would shift the arrow
            between states instead of simply turning it over. */}
        <path d="M4.5 7.25V0.75M1.5 3.75L4.5 0.75L7.5 3.75" />
      </svg>
    </span>
  )
}

/* Expand caret — an inline chevron (Table ships no icon deps, like SortGlyph).
   It points right when closed and rotates 90° to point down when its row is
   open; the rotation is driven off the button's aria-expanded in CSS. */
function ExpandGlyph() {
  return (
    <svg
      className="vds-table__expand-glyph"
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 1L6 6L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Table
 *
 * A data-driven table: declare `columns`, hand it `data`, and it renders the
 * head + body, owning alignment, density, zebra striping, a sticky header,
 * sortable headers, row selection (composing Checkbox), row-click drill-in, and
 * loading / empty states. Composes Surface for the bordered, rounded shell.
 *
 * Column shape: { key, header, align?, width?, render?, sortable?, className?, headerClassName? }
 * - key:    row property to read (and the sort key)
 * - header: column label (defaults to the key)
 * - align:  'left' | 'center' | 'right'  — omit to auto-align by data type
 *           (numeric columns go right, everything else left)
 * - width:  any CSS width (e.g. '120px', '20%')
 * - render: (row, index) => node  — custom cell (badges, links, actions…)
 * - sortable: mark the header clickable (sorting itself is controlled — see below)
 *
 * Sorting is controlled: pass `sort={{ key, direction }}` for the indicator and
 * `onSortChange` to react. Clicking a sortable header toggles its direction (or
 * starts at 'asc' on a new column); you sort `data` yourself in response.
 *
 * Selection is controlled: pass `selectedKeys` + `onSelectionChange`. The header
 * checkbox toggles the whole page (indeterminate when partial).
 *
 * Props:
 * - columns:     column[]  (required)
 * - data:        row[]     (required)
 * - getRowKey:   (row, i) => key   — defaults to row.id, then the index
 * - density:     'comfortable' (default) | 'compact'
 * - verticalAlign: 'middle' (default) | 'top'
 *                Where a cell's content sits when the row is taller than one line.
 *                Middle is right while every cell is one line. The moment ONE column
 *                wraps — a name over a category, a package over its add-ons — the row
 *                grows to fit it and every OTHER cell centres against that new height,
 *                dropping each single-line value below the name that identifies its
 *                row. Measured on the docs page before this existed: a status chip sat
 *                8px under the product name it described, while the ProductTile beside
 *                it was already top-aligned by hand. Set 'top' whenever a column can
 *                render two lines, and the row lines up on the first one.
 * - zebra:       striped rows                    (default false)
 * - stickyHeader: header stays put while the body scrolls (pair with `maxHeight`)
 * - maxHeight:   CSS max-height for the scroll body (enables vertical scroll)
 * - minWidth:    CSS min-width for the table — below it the shell scrolls
 *                horizontally instead of crushing columns (responsive default)
 * - responsive:  opt-in stacked mode — below ~640px of the TABLE'S own width
 *                (container query) rows render as labelled cards: the header
 *                row hides visually (kept for assistive tech) and each cell
 *                shows its column header as an inline label. Selection and
 *                row-click keep working. Column labels come from `header`
 *                when it's a string (node headers fall back to the key).
 *                Default off — the classic grid is unchanged.  (default false)
 * - sort:        { key, direction: 'asc' | 'desc' }   — controlled sort indicator
 * - onSortChange: (next: { key, direction }) => void
 * - selectable:  show the selection column          (default false)
 * - selectedKeys: array | Set of selected row keys
 * - onSelectionChange: (keys[]) => void
 * - onRowClick:  (row, index) => void  — what a click on a row does
 * - interactiveRows: rows look and behave clickable (default true). Needs onRowClick
 *                to take effect — the styling promises a click does something, and a
 *                table without a handler has nothing to promise. Set false to keep a
 *                row's click behaviour without the whole-row affordance.
 * - renderDetail: (row, index) => node — when set, every row gets a leading
 *                expand caret that reveals this node in a full-width detail row
 *                beneath it. This is how you keep dense rows compact: the row
 *                stays a one-line summary, the verbose breakdown lives in the
 *                drawer. Pairs with `expandedKeys`/`onExpandedChange` (controlled)
 *                or `defaultExpandedKeys` (uncontrolled — the common case).
 * - expandedKeys / defaultExpandedKeys / onExpandedChange: which rows are open.
 * - loading:     show skeleton rows                 (default false)
 * - skeletonRows: how many while loading            (default 5)
 * - empty:       node shown when data is empty      (default 'No data')
 * - footer:      a bar rendered INSIDE the table's own card, under a hairline. This
 *                is where a pager belongs and it is not a detail: a pager placed after
 *                the table, outside its border, reads as a separate control that
 *                happens to sit nearby, and the table below it looks unfinished. Inside
 *                the card, under the rule, it is part of the same object — which is how
 *                every paged table in the product is built. Anything can go here; a
 *                pager is simply the usual thing.
 * - caption:     accessible <caption> (visually hidden) describing the table
 * - all Surface props pass through (radius, elevation, bordered, raised, as…)
 *
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Device' },
 *     { key: 'status', header: 'Status', render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
 *     { key: 'seen', header: 'Last seen', align: 'right', sortable: true },
 *   ]}
 *   data={devices}
 *   sort={sort}
 *   onSortChange={setSort}
 * />
 */
/* ---- scroll fade — MEASURED, not animated ------------------------------------------
   Writes two numbers, 1 or 0 per edge, onto the table's root: --vds-table-fade-start
   and --vds-table-fade-end. The edge fades and a pinned column's own fade read them, so
   a fade only ever appears when it MEANS something — one at an edge with nothing beyond
   it is decoration claiming content that is not there.

   This replaces a scroll-timeline. The CSS-only version was the nicer idea and it does
   not fire: measured on a table inside a flex-column card, both edge shadows sat at
   opacity 0 at every scroll position while their animations reported `running` against a
   ScrollTimeline. The prototype hit the same wall and moved to measurement; this is that
   fix, brought back.

   THREE TRIGGERS, because no one of them catches every case:
     scroll  the obvious one.
     resize  an observer on the SCROLLER catches its own box changing; observers on its
             CHILDREN catch content growing or shrinking under a still scroller — a
             filter applied, a column toggled — which moves scrollWidth while the
             scroller's box never changes.
     window  the backstop, and not redundant: ResizeObserver does not fire on every
             viewport-driven resize, and without this the fade sticks at whatever it was
             when the window was last a different size.
   All three call the same idempotent update, so firing twice costs one style write. */
function bindScrollFade(el) {
  const host = el.parentElement ?? el
  const set = (k, on) => host.style.setProperty(k, on ? '1' : '0')
  const update = () => {
    set('--vds-table-fade-start', el.scrollLeft > 1)
    set('--vds-table-fade-end', Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1)
  }
  update()
  el.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
  if (ro) {
    ro.observe(el)
    for (const child of el.children) ro.observe(child)
  }
  return () => {
    el.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    ro?.disconnect()
    host.style.removeProperty('--vds-table-fade-start')
    host.style.removeProperty('--vds-table-fade-end')
  }
}

export const Table = forwardRef(function Table(
  {
    columns = [],
    data = [],
    getRowKey,
    density = 'comfortable',
    verticalAlign = 'middle',
    zebra = false,
    stickyHeader = false,
    maxHeight,
    minWidth,
    responsive = false,
    sort,
    onSortChange,
    selectable = false,
    selectedKeys,
    onSelectionChange,
    onRowClick,
    interactiveRows = true,
    renderDetail,
    expandedKeys,
    defaultExpandedKeys,
    onExpandedChange,
    loading = false,
    skeletonRows = 5,
    empty = 'No data',
    caption,
    footer,
    radius,
    className,
    ...props
  },
  ref,
) {
  const captionId = useId()
  const detailBaseId = useId()
  /* Rows read as clickable by default, because in this product most of them are. The
     flag still needs a handler to take effect, and that is not a hedge: the treatment is
     a pointer, a focus ring and role="button", which together promise that a click does
     something. A table with no onRowClick has nothing to promise, and defaulting the
     PROMISE on would make "this row does nothing" the thing an author has to remember to
     say. So the default answers the common case and the handler keeps it honest.

     Set it false on a table that is clickable but should not advertise it — a row whose
     real actions live in its own buttons, where a whole-row target would swallow them. */
  const rowsInteractive = interactiveRows && typeof onRowClick === 'function'
  /* The shell's right-edge shadow is pinned to the scrollport's right edge. With a pinned
     column that edge IS the column, so the shadow would be cast ON the controls rather
     than beside them. The pinned cell draws its own fade instead — see the SCSS. */
  const hasPinned = columns.some((c) => c.pinned)

  /* A callback ref, not an effect on a stored node: it re-binds if the scrollport is
     replaced and cleans up when it goes, without a dependency list to keep in step. */
  const fadeCleanup = useRef(null)
  const scrollRef = useCallback((node) => {
    fadeCleanup.current?.()
    fadeCleanup.current = node ? bindScrollFade(node) : null
  }, [])
  useEffect(() => () => fadeCleanup.current?.(), [])
  const expandable = typeof renderDetail === 'function'
  const totalCols = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)

  // Expanded set — controlled via `expandedKeys`, else internal state seeded by
  // `defaultExpandedKeys`. Mirrors Popover's open/defaultOpen split: expansion
  // is purely presentational, so uncontrolled is the common case.
  const isExpandControlled = expandedKeys != null
  const [expandedState, setExpandedState] = useState(() => new Set(defaultExpandedKeys ?? []))
  const expandedSet = isExpandControlled
    ? expandedKeys instanceof Set
      ? expandedKeys
      : new Set(expandedKeys)
    : expandedState

  const toggleExpand = (key) => {
    const next = new Set(expandedSet)
    next.has(key) ? next.delete(key) : next.add(key)
    if (!isExpandControlled) setExpandedState(next)
    onExpandedChange?.([...next])
  }

  // Selection set (accepts an array or a Set). Plain code — no per-row state.
  const selected = selectedKeys instanceof Set ? selectedKeys : new Set(selectedKeys ?? [])
  const allKeys = data.map((row, i) => rowKeyOf(row, i, getRowKey))
  const selectedCount = allKeys.filter((k) => selected.has(k)).length
  const allSelected = data.length > 0 && selectedCount === data.length
  const someSelected = selectedCount > 0 && !allSelected

  const emitSelection = (next) => onSelectionChange?.([...next])

  const toggleAll = () => {
    if (!onSelectionChange) return
    emitSelection(allSelected ? new Set() : new Set(allKeys))
  }

  const toggleRow = (key) => {
    if (!onSelectionChange) return
    const next = new Set(selected)
    next.has(key) ? next.delete(key) : next.add(key)
    emitSelection(next)
  }

  const handleSort = (col) => {
    if (!col.sortable || !onSortChange) return
    const isActive = sort?.key === col.key
    const direction = isActive && sort?.direction === 'asc' ? 'desc' : 'asc'
    onSortChange({ key: col.key, direction })
  }

  const headerCell = (col) => {
    const active = sort?.key === col.key
    const dir = active ? sort.direction : undefined
    const content = col.header ?? col.key
    return (
      <th
        key={col.key}
        scope="col"
        style={col.width ? { width: col.width } : undefined}
        aria-sort={col.sortable ? (active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
        className={cx(
          'vds-table__th',
          col.pinned && 'vds-table__cell--pinned',
          `vds-table__cell--${alignOf(col, data)}`,
          col.sortable && 'vds-table__th--sortable',
          active && 'vds-table__th--active',
          col.headerClassName,
        )}
      >
        {col.sortable && onSortChange ? (
          <button type="button" className="vds-table__sort-btn" onClick={() => handleSort(col)}>
            <span>{content}</span>
            <SortGlyph direction={dir} />
          </button>
        ) : (
          content
        )}
      </th>
    )
  }

  const bodyRows = () => {
    if (loading) {
      return Array.from({ length: skeletonRows }).map((_, i) => (
        <tr key={`sk-${i}`} className="vds-table__row vds-table__row--skeleton">
          {expandable && <td className="vds-table__td vds-table__cell--expand" />}
          {selectable && (
            <td className="vds-table__td vds-table__cell--select">
              <span
                className="vds-table__skeleton"
                style={{ width: 'var(--vds-space-4)' }}
                aria-hidden="true"
              />
            </td>
          )}
          {columns.map((col) => (
            <td
              key={col.key}
              data-label={responsive ? labelOf(col) : undefined}
              className={cx('vds-table__td', `vds-table__cell--${alignOf(col, data)}`)}
            >
              <span className="vds-table__skeleton" aria-hidden="true" />
            </td>
          ))}
        </tr>
      ))
    }

    if (data.length === 0) {
      return (
        <tr className="vds-table__row vds-table__row--empty">
          <td className="vds-table__td vds-table__empty" colSpan={totalCols}>
            {empty}
          </td>
        </tr>
      )
    }

    return data.map((row, i) => {
      const key = rowKeyOf(row, i, getRowKey)
      const isSelected = selected.has(key)
      const isExpanded = expandable && expandedSet.has(key)
      const detailId = `${detailBaseId}-${i}`
      return (
        <Fragment key={key}>
          <tr
            className={cx(
              'vds-table__row',
              rowsInteractive && 'vds-table__row--interactive',
              isSelected && 'vds-table__row--selected',
              isExpanded && 'vds-table__row--expanded',
            )}
            aria-selected={selectable ? isSelected : undefined}
            onClick={rowsInteractive ? () => onRowClick(row, i) : undefined}
            onKeyDown={
              rowsInteractive
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onRowClick(row, i)
                    }
                  }
                : undefined
            }
            tabIndex={rowsInteractive ? 0 : undefined}
            role={rowsInteractive ? 'button' : undefined}
          >
            {expandable && (
              // Stop propagation so the caret never fires the row's onClick.
              <td
                className="vds-table__td vds-table__cell--expand"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="vds-table__expand-btn"
                  aria-expanded={isExpanded}
                  aria-controls={isExpanded ? detailId : undefined}
                  aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                  onClick={() => toggleExpand(key)}
                >
                  <ExpandGlyph />
                </button>
              </td>
            )}
            {selectable && (
              // Stop propagation so toggling the box never fires the row's onClick.
              <td
                className="vds-table__td vds-table__cell--select"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleRow(key)}
                  aria-label={`Select row ${i + 1}`}
                />
              </td>
            )}
            {columns.map((col) => (
              <td
                key={col.key}
                data-label={responsive ? labelOf(col) : undefined}
                className={cx('vds-table__td', `vds-table__cell--${alignOf(col, data)}`, col.pinned && 'vds-table__cell--pinned', col.className)}
              >
                {cellOf(col, row, i)}
              </td>
            ))}
          </tr>
          {isExpanded && (
            <tr className="vds-table__row vds-table__row--detail">
              <td className="vds-table__td vds-table__detail" colSpan={totalCols} id={detailId}>
                {renderDetail(row, i)}
              </td>
            </tr>
          )}
        </Fragment>
      )
    })
  }

  return (
    <Surface
      ref={ref}
      padding={null}
      // Default: let the table's own 6px corner apply (no Surface radius class).
      // Pass `radius` to opt into a token step instead.
      radius={radius ?? null}
      className={cx(
        'vds-table',
        `vds-table--${density}`,
        verticalAlign === 'top' && 'vds-table--valign-top',
        zebra && 'vds-table--zebra',
        stickyHeader && 'vds-table--sticky',
        responsive && 'vds-table--responsive',
        rowsInteractive && 'vds-table--row-interactive',
        hasPinned && 'vds-table--has-pinned',
        className,
      )}
      {...props}
    >
      <div
        ref={scrollRef}
        className="vds-table__scroll"
        style={maxHeight != null ? { maxHeight, overflowY: 'auto' } : undefined}
      >
        <table
          className="vds-table__el"
          style={minWidth != null ? { minWidth } : undefined}
          aria-describedby={caption ? captionId : undefined}
        >
          {caption && (
            <caption id={captionId} className="vds-table__caption">
              {caption}
            </caption>
          )}
          <thead className="vds-table__head">
            <tr>
              {expandable && <th scope="col" className="vds-table__th vds-table__cell--expand" />}
              {selectable && (
                <th scope="col" className="vds-table__th vds-table__cell--select">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map(headerCell)}
            </tr>
          </thead>
          <tbody className="vds-table__body">{bodyRows()}</tbody>
        </table>
      </div>
      {footer && <div className="vds-table__footer">{footer}</div>}
    </Surface>
  )
})

Table.displayName = 'Table'
