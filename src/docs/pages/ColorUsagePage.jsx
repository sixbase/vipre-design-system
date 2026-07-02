import { DocPage } from '../DocPage.jsx'
import { Section, ColorUsage } from '../primitives.jsx'
import { Text } from '../../components/index.js'
import { COMPONENT_COLORS, COLOR_USAGE_ORDER } from '../colorUsage.js'

/* ----------------------------------------------------------------------------
   Color usage — every component's color tokens in one scroll, each resolved to
   live hex for the current theme. The audit surface for palette feedback: scan
   here, then adjust a token at its source on the Colors page and it updates
   everywhere it's used. Toggle the theme (top-left) to compare light vs dark.
   -------------------------------------------------------------------------- */
export function ColorUsagePage() {
  return (
    <DocPage
      title="Color usage"
      description="This shows which color tokens each component uses, with the real hex for the mode you're in. Components only use named tokens (plus a few raw color sets for tags and labels), so to change a color, change it once on the Colors page and every component here updates. Flip light and dark to compare."
    >
      {COLOR_USAGE_ORDER.map((name) => {
        const entry = COMPONENT_COLORS[name]
        if (!entry) return null
        return (
          <Section key={name} title={name}>
            <Text variant="detail" tone="subtle" style={{ display: 'block', margin: '-0.25rem 0 0' }}>
              <code>.{entry.scope}</code> · {entry.rows.length} tokens
            </Text>
            <ColorUsage scope={entry.scope} rows={entry.rows} />
          </Section>
        )
      })}
    </DocPage>
  )
}
