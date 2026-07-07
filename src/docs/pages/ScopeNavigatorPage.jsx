import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
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

function ScopeDemo({ initialPath = [], variant }) {
  const [path, setPath] = useState(initialPath)
  return (
    <div style={{ width: '100%', flex: '1 1 100%' }}>
      <ScopeNavigator path={path} onNavigate={setPath} rootItems={TREE} variant={variant} />
    </div>
  )
}

export function ScopeNavigatorPage() {
  return (
    <ComponentPage
      title="Scope Navigator"
      description="The top bar that shows where you are in the account tree (distributor → reseller → customer) and lets you move around it. Open any level's dropdown to search, sort, filter, and jump to another account. When the trail gets too long, the middle folds into a “…” menu, and every dropdown stays on screen. Uses Surface + Input + Icon."
      installCode={`import { ScopeNavigator } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'path' }, { code: 'Entity[]' }, { code: '[]' }, 'The trail from root to where you are now; [] = the root'],
            [{ code: 'onNavigate' }, { code: '(next: Entity[]) => void' }, '—', 'Runs whenever you move or jump'],
            [{ code: 'rootItems' }, { code: 'Entity[]' }, { code: '[]' }, 'The top-level accounts in the root dropdown'],
            [{ code: 'rootLabel' }, { code: 'string' }, { code: "'All Accounts'" }, 'Text for the first segment'],
            [{ code: 'rootIcon' }, { code: 'icon component' }, { code: 'Boxes' }, 'Icon for the first segment'],
            [{ code: 'typeConfig' }, { code: 'Record<type, {label,icon,tone}>' }, { code: 'Vipre taxonomy' }, 'How each account type looks (order = the levels)'],
            [{ code: 'statusConfig' }, { code: 'Record<status, {label,tone,description}>' }, { code: 'active/trial/suspended' }, 'Status dots and the dropdown filter (order = sort order)'],
            [{ code: 'sortOptions' }, { code: '{value,label}[]' }, { code: 'defaultSortOptions' }, 'The sort choices in the dropdown'],
            [{ code: 'variant' }, { code: "'full' | 'basic'" }, { code: "'full'" }, "'basic' = a tighter, plainer trail (same dropdown)"],
            [{ code: 'teleportedSegments' }, { code: 'Set<id>' }, '—', 'Segment ids to flash after a jump'],
          ],
        },
        {
          name: 'Entity shape',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'A unique id that stays the same'],
            [{ code: 'name' }, { code: 'string' }, 'The name shown'],
            [{ code: 'type' }, { code: 'string' }, 'A key in typeConfig (distributor / reseller / customer)'],
            [{ code: 'status' }, { code: 'string' }, 'A key in statusConfig'],
            [{ code: 'children' }, { code: 'Entity[]' }, 'The accounts directly below it (what the dropdown lists)'],
          ],
        },
      ]}
      colors={COMPONENT_COLORS.ScopeNavigator}
      accessibility={[
        <>The bar is a real <IC>{'<nav>'}</IC>; every segment, arrow, and result is a <IC>{'<button>'}</IC> you can tab to, with a visible <IC>:focus-visible</IC> ring.</>,
        <>Status is never shown by color alone — each dot has a <IC>title</IC> that says what it means, and the dropdown filter lists the names.</>,
        <>Icons that are just for looks are <IC>aria-hidden</IC>; the arrow has <IC>aria-expanded</IC>, and the folded “…” menu has a label.</>,
        <>The flash after a jump obeys <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="At the root"
        note="The starting state — “All Accounts”. Open the arrow to go into the top-level distributors; search, sort, and filter inside the dropdown. The bar matches the current theme — flip the docs theme to see it on the navy."
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
        title="Basic (compact)"
        note="A tighter, plainer trail for small spaces — shorter pills, smaller chips, arrow, and chevrons. It works exactly like the full version and has the same dropdown; only the bar takes less room."
      >
        <Preview
          popover
          canvas={<ScopeDemo variant="basic" initialPath={[TREE[0], TREE[0].children[0]]} />}
          code={`<ScopeNavigator
  variant="basic"
  path={path}
  onNavigate={setPath}
  rootItems={accounts}
/>`}
        />
      </Section>

      <Section
        title="Drilled in"
        note="A trail of distributor → reseller → customer. Where you are now is the solid pill on the right; the ones above it are faded. Each segment's arrow opens its own children."
      >
        <Preview
          popover
          canvas={<ScopeDemo initialPath={DEEP_PATH} />}
          code={`<ScopeNavigator path={[distributor, reseller, customer]} onNavigate={setPath} … />`}
        />
      </Section>

      <Section
        title="Responsive collapse"
        note="Make the window (or this canvas) narrower: the middle of the trail folds into a “…” menu, but the root and where you are now always stay visible. It measures the width first, so it doesn't flicker."
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

      <Section
        title="Markup"
        note="The trail's rendered HTML with the vds- classes, for teams not using React — but this component is behavior-heavy. The dropdown (search, sort, filter, jump), the width-measuring collapse into the '…' menu, and the teleport flash are all JS; in plain HTML you get the static trail only."
      >
        <Code>{`<nav class="vds-scope" aria-label="Account scope">
  <div class="vds-scope__trail">
    <!-- one segment per level; the current one gets --active -->
    <div class="vds-scope__seg">
      <div class="vds-scope__crumb vds-scope__crumb--has-caret">
        <button type="button" class="vds-scope__crumb-main vds-scope__crumb-main--clickable">
          <span class="vds-scope__chip vds-scope__chip--sm">…type icon…</span>
          <span class="vds-scope__label">All Accounts</span>
        </button>
        <button type="button" class="vds-scope__caret"
                aria-label="Drill into this scope" aria-expanded="false">
          <svg class="vds-icon" width="14" height="14" aria-hidden="true">…</svg>
        </button>
      </div>
      <!-- the drill-down panel (vds-scope__pop) is JS-rendered while open -->
    </div>

    <svg class="vds-scope__sep" aria-hidden="true">…chevron…</svg>

    <div class="vds-scope__seg vds-scope__seg--active">
      <div class="vds-scope__crumb vds-scope__crumb--active">
        <button type="button" class="vds-scope__crumb-main">
          <span class="vds-scope__chip vds-scope__chip--sm">…</span>
          <span class="vds-scope__label">Acme Manufacturing</span>
        </button>
      </div>
    </div>
  </div>
</nav>

<!-- compact variant: <nav class="vds-scope vds-scope--basic">.
     collapsed middle: a vds-scope__ellipsis button + its JS-rendered menu. -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
