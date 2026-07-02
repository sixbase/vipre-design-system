import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable } from '../primitives.jsx'

export function HomePage() {
  return (
    <DocPage
      title="Vipre Design System"
      description="A fresh, token-first starting point — cool graphite greys, an iris brand accent, and the Rubik type sizes. Written in SCSS, where every value is a named token that switches between light and dark."
    >
      <Section
        title="Principles"
        note="The same rules as the Mason/Claude system, put to work on Vipre's cool, data-packed product screens."
      >
        <PropsTable
          headers={['Principle', 'What it means']}
          rows={[
            ['Tokens only', 'No raw hex or px in components — add a token instead.'],
            ['Named tokens, not raw colors', 'Components use named tokens (canvas, ink, primary), never the raw color sets.'],
            ['Components own their styles', 'Pages put components together; they never restyle a component.'],
            ['Text goes through Text / Heading', 'Never raw font sizes or heading tags.'],
            ['Accessibility is a gate', 'Visible focus, WCAG AA contrast, keyboard support.'],
          ]}
        />
      </Section>

      <Section title="Install" note="POC: one Vite + React app styled with SCSS.">
        <Code>{`npm install\nnpm run dev`}</Code>
      </Section>
    </DocPage>
  )
}
