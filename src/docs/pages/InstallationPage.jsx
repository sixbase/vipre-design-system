import { DocPage } from '../DocPage.jsx'
import { Section, Code, IC } from '../primitives.jsx'
import { Text } from '../../components/index.js'

export function InstallationPage() {
  return (
    <DocPage
      title="Installation"
      description="How to add the system to your app. There are three levels: just the tokens (CSS variables), the full stylesheet (tokens + every component's CSS), or the stylesheet plus the React components. The first two are plain CSS — no React needed."
    >
      <Section title="Requirements">
        <ul className="vds-a11y">
          <li>For the CSS bundles: nothing — they're plain CSS files.</li>
          <li>For the React components: Node.js ≥ 18, React ≥ 18, and a bundler that handles JSX and CSS imports (Vite, Next.js, webpack 5+).</li>
        </ul>
      </Section>

      <Section title="1. Add the package">
        <Code>{`# during the POC phase, link it locally from a sibling repo
npm install ../vipre-design-system`}</Code>
      </Section>

      <Section
        title="2a. Tokens only"
        note="The lightest way in. One file of --vds-* variables (built from dist/vipre-tokens.css). They're plain CSS variables, so they work with any styling setup — SCSS, CSS modules, Tailwind themes, anything. This is what the prototypes use today."
      >
        <Code>{`@import "vipre-design-system/tokens.css";

/* plain CSS custom properties — use them anywhere */
.btn-primary {
  background: var(--vds-primary);
  color: var(--vds-on-primary);
  font-family: var(--vds-font-sans);
}`}</Code>
      </Section>

      <Section
        title="2b. Full stylesheet (no React needed)"
        note="One file with everything: tokens, the Rubik text sizes, and every component's styles as vds- BEM classes (built from dist/vipre.css). Write the HTML shown in each component's Markup section and the classes just work. Behaviors that need JavaScript (opening a menu, trapping focus) are noted on each page — you wire those yourself."
      >
        <Code>{`@import "vipre-design-system/styles.css";`}</Code>
        <Code>{`<button class="vds-button vds-button--solid vds-button--primary vds-button--md">
  Add device
</button>
<span class="vds-badge vds-badge--success" role="status">
  <span class="vds-badge__dot" aria-hidden="true"></span> Protected
</span>`}</Code>
      </Section>

      <Section
        title="2c. Stylesheet + React components"
        note="Import the stylesheet once at your app entry, then use the components. Never import a component's .scss file directly — components ship as source JSX, and all styling comes from the one global bundle."
      >
        <Code>{`// app entry (main.jsx)
import "vipre-design-system/styles.css";`}</Code>
        <Code>{`import { Button, Badge, Heading, Text } from "vipre-design-system";

export function Toolbar() {
  return (
    <div>
      <Heading level="title" as="h1">Devices</Heading>
      <Badge tone="success" dot>Protected</Badge>
      <Button>Add device</Button>
    </div>
  );
}`}</Code>
      </Section>

      <Section title="Dark mode" note="Add the dark class to your root element. Every named token flips on its own — components don't change.">
        <Code>{`<html class="dark"> … </html>`}</Code>
        <Text variant="caption" tone="subtle">
          Light is the default; no class needed for light mode.
        </Text>
      </Section>

      <Section title="Building the bundles" note="Both CSS files are built from the SCSS source in this repo.">
        <Code>{`npm run build:tokens   # dist/vipre-tokens.css — tokens only
npm run build:styles   # dist/vipre.css — tokens + typescale + components
npm run build:lib      # both`}</Code>
        <Text variant="caption" tone="subtle" as="p" style={{ marginTop: '0.5rem' }}>
          The package exports stay stable: <IC>.</IC> (components), <IC>./tokens.css</IC>, <IC>./styles.css</IC>.
        </Text>
      </Section>
    </DocPage>
  )
}
