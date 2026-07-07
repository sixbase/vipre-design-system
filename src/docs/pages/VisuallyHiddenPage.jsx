import { Trash2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { VisuallyHidden } from '../../components/VisuallyHidden/index.js'
import { Button, Icon } from '../../components/index.js'

export function VisuallyHiddenPage() {
  return (
    <ComponentPage
      title="VisuallyHidden"
      description="Words that screen readers say out loud but eyes never see. Use it when a sighted person can tell what something is by looking (an icon, a layout), but a screen reader needs the words. The box is clipped to 1×1px — not display:none — so assistive tech still reads it."
      installCode={`import { VisuallyHidden } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'as' }, { code: 'ElementType' }, { code: "'span'" }, 'Which tag to render'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The words screen readers will say'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Passed to the element'],
          ],
        },
      ]}
      accessibility={[
        <>The clip recipe keeps the text in the accessibility tree; <IC>display: none</IC> would remove it.</>,
        <>Don't hide focusable things this way unless they become visible on focus — a keyboard user would tab into nothing.</>,
        <>Prefer visible text when you can. Hidden text is a patch, not a habit.</>,
      ]}
    >
      <Section title="Icon-only button" note="The eye sees a trash can. The screen reader hears 'Delete device'. Both get the message.">
        <Preview
          canvas={
            <Button variant="ghost" size="sm">
              <Icon as={Trash2} size="sm" />
              <VisuallyHidden>Delete device</VisuallyHidden>
            </Button>
          }
          code={`<Button variant="ghost" size="sm">
  <Icon as={Trash2} size="sm" />
  <VisuallyHidden>Delete device</VisuallyHidden>
</Button>`}
        />
      </Section>

      <Section title="Extra context" note="Tell screen reader users what sighted users can guess — like a link that opens a new tab.">
        <Preview
          canvas={
            <a href="#" onClick={(e) => e.preventDefault()}>
              Threat report
              <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
            </a>
          }
          code={`<a href="/report" target="_blank" rel="noreferrer">
  Threat report
  <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
</a>`}
        />
      </Section>

      <Section title="The utility class" note="Not using React? The same recipe ships as a plain CSS class: vds-visually-hidden.">
        <Code>{`<button type="button">
  <svg class="vds-icon" aria-hidden="true">…</svg>
  <span class="vds-visually-hidden">Delete device</span>
</button>`}</Code>
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Pure CSS — no JS."
      >
        <Code>{`<span class="vds-visually-hidden">Delete device</span>

/* the recipe behind the class */
.vds-visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}`}</Code>
      </Section>
    </ComponentPage>
  )
}
