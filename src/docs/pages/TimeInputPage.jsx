import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import { TimeInput } from '../../components/TimeInput/index.js'
import { Text } from '../../components/index.js'

/* Live time field — the docs page holds the value; the platform UI edits it. */
function BasicTime() {
  const [time, setTime] = useState('09:30')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 200 }}>
      <TimeInput value={time} onChange={(e) => setTime(e.target.value)} aria-label="Pick a time" />
      <Text variant="detail" tone="muted">{time ? `Set to ${time}` : 'No time set'}</Text>
    </div>
  )
}

export function TimeInputPage() {
  return (
    <ComponentPage
      title="Time Input"
      description="A time field, kept deliberately simple: it's an Input with type=time and a little clock icon, so it gets all of Input's look (sizes, invalid, disabled, focus ring) for free and hands the actual time entry to the platform's own time UI — the browser's stepper on desktop, the native clock on a phone. No custom dropdown to reinvent, and the value follows the OS locale. This page is tokens-only: the design system ships the field tokens and this worked example, not an installable component."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own time field against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: "'HH:mm'" }, '—', 'The time string (controlled) — the native type=time format'],
            [{ code: 'defaultValue' }, { code: "'HH:mm'" }, '—', 'The starting time (uncontrolled)'],
            [{ code: 'onChange' }, { code: '(e) => void' }, '—', 'Native change — read e.target.value'],
            [{ code: 'min' }, { code: "'HH:mm'" }, '—', 'Earliest allowed time'],
            [{ code: 'max' }, { code: "'HH:mm'" }, '—', 'Latest allowed time'],
            [{ code: 'step' }, { code: 'number' }, '—', 'Seconds granularity (60 = minutes, 900 = 15 min)'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'Field height — matches Input'],
            [{ code: 'invalid' }, { code: 'boolean' }, { code: 'false' }, 'Danger border + aria-invalid'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Dim the field and turn it off'],
          ],
        },
      ]}
      accessibility={[
        <>It's a native <IC>{'<input type="time">'}</IC>, so keyboard entry, the up/down steppers, and the picker all come from the platform — nothing to reimplement.</>,
        <>Pair it with a <IC>{'<label>'}</IC> (or <IC>aria-label</IC>). <IC>invalid</IC> sets <IC>aria-invalid</IC>; the leading clock icon is decorative and hidden from screen readers.</>,
        <>Because the entry UI is native, it already respects the user's locale (12h vs 24h) and OS settings.</>,
      ]}
    >
      <Section
        title="Basic"
        note="Click into the field and type, use the up/down arrows, or open the native picker. On a phone this is the OS clock."
      >
        <Preview canvas={<BasicTime />} />
      </Section>

      <Section
        title="Steps, sizes, and states"
        note="step sets the granularity (here 15-minute jumps). Sizes and the invalid / disabled states are exactly Input's."
      >
        <Preview
          canvas={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 200 }}>
              <TimeInput defaultValue="09:00" step={900} size="sm" aria-label="15-minute steps" />
              <TimeInput defaultValue="12:30" size="md" aria-label="Medium" />
              <TimeInput defaultValue="17:45" size="lg" aria-label="Large" />
              <TimeInput defaultValue="08:15" invalid aria-label="Invalid" />
              <TimeInput defaultValue="10:00" disabled aria-label="Disabled" />
            </div>
          }
        />
      </Section>

      <Section
        title="Reference implementation"
        note="Reference only — the design system ships the tokens, not this component. TimeInput is intentionally thin: it renders an Input (type=time) with a leading clock icon, so it reuses every Input token and adds nothing new except the clock's tint."
      >
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: 0 }}>
          The reference build lives under <IC>src/components/TimeInput</IC>. Because it composes
          Input, there are no time-specific chrome tokens to learn — it reads Input's
          <IC>--vds-input-*</IC> field tokens, and exposes just <IC>--vds-timeinput-icon</IC> for the
          leading clock tint (bound to <IC>--vds-input-muted</IC>).
        </p>
      </Section>
    </ComponentPage>
  )
}
