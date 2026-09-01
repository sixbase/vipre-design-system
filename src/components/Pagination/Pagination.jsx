import { forwardRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from '@icons'
import { cx } from '../../lib/cx.js'
import { Button } from '../Button/Button.jsx'
import { Icon } from '../Icon/index.js'

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i)
const DOTS = 'dots'

/* The list of page items to render: numbers plus 'dots' gap markers. */
function paginationRange(page, pageCount, siblingCount, showEdges) {
  if (!showEdges) {
    // Just the sliding window around the current page.
    const start = Math.max(1, page - siblingCount)
    const end = Math.min(pageCount, page + siblingCount)
    return [
      ...(start > 1 ? [DOTS] : []),
      ...range(start, end),
      ...(end < pageCount ? [DOTS] : []),
    ]
  }
  // First + last always visible; dots only when they actually hide something.
  const totalNumbers = siblingCount * 2 + 3 // siblings + current + first + last
  if (pageCount <= totalNumbers + 2) return range(1, pageCount)

  const showLeftDots = page - siblingCount > 2
  const showRightDots = page + siblingCount < pageCount - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, totalNumbers), DOTS, pageCount]
  }
  if (showLeftDots && !showRightDots) {
    return [1, DOTS, ...range(pageCount - totalNumbers + 1, pageCount)]
  }
  return [1, DOTS, ...range(page - siblingCount, page + siblingCount), DOTS, pageCount]
}

/**
 * Pagination
 *
 * Prev/next plus numbered page buttons with "…" gaps. You own the state:
 * pass `page` and handle `onPageChange`.
 *
 * Props:
 * - page:         current page (1-based, required)
 * - pageCount:    total pages (required)
 * - onPageChange: (page) => void
 * - siblingCount: numbers shown on each side of the current page (default 1)
 * - size:         'sm' | 'md'   (default 'md')
 * - showEdges:    keep page 1 and the last page always visible (default true)
 * - compact:      force the compact "Page 3 of 12" form at every width
 * - total:        total row count. With `pageSize`, renders the range this page covers
 *                 ("1–10 of 21") ahead of the controls. A page number alone says where
 *                 you are in the pager; the range says where you are in the DATA, which
 *                 is the question someone paging through a list is actually asking.
 * - pageSize:     rows per page — only used to work the range out.
 *                 (default false)
 * - all native <nav> attributes
 *
 * Responsive: below the `sm` breakpoint the number buttons hide automatically
 * (via media query — no JS) and a "Page 3 of 12" readout shows between
 * prev/next. `compact` forces that form everywhere. Touch targets grow to
 * --vds-tap-target on coarse pointers.
 *
 * Accessibility:
 * - <nav aria-label="Pagination">; every button has an aria-label; the
 *   current page carries aria-current="page".
 *
 * @example
 * <Pagination page={page} pageCount={12} onPageChange={setPage} />
 */
export const Pagination = forwardRef(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    siblingCount = 1,
    size = 'md',
    showEdges = true,
    compact = false,
    total,
    pageSize,
    className,
    ...props
  },
  ref,
) {
  const items = paginationRange(page, pageCount, siblingCount, showEdges)
  const go = (p) => {
    if (p >= 1 && p <= pageCount && p !== page) onPageChange?.(p)
  }

  /* Local draft, so the field can be empty mid-edit without the list jumping on every
     keystroke, and re-syncs whenever the page moves from outside — Prev/Next, a filter
     reset, a sort. Junk or out-of-range input snaps back to the current page rather than
     erroring: there is no wrong page to be on, only one that does not exist. */
  const [draft, setDraft] = useState(String(page))
  useEffect(() => { setDraft(String(page)) }, [page])
  const commitJump = () => {
    const n = parseInt(draft, 10)
    if (!Number.isFinite(n)) { setDraft(String(page)); return }
    const clamped = Math.min(pageCount, Math.max(1, n))
    setDraft(String(clamped))
    go(clamped)
  }

  /* The range this page covers. Clamped at the top because the last page is usually short. */
  const hasRange = Number.isFinite(total) && Number.isFinite(pageSize) && total > 0
  const from = hasRange ? (page - 1) * pageSize + 1 : null
  const to = hasRange ? Math.min(total, page * pageSize) : null

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cx(
        'vds-pagination',
        `vds-pagination--${size}`,
        compact && 'vds-pagination--compact',
        className,
      )}
      {...props}
    >
      {hasRange && (
        <span className="vds-pagination__range">
          {from.toLocaleString()}&ndash;{to.toLocaleString()} of {total.toLocaleString()}
        </span>
      )}

      <Button
        variant="ghost"
        tone="neutral"
        size="xs"
        iconOnly
        className="vds-pagination__btn vds-pagination__btn--prev"
        aria-label="Previous page"
        title="Previous page"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        <Icon as={ChevronLeft} size="sm" />
      </Button>

      <ul className="vds-pagination__pages">
        {items.map((item, i) =>
          item === DOTS ? (
            <li key={`dots-${i}`} className="vds-pagination__item">
              <span className="vds-pagination__gap" aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={item} className="vds-pagination__item">
              <button
                type="button"
                className="vds-pagination__btn vds-pagination__btn--page"
                aria-label={item === page ? `Page ${item}` : `Go to page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => go(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      {/* Compact readout — swapped in for the numbers below `sm` (or always with the
          `compact` prop), and TYPEABLE. This form exists because the numbered buttons do
          not fit; without a field the only way to reach page 40 of 129 is to press Next
          thirty-nine times, which is the exact situation the compact form creates.

          Not aria-hidden any more. It used to be, on the grounds that the prev/next
          labels already announce position — true of static text, wrong for a focusable
          input, which would have been reachable by keyboard and invisible to a screen
          reader. It carries its own label instead. */}
      <span className="vds-pagination__status">
        Page{' '}
        <input
          type="text"
          inputMode="numeric"
          className="vds-pagination__jump"
          value={draft}
          aria-label={`Page number, 1 to ${pageCount}`}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={commitJump}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commitJump(); e.currentTarget.blur() }
            if (e.key === 'Escape') { setDraft(String(page)); e.currentTarget.blur() }
          }}
          /* Scales with the largest page number so a 3-digit count does not clip. */
          style={{ width: `${Math.max(2, String(pageCount).length) + 1}ch` }}
        />{' '}
        of <span className="vds-pagination__count">{pageCount}</span>
      </span>

      <Button
        variant="ghost"
        tone="neutral"
        size="xs"
        iconOnly
        className="vds-pagination__btn vds-pagination__btn--next"
        aria-label="Next page"
        title="Next page"
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        <Icon as={ChevronRight} size="sm" />
      </Button>
    </nav>
  )
})

Pagination.displayName = 'Pagination'
