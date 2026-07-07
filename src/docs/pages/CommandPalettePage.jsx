import { useState } from 'react'
import { Monitor, Shield, Mail, Settings, FileText, Building2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC, Kbd as DocKbd } from '../primitives.jsx'
import { CommandPalette } from '../../components/CommandPalette/index.js'
import { Icon } from '../../components/Icon/index.js'
import { Button } from '../../components/Button/index.js'
import { Kbd } from '../../components/Kbd/index.js'

const GROUPS = [
  {
    id: 'nav',
    label: 'Go to',
    items: [
      {
        id: 'devices',
        label: 'Devices',
        icon: <Icon as={Monitor} size="sm" />,
        hint: 'G D',
        keywords: ['endpoints', 'machines'],
      },
      {
        id: 'threats',
        label: 'Threats',
        icon: <Icon as={Shield} size="sm" />,
        hint: 'G T',
        keywords: ['detections', 'quarantine'],
      },
      {
        id: 'email',
        label: 'Email security',
        icon: <Icon as={Mail} size="sm" />,
        keywords: ['phishing', 'spam'],
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      {
        id: 'scan',
        label: 'Start a scan…',
        icon: <Icon as={FileText} size="sm" />,
        keywords: ['run', 'sweep'],
      },
      {
        id: 'add-account',
        label: 'Add account…',
        icon: <Icon as={Building2} size="sm" />,
        keywords: ['customer', 'tenant', 'new'],
      },
      {
        id: 'settings',
        label: 'Open settings',
        icon: <Icon as={Settings} size="sm" />,
        keywords: ['preferences'],
      },
    ],
  },
]

function BasicDemo() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState(null)
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open palette&ensp;
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="sm">K</Kbd>
      </Button>
      {last && <span style={{ marginLeft: 'var(--vds-space-3)' }}>Picked: {last}</span>}
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        placeholder="Search customers, devices, actions…"
        groups={GROUPS}
        onSelect={(item) => setLast(item.label)}
      />
    </>
  )
}

export function CommandPalettePage() {
  return (
    <ComponentPage
      title="CommandPalette"
      description="The app-wide search overlay — the ⌘K box. Open it, type, and it filters your items as you go. Arrow keys move the highlight, Enter picks, Escape closes. You pass the items in groups; it handles the scrim, focus, scrolling, and keyboard for you. On small screens it fills the whole screen."
      installCode={`import { CommandPalette } from 'vipre-design-system'`}
      props={[
        {
          name: 'CommandPalette',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'open' }, { code: 'boolean' }, '—', 'Show or hide the palette (controlled, required)'],
            [{ code: 'onOpenChange' }, { code: '(open) => void' }, '—', 'Called with false when it wants to close'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Search…'" }, 'Search box hint text; also labels the dialog'],
            [{ code: 'groups' }, { code: '[{ id, label, items }]' }, { code: '[]' }, 'The searchable items, in labelled groups'],
            [{ code: 'onSelect' }, { code: '(item) => void' }, '—', 'Fired for any pick, after the item’s own onSelect'],
            [{ code: 'emptyMessage' }, { code: 'string' }, { code: "'No results found.'" }, 'Shown when nothing matches'],
            [{ code: 'footer' }, { code: 'node' }, 'Kbd hints', 'Replace the ↑↓ / ↵ / esc hint row'],
          ],
        },
        {
          name: 'Item',
          headers: ['Field', 'Type', 'Description'],
          rows: [
            [{ code: 'id' }, { code: 'string' }, 'Unique within the palette (required)'],
            [{ code: 'label' }, { code: 'string' }, 'What you see and what the search matches (required)'],
            [{ code: 'icon' }, { code: 'node' }, 'Small icon before the label'],
            [{ code: 'hint' }, { code: 'string' }, 'Muted text on the right — a shortcut or path'],
            [{ code: 'keywords' }, { code: 'string[]' }, 'Extra words the search also matches'],
            [{ code: 'onSelect' }, { code: '(item) => void' }, 'Runs when this item is picked'],
          ],
        },
      ]}
      accessibility={[
        <>Follows the combobox pattern: the input is <IC>role="combobox"</IC>, the results are a <IC>role="listbox"</IC>, and <IC>aria-activedescendant</IC> points at the highlighted option — focus never leaves the input.</>,
        <><DocKbd>↑</DocKbd> <DocKbd>↓</DocKbd> move the highlight (kept scrolled into view), <DocKbd>Enter</DocKbd> selects, <DocKbd>Esc</DocKbd> closes. Clicking the scrim also closes.</>,
        <>Focus is trapped while open (the input is the only tab stop) and returns to wherever you were when it closes.</>,
        <>Body scroll locks while the palette is open; the panel sits at <IC>--vds-z-modal</IC> with <IC>aria-modal="true"</IC>.</>,
        <>Rows grow to <IC>--vds-tap-target</IC> on touch screens; the open animation turns off under <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="Basic"
        note="Controlled: you hold open and pass onOpenChange. Try typing 'phish' — keywords match too, not just labels. Groups with no matches disappear."
      >
        <Preview
          canvas={<BasicDemo />}
          code={`const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open palette</Button>

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  placeholder="Search customers, devices, actions…"
  groups={[
    { id: 'nav', label: 'Go to', items: [
      { id: 'devices', label: 'Devices', icon: <Icon as={Monitor} size="sm" />,
        hint: 'G D', keywords: ['endpoints'], onSelect: () => navigate('/devices') },
    ]},
    { id: 'actions', label: 'Actions', items: [
      { id: 'scan', label: 'Start a scan…', onSelect: startScan },
    ]},
  ]}
  onSelect={(item) => track('palette_pick', item.id)}
/>`}
        />
      </Section>

      <Section
        title="Opening with ⌘K"
        note="The palette doesn't bind the shortcut for you — apps differ. Wire it with one keydown listener."
      >
        <Code>{`useEffect(() => {
  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen((o) => !o)
    }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [])`}</Code>
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. This one is JS-heavy — filtering, highlight movement, aria-activedescendant, focus trap, and scroll lock are all yours to supply. The React component is strongly recommended."
      >
        <Code>{`<div class="vds-command">
  <div class="vds-command__scrim"></div>
  <div class="vds-command__panel vds-surface vds-surface--radius-lg vds-surface--elev-overlay"
       role="dialog" aria-modal="true" aria-label="Search…">
    <div class="vds-command__search">
      <svg class="vds-icon">…search…</svg>
      <input class="vds-command__input" type="text" role="combobox"
             aria-expanded="true" aria-controls="cmd-list"
             aria-activedescendant="cmd-opt-devices" aria-autocomplete="list"
             placeholder="Search…" />
      <kbd class="vds-kbd vds-kbd--sm" aria-hidden="true">esc</kbd>
    </div>
    <div class="vds-command__list" role="listbox" id="cmd-list" aria-label="Results">
      <div class="vds-command__group" role="group" aria-label="Go to">
        <div class="vds-command__group-label" aria-hidden="true">Go to</div>
        <div class="vds-command__item vds-command__item--active" role="option"
             id="cmd-opt-devices" aria-selected="true">
          <span class="vds-command__item-icon"><svg class="vds-icon">…</svg></span>
          <span class="vds-command__item-label">Devices</span>
          <span class="vds-command__item-hint">G D</span>
        </div>
      </div>
    </div>
    <div class="vds-command__footer">
      <span class="vds-command__hint"><kbd class="vds-kbd vds-kbd--sm">↑</kbd><kbd class="vds-kbd vds-kbd--sm">↓</kbd> navigate</span>
      <span class="vds-command__hint"><kbd class="vds-kbd vds-kbd--sm">↵</kbd> select</span>
      <span class="vds-command__hint"><kbd class="vds-kbd vds-kbd--sm">esc</kbd> close</span>
    </div>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
