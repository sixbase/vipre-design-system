import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Combobox } from '../../components/Combobox/index.js'
import { Field } from '../../components/Field/index.js'
import { Icon } from '../../components/Icon/index.js'
import { Text } from '../../components/Text/index.js'
import { Globe, Shield } from '@icons'

const COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 320 }

const CUSTOMERS = [
  { value: 'acme', label: 'Acme Corp' },
  { value: 'globex', label: 'Globex' },
  { value: 'initech', label: 'Initech' },
  { value: 'umbrella', label: 'Umbrella Ltd' },
  { value: 'stark', label: 'Stark Industries' },
]

const REGIONS = [
  { value: 'us-east', label: 'US East', description: 'Virginia', icon: <Icon as={Globe} size="sm" /> },
  { value: 'us-west', label: 'US West', description: 'Oregon', icon: <Icon as={Globe} size="sm" /> },
  { value: 'eu-west', label: 'EU West', description: 'Ireland', icon: <Icon as={Globe} size="sm" /> },
  { value: 'ap-south', label: 'AP South', description: 'Mumbai — limited', icon: <Icon as={Shield} size="sm" />, disabled: true },
]

function ControlledExample() {
  const [customer, setCustomer] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: 320 }}>
      <Combobox
        options={CUSTOMERS}
        value={customer}
        onChange={setCustomer}
        placeholder="Pick a customer…"
        aria-label="Customer"
        clearable
      />
      <Text variant="detail" tone="muted">
        Picked: {customer ?? 'nothing yet'}
      </Text>
    </div>
  )
}

export function ComboboxPage() {
  return (
    <ComponentPage
      title="Combobox"
      description="A dropdown you can type in. Typing filters the list; arrows move a highlight; Enter picks. It’s built from the same parts as Select — Input for the field, Popover for the floating list — so it flips to fit, stays on screen even at 320px, and its options look like every other dropdown’s. Your focus never leaves the text field: the highlight is a virtual cursor."
      installCode={`import { Combobox } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'options' }, { code: '{ value, label, description?, icon?, disabled? }[]' }, '—', 'The list. description is a second muted line; icon is a node'],
            [{ code: 'value / defaultValue' }, { code: 'string' }, '—', 'The picked value, with or without you tracking it'],
            [{ code: 'onChange' }, { code: '(value) => void' }, '—', 'Runs with the picked value — or null after clearing'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Search…'" }, 'Hint text while nothing is picked'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Field height (matches Input)'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Red border + aria-invalid'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Half-faded and click-proof'],
            [{ code: 'clearable' }, { code: 'boolean' }, { code: 'false' }, 'Show an × that clears the pick (onChange gets null)'],
            [{ code: 'emptyMessage' }, { code: 'string' }, { code: "'No matches'" }, 'Shown when the filter finds nothing'],
            [{ code: 'filter' }, { code: '(option, query) => boolean' }, 'label contains', 'Swap in your own matching rule'],
            [{ code: 'placement' }, { code: 'Popover placement' }, { code: "'bottom-start'" }, 'Where the list pops open'],
          ],
        },
      ]}
      accessibility={[
        <>The field is <IC>role="combobox"</IC> with <IC>aria-expanded</IC>, <IC>aria-controls</IC>, and <IC>aria-activedescendant</IC>; the list is <IC>role="listbox"</IC> with <IC>role="option"</IC> rows. Focus stays in the field the whole time.</>,
        <>Keyboard: type to filter, ArrowDown/ArrowUp open and move the highlight, Enter picks, Escape closes, Tab (blur) closes and puts the picked label back.</>,
        <>Give it a name: wrap in a <IC>Field</IC>, or pass <IC>aria-label</IC>.</>,
        <>The floating list flips and clamps to the viewport (Popover does this), so it stays usable on a 320px screen.</>,
      ]}
    >
      <Section title="Basic" note="Click or press ArrowDown to open. Type to filter.">
        <Preview
          reserve={260}
          canvas={
            <div style={COL}>
              <Combobox options={CUSTOMERS} placeholder="Pick a customer…" aria-label="Customer" />
            </div>
          }
          code={`<Combobox
  options={[
    { value: 'acme', label: 'Acme Corp' },
    { value: 'globex', label: 'Globex' },
    { value: 'initech', label: 'Initech' },
  ]}
  placeholder="Pick a customer…"
  onChange={setCustomer}
/>`}
        />
      </Section>

      <Section title="Controlled + clearable" note="Hold the value yourself. The × puts it back to nothing (onChange gets null).">
        <Preview
          reserve={260}
          canvas={<ControlledExample />}
          code={`const [customer, setCustomer] = useState(null)

<Combobox
  options={CUSTOMERS}
  value={customer}
  onChange={setCustomer}
  clearable
/>`}
        />
      </Section>

      <Section
        title="Descriptions, icons, disabled options"
        note="Each option can carry a second muted line, an icon, and a disabled flag."
      >
        <Preview
          reserve={280}
          canvas={
            <div style={COL}>
              <Combobox options={REGIONS} placeholder="Pick a region…" aria-label="Region" defaultValue="eu-west" />
            </div>
          }
          code={`<Combobox
  options={[
    { value: 'us-east', label: 'US East', description: 'Virginia', icon: <Icon as={Globe} size="sm" /> },
    { value: 'eu-west', label: 'EU West', description: 'Ireland', icon: <Icon as={Globe} size="sm" /> },
    { value: 'ap-south', label: 'AP South', description: 'Mumbai — limited', disabled: true },
  ]}
  defaultValue="eu-west"
/>`}
        />
      </Section>

      <Section title="Nothing matches" note="Type gibberish — the list shows emptyMessage instead of options.">
        <Preview
          reserve={200}
          canvas={
            <div style={COL}>
              <Combobox
                options={CUSTOMERS}
                placeholder="Try typing “zzz”…"
                aria-label="Customer"
                emptyMessage="No customers found"
              />
            </div>
          }
          code={`<Combobox options={CUSTOMERS} emptyMessage="No customers found" />`}
        />
      </Section>

      <Section title="In a Field, sizes, states" note="Field wires the label and error for you. Sizes match Input.">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Customer" help="Start typing to filter.">
                <Combobox options={CUSTOMERS} placeholder="Search customers…" />
              </Field>
              <Field label="Region" error="Pick a region">
                <Combobox options={REGIONS} placeholder="Search regions…" />
              </Field>
              <Combobox options={CUSTOMERS} size="sm" placeholder="Small" aria-label="Small combobox" />
              <Combobox options={CUSTOMERS} disabled placeholder="Disabled" aria-label="Disabled combobox" />
            </div>
          }
          code={`<Field label="Customer" help="Start typing to filter.">
  <Combobox options={CUSTOMERS} />
</Field>
<Field label="Region" error="Pick a region">
  <Combobox options={REGIONS} />  {/* Field sets invalid for you */}
</Field>
<Combobox options={CUSTOMERS} size="sm" />
<Combobox options={CUSTOMERS} disabled />`}
        />
      </Section>

      <Section
        title="Custom filter"
        note="Swap the matching rule. This one also matches the option’s value, not just its label."
      >
        <Preview
          reserve={240}
          canvas={
            <div style={COL}>
              <Combobox
                options={REGIONS}
                placeholder="Try “virginia”…"
                aria-label="Region"
                filter={(opt, q) =>
                  `${opt.label} ${opt.description ?? ''}`.toLowerCase().includes(q.trim().toLowerCase())
                }
              />
            </div>
          }
          code={`<Combobox
  options={REGIONS}
  filter={(opt, q) =>
    \`\${opt.label} \${opt.description ?? ''}\`.toLowerCase().includes(q.trim().toLowerCase())
  }
/>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes. A combobox is mostly JS — you must supply: opening/closing the panel and positioning it, filtering rows as the user types, moving aria-activedescendant with the arrows, picking on Enter/click, and syncing aria-expanded. The classes below give you the look."
      >
        <Code>{`<div class="vds-popover vds-combobox">
  <div class="vds-combobox__anchor">
    <div class="vds-input vds-input--md">
      <input class="vds-input__field" role="combobox"
             aria-autocomplete="list" aria-expanded="true"
             aria-controls="cbx-listbox" aria-activedescendant="cbx-opt-1"
             autocomplete="off" placeholder="Search…">
      <span class="vds-input__affix vds-input__affix--trail">
        <span class="vds-combobox__actions">
          <!-- optional clear -->
          <button class="vds-combobox__clear" type="button" aria-label="Clear selection">×</button>
          <!-- caret; add --open while expanded -->
          <span class="vds-combobox__caret vds-combobox__caret--open"><!-- chevron --></span>
        </span>
      </span>
    </div>
  </div>

  <!-- the floating panel (position it with JS; remove when closed) -->
  <div class="vds-surface vds-popover__panel vds-combobox__pop" id="cbx-listbox" role="listbox">
    <div class="vds-popover__menu">
      <div class="vds-popover__item vds-combobox__option" role="option" id="cbx-opt-0" aria-selected="false">
        <span class="vds-combobox__option-body">
          <span class="vds-popover__item-label">Acme Corp</span>
        </span>
      </div>
      <div class="vds-popover__item vds-combobox__option vds-popover__item--active vds-combobox__option--highlighted"
           role="option" id="cbx-opt-1" aria-selected="true">
        <span class="vds-combobox__option-body">
          <span class="vds-popover__item-label">Globex</span>
          <span class="vds-combobox__option-desc">Second line (optional)</span>
        </span>
        <!-- check icon in vds-popover__item-check -->
      </div>
      <!-- nothing matches: -->
      <!-- <div class="vds-combobox__empty">No matches</div> -->
    </div>
  </div>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
