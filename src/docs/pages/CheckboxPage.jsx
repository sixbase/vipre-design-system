import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Checkbox, Text, Stack, Inline } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '0.75rem' }

export function CheckboxPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Checkbox}
      title="Checkbox"
      description="A checkbox with a label. It can be checked, unchecked, or show a dash when only some things are picked. There’s a real checkbox hidden behind the pretty box, wrapped in a label so clicking the text flips it too."
      installCode={`import { Checkbox } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'indeterminate' }, { code: 'boolean' }, { code: 'false' }, 'The dash look for “some are picked”'],
            [{ code: 'tone' }, { code: "'primary' | 'success'" }, { code: "'primary'" }, 'Colour of the CHECKED fill — see “Tone”'],
            [{ code: 'children' }, { code: 'ReactNode' }, '—', 'The label text (optional)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'checked, defaultChecked, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Wraps a real <IC>{'<input type="checkbox">'}</IC> — works with the keyboard and screen readers.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> on the box when you tab to it (<IC>:focus-visible</IC>).</>,
        <><IC>indeterminate</IC> is only how it looks — in your own data it still has to end up checked or unchecked.</>,
      ]}
    >
      <Section
        title="Compact"
        note={'size="sm" drops the box from 18px to 14 and steps the label down with it. For a dense table row or a toolbar, where the default is the tallest thing on the line and starts setting the row height instead of sitting in it. The tap target is unchanged on touch.'}
      >
        <Preview
          canvas={
            <Stack gap={3}>
              <Inline gap={4} align="center">
                <Checkbox size="sm" defaultChecked>Compact</Checkbox>
                <Checkbox size="sm">Unchecked</Checkbox>
                <Checkbox size="sm" indeterminate>Some</Checkbox>
                <Checkbox size="sm" disabled>Disabled</Checkbox>
              </Inline>
              <Inline gap={4} align="center">
                <Checkbox defaultChecked>Default, for comparison</Checkbox>
              </Inline>
            </Stack>
          }
          code={'<Checkbox size="sm">Compact</Checkbox>'}
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Checkbox>Unchecked</Checkbox>
              <Checkbox defaultChecked>Checked</Checkbox>
              <Checkbox indeterminate>Indeterminate</Checkbox>
              <Checkbox defaultChecked disabled>
                Disabled
              </Checkbox>
            </div>
          }
          code={`<Checkbox>Unchecked</Checkbox>
<Checkbox defaultChecked>Checked</Checkbox>
<Checkbox indeterminate>Indeterminate</Checkbox>
<Checkbox defaultChecked disabled>Disabled</Checkbox>`}
        />
      </Section>

      <Section
        title="Tone"
        note="tone changes the checked fill and nothing else — the resting box stays neutral in both, because an unchecked box shouldn’t advertise what colour it would become."
      >
        <Preview
          canvas={
            <div style={COL}>
              <Checkbox defaultChecked>Primary — the default</Checkbox>
              <Checkbox tone="success" defaultChecked>Success</Checkbox>
              <Checkbox tone="success" indeterminate>Success, indeterminate</Checkbox>
            </div>
          }
          code={`<Checkbox defaultChecked>Primary — the default</Checkbox>
<Checkbox tone="success" defaultChecked>Success</Checkbox>`}
        />
      </Section>

      <Section
        title="When to use tone=&quot;success&quot;"
        note="Default to primary. Green is for a tick that means the thing is IN — added to a set the user is assembling and kept until they take it out."
      >
        <Preview
          canvas={
            <div style={{ display: 'grid', gap: '1.75rem' }}>
              <div style={COL}>
                <Text variant="detail" tone="muted">
                  <strong>Yes</strong> — a picker or cart. The tick is the outcome: this is in the order.
                </Text>
                <Checkbox tone="success" defaultChecked>Total Email Protection</Checkbox>
                <Checkbox tone="success" defaultChecked>Endpoint EDR</Checkbox>
              </div>
              <div style={COL}>
                <Text variant="detail" tone="muted">
                  <strong>No</strong> — a filter, a setting, a table’s row selection. Nothing is being
                  acquired, so green over-claims: it reads as “correct” or “passing” rather than “on”.
                </Text>
                <Checkbox defaultChecked>Show suspended accounts</Checkbox>
                <Checkbox defaultChecked>Email me when a scan finishes</Checkbox>
              </div>
            </div>
          }
          code={`{/* In a set the user is building — green */}
<Checkbox tone="success" checked={inCart} onChange={toggle}>Total Email Protection</Checkbox>

{/* A filter or a preference — primary */}
<Checkbox checked={showSuspended} onChange={toggle}>Show suspended accounts</Checkbox>`}
        />
      </Section>

      <Section
        title="The other reason: a surface that is all one colour"
        note="Worth stating because it is the case that usually prompts the question. On a surface already brand-blue end to end — blue product artwork, blue selected cards, a blue primary button — a blue tick adds nothing, because everything is emphasised and so nothing is. Green there is the only mark that reads as a state rather than as more chrome. If you reach for it, take the whole control set with you: the tick, the selected card’s border and tint, the count badge. One green control among blue ones looks like a bug, not a decision. And it does not extend to progress — a Stepper stays one accent, because a finished step is not a success."
      >
        <Preview
          canvas={
            <div style={COL}>
              <Checkbox tone="success" defaultChecked>Complete Defense</Checkbox>
              <Checkbox tone="success" defaultChecked>Edge Defense</Checkbox>
              <Checkbox tone="success">Email Cloud</Checkbox>
            </div>
          }
          code={`{/* Whole control set on the surface, not one control in the middle of it. */}
<Checkbox tone="success" checked={own.has(key)} onChange={toggle}>{name}</Checkbox>`}
        />
      </Section>

      <Section title="Without a label" note="Leave out the text when it sits in a table header or row.">
        <Preview
          canvas={<Checkbox aria-label="Select row" />}
          code={`<Checkbox aria-label="Select row" />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. A real checkbox does all the work; the styled box is just paint. The only JS is for the indeterminate dash — it can only be set as a DOM property (input.indeterminate = true), never as an attribute."
      >
        <Code>{`<label class="vds-checkbox">
  <input type="checkbox" class="vds-checkbox__input" />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
  <span class="vds-checkbox__label">Include archived</span>
</label>

<!-- no label text: keep an aria-label on the input -->
<label class="vds-checkbox">
  <input type="checkbox" class="vds-checkbox__input" aria-label="Select row" />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
</label>

<!-- tone="success": one modifier on the label, nothing else changes -->
<label class="vds-checkbox vds-checkbox--success">
  <input type="checkbox" class="vds-checkbox__input" checked />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
  <span class="vds-checkbox__label">Total Email Protection</span>
</label>

<!-- disabled: add the modifier AND the disabled attribute -->
<label class="vds-checkbox vds-checkbox--disabled">
  <input type="checkbox" class="vds-checkbox__input" disabled checked />
  <span class="vds-checkbox__box" aria-hidden="true"></span>
  <span class="vds-checkbox__label">Disabled</span>
</label>`}</Code>
      </Section>
    </ComponentPage>
  )
}
