import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Text } from '../../components/index.js'
import {
  TimeframeSelect,
  DEFAULT_TIMEFRAMES,
  CALENDAR_TIMEFRAMES,
} from '../../components/index.js'

/* A small harness that echoes the current selection beneath a live control. */
function Demo({ children: render, ...rest }) {
  const [tf, setTf] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
      {render(setTf)}
      <Text variant="detail" tone="subtle">
        {tf ? `${tf.label}${tf.start ? `  ·  ${tf.start.toLocaleDateString()} → ${tf.end.toLocaleDateString()}` : ''}` : 'No selection yet'}
      </Text>
    </div>
  )
}

export function TimeframeSelectPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.TimeframeSelect}
      title="Timeframe Select"
      description="The pick-a-time-range control for dashboards and reports. One component, the common shapes: a small dropdown of presets, a row of quick-toggle buttons, and an optional custom start/end range. The dropdown is built on Popover, so it flips above the button and stays on screen wherever it sits. onChange gives you back the chosen option with real { start, end } dates."
      installCode={`import { TimeframeSelect, DEFAULT_TIMEFRAMES } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'dropdown' | 'segmented'" }, { code: "'dropdown'" }, 'A dropdown pill, or a row of quick-toggle buttons'],
            [{ code: 'options' }, { code: '{ id, label }[]' }, { code: 'DEFAULT_TIMEFRAMES' }, 'The preset ranges to show'],
            [{ code: 'value' }, { code: 'string' }, '—', 'The chosen preset id (you control it)'],
            [{ code: 'defaultValue' }, { code: 'string' }, 'first option', 'What starts selected (component controls it)'],
            [{ code: 'onChange' }, { code: '(sel) => void' }, '—', 'Runs with { id, label, start, end }'],
            [{ code: 'allowCustom' }, { code: 'boolean' }, { code: 'false' }, 'Also let the user pick a custom start/end (dropdown only)'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'How tall the control is'],
            [{ code: 'placement' }, { code: 'Popover placement' }, { code: "'bottom-start'" }, 'Where the menu opens (it flips if space is tight)'],
            [{ code: 'label' }, { code: 'string' }, { code: "'Timeframe'" }, 'The name screen readers read'],
          ],
        },
      ]}
      accessibility={[
        <>The dropdown button has <IC>aria-haspopup</IC> / <IC>aria-expanded</IC> / <IC>aria-controls</IC>; the menu is a <IC>role="menu"</IC> of <IC>menuitemradio</IC> options with <IC>aria-checked</IC>.</>,
        <><IC>↑</IC>/<IC>↓</IC>/<IC>Home</IC>/<IC>End</IC> move between options; <IC>Esc</IC> closes it and puts focus back on the button.</>,
        <>The button-row version is a <IC>role="group"</IC> of <IC>aria-pressed</IC> buttons.</>,
        <>The custom-range date fields are labelled (<IC>Start date</IC> / <IC>End date</IC>) and the end can't be before the start.</>,
      ]}
    >
      <Section title="Dropdown (default)" note="A small pill that opens a menu of preset ranges. The one you pick gets a check.">
        <Preview
          popover
          reserve={300}
          canvas={
            <Demo>{(setTf) => <TimeframeSelect defaultValue="30d" onChange={setTf} />}</Demo>
          }
          code={`<TimeframeSelect
  defaultValue="30d"
  onChange={(tf) => refetch(tf.start, tf.end)}
/>`}
        />
      </Section>

      <Section title="Segmented" note="Every common range as a button, one click each. Best on a wide toolbar.">
        <Preview
          canvas={
            <Demo>{(setTf) => <TimeframeSelect variant="segmented" defaultValue="7d" onChange={setTf} />}</Demo>
          }
          code={`<TimeframeSelect variant="segmented" defaultValue="7d" onChange={setTf} />`}
        />
      </Section>

      <Section title="Custom range" note="Add allowCustom to let the user pick an explicit start/end window.">
        <Preview
          popover
          reserve={420}
          canvas={
            <Demo>{(setTf) => <TimeframeSelect defaultValue="30d" allowCustom onChange={setTf} />}</Demo>
          }
          code={`<TimeframeSelect allowCustom value={tf} onChange={setTf} />`}
        />
      </Section>

      <Section title="Calendar-relative presets" note="Swap the preset list — e.g. Today / Week to date / Year to date.">
        <Preview
          popover
          reserve={300}
          canvas={
            <Demo>{(setTf) => <TimeframeSelect options={CALENDAR_TIMEFRAMES} defaultValue="mtd" onChange={setTf} />}</Demo>
          }
          code={`import { CALENDAR_TIMEFRAMES } from 'vipre-design-system'

<TimeframeSelect options={CALENDAR_TIMEFRAMES} defaultValue="mtd" />`}
        />
      </Section>

      <Section title="Sizes">
        <Preview
          popover
          reserve={300}
          canvas={
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <TimeframeSelect size="sm" defaultValue="7d" />
              <TimeframeSelect size="md" defaultValue="7d" />
            </div>
          }
          code={`<TimeframeSelect size="sm" defaultValue="7d" />
<TimeframeSelect size="md" defaultValue="7d" />`}
        />
      </Section>
    </ComponentPage>
  )
}
