import { useState } from 'react'
import { Mail, Download } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { PageHeader, TimeframeSelect, Button, Badge } from '../../components/index.js'

/* A tiny presentational tab strip for the `tabs` slot demo. */
function DemoTabs() {
  const tabs = ['Summary', 'Detections', 'Targets']
  const [active, setActive] = useState('Summary')
  return (
    <>
      {tabs.map((t) => {
        const isActive = t === active
        return (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className="vds-text vds-text--caption"
            style={{
              appearance: 'none',
              background: 'none',
              border: 0,
              cursor: 'pointer',
              padding: '0.5rem 0.25rem',
              marginBottom: '-1px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--vds-primary)' : 'var(--vds-ink-muted)',
              borderBottom: `2px solid ${isActive ? 'var(--vds-primary)' : 'transparent'}`,
            }}
          >
            {t}
          </button>
        )
      })}
    </>
  )
}

export function PageHeaderPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.PageHeader}
      title="Page Header"
      description="The band at the top of a page. Only the title is required — everything else is an optional slot: a small line above (eyebrow), an icon in a soft circle, status badges, a subtitle, buttons on the right, a row of tabs, and a filter row. So the same component works for a plain title or a full, busy header. Uses Icon."
      installCode={`import { PageHeader } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'title' }, { code: 'string | node' }, '—', 'The heading'],
            [{ code: 'as' }, { code: 'tag' }, { code: "'h1'" }, 'The HTML tag for the title'],
            [{ code: 'eyebrow' }, { code: 'node' }, '—', 'A small line above the title'],
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'Icon shown first, inside a soft circle'],
            [{ code: 'iconTone' }, { code: "'primary'|'success'|'warning'|'danger'|'info'" }, { code: "'primary'" }, 'Color of the circle'],
            [{ code: 'subtitle' }, { code: 'node' }, '—', 'A line of description under the title'],
            [{ code: 'meta' }, { code: 'node' }, '—', 'Next to the title — status badges or counts'],
            [{ code: 'actions' }, { code: 'node' }, '—', 'Controls on the right (buttons, TimeframeSelect…)'],
            [{ code: 'tabs' }, { code: 'node' }, '—', 'A row of tabs below the title'],
            [{ code: 'filters' }, { code: 'node' }, '—', 'A filter row below the tabs'],
          ],
        },
      ]}
      accessibility={[
        <>The title is an <IC>{'<h1>'}</IC> by default (change it with <IC>as</IC>) so each page has one main heading.</>,
        <>The icon circle is just for looks (<IC>aria-hidden</IC>); the title and meta carry the meaning, never color alone.</>,
        <>Slots are plain content — actions, tabs, and filters bring their own roles and keyboard behavior from the controls you put in them.</>,
      ]}
    >
      <Section
        title="Minimal"
        note="The Overview case — just a title and a timeframe picker. Most dashboard pages need nothing more."
      >
        <Preview
          canvas={
            <div style={{ width: '100%' }}>
              <PageHeader title="Overview" actions={<TimeframeSelect size="sm" />} />
            </div>
          }
          code={`<PageHeader title="Overview" actions={<TimeframeSelect />} />`}
        />
      </Section>

      <Section
        title="Every slot"
        note="The full version — icon circle, eyebrow, title with a status badge, subtitle, actions, a row of tabs, and a filter row. Pages use only the parts they need."
      >
        <Preview
          canvas={
            <div style={{ width: '100%' }}>
              <PageHeader
                icon={Mail}
                eyebrow="Integrated Email Security"
                title="Overview"
                meta={<Badge tone="success">Live</Badge>}
                subtitle="Threat activity across this account for the selected window."
                actions={
                  <>
                    <Button variant="secondary" size="sm">
                      <Download size={15} style={{ marginRight: 6 }} />
                      Export
                    </Button>
                    <TimeframeSelect size="sm" />
                  </>
                }
                tabs={<DemoTabs />}
                filters={
                  <>
                    <Button variant="secondary" size="sm">All products</Button>
                    <Button variant="secondary" size="sm">All severities</Button>
                  </>
                }
              />
            </div>
          }
          code={`<PageHeader
  icon={Mail}
  eyebrow="Integrated Email Security"
  title="Overview"
  meta={<Badge tone="success">Live</Badge>}
  subtitle="Threat activity across this account for the selected window."
  actions={<><Button variant="secondary">Export</Button><TimeframeSelect /></>}
  tabs={<Tabs … />}
  filters={<Filters … />}
/>`}
        />
      </Section>
    </ComponentPage>
  )
}
