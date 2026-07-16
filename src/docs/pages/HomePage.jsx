import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable } from '../primitives.jsx'

export function HomePage() {
  return (
    <DocPage
      title="Vipre Design System"
      description="A box of ready-made parts for building Vipre's apps — buttons, tables, forms, and more. Grab them instead of building your own. Every part uses the same colors, sizes, and spacing, so the whole app looks like one thing. It handles light and dark mode by itself, and works with or without React."
    >
      <Section
        title="The rules"
        note="Five rules everything here follows. Keep to them and the app stays tidy."
      >
        <PropsTable
          headers={['Rule', 'What it means']}
          rows={[
            ['Use tokens, not raw values', 'Never type a color or size by hand. Pick a named token.'],
            ['Use names, not raw colors', "Say 'primary' or 'ink', not a hex code."],
            ['Parts style themselves', "Pages just place parts. They don't re-paint them."],
            ['All words go through Text or Heading', 'Never a raw font size or heading tag.'],
            ['Everyone can use it', 'Clear focus ring, easy-to-read contrast, full keyboard support.'],
          ]}
        />
      </Section>

      <Section
        title="See it running"
        note="This site is the real thing — every example is a live part, not a picture. Want it in your own app? Open Installation."
      >
        <Code>{`npm install\nnpm run dev`}</Code>
      </Section>
    </DocPage>
  )
}
