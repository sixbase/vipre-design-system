import { useState } from 'react'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { SearchInput } from '../../components/SearchInput/index.js'
import { Field } from '../../components/Field/index.js'
import { Text } from '../../components/Text/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 320 }

function ControlledExample() {
  const [query, setQuery] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: 320 }}>
      <SearchInput value={query} onChange={setQuery} placeholder="Search devices…" />
      <Text variant="detail" tone="muted">
        {query ? `Searching for “${query}”` : 'Type to search'}
      </Text>
    </div>
  )
}

export function SearchInputPage() {
  return (
    <ComponentPage
      title="SearchInput"
      description="A search box built on Input. It comes with the search icon, a clear × that appears once you type (Escape clears too), a spinner for while results load, and an optional keyboard-shortcut chip like ⌘K. One thing to note: onChange hands you the text itself, not the event."
      installCode={`import { SearchInput } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value / defaultValue' }, { code: 'string' }, '—', 'The text, with or without you tracking it'],
            [{ code: 'onChange' }, { code: '(value, event?) => void' }, '—', 'Runs with the text (a string, not an event). Clearing sends ""'],
            [{ code: 'onClear' }, { code: '() => void' }, '—', 'Runs after the × button or Escape clears the field'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'A spinner replaces the search icon'],
            [{ code: 'shortcutHint' }, { code: 'string' }, '—', 'A chip like ⌘K, shown while empty and unfocused'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Field height (matches Input)'],
            [{ code: 'placeholder' }, { code: 'string' }, { code: "'Search…'" }, 'Hint text'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'Everything a native input takes'],
          ],
        },
      ]}
      accessibility={[
        <><IC>aria-label</IC> defaults to “Search”. Override it, or wrap in a <IC>Field</IC> and pass <IC>aria-label={'{undefined}'}</IC> so the visible label names it.</>,
        <>Escape clears only when there’s text. An empty field lets Escape bubble on — so a dialog around it can still close.</>,
        <>The × button has its own label (“Clear search”) and focus ring; the shortcut chip is decoration (<IC>aria-hidden</IC>) and hides on touch screens.</>,
      ]}
    >
      <Section title="Basic">
        <Preview
          canvas={
            <div style={COL}>
              <SearchInput placeholder="Search devices…" />
            </div>
          }
          code={`<SearchInput placeholder="Search devices…" onChange={setQuery} />`}
        />
      </Section>

      <Section title="Controlled" note="Hold the text yourself. Try typing, then press Escape or the ×.">
        <Preview
          canvas={<ControlledExample />}
          code={`const [query, setQuery] = useState('')

<SearchInput value={query} onChange={setQuery} placeholder="Search devices…" />`}
        />
      </Section>

      <Section
        title="Shortcut hint"
        note="A little chip shows the shortcut while the field is empty and unfocused. Wiring the actual keyboard shortcut is your app’s job."
      >
        <Preview
          canvas={
            <div style={COL}>
              <SearchInput shortcutHint="⌘K" placeholder="Search anything…" />
            </div>
          }
          code={`<SearchInput shortcutHint="⌘K" placeholder="Search anything…" />`}
        />
      </Section>

      <Section title="Loading" note="While results load, a spinner takes the search icon’s spot.">
        <Preview
          canvas={
            <div style={COL}>
              <SearchInput loading defaultValue="ransom" placeholder="Search threats…" />
            </div>
          }
          code={`<SearchInput loading value={query} onChange={setQuery} />`}
        />
      </Section>

      <Section title="Sizes and disabled">
        <Preview
          canvas={
            <div style={COL}>
              <SearchInput size="sm" placeholder="Small" />
              <SearchInput size="md" placeholder="Medium" />
              <SearchInput size="lg" placeholder="Large" />
              <SearchInput disabled placeholder="Disabled" />
            </div>
          }
          code={`<SearchInput size="sm" />
<SearchInput size="md" />
<SearchInput size="lg" />
<SearchInput disabled />`}
        />
      </Section>

      <Section title="In a Field" note="Give it a visible label with Field. Pass aria-label={undefined} so the label does the naming.">
        <Preview
          canvas={
            <div style={COL}>
              <Field label="Find a customer" help="Search by name or domain.">
                <SearchInput aria-label={undefined} placeholder="e.g. Acme Corp" />
              </Field>
            </div>
          }
          code={`<Field label="Find a customer" help="Search by name or domain.">
  <SearchInput aria-label={undefined} placeholder="e.g. Acme Corp" />
</Field>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes — it’s an Input shell with search extras. JS you must supply yourself: showing the × once there’s text (swap it with the hint chip), clearing on × click and on Escape, and swapping the icon for a spinner while loading."
      >
        <Code>{`<div class="vds-input vds-input--md vds-search-input">
  <span class="vds-input__affix vds-input__affix--lead">
    <!-- search icon (or a spinner while loading) -->
  </span>
  <input class="vds-input__field" type="search" placeholder="Search…" aria-label="Search">
  <span class="vds-input__affix vds-input__affix--trail">
    <!-- empty + unfocused: the shortcut chip -->
    <kbd class="vds-search-input__hint" aria-hidden="true">⌘K</kbd>
    <!-- has text: the clear button instead -->
    <button class="vds-search-input__clear" type="button" aria-label="Clear search">
      <!-- × icon -->
    </button>
  </span>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
