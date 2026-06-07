import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Popover, Button, Text, menuKeyDown } from '../../components/index.js'

export function PopoverPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Popover}
      title="Popover"
      description="The anchored-overlay primitive. A trigger opens a floating Surface positioned next to it — and kept on-screen: it flips above the trigger when there isn't room below, clamps left/right into the viewport, and caps its height so it scrolls instead of overflowing. Outside-click and Escape both dismiss it; Escape returns focus to the trigger. Every dropdown, menu, and combobox should compose this rather than re-solving placement and focus."
      installCode={`import { Popover } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'trigger' }, { code: 'ReactElement' }, '—', 'The focusable anchor (cloned for ref + ARIA + toggle)'],
            [{ code: 'children' }, { code: 'node | ({ close }) => node' }, '—', 'Panel content; render-prop gets a close() helper'],
            [{ code: 'placement' }, { code: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'" }, { code: "'bottom-start'" }, 'Preferred side/edge — flips automatically'],
            [{ code: 'gap' }, { code: 'number' }, { code: '6' }, 'px between trigger and panel'],
            [{ code: 'matchWidth' }, { code: 'boolean' }, { code: 'false' }, 'Panel min-width = trigger width'],
            [{ code: 'role' }, { code: "'dialog' | 'menu' | 'listbox'" }, { code: "'dialog'" }, 'Panel role + matching aria-haspopup'],
            [{ code: 'open / defaultOpen / onOpenChange' }, { code: 'boolean / fn' }, '—', 'Controlled or uncontrolled state'],
          ],
        },
      ]}
      accessibility={[
        <>The trigger gets <IC>aria-haspopup</IC>, <IC>aria-expanded</IC>, and (while open) <IC>aria-controls</IC> pointing at the panel.</>,
        <>Focus moves to the panel's first focusable element on open; <IC>Esc</IC> closes and restores focus to the trigger.</>,
        <>Dismisses on outside <IC>mousedown</IC>. Respects <IC>prefers-reduced-motion</IC> (no open animation).</>,
      ]}
    >
      <Section title="Basic menu" note="The same dropdown styling and roving-key logic Select uses — render the canonical vds-popover__menu / __item and wire menuKeyDown. Try it near the bottom of the window: the panel flips up to stay visible.">
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

      <Section title="Placement" note="The -start / -end edge is preferred; the side flips when space is tight.">
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
    </ComponentPage>
  )
}
