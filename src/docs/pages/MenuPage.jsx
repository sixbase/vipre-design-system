import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC, Kbd } from '../primitives.jsx'
import { Menu, MenuItem, MenuSeparator, MenuLabel } from '../../components/Menu/index.js'
import { Button } from '../../components/index.js'
import { Copy, Download, Pencil, Radar, Trash2 } from '@icons'

export function MenuPage() {
  return (
    <ComponentPage
      title="Menu"
      description="A dropdown list of actions. Click the trigger, pick an action, the menu closes. It's built on Popover, so placement (flip + clamp), outside-click and Escape dismissal, and focus return all come from one shared implementation. Arrow keys move, letters jump to matching items, Enter picks."
      installCode={`import { Menu, MenuItem, MenuSeparator, MenuLabel } from 'vipre-design-system'`}
      props={[
        {
          name: 'Menu',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'trigger' }, { code: 'ReactElement' }, '—', 'The button that opens it. Gets aria-haspopup / aria-expanded and the toggle wired in.'],
            [{ code: 'children' }, { code: 'node' }, '—', 'MenuItem, MenuSeparator, and MenuLabel nodes.'],
            [{ code: 'placement' }, { code: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'" }, { code: "'bottom-start'" }, 'Preferred spot. Flips on its own when there\'s no room.'],
            [{ code: 'aria-label' }, { code: 'string' }, '—', 'Name for the menu. Recommended when the trigger is icon-only.'],
            [{ code: 'open / defaultOpen / onOpenChange' }, { code: 'boolean / fn' }, '—', 'Drive it yourself, or let it manage itself (Popover props pass through).'],
          ],
        },
        {
          name: 'MenuItem',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'onSelect' }, { code: '() => void' }, '—', 'The action. Runs on pick; the menu closes and focus returns to the trigger.'],
            [{ code: 'icon' }, { code: 'component' }, '—', 'An icon from @icons, shown before the label.'],
            [{ code: 'danger' }, { code: 'boolean' }, { code: 'false' }, 'Red styling for destructive actions.'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Can\'t be picked; arrow keys skip it.'],
            [{ code: 'trailing' }, { code: 'node' }, '—', 'Something after the label — usually a keyboard hint.'],
          ],
        },
      ]}
      accessibility={[
        <>The panel is <IC>role="menu"</IC>; items are <IC>role="menuitem"</IC>. The trigger gets <IC>aria-haspopup="menu"</IC> and <IC>aria-expanded</IC>.</>,
        <><Kbd>↑</Kbd> <Kbd>↓</Kbd> move between items (wrapping, skipping disabled ones); <Kbd>Home</Kbd> / <Kbd>End</Kbd> jump to the first / last.</>,
        <>Typing letters jumps to the first item that starts with them (typeahead).</>,
        <><Kbd>Enter</Kbd> or <Kbd>Space</Kbd> picks; <Kbd>Esc</Kbd> closes and puts focus back on the trigger. Clicking outside closes too.</>,
        <>On touch screens, rows grow to the minimum tap target (<IC>--vds-tap-target</IC>).</>,
      ]}
    >
      <Section
        title="Basic"
        note="Give it a trigger and some MenuItems. Picking an item runs onSelect and closes the menu. Try the keyboard: arrows, letters, Enter, Escape."
      >
        <Preview
          popover
          reserve={280}
          canvas={
            <Menu trigger={<Button variant="outline" tone="neutral">Actions</Button>} aria-label="Device actions">
              <MenuItem icon={Radar} onSelect={() => {}}>Rescan</MenuItem>
              <MenuItem icon={Pencil} onSelect={() => {}}>Rename</MenuItem>
              <MenuItem icon={Copy} onSelect={() => {}}>Duplicate policy</MenuItem>
              <MenuSeparator />
              <MenuItem icon={Trash2} danger onSelect={() => {}}>Remove device</MenuItem>
            </Menu>
          }
          code={`<Menu trigger={<Button variant="outline" tone="neutral">Actions</Button>} aria-label="Device actions">
  <MenuItem icon={Radar} onSelect={rescan}>Rescan</MenuItem>
  <MenuItem icon={Pencil} onSelect={rename}>Rename</MenuItem>
  <MenuItem icon={Copy} onSelect={duplicate}>Duplicate policy</MenuItem>
  <MenuSeparator />
  <MenuItem icon={Trash2} danger onSelect={remove}>Remove device</MenuItem>
</Menu>`}
        />
      </Section>

      <Section
        title="Labels, hints, disabled"
        note="MenuLabel names a group without being clickable. trailing holds a keyboard hint. Disabled items are dimmed and skipped by the arrow keys."
      >
        <Preview
          popover
          reserve={320}
          canvas={
            <Menu trigger={<Button variant="outline" tone="neutral">Report</Button>} aria-label="Report actions">
              <MenuLabel>Export</MenuLabel>
              <MenuItem icon={Download} onSelect={() => {}} trailing="⌘E">CSV</MenuItem>
              <MenuItem icon={Download} onSelect={() => {}}>PDF</MenuItem>
              <MenuSeparator />
              <MenuLabel>Schedule</MenuLabel>
              <MenuItem onSelect={() => {}}>Email weekly</MenuItem>
              <MenuItem disabled>Email daily (Pro only)</MenuItem>
            </Menu>
          }
          code={`<Menu trigger={<Button variant="outline" tone="neutral">Report</Button>} aria-label="Report actions">
  <MenuLabel>Export</MenuLabel>
  <MenuItem icon={Download} onSelect={exportCsv} trailing="⌘E">CSV</MenuItem>
  <MenuItem icon={Download} onSelect={exportPdf}>PDF</MenuItem>
  <MenuSeparator />
  <MenuLabel>Schedule</MenuLabel>
  <MenuItem onSelect={emailWeekly}>Email weekly</MenuItem>
  <MenuItem disabled>Email daily (Pro only)</MenuItem>
</Menu>`}
        />
      </Section>

      <Section
        title="Placement"
        note="Same options as Popover. bottom-end lines the panel up with the trigger's right edge — the usual pick for a menu at the end of a table row."
      >
        <Preview
          popover
          reserve={240}
          canvas={
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Menu placement="bottom-start" trigger={<Button variant="ghost">bottom-start</Button>} aria-label="Example menu">
                <MenuItem onSelect={() => {}}>Lines up with the left edge</MenuItem>
              </Menu>
              <Menu placement="bottom-end" trigger={<Button variant="ghost">bottom-end</Button>} aria-label="Example menu">
                <MenuItem onSelect={() => {}}>Lines up with the right edge</MenuItem>
              </Menu>
            </div>
          }
          code={`<Menu placement="bottom-end" trigger={…}>…</Menu>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML while open, for teams using the CSS bundle without React. Rows reuse the shared vds-popover__item look, so every dropdown in the system matches. Opening/closing, positioning, and the keyboard model are JavaScript you'd have to wire yourself."
      >
        <Code>{`<div class="vds-popover vds-menu">
  <button class="vds-button …" aria-haspopup="menu" aria-expanded="true" aria-controls="menu-1">Actions</button>
  <div id="menu-1" role="menu"
       class="vds-surface vds-surface--radius-md vds-surface--bordered vds-surface--elev-overlay vds-popover__panel vds-menu__panel"
       tabindex="-1" style="position: absolute; top: …; left: …;">
    <div class="vds-popover__menu vds-menu__list" role="none">
      <button class="vds-popover__item vds-menu__item" role="menuitem">
        <svg class="vds-icon vds-menu__item-icon" …>…</svg>
        <span class="vds-menu__item-label">Rename</span>
        <span class="vds-menu__item-trailing">⌘R</span>
      </button>
      <div class="vds-menu__label" role="presentation">Danger zone</div>
      <div class="vds-menu__separator" role="separator" aria-orientation="horizontal"></div>
      <button class="vds-popover__item vds-menu__item vds-menu__item--danger" role="menuitem">
        <span class="vds-menu__item-label">Remove device</span>
      </button>
    </div>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
