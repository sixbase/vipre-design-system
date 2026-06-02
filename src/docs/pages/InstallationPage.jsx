import { DocPage } from '../DocPage.jsx'
import { Section, Code } from '../primitives.jsx'
import { Text } from '../../components/index.js'

export function InstallationPage() {
  return (
    <DocPage
      title="Installation"
      description="How to consume the Vipre Design System in a React app. Two delivery paths — tokens only (lightest), or tokens + components."
    >
      <Section title="Requirements">
        <ul className="vds-a11y">
          <li>Node.js ≥ 18, React ≥ 18</li>
          <li>A bundler that supports CSS imports and JSX (Vite, Next.js, webpack 5+)</li>
        </ul>
      </Section>

      <Section title="1. Add the package">
        <Code>{`# from a sibling repo, link it locally during the POC phase
npm install ../vipre-design-system`}</Code>
      </Section>

      <Section
        title="2a. Tokens only (the bridge)"
        note="Lightest path — pull in just the CSS variables and map them into your existing styling (e.g. Tailwind @theme). What the prototypes use today."
      >
        <Code>{`@import "vipre-design-system/tokens.css";

/* map into Tailwind @theme, for example */
@theme {
  --color-primary: var(--vds-primary);
  --color-surface: var(--vds-surface);
  --font-sans:     var(--vds-font-sans);
}`}</Code>
      </Section>

      <Section
        title="2b. Tokens + components"
        note="Full path — import the stylesheet once, then use the React components."
      >
        <Code>{`// app entry (main.jsx)
import "vipre-design-system/styles.css";`}</Code>
        <Code>{`import { Button, Badge, Heading, Text } from "vipre-design-system";

export function Toolbar() {
  return (
    <div>
      <Heading level="title" as="h1">Devices</Heading>
      <Badge tone="success" dot>Protected</Badge>
      <Button variant="primary">Add device</Button>
    </div>
  );
}`}</Code>
      </Section>

      <Section title="Dark mode" note="Add the dark class to your root element. Every semantic token flips automatically.">
        <Code>{`<html class="dark"> … </html>`}</Code>
        <Text variant="caption" tone="subtle">
          Light is the default; no class needed for light mode.
        </Text>
      </Section>
    </DocPage>
  )
}
