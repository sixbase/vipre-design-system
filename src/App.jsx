import { useState } from 'react'
import { Heading, Text } from './components/Text.jsx'
import { Button } from './components/Button.jsx'
import { Badge } from './components/Badge.jsx'

const TYPE_SPECIMENS = [
  { kind: 'h', level: 'display', token: 'text--display', meta: '30 / 36 · 600' },
  { kind: 'h', level: 'title', token: 'text--title', meta: '24 / 32 · 600' },
  { kind: 'h', level: 'heading', token: 'text--heading', meta: '20 / 28 · 600' },
  { kind: 'h', level: 'subheading', token: 'text--subheading', meta: '16 / 24 · 500' },
  { kind: 't', variant: 'body-lg', token: 'text--body-lg', meta: '15 / 22 · 400' },
  { kind: 't', variant: 'body', token: 'text--body', meta: '14 / 20 · 400' },
  { kind: 't', variant: 'caption', token: 'text--caption', meta: '13 / 18 · 400' },
  { kind: 't', variant: 'detail', token: 'text--detail', meta: '12 / 16 · 400' },
  { kind: 't', variant: 'micro', token: 'text--micro', meta: '11 / 14 · 500' },
  { kind: 't', variant: 'eyebrow', token: 'text--eyebrow', meta: '11 · 600 · upper' },
  { kind: 't', variant: 'nano', token: 'text--nano', meta: '10 · 500' },
]

const NEUTRALS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const IRIS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const SEMANTIC = ['canvas', 'surface', 'surface-raised', 'primary', 'success', 'warning', 'danger', 'info']

function Section({ eyebrow, title, children }) {
  return (
    <section className="vds-section">
      <Text variant="eyebrow" tone="primary" className="vds-section__eyebrow">
        {eyebrow}
      </Text>
      <Heading level="heading" className="vds-section__title">
        {title}
      </Heading>
      {children}
    </section>
  )
}

function Swatch({ label, varName }) {
  return (
    <div className="vds-swatch">
      <div className="vds-swatch__chip" style={{ backgroundColor: `var(${varName})` }} />
      <Text variant="nano" tone="subtle" as="span" className="vds-swatch__label">
        {label}
      </Text>
    </div>
  )
}

export function App() {
  const [dark, setDark] = useState(true)

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="vds-shell">
      <div className="vds-shell__inner">
        {/* Header */}
        <header className="vds-topbar">
          <div>
            <Text variant="eyebrow" tone="primary">
              Vipre Design System
            </Text>
            <Heading level="title" as="h1">
              Foundation
            </Heading>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {dark ? '☀ Light' : '☾ Dark'}
          </Button>
        </header>

        <Text variant="body-lg" tone="muted" className="vds-lede">
          A fresh, token-first foundation for Vipre — cool graphite neutrals, an
          iris brand accent, and the Rubik typescale. Authored in SCSS; every
          value is a semantic token that flips between light and dark.
        </Text>

        {/* Typography */}
        <Section eyebrow="Scale" title="Typography — Rubik">
          <div className="vds-specimens">
            {TYPE_SPECIMENS.map((s) => (
              <div key={s.token} className="vds-specimen">
                {s.kind === 'h' ? (
                  <Heading level={s.level} as="div">
                    The quick brown fox
                  </Heading>
                ) : (
                  <Text variant={s.variant} as="div">
                    The quick brown fox jumps over the lazy dog
                  </Text>
                )}
                <div className="vds-specimen__meta">
                  <Text variant="nano" tone="subtle" as="span">
                    {s.meta}
                  </Text>
                  <Text variant="micro" tone="muted" as="span" className="vds-specimen__token">
                    {s.token}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Color — primitives */}
        <Section eyebrow="Primitive" title="Color ramps">
          <Text variant="caption" tone="muted" className="vds-section__label">
            Graphite — cool neutral
          </Text>
          <div className="vds-swatches vds-swatches--wide">
            {NEUTRALS.map((n) => (
              <Swatch key={n} label={n} varName={`--vds-graphite-${n}`} />
            ))}
          </div>
          <Text variant="caption" tone="muted" className="vds-section__label">
            Iris — brand accent
          </Text>
          <div className="vds-swatches vds-swatches--iris">
            {IRIS.map((n) => (
              <Swatch key={n} label={n} varName={`--vds-iris-${n}`} />
            ))}
          </div>
        </Section>

        {/* Color — semantic */}
        <Section eyebrow="Semantic" title="Theme tokens">
          <div className="vds-swatches vds-swatches--semantic">
            {SEMANTIC.map((name) => (
              <Swatch key={name} label={name} varName={`--vds-${name}`} />
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section eyebrow="Component" title="Button">
          <div className="vds-row">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="vds-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        {/* Badges */}
        <Section eyebrow="Component" title="Badge">
          <div className="vds-row">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="primary" dot>
              Active
            </Badge>
            <Badge tone="success" dot>
              Protected
            </Badge>
            <Badge tone="warning" dot>
              At risk
            </Badge>
            <Badge tone="danger" dot>
              Threat
            </Badge>
            <Badge tone="info">Info</Badge>
          </div>
        </Section>
      </div>
    </div>
  )
}
