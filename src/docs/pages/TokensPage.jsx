import { DocPage } from '../DocPage.jsx'
import { Section, IC, RefTable } from '../primitives.jsx'
import { Text, Heading } from '../../components/index.js'
import {
  PRIMITIVES, SEMANTIC_GROUPS, TYPE_SCALE, WEIGHTS, LEADING, SPACING,
  RADIUS, SHADOWS, MOTION, LAYOUT, BREAKPOINTS, ZINDEX, CONTROLS, FONT, EFFECTS,
} from '../tokens.js'

/* ============================================================================
   Token Reference — the flat, scannable lookup for every --vds-* token, grouped
   the way a dev reaches for them. Composes DocPage + the existing .vds-ref-table
   styling; the teaching pages (Colors, Typography, Spacing…) own the "why", this
   page is the "what + value". Data comes straight from tokens.js (the mirror of
   _tokens.scss), so it stays in sync.
   ========================================================================== */

const Tok = ({ children }) => <code className="vds-inline-code">{children}</code>

/* ---- preview swatches (all colours/effects come from tokens) ---- */
const ColorSwatch = ({ token }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block', width: 22, height: 22, borderRadius: 4,
      background: `var(${token})`, border: '1px solid var(--vds-line)', verticalAlign: 'middle',
    }}
  />
)

const RadiusSwatch = ({ token }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block', width: 40, height: 24,
      background: 'var(--vds-primary-soft)', border: '1px solid var(--vds-primary)',
      borderRadius: `var(${token})`, verticalAlign: 'middle',
    }}
  />
)

const ShadowSwatch = ({ token }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block', width: 40, height: 24, borderRadius: 6,
      background: 'var(--vds-surface)', boxShadow: `var(${token})`, verticalAlign: 'middle',
    }}
  />
)

const SpaceBar = ({ token }) => (
  <span className="vds-space-bar" aria-hidden="true" style={{ width: `var(${token})` }} />
)

export function TokensPage() {
  return (
    <DocPage
      title="Token Reference"
      description="Every design token in one place — names, values, and what each is for. Tokens are plain CSS variables (--vds-*), so they work in any framework: reach for var(--vds-…) and never hard-code a colour, size, or duration. Semantic tokens flip automatically between light and dark. This page is the flat lookup; the Foundation pages (Colors, Typography, Spacing, Depth) cover the reasoning."
    >
      <Section
        title="How tokens are layered"
        note="Three tiers. You style with tiers 2 and 3; tier 1 is the raw material underneath."
      >
        <RefTable
          headers={['Tier', 'What it is', 'Use it?']}
          rows={[
            [<strong key="a">Primitive</strong>, <>Raw colour ramps — <Tok>--vds-graphite-500</Tok>, <Tok>--vds-cobalt-600</Tok></>, 'No — never in a component'],
            [<strong key="b">Semantic</strong>, <>Intent, bound to a primitive and theme-aware — <Tok>--vds-primary</Tok>, <Tok>--vds-ink</Tok></>, 'Yes — for colour'],
            [<strong key="c">Scale</strong>, <>Type, spacing, radius, shadow, motion, layout, z-index</>, 'Yes — for everything else'],
          ]}
        />
      </Section>

      {/* ---- COLOUR ---------------------------------------------------------- */}
      <Section
        title="Color · semantic"
        note="The colour tokens you actually paint with. Each maps to a primitive and shows its light → dark step. Swatches reflect the current theme — flip the theme toggle to see them move."
      >
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 'var(--vds-space-6)' }}>
            <Heading level="subheading" as="h3" style={{ marginBottom: 'var(--vds-space-3)' }}>
              {group.title}
            </Heading>
            <RefTable
              headers={['', 'Token', 'Light → dark', 'Usage']}
              rows={group.rows.map((r) => [
                <ColorSwatch key="s" token={r.token} />,
                <Tok key="t">{r.token}</Tok>,
                r.ref,
                r.usage,
              ])}
            />
          </div>
        ))}
      </Section>

      <Section
        title="Color · primitive ramps"
        note="The raw material — 12 families × 12 steps (50…1000). Components never use these directly; they exist so semantic tokens have something to point at. Hover a step for its hex; the Colors page has the full grid."
      >
        <div className="vds-ref-table-wrap">
          <table className="vds-ref-table">
            <tbody>
              {PRIMITIVES.map((fam) => (
                <tr key={fam.name}>
                  <td style={{ whiteSpace: 'nowrap' }}><Tok>{`--vds-${fam.name.toLowerCase()}-*`}</Tok></td>
                  <td>
                    <span style={{ display: 'inline-flex', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--vds-line)' }}>
                      {Object.entries(fam.shades).map(([step, hex]) => (
                        <span
                          key={step}
                          title={`${fam.name.toLowerCase()}-${step} · ${hex}`}
                          style={{ display: 'inline-block', width: 20, height: 22, background: hex }}
                        />
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- TYPOGRAPHY ------------------------------------------------------ */}
      <Section
        title="Typography · scale"
        note="One ramp of 11 steps. Render text through Text / Heading — the class is applied for you. The steps that scale (display / title / heading) show their range at a 320px viewport → full size."
      >
        <RefTable
          headers={['Sample', 'Class', 'Size (px)', 'Line', 'Weight', 'Tracking', 'Usage']}
          rows={TYPE_SCALE.map((s) => [
            s.kind === 'h'
              ? <Heading key="x" level={s.level} as="span">Ag</Heading>
              : <Text key="x" variant={s.variant} as="span">Ag</Text>,
            <Tok key="t">{`vds-${s.token}`}</Tok>,
            String(s.px),
            String(s.lh),
            String(s.weight),
            s.tracking ?? '—',
            s.usage,
          ])}
        />
      </Section>

      <Section title="Typography · weight, leading & font">
        <Heading level="subheading" as="h3" style={{ marginBottom: 'var(--vds-space-3)' }}>Font weights</Heading>
        <RefTable
          headers={['Token', 'Value', 'Name']}
          rows={WEIGHTS.map((w) => [<Tok key="t">{w.token}</Tok>, <span key="v" style={{ fontWeight: w.value }}>{w.value}</span>, w.name])}
        />
        <Heading level="subheading" as="h3" style={{ margin: 'var(--vds-space-6) 0 var(--vds-space-3)' }}>Line-height</Heading>
        <RefTable
          headers={['Token', 'Value', 'Usage']}
          rows={LEADING.map((l) => [<Tok key="t">{l.token}</Tok>, l.value, l.usage])}
        />
        <Heading level="subheading" as="h3" style={{ margin: 'var(--vds-space-6) 0 var(--vds-space-3)' }}>Font family</Heading>
        <RefTable
          headers={['Token', 'Value', 'Usage']}
          rows={FONT.map((f) => [<Tok key="t">{f.token}</Tok>, f.value, f.usage])}
        />
      </Section>

      {/* ---- SPACING --------------------------------------------------------- */}
      <Section title="Spacing" note="A 4px-based scale for every gap and pad. The bar shows the real size.">
        <RefTable
          headers={['Size', 'Token', 'px', 'Usage']}
          rows={SPACING.map((s) => [<SpaceBar key="b" token={s.token} />, <Tok key="t">{s.token}</Tok>, s.px, s.usage])}
        />
      </Section>

      {/* ---- RADIUS ---------------------------------------------------------- */}
      <Section title="Radius" note="Corner rounding. Controls use sm; surfaces step up from there.">
        <RefTable
          headers={['', 'Token', 'px', 'Usage']}
          rows={RADIUS.map((r) => [<RadiusSwatch key="s" token={r.token} />, <Tok key="t">{r.token}</Tok>, r.px, r.usage])}
        />
      </Section>

      {/* ---- ELEVATION ------------------------------------------------------- */}
      <Section title="Elevation · shadow" note="A four-step shadow ramp, tinted with the Midnight navy for a cool cast. Higher float = deeper shadow.">
        <RefTable
          headers={['', 'Token', 'Usage']}
          rows={SHADOWS.map((s) => [<ShadowSwatch key="s" token={s.token} />, <Tok key="t">{s.token}</Tok>, s.usage])}
        />
      </Section>

      {/* ---- MOTION ---------------------------------------------------------- */}
      <Section title="Motion" note="Shared easings and durations. Pair a duration with an easing; honour prefers-reduced-motion.">
        <RefTable
          headers={['Token', 'Value', 'Usage']}
          rows={MOTION.map((m) => [<Tok key="t">{m.token}</Tok>, <Tok key="v">{m.value}</Tok>, m.usage])}
        />
      </Section>

      {/* ---- LAYOUT ---------------------------------------------------------- */}
      <Section title="Layout & grid" note="Structural rhythm. Some values step up with the viewport — the Responsiveness page covers where.">
        <RefTable
          headers={['Token', 'Value', 'Usage']}
          rows={LAYOUT.map((l) => [<Tok key="t">{l.token}</Tok>, l.value, l.usage])}
        />
      </Section>

      {/* ---- BREAKPOINTS ----------------------------------------------------- */}
      <Section title="Breakpoints" note="The responsive tiers. Style with the SCSS mixins; the --vds-bp-* tokens are just for JS — CSS media queries can't read variables.">
        <RefTable
          headers={['Name', 'Token', 'Value', 'Usage']}
          rows={BREAKPOINTS.map((b) => [<strong key="n">{b.name}</strong>, <Tok key="t">{b.token}</Tok>, b.value, b.usage])}
        />
      </Section>

      {/* ---- Z-INDEX --------------------------------------------------------- */}
      <Section title="Z-index" note="The stacking order for floating layers. Reference one of these — never a hand-written z-index. Gaps leave room to slot new layers in.">
        <RefTable
          headers={['Token', 'Value', 'Usage']}
          rows={ZINDEX.map((z) => [<Tok key="t">{z.token}</Tok>, z.value, z.usage])}
        />
      </Section>

      {/* ---- CONTROLS + EFFECTS ---------------------------------------------- */}
      <Section title="Controls & focus" note="Shared control heights and the focus-ring recipe knobs, so every input, button, and select lines up.">
        <RefTable
          headers={['Token', 'Value', 'Usage']}
          rows={CONTROLS.map((c) => [<Tok key="t">{c.token}</Tok>, c.value, c.usage])}
        />
      </Section>

      <Section title="Effects" note="The focus outline and the scrim behind overlays.">
        <RefTable
          headers={['', 'Token', 'Value', 'Usage']}
          rows={EFFECTS.map((e) => [<ColorSwatch key="s" token={e.token} />, <Tok key="t">{e.token}</Tok>, e.ref, e.usage])}
        />
      </Section>

      {/* ---- COMPONENT TOKENS ------------------------------------------------ */}
      <Section
        title="Component tokens"
        note="Every component also re-exposes a small family of its own tokens under a --vds-{name}-* namespace, each bound to one of the foundation tokens above. Re-point them on your own selector to re-space or re-shape that component — nothing else in the system moves. Each component page documents its own set in a live Token / Bound to / Live value / What it controls table."
      >
        <RefTable
          headers={['Component', 'Token namespace', 'Full spec']}
          rows={[
            [<strong key="b">Button</strong>, <Tok key="t">--vds-button-*</Tok>, <a key="l" href="#/components/button">Button → Tokens</a>],
            [<strong key="i">Input</strong>, <Tok key="t">--vds-input-*</Tok>, <a key="l" href="#/primitives/input">Input → Tokens</a>],
            [<strong key="f">Field</strong>, <Tok key="t">--vds-field-*</Tok>, <a key="l" href="#/primitives/field">Field → Tokens</a>],
            [<strong key="s">Select</strong>, <Tok key="t">--vds-select-*</Tok>, <a key="l" href="#/primitives/select">Select → Tokens</a>],
            [<span key="x" className="vds-text vds-text--tone-muted">…and so on</span>, <span key="y" className="vds-text vds-text--tone-muted">one namespace per component</span>, <span key="z" className="vds-text vds-text--tone-muted">see each component page</span>],
          ]}
        />
        <Text variant="caption" tone="muted" style={{ marginTop: 'var(--vds-space-3)' }}>
          Consumers import the CSS bundle once (<IC>vipre-design-system/styles.css</IC>) or just the tokens (<IC>vipre-design-system/tokens.css</IC>) and every <IC>--vds-*</IC> above is available as a plain CSS variable — reach for <IC>var(--vds-…)</IC> in any framework.
        </Text>
      </Section>
    </DocPage>
  )
}
