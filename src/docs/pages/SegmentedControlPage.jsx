import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { SegmentedControl } from '../../components/SegmentedControl/index.js'
import { Icon } from '../../components/Icon/index.js'
import { Text } from '../../components/Text/index.js'
import { LayoutGrid, ScrollText } from '@icons'

function ControlledExample() {
  const [view, setView] = useState('list')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
      <SegmentedControl
        aria-label="View"
        value={view}
        onChange={setView}
        options={[
          { value: 'list', label: 'List', icon: <Icon as={ScrollText} size="sm" /> },
          { value: 'grid', label: 'Grid', icon: <Icon as={LayoutGrid} size="sm" /> },
        ]}
      />
      <Text variant="detail" tone="muted">
        Showing: {view}
      </Text>
    </div>
  )
}

export function SegmentedControlPage() {
  return (
    <ComponentPage
      title="SegmentedControl"
      description="A row of buttons where exactly one is on — like the Day/Week/Month toggle on a chart. Underneath it’s a set of real radio inputs, so arrow keys and form posting just work. A brand-colored pill slides to whichever segment is picked (it jumps instead of sliding for people who turn animations off)."
      installCode={`import { SegmentedControl } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'options' }, { code: '{ value, label, icon?, disabled? }[]' }, '—', 'The segments. icon is a node (e.g. an <Icon/>)'],
            [{ code: 'value / defaultValue' }, { code: 'string' }, '—', 'The picked segment, with or without you tracking it'],
            [{ code: 'onChange' }, { code: '(value, event) => void' }, '—', 'Runs with the value that was picked'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Control height (matches the shared control tokens)'],
            [{ code: 'fullWidth' }, { code: 'boolean' }, { code: 'false' }, 'Stretch to the container; segments share the width'],
            [{ code: 'name' }, { code: 'string' }, 'auto', 'Shared radio name (made up for you if you skip it)'],
          ],
        },
      ]}
      accessibility={[
        <>Real radios inside <IC>role="radiogroup"</IC> — Arrow keys move the pick, Tab moves past the whole group. Name it with <IC>aria-label</IC>.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> on the focused segment (<IC>:focus-visible</IC>).</>,
        <>The sliding pill respects <IC>prefers-reduced-motion</IC> — it jumps instead.</>,
        <>Too many segments? The row scrolls sideways. It never wraps.</>,
      ]}
    >
      <Section title="Basic">
        <Preview
          canvas={
            <SegmentedControl
              aria-label="Timeframe"
              defaultValue="week"
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
            />
          }
          code={`<SegmentedControl
  aria-label="Timeframe"
  defaultValue="week"
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  onChange={setTimeframe}
/>`}
        />
      </Section>

      <Section title="With icons, controlled" note="Pass an icon per option. Here the value is held outside.">
        <Preview
          canvas={<ControlledExample />}
          code={`const [view, setView] = useState('list')

<SegmentedControl
  aria-label="View"
  value={view}
  onChange={setView}
  options={[
    { value: 'list', label: 'List', icon: <Icon as={ScrollText} size="sm" /> },
    { value: 'grid', label: 'Grid', icon: <Icon as={LayoutGrid} size="sm" /> },
  ]}
/>`}
        />
      </Section>

      <Section title="Sizes">
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <SegmentedControl
                size="sm"
                aria-label="Small"
                defaultValue="a"
                options={[
                  { value: 'a', label: 'Alerts' },
                  { value: 'b', label: 'Events' },
                ]}
              />
              <SegmentedControl
                size="md"
                aria-label="Medium"
                defaultValue="a"
                options={[
                  { value: 'a', label: 'Alerts' },
                  { value: 'b', label: 'Events' },
                ]}
              />
            </div>
          }
          code={`<SegmentedControl size="sm" … />
<SegmentedControl size="md" … />`}
        />
      </Section>

      <Section title="Full width" note="fullWidth stretches the control; segments split the space evenly.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 400 }}>
              <SegmentedControl
                fullWidth
                aria-label="Status filter"
                defaultValue="all"
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'open', label: 'Open' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
            </div>
          }
          code={`<SegmentedControl fullWidth … />`}
        />
      </Section>

      <Section title="Disabled option" note="Disable a single segment — it fades and can’t be picked.">
        <Preview
          canvas={
            <SegmentedControl
              aria-label="Report range"
              defaultValue="7d"
              options={[
                { value: '24h', label: '24h' },
                { value: '7d', label: '7 days' },
                { value: '90d', label: '90 days', disabled: true },
              ]}
            />
          }
          code={`options={[
  { value: '24h', label: '24h' },
  { value: '7d', label: '7 days' },
  { value: '90d', label: '90 days', disabled: true },
]}`}
        />
      </Section>

      <Section
        title="Overflow"
        note="Too many segments in a narrow spot? The track scrolls sideways — segments never wrap or squish."
      >
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '18rem' }}>
              <SegmentedControl
                aria-label="Many views"
                defaultValue="dash"
                options={[
                  { value: 'dash', label: 'Dashboard' },
                  { value: 'dev', label: 'Devices' },
                  { value: 'thr', label: 'Threats' },
                  { value: 'pol', label: 'Policies' },
                  { value: 'rep', label: 'Reports' },
                ]}
              />
            </div>
          }
          code={`{/* nothing to configure — overflow scrolls automatically */}`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes. Without React there is no measured sliding thumb — leave it out, and the checked segment paints its own (non-sliding) pill via a CSS fallback. Checking, arrow keys, and posting are native radio behaviour."
      >
        <Code>{`<div class="vds-segmented vds-segmented--md" role="radiogroup" aria-label="Timeframe">
  <!-- React renders a JS-measured sliding pill here:
       <span class="vds-segmented__thumb" aria-hidden="true" style="transform:…; width:…"></span>
       Static markup: omit it — CSS falls back to a pill on the checked segment. -->
  <label class="vds-segmented__segment">
    <input class="vds-segmented__input" type="radio" name="tf" value="day">
    <span class="vds-segmented__face">
      <span class="vds-segmented__text">Day</span>
    </span>
  </label>
  <label class="vds-segmented__segment">
    <input class="vds-segmented__input" type="radio" name="tf" value="week" checked>
    <span class="vds-segmented__face">
      <span class="vds-segmented__icon"><!-- optional icon --></span>
      <span class="vds-segmented__text">Week</span>
    </span>
  </label>
  <!-- disabled: add vds-segmented__segment--disabled AND disabled on the input -->
</div>

<!-- Modifiers: vds-segmented--sm, vds-segmented--full -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
