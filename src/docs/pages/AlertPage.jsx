import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Alert } from '../../components/Alert/index.js'
import { Button } from '../../components/index.js'

export function AlertPage() {
  return (
    <ComponentPage
      title="Alert"
      description="A message banner that sits in the page. It has a soft color fill, a colored stripe on the left, and an icon that matches the tone. Use it to tell people something about the page or section they're looking at. For messages that pop in and vanish, use Toast instead."
      installCode={`import { Alert } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'tone' }, { code: "'neutral' | 'info' | 'success' | 'warning' | 'danger'" }, { code: "'info'" }, 'The color and mood of the message'],
            [{ code: 'title' }, { code: 'node' }, '—', 'Bold first line'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The message body'],
            [{ code: 'icon' }, { code: 'component | node | false' }, 'per tone', 'Swap the icon, or pass false to hide it'],
            [{ code: 'dismissible' }, { code: 'boolean' }, { code: 'false' }, 'Show an × button'],
            [{ code: 'onDismiss' }, { code: '() => void' }, '—', 'Runs when the × is pressed. You remove the alert'],
            [{ code: 'actions' }, { code: 'node' }, '—', 'Buttons under the text'],
            [{ code: '…props' }, { code: 'HTMLAttributes<div>' }, '—', 'Passed to the root <div> (an explicit role wins)'],
          ],
        },
      ]}
      accessibility={[
        <>Calm tones (neutral, info, success) use <IC>role="status"</IC> — screen readers finish what they're saying first.</>,
        <>Urgent tones (warning, danger) use <IC>role="alert"</IC> — screen readers announce them right away.</>,
        <>The icon is decoration (<IC>aria-hidden</IC>). The meaning is in the words.</>,
        <>The × button is labelled "Dismiss" and grows to a 44px hit area on touch screens.</>,
      ]}
    >
      <Section title="Tones" note="Five colors. Pick the one that matches the news.">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <Alert tone="neutral" title="Heads up">Maintenance window this Sunday, 02:00–04:00 UTC.</Alert>
              <Alert tone="info" title="New version available">Agent 12.4 is ready to roll out.</Alert>
              <Alert tone="success" title="Scan complete">No threats found on 214 devices.</Alert>
              <Alert tone="warning" title="Certificate expiring">The API certificate expires in 12 days.</Alert>
              <Alert tone="danger" title="Agent offline">3 endpoints have not reported in 24 hours.</Alert>
            </div>
          }
          code={`<Alert tone="success" title="Scan complete">
  No threats found on 214 devices.
</Alert>`}
        />
      </Section>

      <Section title="Dismissible" note="Add an × so people can put the message away. You handle onDismiss and remove the alert yourself.">
        <Preview
          canvas={
            <Alert tone="info" title="New version available" dismissible onDismiss={() => {}}>
              Agent 12.4 is ready to roll out to your fleet.
            </Alert>
          }
          code={`<Alert tone="info" title="New version available"
       dismissible onDismiss={() => setShown(false)}>
  Agent 12.4 is ready to roll out to your fleet.
</Alert>`}
        />
      </Section>

      <Section title="With actions" note="Put the fix right in the banner. Actions always sit below the text, so the banner works in any width.">
        <Preview
          canvas={
            <Alert
              tone="danger"
              title="Agent offline"
              dismissible
              onDismiss={() => {}}
              actions={
                <>
                  <Button size="sm" tone="danger">Reconnect</Button>
                  <Button size="sm" variant="ghost">View devices</Button>
                </>
              }
            >
              3 endpoints have not reported in 24 hours.
            </Alert>
          }
          code={`<Alert tone="danger" title="Agent offline"
       actions={<Button size="sm" tone="danger">Reconnect</Button>}>
  3 endpoints have not reported in 24 hours.
</Alert>`}
        />
      </Section>

      <Section title="Custom or no icon" note="Each tone picks its own icon. Pass your own, or pass false for none.">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <Alert tone="info" icon={false} title="Quiet banner">No icon on this one.</Alert>
            </div>
          }
          code={`<Alert tone="info" icon={false} title="Quiet banner">
  No icon on this one.
</Alert>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Only the × button needs JS (to remove the banner)."
      >
        <Code>{`<div class="vds-alert vds-alert--success" role="status">
  <span class="vds-alert__icon" aria-hidden="true"><svg class="vds-icon">…</svg></span>
  <div class="vds-alert__body">
    <div class="vds-alert__title">Scan complete</div>
    <div class="vds-alert__desc">No threats found on 214 devices.</div>
    <div class="vds-alert__actions"><!-- buttons --></div>
  </div>
  <button type="button" class="vds-alert__dismiss" aria-label="Dismiss">
    <svg class="vds-icon">…</svg>
  </button>
</div>

<!-- warning / danger use role="alert" instead of role="status" -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
