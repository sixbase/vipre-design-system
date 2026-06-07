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
      description="Which color tokens each component paints with, resolved to live hex for the current theme. Components only ever consume semantic tokens (+ a few primitive family ramps for categorical tints), so to adjust a color, change it once at its source on the Colors page and every component below follows. Toggle light/dark to compare."
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
