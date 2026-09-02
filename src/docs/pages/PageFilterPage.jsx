import { useMemo, useState } from 'react'
import { DocPage } from '../DocPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Inline, ProductTile, Stack, Table, Text } from '../../components/index.js'

/* Product marks and the stacks glyph — the same three the Product Tile and Table pages
   demonstrate with, plus Material Symbols' `stacks` on its native 24 grid for the row
   that stands for all of them. ProductTile measures the ink and centres it, so the two
   grids land at the same optical size. */
const GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
  stacks: 'M11.513 13.663q-.238-.063-.463-.188l-8.45-4.6q-.275-.15-.388-.375T2.1 8t.113-.5t.387-.375l8.45-4.6q.225-.125.463-.188T12 2.275t.488.063t.462.187l8.45 4.6q.275.15.388.375T21.9 8t-.113.5t-.387.375l-8.45 4.6q-.225.125-.462.188t-.488.062t-.487-.062M12 21.9q-.275 0-.525-.062t-.475-.188l-8.4-4.575q-.35-.2-.462-.575t.087-.7t.575-.45t.7.1L12 20l8.5-4.55q.325-.175.7-.087t.575.437t-.075.713t-.45.562l-8.425 4.575q-.225.125-.475.188T12 21.9m0-4.5q-.275 0-.525-.062t-.475-.188l-8.4-4.575q-.35-.2-.462-.575t.087-.7t.575-.45t.7.1L12 15.5l8.5-4.55q.325-.175.7-.087t.575.437t-.075.713t-.45.562L12.85 17.15q-.225.125-.475.188T12 17.4',
}

/* The list the filter offers. One flat array, tagged: an aggregate, then a heading row
   per group followed by its members. Exactly the shape the Table page's Grouped rows
   example uses — a page filter IS that table, given a job. */
const OPTIONS = [
  { key: 'all', isAll: true, name: 'All bundles and packages', customers: 324, trials: 112 },

  { key: 'grp-bundles', isGroup: true, group: 'Bundles' },
  { key: 'email-cloud', name: 'Email Cloud', glyph: GLYPHS.ies, customers: 58, trials: 6 },
  { key: 'atp', name: 'Advanced Threat Protection', glyph: GLYPHS.ies, customers: 57, trials: 10 },
  { key: 'ep-email', name: 'Endpoint+Email', glyph: GLYPHS.edr, customers: 55, trials: 3 },
  { key: 'total-email', name: 'Total Email Protection', glyph: GLYPHS.ies, customers: 49, trials: 3 },

  { key: 'grp-packages', isGroup: true, group: 'Packages' },
  { key: 'ies', name: 'IES', glyph: GLYPHS.ies, customers: 51, trials: 8 },
  { key: 'safesend-ai', name: 'SafeSend + AI', glyph: GLYPHS.safesend, customers: 48, trials: 5 },
  { key: 'safesend', name: 'SafeSend', glyph: GLYPHS.safesend, customers: 46, trials: 7 },
  /* Enough options to overflow the column on purpose: the pattern's whole claim is that
     each side scrolls on its own, and a list that fits never demonstrates it. */
  { key: 'ies-beta', name: 'IES BETA', glyph: GLYPHS.ies, customers: 47, trials: 4 },
  { key: 'safesend-beta', name: 'SafeSend Beta', glyph: GLYPHS.safesend, customers: 43, trials: 5 },
  { key: 'edge-defense', name: 'Edge Defense', glyph: GLYPHS.edr, customers: 40, trials: 5 },
  { key: 'edge-nordics', name: 'Edge Defense Nordics', glyph: GLYPHS.edr, customers: 45, trials: 3 },
  { key: 'vault', name: 'VaultCritical Suite', glyph: GLYPHS.ies, customers: 47, trials: 10 },
  { key: 'essentials', name: 'Essentials', glyph: GLYPHS.ies, customers: 47, trials: 12 },
]

const cell = (render) => (r) => (r.isGroup ? null : render(r))

function PageFilterDemo() {
  const [sort, setSort] = useState({ key: 'customers', direction: 'desc' })
  const [picked, setPicked] = useState('all')

  /* Sorts WITHIN each group. A plain column sort reorders every row it is handed, which
     scatters the headings and the aggregate through the list — the grouping is structure,
     not an ordering. The aggregate never sorts: ordered by customers it would sit at the
     top pretending to be the biggest package. */
  const rows = useMemo(() => {
    const out = []
    let bucket = []
    const flush = () => {
      bucket.sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av ?? '').localeCompare(String(bv ?? ''))
        return sort.direction === 'asc' ? cmp : -cmp
      })
      out.push(...bucket)
      bucket = []
    }
    for (const row of OPTIONS) {
      if (row.isAll) { out.push(row); continue }
      if (row.isGroup) { flush(); out.push(row); continue }
      bucket.push(row)
    }
    flush()
    return out
  }, [sort])

  return (
    /* A fixed height so "full height" is demonstrable in a docs page. In an app this is
       the shell's own height — the filter runs from the header to the bottom of the
       window, and neither side ever scrolls the other. */
    <div style={{ height: 560, width: '100%' }}>
    <div className="vds-page-filter">
      <div className="vds-page-filter__rail">
        <Table
          stickyHeader
          maxHeight="100%"
          data={rows}
          getRowKey={(r) => r.key}
          sort={sort}
          onSortChange={setSort}
          selectedKeys={[picked]}
          interactiveRows={(r) => !r.isGroup}
          onRowClick={(r) => setPicked(r.key)}
          rowClassName={(r) => (r.isGroup ? 'vds-table__row--heading' : undefined)}
          caption="Filter the page by bundle or package"
          columns={[
            {
              key: 'name',
              header: 'Bundles and Packages',
              sortable: true,
              render: (r) =>
                r.isGroup ? (
                  <Text as="span" variant="eyebrow" tone="subtle">{r.group}</Text>
                ) : (
                  <Inline gap={3} align="center">
                    <ProductTile glyph={r.isAll ? GLYPHS.stacks : r.glyph} tonal size={20} />
                    <Text as="span" variant="body">{r.name}</Text>
                  </Inline>
                ),
            },
            { key: 'customers', header: 'Customers', align: 'right', width: '96px', sortable: true,
              render: cell((r) => r.customers.toLocaleString()) },
            { key: 'trials', header: 'Trials', align: 'right', width: '72px', sortable: true,
              render: cell((r) => r.trials.toLocaleString()) },
          ]}
        />
      </div>

      {/* The page. It reads the selection and nothing else — the filter does not route,
          does not reload, and does not move: the answer appears beside the question. */}
      {/* A PLACEHOLDER, deliberately. What goes here is the product's page — a title, a
          panel, a dashboard, whatever the filter is filtering — and the docs have nothing
          useful to say about it. Standing in a real page here teaches the reader the page
          rather than the pattern, and every reader then has to work out which half is the
          part being documented. The pattern is the rail, the seam and the two independent
          scrolls; the right-hand side only has to hold its ground. */}
      <div className="vds-page-filter__panel">
        <div className="vds-page-filter__placeholder">
          <Text as="span" variant="caption" tone="subtle">Page content</Text>
        </div>
      </div>
    </div>
    </div>
  )
}

export function PageFilterPage() {
  return (
    <DocPage
      title="Page filter"
      description="A rail of options on the left, the page they filter on the right. Not navigation — nothing routes and nothing reloads; picking a row changes what the panel beside it is about. Built from Table, because the options carry figures and the figures have to line up."
    >
      <Section
        title="Anatomy"
        note="The filter is a full-height column and the page butts straight against it — each side scrolls on its own, so a long option list never pushes the page down and a long page never drags the filter out of reach. The rail runs to the top edge, because it is the same list whatever the page is showing; the title belongs to the half that changes. One row is always current, including the aggregate at the top, which is what “no filter” looks like when it still has to be a choice."
      >
        <Preview
          canvas={<PageFilterDemo />}
          code={`<Table
  data={rows}                        // aggregate, heading, members — one flat array
  getRowKey={(r) => r.key}
  selectedKeys={[picked]}            // the current row — no checkboxes
  interactiveRows={(r) => !r.isGroup}
  onRowClick={(r) => setPicked(r.key)}
  rowClassName={(r) => r.isGroup ? 'vds-table__row--heading' : undefined}
  columns={columns}
/>`}
        />
      </Section>

      <Section title="What makes it a filter rather than a table">
        <Stack gap={3}>
          <Text variant="body">
            <strong>One row is always current.</strong> A table can have nothing selected; a filter
            cannot, because the page has to be about something. That is why the aggregate exists as a
            row rather than as a “clear” button — <IC>All bundles and packages</IC> is not the absence
            of a filter, it is the choice to see everything, and it has to be as pickable as the rest.
          </Text>
          <Text variant="body">
            <strong>Selection without checkboxes.</strong> <IC>selectedKeys</IC> drives the current row;
            <IC>selectable</IC> is what draws the checkbox column. They are separable, and this pattern
            wants the first without the second — a checkbox says “choose several and then act”, which
            is a different promise from “this is what you are looking at”.
          </Text>
          <Text variant="body">
            <strong>It filters in place.</strong> The panel is beside the rail, not after it, so the
            question and the answer are on screen together. Anything that routes or reloads is
            navigation and belongs in the Side Nav instead.
          </Text>
          <Text variant="body">
            <strong>The headings are not options.</strong> Bundles and Packages label the groups; they
            cannot be picked, so they carry no pointer, no hover and no <IC>role=&quot;button&quot;</IC>.
            Guarding only the click handler would leave them looking pickable and doing nothing.
          </Text>
        </Stack>
      </Section>

      <Section title="Why a Table and not a list">
        <Text variant="body">
          The options carry figures, and figures have to line up. Build the rail from divs and each
          row sizes its own numbers, so the column of counts stops being a column the moment one
          option reaches four digits. A Table also brings the sort, the selected row, the keyboard
          behaviour and the header band for free — all of which this pattern needs and none of which
          is worth writing twice. The rail runs at the default density, not compact: it is a list of
          choices to be aimed at, and a filter that is hard to hit is worse than a filter that
          shows two fewer options without scrolling.
        </Text>
      </Section>
    </DocPage>
  )
}
