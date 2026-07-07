import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable } from '../primitives.jsx'
import { Heading, Text } from '../../components/index.js'
import { TYPE_SCALE, WEIGHTS, LEADING } from '../tokens.js'

const SPECIMEN = 'The quick brown fox jumps over the lazy dog'
const PARAGRAPH =
  'Scope coverage rolls up from every managed device, so a single figure reflects the whole estate at a glance.'

// One large step and one small, across the ramp — how much air a line needs
// shifts with its size.
const LEADING_DEMO = [
  { name: 'title', kind: 'h', level: 'title', px: '20–24' }, // fluid — 20px narrow → 24px wide
  { name: 'body', kind: 't', variant: 'body', px: 14 },
]
// Same digit count, mixed digit widths — so proportional figures visibly
// stagger while tabular locks them into columns. Both cards show these.
const NUMERAL_ROWS = ['1,111,489', '8,090,246', '1,141,118', '9,806,532']

// The three most-reached-for leadings — one tight, one default, one open.
const LEADING_KEYS = ['tight', 'normal', 'relaxed']
const LEADING_COLS = LEADING_KEYS.map((key) => ({
  key,
  value: LEADING.find((l) => l.token === `--vds-leading-${key}`).value,
}))

export function TypographyPage() {
  return (
    <DocPage
      title="Typography"
      description="One font — Rubik — in 11 sizes. Each size already has its boldness and line spacing built in, so you never pick a font size by hand. Always use the Text or Heading component."
    >
      <Section title="Font family">
        <div className="vds-font-family">
          <Text variant="display" as="div" className="vds-font-family__specimen">
            Aa
          </Text>
          <div className="vds-font-family__meta">
            <div className="vds-font-family__name">Rubik</div>
            <code className="vds-mono-note">--vds-font-sans</code>
            <Text variant="detail" tone="muted" as="p" style={{ marginTop: '0.35rem' }}>
              Four weights, from regular to bold. Clean and easy to read, even when tiny.
            </Text>
          </div>
        </div>
      </Section>

      <Section
        title="Type scale"
        note="11 text sizes, big to small. Not sure which to use? Pick body for normal words and detail for tiny table text."
      >
        <div className="vds-typescale">
          {TYPE_SCALE.map((s) => (
            <div key={s.token} className="vds-typescale__row">
              <div className="vds-typescale__specimen">
                {s.kind === 'h' ? (
                  <Heading level={s.level} as="div">{SPECIMEN}</Heading>
                ) : (
                  <Text variant={s.variant} as="div">{SPECIMEN}</Text>
                )}
              </div>
              <div className="vds-typescale__spec">
                <span className="vds-typescale__name">{s.name}</span>
                <span className="vds-typescale__nums">
                  {s.px} / {s.lh} · {s.weight}
                  {s.tracking ? ` · ${s.tracking}` : ''}
                </span>
                <span className="vds-typescale__usage">{s.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Line height"
        note="Line height is the gap between lines of text. Every size already sets a good one. If a block of text wraps and you want it tighter or roomier, use a preset below."
      >
        <PropsTable
          headers={['Token', 'Value', 'Use for']}
          rows={LEADING.map((l) => [{ code: l.token.replace('--vds-', '') }, l.value, l.usage])}
        />

        <Text variant="caption" tone="muted" as="p" className="vds-leading-caption">
          The same sentence, big and small, at three spacings. Watch the gaps between the lines change.
        </Text>
        <div className="vds-leading-grid" style={{ '--cols': LEADING_COLS.length }}>
          <div className="vds-leading-grid__corner" />
          {LEADING_COLS.map((c) => (
            <div key={c.key} className="vds-leading-grid__col">
              {c.key} <span className="vds-leading-grid__val">{c.value}</span>
            </div>
          ))}
          {LEADING_DEMO.map((row) => (
            <div key={row.name} className="vds-leading-grid__band">
              <div className="vds-leading-grid__label">
                {row.name} <span className="vds-leading-grid__val">{row.px}px</span>
              </div>
              {LEADING_COLS.map((c) => (
                <div key={c.key} className="vds-leading-grid__cell">
                  {row.kind === 'h' ? (
                    <Heading level={row.level} as="p" leading={c.key}>{PARAGRAPH}</Heading>
                  ) : (
                    <Text variant={row.variant} leading={c.key}>{PARAGRAPH}</Text>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Weight">
        <div className="vds-weights">
          {WEIGHTS.map((w) => (
            <div key={w.name} className="vds-weights__row">
              <span className="vds-weights__specimen" style={{ fontWeight: w.value }}>Ag</span>
              <span className="vds-weights__name">{w.name}</span>
              <span className="vds-weights__val">{w.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Numerals"
        note="Normal numbers have different widths, so columns of them look wobbly. Tabular numbers make every digit the same width, so they line up neatly — great for tables and numbers that keep changing. Add tabular to switch it on."
      >
        <div className="vds-numerals">
          <div className="vds-numerals__col">
            <span className="vds-numerals__head">Proportional</span>
            {NUMERAL_ROWS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="vds-numerals__col vds-numerals__col--tabular vds-text--tabular">
            <span className="vds-numerals__head">Tabular</span>
            {NUMERAL_ROWS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Using it"
        note={
          <>
            Two things to set: how big the text looks
            (<code className="vds-inline-code">level</code> on Heading,{' '}
            <code className="vds-inline-code">variant</code> on Text) and which HTML tag it
            becomes (<code className="vds-inline-code">as</code>, like{' '}
            <code className="vds-inline-code">h1</code>).{' '}
            <code className="vds-inline-code">leading</code> and{' '}
            <code className="vds-inline-code">tabular</code> are optional extras. Not using
            React? Every size is also a plain CSS class — e.g.{' '}
            <code className="vds-inline-code">class="vds-text vds-text--body"</code> or{' '}
            <code className="vds-inline-code">class="vds-text vds-heading vds-text--title"</code>.
          </>
        }
      >
        <PropsTable
          headers={['Component', 'Prop', 'Renders']}
          rows={[
            [{ code: 'Heading' }, { code: 'display · title · heading · subheading' }, 'Display down to card titles'],
            [{ code: 'Text' }, { code: 'body-lg · body · caption · detail' }, 'Copy down to dense metadata'],
            [{ code: 'Text' }, { code: 'micro · eyebrow · nano' }, 'Labels, overlines, chart ticks'],
          ]}
        />
        <Code>{`<Heading level="title" as="h1">Customer Management</Heading>
<Text variant="body" tone="muted">Secondary copy</Text>
<Text variant="body" leading="relaxed">Long-form paragraph that wraps…</Text>
<Text variant="detail" tabular>1,204,398</Text>
<Text variant="eyebrow" tone="primary">Overview</Text>`}</Code>
      </Section>
    </DocPage>
  )
}
