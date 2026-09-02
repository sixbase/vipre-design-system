import { useMemo, useState } from 'react'
import { DocPage } from '../DocPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { Inline, ProductTile, Stack, Table, Text } from '../../components/index.js'
import { GLYPHS } from '../templateData.js'


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
