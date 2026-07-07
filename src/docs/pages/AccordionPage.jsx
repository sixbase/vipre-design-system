import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, Kbd, IC } from '../primitives.jsx'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/Accordion/index.js'
import { Text } from '../../components/Text/index.js'

function ControlledExample() {
  const [open, setOpen] = useState(['scan'])
  return (
    <div style={{ width: '100%', maxWidth: '28rem' }}>
      <Accordion type="multiple" value={open} onChange={setOpen}>
        <AccordionItem value="scan">
          <AccordionTrigger>Scan schedule</AccordionTrigger>
          <AccordionContent>Runs a quick scan every night at 02:00.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="exclusions">
          <AccordionTrigger>Exclusions</AccordionTrigger>
          <AccordionContent>4 folders are skipped during scans.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="alerts">
          <AccordionTrigger>Alerts</AccordionTrigger>
          <AccordionContent>Email the admin group on any critical detection.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function AccordionPage() {
  return (
    <ComponentPage
      title="Accordion"
      description="Stacked sections that open and close. Use it to hide detail until someone asks for it — settings groups, FAQ lists, long policy text. Single mode keeps one section open at a time; multiple lets any number stay open. Opening animates smoothly; the text fades in a beat later."
      installCode={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'vipre-design-system'`}
      props={[
        {
          name: 'Accordion',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'type' }, { code: "'single' | 'multiple'" }, { code: "'single'" }, 'One open at a time, or many'],
            [{ code: 'value' }, { code: 'string | string[]' }, '—', 'Open item(s) (controlled). String for single, array for multiple'],
            [{ code: 'defaultValue' }, { code: 'string | string[]' }, '—', 'What starts open (uncontrolled)'],
            [{ code: 'onChange' }, { code: '(value) => void' }, '—', 'Called with the new open value(s)'],
          ],
        },
        {
          name: 'AccordionItem',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string' }, '—', 'This section’s id (required)'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Fade the trigger and block clicks'],
          ],
        },
        {
          name: 'AccordionTrigger',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'as' }, { code: 'string' }, { code: "'h3'" }, 'The heading tag that wraps the button'],
          ],
        },
      ]}
      accessibility={[
        <>The trigger is a real <IC>&lt;button&gt;</IC> inside a heading, so <Kbd>Enter</Kbd> and <Kbd>Space</Kbd> just work.</>,
        <><IC>aria-expanded</IC> and <IC>aria-controls</IC> on the button; the body is a <IC>role="region"</IC> labelled by its trigger.</>,
        <>Closed content is <IC>visibility: hidden</IC> + <IC>aria-hidden</IC> — you can’t tab into it.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC>.</>,
        <>Under <IC>prefers-reduced-motion</IC> sections snap open and closed instantly.</>,
      ]}
    >
      <Section title="Single" note="One section open at a time. Clicking an open section closes it.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '28rem' }}>
              <Accordion type="single" defaultValue="what">
                <AccordionItem value="what">
                  <AccordionTrigger>What does the agent scan?</AccordionTrigger>
                  <AccordionContent>
                    Files on disk, running processes, and incoming email attachments.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="when">
                  <AccordionTrigger>When do scans run?</AccordionTrigger>
                  <AccordionContent>
                    A quick scan runs nightly. Full scans run every Sunday at 02:00.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="off" disabled>
                  <AccordionTrigger>Can I turn it off?</AccordionTrigger>
                  <AccordionContent>No.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          }
          code={`<Accordion type="single" defaultValue="what">
  <AccordionItem value="what">
    <AccordionTrigger>What does the agent scan?</AccordionTrigger>
    <AccordionContent>Files, processes, and attachments.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="off" disabled>…</AccordionItem>
</Accordion>`}
        />
      </Section>

      <Section title="Multiple, controlled" note="type='multiple' lets several stay open. Hold the array yourself with value + onChange.">
        <Preview
          canvas={<ControlledExample />}
          code={`const [open, setOpen] = useState(['scan'])

<Accordion type="multiple" value={open} onChange={setOpen}>
  <AccordionItem value="scan">…</AccordionItem>
  <AccordionItem value="exclusions">…</AccordionItem>
  <AccordionItem value="alerts">…</AccordionItem>
</Accordion>`}
        />
      </Section>

      <Section title="Motion" note="Height animates with grid-template-rows 0fr → 1fr over 240ms (--vds-dur-slow, --vds-ease-emphatic). The body fades in a beat later — same choreography as the MSP v2 nav. Reduced motion makes it instant.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '28rem' }}>
              <Accordion type="single">
                <AccordionItem value="try">
                  <AccordionTrigger>Open me to feel the timing</AccordionTrigger>
                  <AccordionContent>
                    <Text tone="muted">
                      The box grows first, then this text fades in just after.
                    </Text>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          }
          code={`/* nothing to configure — motion is built in */`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. JS you must supply yourself: toggle aria-expanded on the button and the --open classes on the panel/item."
      >
        <Code>{`<div class="vds-accordion">
  <div class="vds-accordion__item vds-accordion__item--open" data-state="open">
    <h3 class="vds-accordion__header">
      <button class="vds-accordion__trigger" id="acc-trigger-1"
              aria-expanded="true" aria-controls="acc-panel-1">
        <span class="vds-accordion__label">Scan schedule</span>
        <svg class="vds-icon vds-accordion__chevron" aria-hidden="true">…</svg>
      </button>
    </h3>
    <div class="vds-accordion__panel vds-accordion__panel--open" role="region"
         id="acc-panel-1" aria-labelledby="acc-trigger-1">
      <div class="vds-accordion__clip">
        <div class="vds-accordion__body">Runs a quick scan every night.</div>
      </div>
    </div>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
