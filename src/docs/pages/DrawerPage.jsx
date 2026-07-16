import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC, Kbd } from '../primitives.jsx'
import { Drawer } from '../../components/Drawer/index.js'
import { Button, Field, Input, Text } from '../../components/index.js'

/* Each demo owns its open/close state, like other interactive doc examples. */
function BasicDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Device details</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="WKS-0142"
        footer={
          <>
            <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>Rescan device</Button>
          </>
        }
      >
        <Text variant="body" tone="muted">
          The drawer slides in from the right and the page behind it dims. Tab stays inside.
          Escape, the scrim, and the ✕ all close it — then focus goes back to the button that
          opened it.
        </Text>
      </Drawer>
    </>
  )
}

function SidesDemo() {
  const [side, setSide] = useState(null)
  return (
    <>
      {['right', 'left', 'bottom'].map((s) => (
        <Button key={s} variant="outline" tone="neutral" onClick={() => setSide(s)}>
          {s}
        </Button>
      ))}
      <Drawer
        open={side != null}
        onClose={() => setSide(null)}
        side={side ?? 'right'}
        title={`From the ${side}`}
      >
        <Text variant="body" tone="muted">
          Right is the default. Left suits navigation. Bottom becomes a sheet — handy on phones.
        </Text>
      </Drawer>
    </>
  )
}

function SizesDemo() {
  const [size, setSize] = useState(null)
  return (
    <>
      {['sm', 'md', 'lg'].map((s) => (
        <Button key={s} variant="outline" tone="neutral" onClick={() => setSize(s)}>
          {s}
        </Button>
      ))}
      <Drawer
        open={size != null}
        onClose={() => setSize(null)}
        size={size ?? 'md'}
        title={`A "${size}" drawer`}
      >
        <Text variant="body" tone="muted">
          Size sets the width for side drawers, and the height for the bottom sheet. Below the sm
          breakpoint, side drawers just take the whole width.
        </Text>
      </Drawer>
    </>
  )
}

function FormDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Edit policy
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Edit policy"
        size="lg"
        footer={
          <>
            <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vds-space-4)' }}>
          <Field label="Policy name">
            <Input defaultValue="Workstations — default" />
          </Field>
          <Field label="Scan schedule">
            <Input defaultValue="Daily at 02:00" />
          </Field>
        </div>
      </Drawer>
    </>
  )
}

export function DrawerPage() {
  return (
    <ComponentPage
      title="Drawer"
      description="A panel that slides in from the edge of the screen. Use it for detail views, filters, and forms that are too big for a Modal but shouldn't be a whole page. It works like a Modal: a scrim dims the page, focus stays inside, and Escape or a scrim click closes it. You own the open state."
      installCode={`import { Drawer } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'open' }, { code: 'boolean' }, { code: 'false' }, 'Shows the drawer. You keep this in your own state.'],
            [{ code: 'onClose' }, { code: '() => void' }, '—', 'Called when the user tries to close it (Escape, scrim click, ✕). Set open to false here.'],
            [{ code: 'side' }, { code: "'right' | 'left' | 'bottom'" }, { code: "'right'" }, 'Which edge it slides in from. bottom makes it a sheet.'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Width for side drawers, height for the bottom sheet.'],
            [{ code: 'title' }, { code: 'node' }, '—', 'Header text. Also becomes the accessible name (aria-labelledby).'],
            [{ code: 'footer' }, { code: 'node' }, '—', 'Pinned to the bottom — usually your action Buttons.'],
            [{ code: 'dismissible' }, { code: 'boolean' }, { code: 'true' }, 'When false, Escape / scrim / ✕ do nothing — only your own buttons close it.'],
          ],
        },
      ]}
      accessibility={[
        <>The panel is <IC>role="dialog"</IC> with <IC>aria-modal="true"</IC>; <IC>title</IC> is wired to <IC>aria-labelledby</IC> automatically.</>,
        <><Kbd>Tab</Kbd> and <Kbd>Shift+Tab</Kbd> cycle inside the panel — focus can't escape while it's open.</>,
        <><Kbd>Esc</Kbd> and a click on the scrim close it (unless <IC>dismissible</IC> is false). Focus returns to whatever opened it.</>,
        <>Body scroll is locked while open, so the page doesn't move behind the drawer.</>,
        <>The slide animation is skipped for people with <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="Basic"
        note="Open state lives in your component. The drawer calls onClose when the user wants out — you set open back to false."
      >
        <Preview
          canvas={<BasicDemo />}
          code={`const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Device details</Button>
<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="WKS-0142"
  footer={
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>Close</Button>
      <Button onClick={() => setOpen(false)}>Rescan device</Button>
    </>
  }
>
  …detail content…
</Drawer>`}
        />
      </Section>

      <Section
        title="Sides"
        note="Three edges. It slides in fast, then eases to a soft stop."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SidesDemo />
            </div>
          }
          code={`<Drawer side="right" … />  // the default — detail views
<Drawer side="left" … />   // navigation
<Drawer side="bottom" … /> // a sheet — caps at 90vh`}
        />
      </Section>

      <Section
        title="Sizes"
        note="Width for side drawers, height for the bottom sheet. On small screens, side drawers go full-width."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SizesDemo />
            </div>
          }
          code={`<Drawer size="sm" … /> // 20rem wide (30vh tall as a sheet)
<Drawer size="md" … /> // 26rem — the default (50vh)
<Drawer size="lg" … /> // 34rem — forms (75vh)`}
        />
      </Section>

      <Section
        title="With a form"
        note="The drawer's sweet spot: multi-field editing next to the page. The body scrolls; the header and footer stay put."
      >
        <Preview
          canvas={<FormDemo />}
          code={`<Drawer open={open} onClose={close} title="Edit policy" size="lg" footer={…}>
  <Field label="Policy name"><Input … /></Field>
  <Field label="Scan schedule"><Input … /></Field>
</Drawer>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML, for teams using the CSS bundle without React. The classes are pure CSS — but the behavior (open/close, focus trap, Escape, scroll lock, focus return) is JavaScript you'd have to wire yourself. Add vds-drawer--closing during your exit animation."
      >
        <Code>{`<!-- Portaled to <body>. Sides: vds-drawer--right | --left | --bottom. Sizes: --sm | --md | --lg -->
<div class="vds-drawer vds-drawer--right vds-drawer--md">
  <div class="vds-drawer__scrim"></div>
  <div class="vds-surface vds-surface--bordered vds-surface--elev-overlay vds-drawer__panel"
       role="dialog" aria-modal="true" aria-labelledby="d-title" tabindex="-1">
    <header class="vds-drawer__header">
      <h2 id="d-title" class="vds-text vds-heading vds-text--heading vds-drawer__title">WKS-0142</h2>
      <button class="vds-drawer__close" aria-label="Close">…icon…</button>
    </header>
    <div class="vds-drawer__body">…content…</div>
    <footer class="vds-drawer__footer">
      <button class="vds-button vds-button--outline vds-button--neutral vds-button--md">Close</button>
      <button class="vds-button vds-button--solid vds-button--primary vds-button--md">Rescan device</button>
    </footer>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
