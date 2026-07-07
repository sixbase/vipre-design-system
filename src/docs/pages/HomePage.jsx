import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable } from '../primitives.jsx'

export function HomePage() {
  return (
    <DocPage
      title="Vipre Design System"
      description="A token-first design system for Vipre's product UI: cool graphite greys, the Vipre midnight navy, and the Rubik typescale. Around 50 components, light and dark mode from one set of named tokens, and responsive by default — fluid type, breakpoint mixins, and components that adapt to their container. It ships the MSP v2 chrome (the navy SideNav and AppShell) and works without React too: the styles compile to one plain CSS bundle with vds- classes, so any front end can use them."
    >
      <Section
        title="Principles"
        note="The same rules as the Mason/Claude system, put to work on Vipre's cool, data-packed product screens."
      >
        <PropsTable
          headers={['Principle', 'What it means']}
          rows={[
            ['Tokens only', 'No raw hex or px in components — add a token instead.'],
            ['Named tokens, not raw colors', 'Components use named tokens (canvas, ink, primary), never the raw color ramps.'],
            ['Components own their styles', 'Pages put components together; they never restyle a component.'],
            ['Text goes through Text / Heading', 'Never raw font sizes or heading tags.'],
            ['Accessibility is a gate', 'Visible focus, WCAG AA contrast, keyboard support, reduced motion.'],
          ]}
        />
      </Section>

      <Section
        title="Run the docs"
        note="This site is the living spec — every example is the real component. See Installation for how to use the system in your own app."
      >
        <Code>{`npm install\nnpm run dev`}</Code>
      </Section>
    </DocPage>
  )
}
