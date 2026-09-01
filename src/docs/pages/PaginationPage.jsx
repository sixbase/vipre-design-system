import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Pagination } from '../../components/Pagination/index.js'

function LiveExample(props) {
  const [page, setPage] = useState(props.start ?? 5)
  return <Pagination page={page} onPageChange={setPage} {...props} />
}

export function PaginationPage() {
  return (
    <ComponentPage
      title="Pagination"
      description="Buttons for moving through pages of results: previous, next, and the page numbers with '…' where numbers are skipped. You hold the page number; it calls you back when the user picks a new one. On small screens the numbers step aside for a simple 'Page 3 of 12'."
      installCode={`import { Pagination } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'page' }, { code: 'number' }, '—', 'The current page, starting at 1 (required)'],
            [{ code: 'pageCount' }, { code: 'number' }, '—', 'Total number of pages (required)'],
            [{ code: 'onPageChange' }, { code: '(page) => void' }, '—', 'Called with the page the user picked'],
            [{ code: 'siblingCount' }, { code: 'number' }, { code: '1' }, 'Numbers shown on each side of the current page'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Button size'],
            [{ code: 'showEdges' }, { code: 'boolean' }, { code: 'true' }, 'Keep page 1 and the last page always visible'],
            [{ code: 'compact' }, { code: 'boolean' }, { code: 'false' }, 'Force the “Page 3 of 12” form at every width'],
          ],
        },
      ]}
      accessibility={[
        <>Renders <IC>&lt;nav aria-label="Pagination"&gt;</IC> so it’s a named landmark.</>,
        <>Every button has an <IC>aria-label</IC> (“Go to page 7”, “Previous page”); the current page carries <IC>aria-current="page"</IC>.</>,
        <>Prev/next disable at the ends using <IC>opacity</IC> + <IC>pointer-events: none</IC>.</>,
        <>On touch screens (coarse pointers) every button grows to at least <IC>--vds-tap-target</IC> (44px).</>,
        <>Focus rings use <IC>--vds-focus-ring</IC>; transitions stop under <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="Beside a table"
        note="What a pager looks like under a list of data: the range it covers on the left, the controls on the right, and the page number typeable so you can jump instead of stepping. This is the form the product's Accounts and Devices tables use."
      >
        <Preview
          canvas={<LiveExample start={1} pageCount={129} total={1539} pageSize={12} size="sm" compact />}
          code={`<Pagination
  page={page}
  pageCount={129}
  onPageChange={setPage}
  size="sm"
  total={1539}      // rows in the whole list
  pageSize={12}     // rows on a page
  compact
/>`}
        />
        <p>
          <IC>total</IC> and <IC>pageSize</IC> give you the range — <strong>1&ndash;12 of 1,539</strong>.
          A page number says where you are in the <em>pager</em>; the range says where you are in the{' '}
          <em>data</em>, which is what someone paging a list is actually asking. And the page number is
          an input at every width: the compact form exists because the numbered buttons do not fit, so
          without a field the only way to reach page 40 of 129 is to press Next thirty-nine times.
        </p>
      </Section>

      <Section title="Basic" note="Try it — the page state lives in the demo. '…' appears where numbers are skipped.">
        <Preview
          canvas={<LiveExample pageCount={12} />}
          code={`const [page, setPage] = useState(5)

<Pagination page={page} pageCount={12} onPageChange={setPage} />`}
        />
      </Section>

      <Section title="More siblings" note="siblingCount is how many numbers hug the current page on each side.">
        <Preview
          canvas={<LiveExample pageCount={30} start={15} siblingCount={2} />}
          code={`<Pagination page={15} pageCount={30} siblingCount={2} onPageChange={setPage} />`}
        />
      </Section>

      <Section title="Small" note="size='sm' for dense tables. showEdges={false} drops the always-visible first/last page.">
        <Preview
          canvas={<LiveExample pageCount={20} start={9} size="sm" showEdges={false} />}
          code={`<Pagination page={9} pageCount={20} size="sm" showEdges={false} onPageChange={setPage} />`}
        />
      </Section>

      <Section
        title="Compact"
        note="On small screens the numbers hide by themselves. The compact prop forces this simple “Page 3 of 12” form at every width, shown here."
      >
        <Preview
          canvas={<LiveExample pageCount={12} start={3} compact />}
          code={`<Pagination page={3} pageCount={12} compact onPageChange={setPage} />
{/* renders: ‹  Page 3 of 12  › */}`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. JS you must supply yourself: the click handlers, moving aria-current, and disabling prev/next at the ends. The status span shows below sm via CSS."
      >
        <Code>{`<nav class="vds-pagination vds-pagination--md" aria-label="Pagination">
  <button class="vds-pagination__btn vds-pagination__btn--prev" aria-label="Previous page">
    <svg class="vds-icon">…</svg>
  </button>
  <ul class="vds-pagination__pages">
    <li class="vds-pagination__item">
      <button class="vds-pagination__btn vds-pagination__btn--page" aria-label="Go to page 1">1</button>
    </li>
    <li class="vds-pagination__item">
      <span class="vds-pagination__gap" aria-hidden="true">…</span>
    </li>
    <li class="vds-pagination__item">
      <button class="vds-pagination__btn vds-pagination__btn--page"
              aria-label="Page 5" aria-current="page">5</button>
    </li>
    <li class="vds-pagination__item">
      <button class="vds-pagination__btn vds-pagination__btn--page" aria-label="Go to page 12">12</button>
    </li>
  </ul>
  <span class="vds-pagination__status" aria-hidden="true">Page 5 of 12</span>
  <button class="vds-pagination__btn vds-pagination__btn--next" aria-label="Next page">
    <svg class="vds-icon">…</svg>
  </button>
</nav>`}</Code>
      </Section>
    </ComponentPage>
  )
}
