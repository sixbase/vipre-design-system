import { useRef } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Toast, ToastProvider, useToast } from '../../components/Toast/index.js'
import { Button } from '../../components/index.js'

/* Demos wrap themselves in a ToastProvider. In a real app you wrap once,
   at the root — every useToast() below it shares one stack. */

function TonesDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button variant="outline" tone="neutral" onClick={() => toast({ title: 'Report queued', description: 'We’ll email you when it’s ready.' })}>
        neutral
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast({ tone: 'info', title: 'Agent 12.4 available', description: '18 devices can update.' })}>
        info
      </Button>
      <Button variant="outline" tone="success" onClick={() => toast({ tone: 'success', title: 'Scan complete', description: 'No threats found.' })}>
        success
      </Button>
      <Button variant="outline" tone="warning" onClick={() => toast({ tone: 'warning', title: '3 devices offline', description: 'They missed the last check-in.' })}>
        warning
      </Button>
      <Button variant="outline" tone="danger" onClick={() => toast({ tone: 'danger', title: 'Quarantine failed', description: 'WKS-0142 did not respond.' })}>
        danger
      </Button>
    </div>
  )
}

function StickyDemo() {
  const { toast, dismiss } = useToast()
  const idRef = useRef(null)
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => {
          idRef.current = toast({
            tone: 'warning',
            title: 'License expires in 7 days',
            description: 'Renew to keep protection active.',
            duration: null, // sticky — stays until dismissed
          })
        }}
      >
        Show sticky toast
      </Button>
      <Button variant="ghost" onClick={() => dismiss(idRef.current)}>
        Dismiss it
      </Button>
    </div>
  )
}

function ActionDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="outline"
      tone="neutral"
      onClick={() =>
        toast({
          tone: 'success',
          title: 'Device removed',
          description: 'WKS-0142 is gone from this site.',
          action: { label: 'Undo', onClick: () => toast({ title: 'Restored', tone: 'info' }) },
        })
      }
    >
      Remove device
    </Button>
  )
}

export function ToastPage() {
  return (
    <ComponentPage
      title="Toast"
      description="A small message that pops up in the corner, tells you something happened, and goes away by itself. Wrap the app in ToastProvider once, then fire toasts from anywhere with the useToast() hook. They stack bottom-right (a full-width strip on phones), auto-dismiss after 5 seconds, and wait while you hover them."
      installCode={`import { ToastProvider, useToast, Toast } from 'vipre-design-system'`}
      props={[
        {
          name: 'toast(options) — from useToast()',
          headers: ['Option', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'title' }, { code: 'node' }, '—', 'Bold first line. Keep it short.'],
            [{ code: 'description' }, { code: 'node' }, '—', 'Smaller muted second line.'],
            [{ code: 'tone' }, { code: "'neutral' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'neutral'" }, 'Colors the icon and sets the screen-reader role.'],
            [{ code: 'duration' }, { code: 'number | null' }, { code: '5000' }, 'ms before it auto-dismisses. null makes it sticky — it stays until dismissed.'],
            [{ code: 'action' }, { code: '{ label, onClick }' }, '—', 'One optional button on the toast. Picking it also dismisses the toast.'],
          ],
        },
        {
          name: '<Toast> (presentational)',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'title' }, { code: 'node' }, '—', 'Bold first line.'],
            [{ code: 'description' }, { code: 'node' }, '—', 'Smaller muted second line.'],
            [{ code: 'tone' }, { code: "'neutral' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'neutral'" }, 'Icon color + role.'],
            [{ code: 'action' }, { code: '{ label, onClick }' }, '—', 'One optional action button.'],
            [{ code: 'onDismiss' }, { code: '() => void' }, '—', 'Shows the ✕ button when given.'],
          ],
        },
      ]}
      accessibility={[
        <>Toasts are <IC>role="status"</IC> (announced politely); the <IC>danger</IC> tone is <IC>role="alert"</IC> so screen readers announce it right away.</>,
        <>The stack lives in a named region (<IC>role="region"</IC>, <IC>aria-label="Notifications"</IC>).</>,
        <>Hovering (or focusing) a toast pauses its countdown — it won't vanish mid-read.</>,
        <>Toasts never steal focus. The action and ✕ buttons are normal tab stops with visible focus rings.</>,
        <>Enter/exit animations are skipped for people with <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section
        title="Tones"
        note="Wrap the app once in ToastProvider, then call toast() from any component below it. The tone colors the icon only — the card stays calm."
      >
        <Preview
          canvas={
            <ToastProvider>
              <TonesDemo />
            </ToastProvider>
          }
          code={`// once, at the app root
<ToastProvider>
  <App />
</ToastProvider>

// anywhere below it
const { toast } = useToast()
toast({ tone: 'success', title: 'Scan complete', description: 'No threats found.' })`}
        />
      </Section>

      <Section
        title="Sticky + dismiss"
        note="duration: null keeps a toast up until someone closes it. toast() returns an id, so you can dismiss it yourself later."
      >
        <Preview
          canvas={
            <ToastProvider>
              <StickyDemo />
            </ToastProvider>
          }
          code={`const { toast, dismiss } = useToast()

const id = toast({
  tone: 'warning',
  title: 'License expires in 7 days',
  duration: null, // sticky
})

// later, e.g. after the license renews
dismiss(id)`}
        />
      </Section>

      <Section
        title="With an action"
        note="One button, max. Picking it runs your handler and dismisses the toast. Undo is the classic use."
      >
        <Preview
          canvas={
            <ToastProvider>
              <ActionDemo />
            </ToastProvider>
          }
          code={`toast({
  tone: 'success',
  title: 'Device removed',
  action: { label: 'Undo', onClick: restoreDevice },
})`}
        />
      </Section>

      <Section
        title="Static cards"
        note="The presentational <Toast> is exported on its own — no provider needed. Useful for docs and tests."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: 'min(24rem, 100%)' }}>
              <Toast title="Report queued" description="We'll email you when it's ready." onDismiss={() => {}} />
              <Toast tone="success" title="Scan complete" description="No threats found." onDismiss={() => {}} />
              <Toast tone="danger" title="Quarantine failed" description="WKS-0142 did not respond." action={{ label: 'Retry', onClick: () => {} }} onDismiss={() => {}} />
            </div>
          }
          code={`<Toast title="Report queued" description="We'll email you when it's ready." onDismiss={close} />
<Toast tone="success" title="Scan complete" description="No threats found." onDismiss={close} />
<Toast tone="danger" title="Quarantine failed" action={{ label: 'Retry', onClick: retry }} onDismiss={close} />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML, for teams using the CSS bundle without React. The classes are pure CSS — but stacking, timers, pause-on-hover, and dismissal are JavaScript you'd have to wire yourself. Add vds-toast--leaving during your exit animation."
      >
        <Code>{`<!-- Fixed region, portaled to <body>. Newest toast goes first in the DOM. -->
<div class="vds-toaster" role="region" aria-label="Notifications">
  <!-- Tones: vds-toast--neutral | --info | --success | --warning | --danger -->
  <div class="vds-surface vds-surface--radius-md vds-surface--bordered vds-surface--elev-floating vds-toast vds-toast--success"
       role="status">
    <svg class="vds-icon vds-toast__icon" …>…tone icon…</svg>
    <div class="vds-toast__content">
      <div class="vds-toast__title">Scan complete</div>
      <div class="vds-toast__desc">No threats found.</div>
    </div>
    <button class="vds-toast__action">Undo</button>
    <button class="vds-toast__close" aria-label="Dismiss">…icon…</button>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
