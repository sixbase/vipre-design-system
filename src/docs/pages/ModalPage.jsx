import { useRef, useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC, Kbd } from '../primitives.jsx'
import { Modal } from '../../components/Modal/index.js'
import { Button, Input, Field } from '../../components/index.js'

/* Each demo owns its open/close state, like other interactive doc examples. */
function BasicDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Remove device</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Remove device?"
        description="The device and its scan history are deleted. This cannot be undone."
        footer={
          <>
            <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button tone="danger" onClick={() => setOpen(false)}>
              Remove
            </Button>
          </>
        }
      >
        Removing <strong>WKS-0142</strong> also frees up one seat on the Endpoint Security
        package.
      </Modal>
    </>
  )
}

function SizesDemo() {
  const [size, setSize] = useState(null)
  return (
    <>
      {['sm', 'md', 'lg', 'full'].map((s) => (
        <Button key={s} variant="outline" tone="neutral" onClick={() => setSize(s)}>
          {s}
        </Button>
      ))}
      <Modal
        open={size != null}
        onClose={() => setSize(null)}
        size={size ?? 'md'}
        title={`A "${size}" modal`}
        description="Resize the window to see how it behaves on small screens."
        footer={
          <Button variant="outline" tone="neutral" onClick={() => setSize(null)}>
            Close
          </Button>
        }
      >
        The panel never grows past the viewport. If the content is taller than the screen, the
        body scrolls and the header and footer stay put.
      </Modal>
    </>
  )
}

function InitialFocusDemo() {
  const [open, setOpen] = useState(false)
  const nameRef = useRef(null)
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Rename site
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Rename site"
        initialFocusRef={nameRef}
        footer={
          <>
            <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <Field label="Site name">
          <Input ref={nameRef} defaultValue="Acme — HQ" />
        </Field>
      </Modal>
    </>
  )
}

function NonDismissibleDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Accept terms
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        dismissible={false}
        title="Updated terms of service"
        description="You have to pick one of the buttons — Escape and the backdrop won't close this."
        footer={
          <>
            <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button onClick={() => setOpen(false)}>Accept</Button>
          </>
        }
      >
        Use this only when the user really must make a choice before continuing.
      </Modal>
    </>
  )
}

export function ModalPage() {
  return (
    <ComponentPage
      title="Modal"
      description="A dialog that takes over the page. A dark scrim dims everything behind it and a centered panel holds your content. While it's open, the page can't scroll, Tab stays inside the panel, and closing it puts focus back where it was. You own the open state — the modal just tells you when the user wants out."
      installCode={`import { Modal } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'open' }, { code: 'boolean' }, { code: 'false' }, 'Shows the modal. You keep this in your own state.'],
            [{ code: 'onClose' }, { code: '() => void' }, '—', 'Called when the user tries to close it (Escape, scrim click, ✕). Set open to false here.'],
            [{ code: 'title' }, { code: 'node' }, '—', 'Header text. Also becomes the accessible name (aria-labelledby).'],
            [{ code: 'description' }, { code: 'node' }, '—', 'Muted line under the title. Wired to aria-describedby.'],
            [{ code: 'footer' }, { code: 'node' }, '—', 'Pinned to the bottom — usually your action Buttons.'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg' | 'full'" }, { code: "'md'" }, 'How wide the panel is. full takes over almost the whole screen.'],
            [{ code: 'dismissible' }, { code: 'boolean' }, { code: 'true' }, 'When false, Escape / scrim / ✕ do nothing — only your own buttons close it.'],
            [{ code: 'initialFocusRef' }, { code: 'ref' }, '—', 'What gets focus when it opens. Defaults to the first focusable element.'],
          ],
        },
      ]}
      accessibility={[
        <>The panel is <IC>role="dialog"</IC> with <IC>aria-modal="true"</IC>; <IC>title</IC> and <IC>description</IC> are wired to <IC>aria-labelledby</IC> / <IC>aria-describedby</IC> automatically.</>,
        <><Kbd>Tab</Kbd> and <Kbd>Shift+Tab</Kbd> cycle inside the panel — focus can't escape while it's open.</>,
        <><Kbd>Esc</Kbd> and a click on the scrim close it (unless <IC>dismissible</IC> is false). Focus returns to whatever opened it.</>,
        <>Body scroll is locked while open, so the page doesn't move behind the dialog.</>,
        <>The fade + scale entrance is skipped for people with <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="Basic"
        note="Open state lives in your component. The modal calls onClose when the user hits Escape, clicks the scrim, or presses the ✕ — you set open back to false."
      >
        <Preview
          canvas={<BasicDemo />}
          code={`const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Remove device</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Remove device?"
  description="The device and its scan history are deleted. This cannot be undone."
  footer={
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>Cancel</Button>
      <Button tone="danger" onClick={() => setOpen(false)}>Remove</Button>
    </>
  }
>
  Removing <strong>WKS-0142</strong> also frees up one seat.
</Modal>`}
        />
      </Section>

      <Section
        title="Sizes"
        note="Four widths. Below the sm breakpoint every size goes near-full-width with small margins, and tall content scrolls inside the body."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SizesDemo />
            </div>
          }
          code={`<Modal size="sm" … />   // 26rem — confirmations
<Modal size="md" … />   // 35rem — the default
<Modal size="lg" … />   // 45rem — forms, tables
<Modal size="full" … /> // near the whole screen`}
        />
      </Section>

      <Section
        title="Initial focus"
        note="By default the first focusable element gets focus. Point initialFocusRef at the field the user came to fill in."
      >
        <Preview
          canvas={<InitialFocusDemo />}
          code={`const nameRef = useRef(null)

<Modal open={open} onClose={close} title="Rename site" initialFocusRef={nameRef} …>
  <Field label="Site name">
    <Input ref={nameRef} defaultValue="Acme — HQ" />
  </Field>
</Modal>`}
        />
      </Section>

      <Section
        title="Non-dismissible"
        note="dismissible={false} turns off Escape, scrim click, and the ✕ button. Save it for real must-answer moments — it's annoying everywhere else."
      >
        <Preview
          canvas={<NonDismissibleDemo />}
          code={`<Modal open={open} onClose={close} dismissible={false} … />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML, for teams using the CSS bundle without React. The classes are pure CSS — but the behavior (open/close, focus trap, Escape, scroll lock, focus return) is JavaScript you'd have to wire yourself. Add vds-modal--closing during your exit animation."
      >
        <Code>{`<!-- Portaled to <body>. Sizes: vds-modal--sm | --md | --lg | --full -->
<div class="vds-modal vds-modal--md">
  <div class="vds-modal__scrim"></div>
  <div class="vds-surface vds-surface--radius-lg vds-surface--bordered vds-surface--elev-overlay vds-modal__panel"
       role="dialog" aria-modal="true" aria-labelledby="m-title" aria-describedby="m-desc" tabindex="-1">
    <header class="vds-modal__header">
      <div class="vds-modal__heading">
        <h2 id="m-title" class="vds-text vds-heading vds-text--heading vds-modal__title">Remove device?</h2>
        <p id="m-desc" class="vds-text vds-text--body vds-text--tone-muted vds-modal__desc">This cannot be undone.</p>
      </div>
      <button class="vds-modal__close" aria-label="Close">…icon…</button>
    </header>
    <div class="vds-modal__body">…content…</div>
    <footer class="vds-modal__footer">
      <button class="vds-button vds-button--outline vds-button--neutral vds-button--md">Cancel</button>
      <button class="vds-button vds-button--solid vds-button--danger vds-button--md">Remove</button>
    </footer>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
