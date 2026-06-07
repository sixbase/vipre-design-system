import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { ScopeNavigator } from '../../components/index.js'
import { COMPONENT_COLORS } from '../colorUsage.js'

/* ----------------------------------------------------------------------------
   A small demo account tree (distributor → reseller → customer) with statuses
   and child counts, so the drill-down dropdowns + responsive collapse have real
   data to walk.
   -------------------------------------------------------------------------- */
const customer = (id, name, status) => ({ id, name, type: 'customer', status })

const TREE = [
  {
    id: 'd1',
    name: 'Ingram Micro EMEA',
    type: 'distributor',
    status: 'active',
    children: [
      {
        id: 'r1',
        name: 'Northwind Managed Services',
        type: 'reseller',
        status: 'active',
        children: [
          customer('c1', 'Acme Manufacturing', 'active'),
          customer('c2', 'Belmont Legal Group', 'trial'),
          customer('c3', 'Crestview Health', 'active'),
          customer('c4', 'Dunmore Logistics', 'suspended'),
        ],
      },
      {
        id: 'r2',
        name: 'Harbor Point IT',
        type: 'reseller',
        status: 'trial',
        children: [
          customer('c5', 'Evergreen Realty', 'active'),
          customer('c6', 'Fairlane Motors', 'active'),
        ],
      },
      {
        id: 'r3',
        name: 'Summit Cloud Partners',
        type: 'reseller',
        status: 'active',
        children: [customer('c7', 'Granite Financial', 'active')],
      },
    ],
  },
  {
    id: 'd2',
    name: 'TD Synnex Nordics',
    type: 'distributor',
    status: 'active',
    children: [
      {
        id: 'r4',
        name: 'Fjord Security',
        type: 'reseller',
        status: 'active',
        children: [customer('c8', 'Helsinki Dental', 'active'), customer('c9', 'Idun Retail', 'trial')],
      },
    ],
  },
]

/* Path to a deep customer, used to demo the collapse behavior. */
const DEEP_PATH = [TREE[0], TREE[0].children[0], TREE[0].children[0].children[0]]

function ScopeDemo({ initialPath = [] }) {
  const [path, setPath] = useState(initialPath)
  return (
    <div style={{ width: '100%', flex: '1 1 100%' }}>
      <ScopeNavigator path={path} onNavigate={setPath} rootItems={TREE} />
    </div>
  )
}

export function ScopeNavigatorPage() {
  return (
    <ComponentPage
      title="Scope Navigator"
      description="The MSP hierarchy breadcrumb — the top bar that lets an operator walk an account tree (distributor → reseller → customer), drill into any level via a searchable / sortable / filterable dropdown, and jump scope. The middle of a deep trail collapses into a “…” menu as space tightens, and every popover stays inside the viewport. Composes Surface + Input + Icon."
      installCode={`import { ScopeNavigator } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'path' }, { code: 'Entity[]' }, { code: '[]' }, 'Root→current entities; [] = the root scope'],
            [{ code: 'onNavigate' }, { code: '(next: Entity[]) => void' }, '—', 'Fired on any drill / jump'],
            [{ code: 'rootItems' }, { code: 'Entity[]' }, { code: '[]' }, 'Top-level entities in the root dropdown'],
            [{ code: 'rootLabel' }, { code: 'string' }, { code: "'All Accounts'" }, 'Label for the root segment'],
            [{ code: 'rootIcon' }, { code: 'icon component' }, { code: 'Boxes' }, 'Icon for the root segment'],
            [{ code: 'typeConfig' }, { code: 'Record<type, {label,icon,tone}>' }, { code: 'Vipre taxonomy' }, 'How each entity type renders (key order = level)'],
            [{ code: 'statusConfig' }, { code: 'Record<status, {label,tone,description}>' }, { code: 'active/trial/suspended' }, 'Status dots + dropdown filter (key order = sort)'],
            [{ code: 'sortOptions' }, { code: '{value,label}[]' }, { code: 'defaultSortOptions' }, 'Sort choices in the dropdown toolbar'],
            [{ code: 'teleportedSegments' }, { code: 'Set<id>' }, '—', 'Segment ids to flash-highlight after a jump'],
          ],
        },
        {
          name: 'Entity shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'Stable unique id'],
            [{ code: 'name' }, { code: 'string' }, 'Display name'],
            [{ code: 'type' }, { code: 'string' }, 'A key in typeConfig (distributor / reseller / customer)'],
            [{ code: 'status' }, { code: 'string' }, 'A key in statusConfig'],
            [{ code: 'children' }, { code: 'Entity[]' }, 'Direct descendants (drives the drill-down dropdown)'],
          ],
        },
      ]}
      colors={COMPONENT_COLORS.ScopeNavigator}
      accessibility={[
        <>The bar is a real <IC>{'<nav>'}</IC>; every segment, caret, and result is a focusable <IC>{'<button>'}</IC> with a visible <IC>:focus-visible</IC> ring.</>,
        <>Status is never color-only — each dot carries a <IC>title</IC> with the status meaning, and the dropdown filter lists labels.</>,
        <>Decorative icons are <IC>aria-hidden</IC>; the caret exposes <IC>aria-expanded</IC>, and the collapsed “…” menu has an accessible label.</>,
        <>The teleport highlight respects <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="At the root"
        note="The default state — “All Accounts”. Open the caret to drill into the top-level distributors; search, sort, and filter inside the dropdown. The bar follows the ambient theme — toggle the docs theme to see it on the product navy."
      >
        <Preview
          popover
          canvas={<ScopeDemo />}
          code={`<ScopeNavigator
  path={path}
  onNavigate={setPath}
  rootItems={accounts}
/>`}
        />
      </Section>

      <Section
        title="Drilled in"
        note="A path of distributor → reseller → customer. The current scope is the solid pill on the right; ancestors are translucent. Each segment’s caret drills into its own children."
      >
        <Preview
          popover
          canvas={<ScopeDemo initialPath={DEEP_PATH} />}
          code={`<ScopeNavigator path={[distributor, reseller, customer]} onNavigate={setPath} … />`}
        />
      </Section>

      <Section
        title="Responsive collapse"
        note="Narrow the window (or this canvas): the middle of the trail folds into a “…” menu, always keeping the root and the current scope visible. The collapse is width-estimated, so it’s flicker-free."
      >
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
              <ScopeDemo initialPath={DEEP_PATH} />
            </div>
          }
          code={`// Same component — it measures its container and collapses the middle
// segments into a "…" menu when the full trail won't fit.`}
        />
      </Section>
    </ComponentPage>
  )
}
