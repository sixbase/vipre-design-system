import { useState } from 'react'
import { Mail, Download } from 'lucide-react'
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
      description="The header band that opens a page inside an app shell. Everything below the title is an optional slot — eyebrow, icon medallion, status meta, subtitle, right-aligned actions, an in-page tab strip, and a filter row — so the same component spans a bare title through a rich multi-row header. Composes Icon."
      installCode={`import { PageHeader } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'title' }, { code: 'string | node' }, '—', 'The heading'],
            [{ code: 'as' }, { code: 'tag' }, { code: "'h1'" }, 'Element for the title'],
            [{ code: 'eyebrow' }, { code: 'node' }, '—', 'Small context line above the title'],
            [{ code: 'icon' }, { code: 'icon component' }, '—', 'Leading icon, shown in a soft medallion'],
            [{ code: 'iconTone' }, { code: "'primary'|'success'|'warning'|'danger'|'info'" }, { code: "'primary'" }, 'Medallion color'],
            [{ code: 'subtitle' }, { code: 'node' }, '—', 'Description line under the title'],
            [{ code: 'meta' }, { code: 'node' }, '—', 'Beside the title — status badges, counts'],
            [{ code: 'actions' }, { code: 'node' }, '—', 'Right-aligned controls (buttons, TimeframeSelect…)'],
            [{ code: 'tabs' }, { code: 'node' }, '—', 'In-page tab strip below the title block'],
            [{ code: 'filters' }, { code: 'node' }, '—', 'Filter row below the tabs'],
          ],
        },
      ]}
      accessibility={[
        <>The title renders as an <IC>{'<h1>'}</IC> by default (override with <IC>as</IC>) so each page exposes one top-level heading.</>,
        <>The icon medallion is decorative (<IC>aria-hidden</IC>); meaning is carried by the title and meta, never by color alone.</>,
        <>Slots are plain nodes — actions, tabs, and filters bring their own roles and focus behavior from the controls you pass in.</>,
      ]}
    >
      <Section
        title="Minimal"
        note="The Overview case — just a title and a timeframe control. Most dashboard pages need nothing more."
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
        note="The complex form — icon medallion, eyebrow, title with a status badge, subtitle, actions, an in-page tab strip, and a filter row. Pages slot in only the parts they need."
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
