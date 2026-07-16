import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Kbd, IC, TokenSpecTable } from '../primitives.jsx'
import { DatePicker } from '../../components/DatePicker/index.js'
import { Text } from '../../components/index.js'

/* The one token spec — Token / Bound to / What it controls, grouped. Live
   values are read at render by the shared TokenSpecTable off a .vds-datepicker
   probe. Only the calendar's own --vds-datepicker-* tokens live here; the
   trigger borrows Input's chrome, noted in the prose below the table. */
const DATEPICKER_TOKEN_GROUPS = [
  {
    label: 'Calendar — sizing & shape',
    tokens: [
      { token: '--vds-datepicker-cell', bound: 'var(--vds-control-h-sm)', controls: 'Day cell size (~32px)' },
      { token: '--vds-datepicker-gap', bound: 'var(--vds-space-1)', controls: 'Gap between cells (4px)' },
      { token: '--vds-datepicker-pad', bound: 'var(--vds-space-2)', controls: 'Panel inset (8px)' },
      { token: '--vds-datepicker-radius', bound: 'var(--vds-radius-sm)', controls: 'Cell + nav-button radius' },
    ],
  },
  {
    label: 'Calendar — color',
    tokens: [
      { token: '--vds-datepicker-accent', bound: 'var(--vds-primary)', controls: 'Selected day fill' },
      { token: '--vds-datepicker-on-accent', bound: 'var(--vds-on-primary)', controls: 'Selected day ink' },
      { token: '--vds-datepicker-today-ring', bound: 'var(--vds-focus-ring)', controls: "Today's ring" },
      { token: '--vds-datepicker-muted', bound: 'var(--vds-ink-subtle)', controls: 'Outside-month days + weekday header' },
      { token: '--vds-datepicker-hover', bound: 'ink 7% → transparent', controls: 'Day / nav hover fill' },
    ],
  },
  {
    label: 'Motion',
    tokens: [
      { token: '--vds-datepicker-dur', bound: 'var(--vds-dur-fast)', controls: 'Hover / focus transition' },
      { token: '--vds-datepicker-ease', bound: 'var(--vds-ease-out)', controls: 'The easing curve' },
    ],
  },
]

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
      description="A field that looks like an Input but opens a little month calendar when you click it. You move around with the arrow keys, pick a day, and it closes — the panel flips up if there's no room below, closes on Escape, and puts focus back on the field, all borrowed from Popover. The calendar is drawn with plain date math (no date library) and weeks start on Sunday. This page is tokens-only: the design system ships the --vds-datepicker-* variables and this example, not a component you can install."
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
        title="Tokens"
        note="Every look comes from a variable on the .vds-datepicker root. Grab or re-set any of them on your own selector to restyle the picker without touching anything else. Live value is what the browser shows right now. The field borrows Input's tokens; the calendar has its own small set below."
      >
        <TokenSpecTable scope="vds-datepicker" prefix="--vds-datepicker-" groups={DATEPICKER_TOKEN_GROUPS} />

        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.75rem' }}>
          The trigger also reads Input's <IC>--vds-input-fill</IC>, <IC>--vds-input-border</IC>,
          <IC>--vds-input-border-hover</IC>, and <IC>--vds-input-muted</IC> — the same field look
          Select and Textarea use — so a date field matches the text fields beside it.
        </p>
      </Section>
    </ComponentPage>
  )
}
