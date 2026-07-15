import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Kbd, IC, PropsTable } from '../primitives.jsx'
import { DatePicker } from '../../components/DatePicker/index.js'
import { Text } from '../../components/index.js'

/* A labelled token table for the Tokens section (same shape SideNav uses). */
function TokenGroup({ label, headers, rows }) {
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <p className="vds-text vds-text--eyebrow" style={{ margin: '0 0 0.4rem' }}>{label}</p>
      <PropsTable headers={headers} rows={rows} />
    </div>
  )
}

/* Live pickers — the docs page owns the state; the component just reports back. */
function BasicPicker() {
  const [date, setDate] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 260 }}>
      <DatePicker value={date} onChange={setDate} aria-label="Pick a date" />
      <Text variant="detail" tone="muted">
        {date ? `You picked ${date.toLocaleDateString()}` : 'Nothing picked yet'}
      </Text>
    </div>
  )
}

function RangePicker() {
  // A window around a fixed reference day, so days outside it are disabled.
  const [date, setDate] = useState(null)
  const min = new Date(2026, 6, 1)
  const max = new Date(2026, 6, 31)
  return (
    <div style={{ maxWidth: 260 }}>
      <DatePicker
        value={date}
        onChange={setDate}
        min={min}
        max={max}
        placeholder="July 2026 only"
        aria-label="Pick a July date"
      />
    </div>
  )
}

const KEYS = [
  [<Kbd>← →</Kbd>, 'Move one day left or right'],
  [<Kbd>↑ ↓</Kbd>, 'Move one week up or down'],
  [<><Kbd>Home</Kbd> / <Kbd>End</Kbd></>, 'Jump to the start or end of the week'],
  [<><Kbd>PageUp</Kbd> / <Kbd>PageDown</Kbd></>, 'Flip to the previous or next month'],
  [<><Kbd>Enter</Kbd> / <Kbd>Space</Kbd></>, 'Pick the focused day and close'],
  [<Kbd>Esc</Kbd>, 'Close and send focus back to the field'],
]

export function DatePickerPage() {
  return (
    <ComponentPage
      title="Date Picker"
      description="A field that looks like an Input but opens a little month calendar when you click it. You move around with the arrow keys, pick a day, and it closes — the panel flips up if there's no room below, closes on Escape, and puts focus back on the field, all borrowed from Popover. The calendar is drawn with plain date math (no date library) and weeks start on Sunday. This page is tokens-only: the design system ships the --vds-datepicker-* variables and this worked example, not an installable component."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own picker against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'Date | null' }, '—', 'The chosen day (controlled)'],
            [{ code: 'defaultValue' }, { code: 'Date | null' }, { code: 'null' }, 'The starting day (uncontrolled)'],
            [{ code: 'onChange' }, { code: '(date: Date | null) => void' }, '—', 'Runs when a day is picked'],
            [{ code: 'min' }, { code: 'Date' }, '—', 'Days before this are disabled'],
            [{ code: 'max' }, { code: 'Date' }, '—', 'Days after this are disabled'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'Trigger height — matches Input'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Danger border + aria-invalid'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Dim the field and turn it off'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Select date'" }, 'Shown when nothing is picked'],
            [{ code: 'format' }, { code: '(date) => string' }, { code: 'toLocaleDateString' }, 'How the chosen date reads on the field'],
          ],
        },
      ]}
      accessibility={[
        <>The trigger is a real <IC>{'<button>'}</IC> with <IC>aria-haspopup="dialog"</IC>; the panel is <IC>role="dialog"</IC>.</>,
        <>The grid is <IC>role="grid"</IC> with <IC>role="row"</IC> weeks and <IC>role="gridcell"</IC> day buttons. Each day carries <IC>aria-selected</IC> and a full-date <IC>aria-label</IC> (e.g. "Wednesday, July 15, 2026").</>,
        <>Arrow keys move day-by-day, <Kbd>PageUp</Kbd>/<Kbd>PageDown</Kbd> change month, <Kbd>Enter</Kbd> picks, and <Kbd>Esc</Kbd> closes and returns focus — see the keyboard table.</>,
        <>Today gets a ring (not just a color) so it never relies on color alone; disabled days are dimmed and refuse clicks.</>,
        <><IC>prefers-reduced-motion</IC> turns off the hover and open transitions.</>,
      ]}
    >
      <Section
        title="Basic"
        note="Click the field to open the calendar, then click a day or arrow-key to it and press Enter. Try it near the bottom of the window — the panel flips up so you can still see it."
      >
        <Preview popover reserve={380} canvas={<BasicPicker />} />
      </Section>

      <Section
        title="Min / max range"
        note="Pass min and max to fence the pickable days. Days outside the window are dimmed and can't be clicked — here only July 2026 is open."
      >
        <Preview popover reserve={380} canvas={<RangePicker />} />
      </Section>

      <Section
        title="Sizes, invalid, disabled"
        note="The trigger shares Input's sizes and states, so a date field lines up with the text fields next to it."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 260 }}>
              <DatePicker size="sm" placeholder="Small" aria-label="Small" />
              <DatePicker size="md" placeholder="Medium" aria-label="Medium" />
              <DatePicker size="lg" placeholder="Large" aria-label="Large" />
              <DatePicker invalid placeholder="Invalid" aria-label="Invalid" />
              <DatePicker disabled placeholder="Disabled" aria-label="Disabled" />
            </div>
          }
        />
      </Section>

      <Section title="Keyboard" note="Once the calendar is open, the whole grid is drivable from the keyboard.">
        <div className="vds-ref-table-wrap">
          <table className="vds-ref-table">
            <thead><tr><th>Key</th><th>What it does</th></tr></thead>
            <tbody>
              {KEYS.map((row, i) => (
                <tr key={i}><td>{row[0]}</td><td>{row[1]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Reference implementation"
        note="How the demos on this page are built — reference only. The design system ships the tokens below, not this markup. Your team writes its own picker (its own classes, its own framework) and binds to the --vds-datepicker-* variables. The reference build lives in the repo under src/components/DatePicker and computes the month grid with plain Date math — no date library, weeks start Sunday."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The trigger reuses Input's <IC>--vds-input-*</IC> chrome tokens (it is an input dressed
          up), and the calendar panel rides on Popover for placement, Escape, outside-click, and
          focus-return — so this component invents no new overlay behavior.
        </p>
      </Section>

      <Section
        title="Tokens"
        note="Every visual value is a custom property on the .vds-datepicker root — grab or re-declare any of them on your own selector to retheme the picker without touching the rest of the system. The trigger borrows Input's field tokens; the calendar has its own small set below."
      >
        <TokenGroup label="Calendar — sizing & shape" headers={['Token', 'Maps to', 'Controls']} rows={[
          [{ code: '--vds-datepicker-cell' }, { code: '--vds-control-h-sm' }, 'Day cell size (~32px)'],
          [{ code: '--vds-datepicker-gap' }, { code: '--vds-space-1' }, 'Gap between cells (4px)'],
          [{ code: '--vds-datepicker-pad' }, { code: '--vds-space-2' }, 'Panel inset (8px)'],
          [{ code: '--vds-datepicker-radius' }, { code: '--vds-radius-sm' }, 'Cell + nav-button radius'],
        ]} />

        <TokenGroup label="Calendar — color" headers={['Token', 'Maps to', 'Controls']} rows={[
          [{ code: '--vds-datepicker-accent' }, { code: '--vds-primary' }, 'Selected day fill'],
          [{ code: '--vds-datepicker-on-accent' }, { code: '--vds-on-primary' }, 'Selected day ink'],
          [{ code: '--vds-datepicker-today-ring' }, { code: '--vds-focus-ring' }, "Today's ring"],
          [{ code: '--vds-datepicker-muted' }, { code: '--vds-ink-subtle' }, 'Outside-month days + weekday header'],
          [{ code: '--vds-datepicker-hover' }, 'ink 7% → transparent', 'Day / nav hover fill'],
        ]} />

        <TokenGroup label="Motion" headers={['Token', 'Maps to', 'Controls']} rows={[
          [{ code: '--vds-datepicker-dur' }, { code: '--vds-dur-fast' }, 'Hover / focus transition'],
          [{ code: '--vds-datepicker-ease' }, { code: '--vds-ease-out' }, 'The easing curve'],
        ]} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
          The trigger also reads Input's <IC>--vds-input-fill</IC>, <IC>--vds-input-border</IC>,
          <IC>--vds-input-border-hover</IC>, and <IC>--vds-input-muted</IC> — the same field chrome
          Select and Textarea use — so a date field matches the text fields beside it.
        </p>
      </Section>
    </ComponentPage>
  )
}
