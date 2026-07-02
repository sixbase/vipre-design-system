import { DocPage } from '../DocPage.jsx'
import { Section, Code } from '../primitives.jsx'
import { Text } from '../../components/index.js'

export function InstallationPage() {
  return (
    <DocPage
      title="Installation"
      description="How to use the Vipre Design System in a React app. Two ways to add it — just the tokens (the lightest), or the tokens plus the components."
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
        note="The lightest way — grab just the CSS variables and use them straight. They're plain variables, so they work with any styling setup. This is what the prototypes use today."
      >
        <Code>{`@import "vipre-design-system/tokens.css";

/* the tokens are plain CSS custom properties — reference them anywhere */
.btn-primary {
  background: var(--vds-primary);
  color: var(--vds-on-primary);
  font-family: var(--vds-font-sans);
}`}</Code>
      </Section>

      <Section
        title="2b. Tokens + components"
        note="The full way — import the stylesheet once, then use the React components."
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

      <Section title="Dark mode" note="Add the dark class to your root element. Every named token switches over on its own.">
        <Code>{`<html class="dark"> … </html>`}</Code>
        <Text variant="caption" tone="subtle">
          Light is the default; you don't need any class for light mode.
        </Text>
      </Section>
    </DocPage>
  )
}
