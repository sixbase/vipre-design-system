import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC, Kbd } from '../primitives.jsx'
import { Tooltip } from '../../components/Tooltip/index.js'
import { Button, Icon } from '../../components/index.js'
import { Pencil, Radar, Trash2 } from '@icons'

export function TooltipPage() {
  return (
    <ComponentPage
      title="Tooltip"
      description="A small dark chip that names or explains the thing under the pointer. Wrap exactly one focusable element. Hover shows it after a short delay; keyboard focus shows it right away. It flips to the other side when there's no room, never steals focus, and never blocks a click."
      installCode={`import { Tooltip } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'content' }, { code: 'node' }, '—', 'What the chip says. Keep it short — it\'s a hint, not a paragraph.'],
            [{ code: 'placement' }, { code: "'top' | 'bottom' | 'left' | 'right'" }, { code: "'top'" }, 'Preferred side. It flips on its own when there\'s no room, and slides to stay on screen.'],
            [{ code: 'delay' }, { code: 'number' }, { code: '300' }, 'ms before it shows on hover. Focus shows it instantly. Sweeping across a row of triggers skips the wait.'],
            [{ code: 'children' }, { code: 'ReactElement' }, '—', 'Exactly one focusable element — the trigger.'],
          ],
        },
      ]}
      accessibility={[
        <>The chip is <IC>role="tooltip"</IC>. While it's visible, the trigger gets <IC>aria-describedby</IC> pointing at it — screen readers read it as a description.</>,
        <>Keyboard focus shows it (no delay); blur and <Kbd>Esc</Kbd> hide it. It works without a mouse.</>,
        <>A tooltip is a description, not a name. Icon-only buttons still need their own <IC>aria-label</IC>.</>,
        <>On touch screens there's no hover — it shows on keyboard focus and long-press instead.</>,
        <>Never put anything essential in a tooltip. If people must read it, put it on the page.</>,
        <>The tiny fade is skipped for people with <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="Basic"
        note="Wrap one focusable element and give it content. Hover waits ~300ms; Tab to it and it shows instantly."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Tooltip content="Runs a full scan on every device at this site">
                <Button variant="outline" tone="neutral">Scan all</Button>
              </Tooltip>
              <Tooltip content="Download this table as CSV">
                <Button variant="outline" tone="neutral">Export</Button>
              </Tooltip>
            </div>
          }
          code={`<Tooltip content="Runs a full scan on every device at this site">
  <Button variant="outline" tone="neutral">Scan all</Button>
</Tooltip>`}
        />
      </Section>

      <Section
        title="Placement"
        note="Four sides. The side is a preference — when there's no room, it flips to the opposite side and the arrow keeps pointing at the trigger."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['top', 'bottom', 'left', 'right'].map((p) => (
                <Tooltip key={p} content={`placement="${p}"`} placement={p}>
                  <Button variant="ghost">{p}</Button>
                </Tooltip>
              ))}
            </div>
          }
          code={`<Tooltip content="…" placement="top">…</Tooltip>    // the default
<Tooltip content="…" placement="bottom">…</Tooltip>
<Tooltip content="…" placement="left">…</Tooltip>
<Tooltip content="…" placement="right">…</Tooltip>`}
        />
      </Section>

      <Section
        title="Icon-only buttons"
        note="The classic use: a toolbar of icons. The tooltip explains; the aria-label names. You need both."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <Tooltip content="Rescan this device">
                <Button variant="ghost" iconOnly aria-label="Rescan"><Icon as={Radar} size="sm" /></Button>
              </Tooltip>
              <Tooltip content="Rename">
                <Button variant="ghost" iconOnly aria-label="Rename"><Icon as={Pencil} size="sm" /></Button>
              </Tooltip>
              <Tooltip content="Remove from this site">
                <Button variant="ghost" tone="danger" iconOnly aria-label="Remove"><Icon as={Trash2} size="sm" /></Button>
              </Tooltip>
            </div>
          }
          code={`<Tooltip content="Rescan this device">
  <Button variant="ghost" iconOnly aria-label="Rescan">
    <Icon as={Radar} size="sm" />
  </Button>
</Tooltip>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML, for teams using the CSS bundle without React. The chip is position: fixed and portaled to <body>; showing/hiding, placement, flipping, and the arrow offset (--_tt-arrow) are JavaScript you'd have to wire yourself."
      >
        <Code>{`<!-- The trigger, with aria-describedby while the tip is visible -->
<button class="vds-button …" aria-label="Rescan" aria-describedby="tip-1">…</button>

<!-- The chip, portaled to <body>. Sides: vds-tooltip--top | --bottom | --left | --right -->
<div id="tip-1" role="tooltip" class="vds-tooltip vds-tooltip--top"
     style="top: 120px; left: 340px; --_tt-arrow: 48px;">
  Rescan this device
  <span class="vds-tooltip__arrow" aria-hidden="true"></span>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
