import { useMemo, useState } from 'react'
import * as Icons from '@icons'
import { Shield, Monitor, Building2, Search, ChevronRight, Bell, TriangleAlert, CircleCheck } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Icon, SearchInput, Text } from '../../components/index.js'

const SIZES = ['xs', 'sm', 'md', 'lg']
const TONES = ['current', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger', 'info']

// Every icon currently wired up in @icons (src/icons.jsx), sorted A→Z.
const ICON_NAMES = Object.keys(Icons).sort((a, b) => a.localeCompare(b))

/* A searchable wall of every icon we've pulled from Material Symbols. Click a
   tile to copy its <Icon> usage. Nothing here is special — it just reads the
   @icons barrel, so it stays in sync as icons are added. */
function IconLibrary() {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState('')
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? ICON_NAMES.filter((n) => n.toLowerCase().includes(q)) : ICON_NAMES
  }, [query])

  const copy = (name) => {
    navigator.clipboard?.writeText(`<Icon as={${name}} />`)
    setCopied(name)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 16rem', minWidth: '12rem' }}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search icons…"
            aria-label="Search icons"
          />
        </div>
        <Text variant="detail" tone="muted">
          {matches.length} of {ICON_NAMES.length}{copied ? ` · copied ${copied}` : ''}
        </Text>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(6.5rem, 1fr))',
          gap: '0.5rem',
        }}
      >
        {matches.map((name) => {
          const Glyph = Icons[name]
          return (
            <button
              key={name}
              type="button"
              onClick={() => copy(name)}
              title={`Copy <Icon as={${name}} />`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 0.5rem',
                border: '1px solid var(--vds-line)',
                borderRadius: 'var(--vds-radius-md)',
                background: copied === name ? 'var(--vds-primary-soft)' : 'var(--vds-surface)',
                color: 'var(--vds-ink)',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <Icon as={Glyph} size="md" tone="subtle" />
              <span
                className="vds-text vds-text--micro vds-text--tone-muted"
                style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function IconPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Icon}
      title="Icon"
      description="A wrapper that gives any SVG the same size and color rules. It ships no icons of its own — pass an icon component through the `as` prop (the docs use the Material Symbols set via @icons), or plain SVG as children. The icon takes the color of the text around it unless you set a tone."
      installCode={`import { Icon } from 'vipre-design-system'\nimport { Shield } from '@icons'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'as' }, { code: 'ComponentType' }, '—', 'The icon component to show (e.g. from @icons)'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg'" }, { code: "'md'" }, '14 / 16 / 20 / 24px'],
            [{ code: 'tone' }, { code: "'current' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'current'" }, 'Color; by default matches the text color'],
            [{ code: 'label' }, { code: 'string' }, '—', 'A name screen readers can read; leave it off for decoration-only icons'],
          ],
        },
      ]}
      accessibility={[
        <>With a <IC>label</IC>, the icon shows up as <IC>role="img"</IC> with that name for screen readers.</>,
        <>Without a <IC>label</IC> it is <IC>aria-hidden</IC> — the right choice for icons sitting next to text.</>,
        <>Tone colors stay easy to read (AA contrast) on canvas and surface in both light and dark.</>,
      ]}
    >
      <Section
        title="Using Material Symbols"
        note="We don't draw our own icons. We borrow Google's Material Symbols set (~3,000 icons) — but only the ones we actually use get shipped, so the app stays light."
      >
        <Code>{`// 1. Find an icon at fonts.google.com/icons — note its name (e.g. "star").

// 2. Add one line to src/icons.jsx. Always pick the -outline-rounded style
//    so every icon matches (soft, hollow). If there's no outline, fall back
//    to -rounded.
import _Star from '~icons/material-symbols/star-outline-rounded'
export const Star = a(_Star)

// 3. Use it anywhere.
import { Star } from '@icons'
<Icon as={Star} size="sm" tone="warning" />`}</Code>
      </Section>

      <Section
        title="Library"
        note="Every icon currently wired up. Type to filter; click a tile to copy its usage. This grid reads straight from @icons, so new icons show up here automatically."
      >
        <IconLibrary />
      </Section>

      <Section title="Sizes">
        <Preview
          canvas={SIZES.map((s) => <Icon key={s} as={Shield} size={s} />)}
          code={`<Icon as={Shield} size="xs" />\n<Icon as={Shield} size="sm" />\n<Icon as={Shield} size="md" />\n<Icon as={Shield} size="lg" />`}
        />
      </Section>

      <Section title="Tones">
        <Preview
          canvas={TONES.map((t) => <Icon key={t} as={CircleCheck} tone={t} label={t} />)}
          code={`<Icon as={CircleCheck} tone="primary" />\n<Icon as={CircleCheck} tone="success" />\n<Icon as={CircleCheck} tone="danger" />`}
        />
      </Section>

      <Section title="In context" note="By default icons take the color of the text next to them — always pair them with a label.">
        <Preview
          canvas={
            <>
              <Icon as={Building2} tone="muted" />
              <Icon as={Monitor} tone="muted" />
              <Icon as={Bell} tone="primary" />
              <Icon as={TriangleAlert} tone="warning" />
              <Icon as={Search} tone="subtle" />
              <Icon as={ChevronRight} tone="subtle" />
            </>
          }
          code={`<Icon as={Bell} tone="primary" />\n<Icon as={TriangleAlert} tone="warning" />`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Icon puts its classes straight on your SVG and sets the size in width/height (14 / 16 / 20 / 24). No JS needed."
      >
        <Code>{`<!-- decorative (default): hidden from screen readers -->
<svg class="vds-icon" width="20" height="20" aria-hidden="true">…</svg>

<!-- toned: add vds-icon--{muted|subtle|primary|success|warning|danger|info} -->
<svg class="vds-icon vds-icon--success" width="20" height="20" aria-hidden="true">…</svg>

<!-- meaningful: give it a role and a name instead of aria-hidden -->
<svg class="vds-icon vds-icon--danger" width="20" height="20" role="img" aria-label="Threat">…</svg>`}</Code>
      </Section>
    </ComponentPage>
  )
}
