import { DocPage } from '../DocPage.jsx'
import { Section, PropsTable, IC } from '../primitives.jsx'
import { Text, Surface } from '../../components/index.js'

/* The five semantic elevation levels. Each row is rendered as a live tile so
   the surface tone + border + shadow combination is the real thing, not a
   picture of it. */
const LEVELS = [
  { key: 'flat', n: 0, role: 'Page canvas, inline cells', surface: '--vds-canvas', shadow: null, bordered: false },
  { key: 'resting', n: 1, role: 'Cards, panels, table shell', surface: '--vds-surface', shadow: null, bordered: true },
  { key: 'raised', n: 2, role: 'Menus, popovers, selects', surface: '--vds-surface-raised', shadow: '--vds-shadow-md', bordered: true },
  { key: 'overlay', n: 3, role: 'Drawers, modals', surface: '--vds-surface-overlay', shadow: '--vds-shadow-lg', bordered: true },
  { key: 'floating', n: 4, role: 'Toasts, tooltips', surface: '--vds-surface-raised', shadow: '--vds-shadow-lg', bordered: false },
]

const SHADOWS = ['--vds-shadow-xs', '--vds-shadow-sm', '--vds-shadow-md', '--vds-shadow-lg']

const SURFACES = [
  { token: '--vds-canvas', label: 'canvas', note: 'Level 0 — the page' },
  { token: '--vds-surface', label: 'surface', note: 'Level 1 — resting' },
  { token: '--vds-surface-raised', label: 'surface-raised', note: 'Level 2 — raised' },
  { token: '--vds-surface-overlay', label: 'surface-overlay', note: 'Level 3 — overlay' },
]

const Z_TOKENS = [
  ['--vds-z-base', '0', 'Default document flow'],
  ['--vds-z-raised', '10', 'In-component lift (Table sticky header)'],
  ['--vds-z-sticky', '100', 'Page-level sticky toolbars / headers'],
  ['--vds-z-dropdown', '200', 'Menus, selects, popovers, comboboxes'],
  ['--vds-z-drawer', '300', 'Side drawers / sheets'],
  ['--vds-z-modal', '400', 'Modal dialogs'],
  ['--vds-z-toast', '500', 'Toasts / notifications'],
  ['--vds-z-tooltip', '600', 'Tooltips — always on top'],
]

/* The diagonal stack uses these for the overlapping demo cards. */
const Z_STACK = [
  { label: 'sticky', token: '--vds-z-sticky' },
  { label: 'dropdown', token: '--vds-z-dropdown' },
  { label: 'drawer', token: '--vds-z-drawer' },
  { label: 'modal', token: '--vds-z-modal' },
  { label: 'tooltip', token: '--vds-z-tooltip' },
]

export function DepthPage() {
  return (
    <DocPage
      title="Depth"
      description="How Vipre shows that one surface sits on top of another — kept subtle on purpose. Use the gentlest way to tell two surfaces apart: color first, then a line, then a shadow, and only then stacking order."
    >
      <Section title="The priority order" note="Try these in order. Don't jump to a heavier one when a lighter one already tells the surfaces apart.">
        <ol className="vds-depth-order">
          <li><span className="vds-depth-order__n">1</span><div><strong>Color</strong> — a surface that sits higher up uses a different background (<IC>canvas</IC> → <IC>surface</IC> → <IC>surface-raised</IC> → <IC>surface-overlay</IC>).</div></li>
          <li><span className="vds-depth-order__n">2</span><div><strong>Line</strong> — a 1px <IC>--vds-line</IC> border tells two flat surfaces apart before you reach for a shadow.</div></li>
          <li><span className="vds-depth-order__n">3</span><div><strong>Shadow</strong> — only when something <em>lifts off</em> the page (menus, modals, toasts).</div></li>
          <li><span className="vds-depth-order__n">4</span><div><strong>Stack order</strong> — a <IC>--vds-z-*</IC> token decides which floating thing shows on top when two overlap.</div></li>
        </ol>
      </Section>

      <Section title="Elevation ladder" note="Five levels, named for their job — not their look. Each tile below is a real <Surface elevation={level} /> — the level sets the background, border, and shadow all at once.">
        <div className="vds-elev-ladder">
          {LEVELS.map((l) => (
            <div key={l.key} className="vds-elev-item">
              <Surface
                elevation={l.key}
                bordered={l.bordered}
                radius="md"
                padding={0}
                className="vds-elev-tile"
              >
                <span className="vds-elev-tile__n">{l.n}</span>
              </Surface>
              <Text variant="caption" className="vds-elev-item__name vds-mono">{`elevation="${l.key}"`}</Text>
              <Text variant="caption" tone="muted">{l.role}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow scale" note="Tinted with navy for a cool look. Only for things that float — flat surfaces use color and a line instead. In dark mode the shadows fade on purpose; depth comes from the surface colors.">
        <div className="vds-shadow-row">
          {SHADOWS.map((s) => (
            <div key={s} className="vds-shadow-item">
              <div className="vds-shadow-chip" style={{ boxShadow: `var(${s})` }} />
              <Text variant="caption" className="vds-mono">{s.replace('--vds-shadow-', '')}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Surface ladder" note="The color side of depth. In light mode shadows do the work, so the surfaces barely change. In dark mode color does the work — higher up means lighter — so each step gets a lighter navy. Flip the theme (top-left) to see the difference.">
        <div className="vds-swatches vds-swatches--semantic">
          {SURFACES.map((s) => (
            <div key={s.token} className="vds-swatch">
              <div className="vds-swatch__chip" style={{ background: `var(${s.token})` }} />
              <Text variant="caption" className="vds-swatch__label">{s.label}</Text>
              <Text variant="caption" tone="muted">{s.note}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Stacking order" note="One place that decides z-index. Components never type a number — they use a token. The gaps of 100 leave room to add a layer in between later.">
        <div className="vds-zstack">
          {Z_STACK.map((z, i) => (
            <div
              key={z.label}
              className="vds-zstack__card"
              style={{ zIndex: `var(${z.token})`, left: `${i * 64}px`, top: `${i * 26}px` }}
            >
              <span className="vds-mono">{z.label}</span>
            </div>
          ))}
        </div>
        <PropsTable
          headers={['Token', 'Value', 'Layer']}
          rows={Z_TOKENS.map(([t, v, use]) => [{ code: t }, v, use])}
        />
      </Section>

      <Section title="Scrim" note="The dark layer behind overlays (level 3). Navy in light mode, near-black in dark. It dims the page so it doesn't fight with the dialog on top.">
        <div className="vds-scrim-demo">
          <div className="vds-scrim-demo__bg">
            <Text variant="caption" tone="muted">Page content behind the overlay…</Text>
            <Text variant="caption" tone="muted">…dimmed by the scrim so focus moves forward.</Text>
          </div>
          <div className="vds-scrim-demo__scrim" />
          <div className="vds-scrim-demo__dialog">
            <Text variant="body">Confirm action</Text>
            <Text variant="caption" tone="muted">A level-3 overlay sits on surface-overlay with shadow-lg, above the dimmed page.</Text>
          </div>
        </div>
      </Section>
    </DocPage>
  )
}
