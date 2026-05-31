import { useState } from 'react'
import { Heading, Text } from './components/Text.jsx'
import { Button } from './components/Button.jsx'
import { Badge } from './components/Badge.jsx'

const TYPE_SPECIMENS = [
  { kind: 'h', level: 'display', token: 'text-display', meta: '30 / 36 · 600' },
  { kind: 'h', level: 'title', token: 'text-title', meta: '24 / 32 · 600' },
  { kind: 'h', level: 'heading', token: 'text-heading', meta: '20 / 28 · 600' },
  { kind: 'h', level: 'subheading', token: 'text-subheading', meta: '16 / 24 · 500' },
  { kind: 't', variant: 'body-lg', token: 'text-body-lg', meta: '15 / 22 · 400' },
  { kind: 't', variant: 'body', token: 'text-body', meta: '14 / 20 · 400' },
  { kind: 't', variant: 'caption', token: 'text-caption', meta: '13 / 18 · 400' },
  { kind: 't', variant: 'detail', token: 'text-detail', meta: '12 / 16 · 400' },
  { kind: 't', variant: 'micro', token: 'text-micro', meta: '11 / 14 · 500' },
  { kind: 't', variant: 'eyebrow', token: 'text-eyebrow', meta: '11 · 600 · upper' },
  { kind: 't', variant: 'nano', token: 'text-nano', meta: '10 · 500' },
]

const NEUTRALS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const IRIS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const SEMANTIC = [
  ['canvas', 'bg-canvas'],
  ['surface', 'bg-surface'],
  ['surface-raised', 'bg-surface-raised'],
  ['primary', 'bg-primary'],
  ['success', 'bg-success'],
  ['warning', 'bg-warning'],
  ['danger', 'bg-danger'],
  ['info', 'bg-info'],
]

function Section({ eyebrow, title, children }) {
  return (
    <section className="border-t border-line py-10">
      <Text variant="eyebrow" tone="primary" className="mb-1">
        {eyebrow}
      </Text>
      <Heading level="heading" className="mb-6">
        {title}
      </Heading>
      {children}
    </section>
  )
}

function Swatch({ label, varName }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-12 rounded-[var(--radius-md)] border border-line"
        style={{ backgroundColor: `var(${varName})` }}
      />
      <Text variant="nano" tone="subtle" as="span" className="font-mono">
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
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[960px] px-6 pb-20">
        {/* Header */}
        <header className="flex items-center justify-between py-8">
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

        <Text variant="body-lg" tone="muted" className="max-w-[60ch]">
          A fresh, token-first foundation for Vipre — cool graphite neutrals, an
          iris brand accent, and the Rubik typescale. Everything below is driven
          by semantic tokens that flip between light and dark.
        </Text>

        {/* Typography */}
        <Section eyebrow="Scale" title="Typography — Rubik">
          <div className="flex flex-col divide-y divide-line">
            {TYPE_SPECIMENS.map((s) => (
              <div
                key={s.token}
                className="flex items-baseline justify-between gap-6 py-3"
              >
                {s.kind === 'h' ? (
                  <Heading level={s.level} as="div">
                    The quick brown fox
                  </Heading>
                ) : (
                  <Text variant={s.variant} as="div">
                    The quick brown fox jumps over the lazy dog
                  </Text>
                )}
                <div className="flex shrink-0 items-baseline gap-3 text-right">
                  <Text variant="nano" tone="subtle" as="span" className="font-mono">
                    {s.meta}
                  </Text>
                  <Text variant="micro" tone="muted" as="span" className="font-mono w-28">
                    {s.token}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Color — primitives */}
        <Section eyebrow="Primitive" title="Color ramps">
          <Text variant="caption" tone="muted" className="mb-3">
            Graphite — cool neutral
          </Text>
          <div className="mb-8 grid grid-cols-6 gap-3 sm:grid-cols-11">
            {NEUTRALS.map((n) => (
              <Swatch key={n} label={n} varName={`--color-graphite-${n}`} />
            ))}
          </div>
          <Text variant="caption" tone="muted" className="mb-3">
            Iris — brand accent
          </Text>
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
            {IRIS.map((n) => (
              <Swatch key={n} label={n} varName={`--color-iris-${n}`} />
            ))}
          </div>
        </Section>

        {/* Color — semantic */}
        <Section eyebrow="Semantic" title="Theme tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SEMANTIC.map(([label, bg]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div className={`h-12 rounded-[var(--radius-md)] border border-line ${bg}`} />
                <Text variant="nano" tone="subtle" as="span" className="font-mono">
                  {label}
                </Text>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section eyebrow="Component" title="Button">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section eyebrow="Component" title="Badge">
          <div className="flex flex-wrap items-center gap-3">
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
