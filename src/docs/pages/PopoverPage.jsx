import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Popover, Button, Text, menuKeyDown } from '../../components/index.js'

export function PopoverPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Popover}
      title="Popover"
      description="The floating-panel building block. A trigger opens a little panel right next to it, and the panel always stays on screen: it flips above the trigger when there's no room below, slides left or right to stay in view, and caps its height so it scrolls instead of running off the edge. Clicking outside or pressing Escape closes it; Escape also puts focus back on the trigger. Build every dropdown, menu, and search box on top of this instead of redoing placement and focus each time."
      installCode={`import { Popover } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'trigger' }, { code: 'ReactElement' }, '—', 'The button the panel opens from (it gets a ref, ARIA, and toggle wired in)'],
            [{ code: 'children' }, { code: 'node | ({ close }) => node' }, '—', 'What goes inside the panel; if you pass a function, it hands you a close() helper'],
            [{ code: 'placement' }, { code: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'" }, { code: "'bottom-start'" }, 'Where you\'d like it to open — it flips on its own if there\'s no room'],
            [{ code: 'gap' }, { code: 'number' }, { code: '6' }, 'The px of space between the trigger and the panel'],
            [{ code: 'matchWidth' }, { code: 'boolean' }, { code: 'false' }, 'Makes the panel at least as wide as the trigger'],
            [{ code: 'role' }, { code: "'dialog' | 'menu' | 'listbox'" }, { code: "'dialog'" }, 'What kind of panel it is, plus the matching aria-haspopup'],
            [{ code: 'open / defaultOpen / onOpenChange' }, { code: 'boolean / fn' }, '—', 'Let it open and close itself, or drive it yourself'],
          ],
        },
      ]}
      accessibility={[
        <>The trigger gets <IC>aria-haspopup</IC> and <IC>aria-expanded</IC>, and while it's open, <IC>aria-controls</IC> pointing at the panel.</>,
        <>When it opens, focus jumps to the first thing you can click inside; <IC>Esc</IC> closes it and sends focus back to the trigger.</>,
        <>Clicking outside (<IC>mousedown</IC>) closes it. It respects <IC>prefers-reduced-motion</IC>, so there's no open animation for people who turn motion off.</>
      ]}
    >
      <Section title="Basic menu" note="The same dropdown look and arrow-key behavior Select uses — drop in the standard vds-popover__menu / __item and hook up menuKeyDown. Try it near the bottom of the window: the panel flips upward so you can still see it.">
        <Preview
          popover
          reserve={260}
          canvas={
            <Popover role="menu" matchWidth trigger={<Button variant="secondary">Options</Button>}>
              {({ close }) => (
                <div className="vds-popover__menu" role="none" onKeyDown={menuKeyDown}>
                  <button className="vds-popover__item" role="menuitem" onClick={close}>Rename</button>
                  <button className="vds-popover__item" role="menuitem" onClick={close}>Duplicate</button>
                  <button className="vds-popover__item" role="menuitem" onClick={close}>Archive</button>
                </div>
              )}
            </Popover>
          }
          code={`<Popover role="menu" trigger={<Button variant="secondary">Options</Button>}>
  {({ close }) => (
    <div className="vds-popover__menu" onKeyDown={menuKeyDown}>
      <button className="vds-popover__item" role="menuitem" onClick={close}>Rename</button>
      <button className="vds-popover__item" role="menuitem" onClick={close}>Duplicate</button>
      <button className="vds-popover__item" role="menuitem" onClick={close}>Archive</button>
    </div>
  )}
</Popover>`}
        />
      </Section>

      <Section title="Placement" note="The -start / -end part picks which edge it lines up with; the side flips when there isn't enough room.">
        <Preview
          popover
          reserve={260}
          canvas={
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Popover placement="bottom-start" trigger={<Button variant="ghost">bottom-start</Button>}>
                <div style={{ padding: '0.75rem' }}><Text variant="detail">Aligned to the left edge</Text></div>
              </Popover>
              <Popover placement="bottom-end" trigger={<Button variant="ghost">bottom-end</Button>}>
                <div style={{ padding: '0.75rem' }}><Text variant="detail">Aligned to the right edge</Text></div>
              </Popover>
            </div>
          }
          code={`<Popover placement="bottom-end" trigger={…}>…</Popover>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Almost everything Popover does is JS: measuring and placing the panel (it's position: absolute with inline top/left), flipping when space runs out, outside-click / Escape to close, and moving focus. The panel only exists in the DOM while open."
      >
        <Code>{`<div class="vds-popover">
  <!-- your trigger, with the ARIA the JS keeps in sync -->
  <button class="vds-button vds-button--outline vds-button--neutral vds-button--md"
          aria-haspopup="menu" aria-expanded="true" aria-controls="pop-1">
    Options
  </button>

  <!-- open panel: a Surface, positioned by JS (inline top/left/max-height) -->
  <div id="pop-1" class="vds-surface vds-surface--radius-md vds-surface--bordered
                         vds-surface--elev-overlay vds-popover__panel"
       role="menu" tabindex="-1" style="position:absolute; top:…; left:…">
    <!-- the standard dropdown list shared by Select / TimeframeSelect -->
    <div class="vds-popover__menu">
      <button type="button" role="menuitem" class="vds-popover__item">Rename</button>
      <button type="button" role="menuitem" class="vds-popover__item">Duplicate</button>
      <button type="button" role="menuitem"
              class="vds-popover__item vds-popover__item--active">Archive</button>
    </div>
  </div>
</div>

<!-- vds-popover__panel--up is added when the panel flips above the trigger -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
