import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Select, Field } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 280 }
const OPTS = (
  <>
    <option value="active">Active</option>
    <option value="trial">Trial</option>
    <option value="suspended">Suspended</option>
  </>
)

export function SelectPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Select}
      title="Select"
      description="A dropdown for picking one option. The button looks like an Input, but the open list is the same Popover menu TimeframeSelect uses — so it flips to fit, stays on screen, and closes just like every other dropdown, and its options all look the same (hover, filled when chosen, a check mark)."
      installCode={`import { Select } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'options' }, { code: '{ value, label, disabled }[]' }, '—', 'The list of options (or pass <option> children)'],
            [{ code: 'value / defaultValue' }, { code: 'string' }, '—', 'The chosen option, with or without you tracking it'],
            [{ code: 'onChange' }, { code: '(value) => void' }, '—', 'Runs with the value that was picked'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Select…'" }, 'What the button says when nothing is picked yet'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'How tall the button is (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid to show something’s wrong'],
            [{ code: 'placement' }, { code: 'Popover placement' }, { code: "'bottom-start'" }, 'Where the menu pops open'],
          ],
        },
      ]}
      accessibility={[
        <>The button is a <IC>button</IC> with <IC>aria-haspopup="listbox"</IC>; the open panel is a <IC>role="listbox"</IC> with <IC>role="option"</IC> items. Arrow keys move between options.</>,
        <>Give it a <IC>{'<label>'}</IC> / <IC>Field</IC> so it has a name people can see; <IC>invalid</IC> sets <IC>aria-invalid</IC>.</>,
      ]}
    >
      <Section title="Sizes">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Status (Small)" htmlFor="sel-sm"><Select size="sm" defaultValue="active">{OPTS}</Select></Field>
              <Field label="Status (Medium)" htmlFor="sel-md"><Select size="md" defaultValue="active">{OPTS}</Select></Field>
              <Field label="Status (Large)" htmlFor="sel-lg"><Select size="lg" defaultValue="active">{OPTS}</Select></Field>
            </div>
          }
          code={`<Field label="Status">
  <Select defaultValue="active">
    <option value="active">Active</option>
    <option value="suspended">Suspended</option>
  </Select>
</Field>`}
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Status" error="Choose a status" htmlFor="sel-invalid">
                <Select defaultValue="active">{OPTS}</Select>
              </Field>
              <Field label="Status" htmlFor="sel-disabled">
                <Select disabled defaultValue="active">{OPTS}</Select>
              </Field>
            </div>
          }
          code={`<Field label="Status" error="Choose a status"><Select>…</Select></Field>
<Field label="Status"><Select disabled>…</Select></Field>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. The classes are pure CSS, but the behavior is JS you'd wire yourself: open/close on click, outside-click and Escape to close, arrow keys between options, and keeping the panel on screen. The panel only exists in the DOM while open."
      >
        <Code>{`<div class="vds-popover vds-select">
  <!-- trigger. sizes: vds-select--sm | --md | --lg -->
  <button type="button" class="vds-select__trigger vds-select--md"
          aria-haspopup="listbox" aria-expanded="false">
    <span class="vds-select__value">Active</span>
    <svg class="vds-icon vds-select__caret" width="16" height="16" aria-hidden="true">…</svg>
  </button>

  <!-- open panel (rendered only while open) -->
  <div class="vds-surface vds-surface--radius-md vds-surface--bordered vds-surface--elev-overlay
              vds-popover__panel vds-select__pop" role="listbox" tabindex="-1">
    <div class="vds-popover__menu">
      <button type="button" role="option" aria-selected="true"
              class="vds-popover__item vds-popover__item--active">
        <span class="vds-popover__item-label">Active</span>
        <svg class="vds-icon vds-popover__item-check" width="16" height="16" aria-hidden="true">…</svg>
      </button>
      <button type="button" role="option" class="vds-popover__item">
        <span class="vds-popover__item-label">Suspended</span>
      </button>
    </div>
  </div>
</div>

<!-- invalid: add vds-select--invalid + aria-invalid on the trigger.
     placeholder (nothing picked): add vds-select--placeholder. -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
