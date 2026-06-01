import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable } from '../primitives.jsx'

export function HomePage() {
  return (
    <DocPage
      title="Vipre Design System"
      description="A fresh, token-first foundation — cool graphite neutrals, an iris brand accent, and the Rubik typescale. Authored in SCSS; every value is a semantic token that flips between light and dark."
    >
      <Section
        title="Principles"
        note="The same discipline as the Mason/Claude system, applied to Vipre's cool, data-dense SaaS domain."
      >
        <PropsTable
          headers={['Principle', 'What it means']}
          rows={[
            ['Tokens only', 'No raw hex or px in components — add a token instead.'],
            ['Semantic over primitive', 'Components use intent tokens (canvas, ink, primary), never raw ramps.'],
            ['Components own their styles', 'Pages compose; they never restyle a component.'],
            ['Text goes through Text / Heading', 'Never raw font sizes or heading tags.'],
            ['Accessibility is a gate', 'Visible focus, WCAG AA contrast, keyboard support.'],
          ]}
        />
      </Section>

      <Section title="Install" note="POC: a single Vite + React app styled with SCSS.">
        <Code>{`npm install\nnpm run dev`}</Code>
      </Section>
    </DocPage>
  )
}
