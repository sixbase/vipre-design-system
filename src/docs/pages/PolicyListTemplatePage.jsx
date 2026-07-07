import { useMemo, useState } from 'react'
import { ShieldCheck } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, IC } from '../primitives.jsx'
import {
  PageHeader, SearchInput, Select, Button, Stack, Inline, Surface,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Badge, Tag, DescriptionList, EmptyState, Text,
} from '../../components/index.js'
import { POLICIES, POLICY_STATUS, POLICY_TYPE_TONE } from '../templateData.js'

/* ---- The assembled page ------------------------------------------------------ */

function PolicyListDemo() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return POLICIES.filter((p) => {
      if (status !== 'all' && p.status !== status) return false
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, status])

  const counts = useMemo(() => {
    const c = { active: 0, disabled: 0, draft: 0 }
    for (const p of POLICIES) c[p.status] += 1
    return c
  }, [])

  return (
    <div
      style={{
        height: 620,
        overflowY: 'auto',
        border: '1px solid var(--vds-line)',
        borderRadius: 'var(--vds-radius-lg)',
        background: 'var(--vds-canvas)',
        padding: 'var(--vds-page-pad)',
        width: '100%',
      }}
    >
      <Stack gap={6}>
        <PageHeader
          icon={ShieldCheck}
          title="Policies"
          subtitle={`${POLICIES.length} policies · ${counts.active} active · ${counts.disabled} disabled · ${counts.draft} draft`}
          actions={<Button size="sm">New policy</Button>}
          filters={
            <Inline gap={2} wrap>
              <SearchInput
                size="sm"
                placeholder="Search policies…"
                aria-label="Search policies"
                value={query}
                onChange={setQuery}
              />
              <Select
                size="sm"
                aria-label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'disabled', label: 'Disabled' },
                  { value: 'draft', label: 'Draft' },
                ]}
              />
            </Inline>
          }
        />

        {filtered.length === 0 ? (
          <Surface>
            <EmptyState
              size="sm"
              icon={ShieldCheck}
              title="No policies match"
              actions={
                <Button size="sm" variant="outline" tone="neutral" onClick={() => { setQuery(''); setStatus('all') }}>
                  Clear filters
                </Button>
              }
            >
              Nothing matches your search and status filter.
            </EmptyState>
          </Surface>
        ) : (
          <Surface padding={2}>
            <Accordion type="single">
              {filtered.map((p) => (
                <AccordionItem key={p.id} value={p.id}>
                  <AccordionTrigger>
                    {/* Everything in the trigger row must be non-interactive —
                        it all lives inside the trigger button. */}
                    <Inline as="span" gap={2} wrap style={{ width: '100%', minWidth: 0 }}>
                      <Text as="span" variant="body">{p.name}</Text>
                      <Tag size="sm" tone={POLICY_TYPE_TONE[p.type] ?? 'neutral'}>{p.type}</Tag>
                      <Badge tone={p.scope === 'inherited' ? 'info' : 'neutral'}>
                        {p.scope === 'inherited' ? 'Inherited' : 'Local'}
                      </Badge>
                      <Inline as="span" gap={2} style={{ marginLeft: 'auto' }}>
                        <Text as="span" variant="detail" tone="muted" tabular>
                          {p.assigned > 0 ? `${p.assigned} assigned` : '—'}
                        </Text>
                        <Badge tone={POLICY_STATUS[p.status].tone} dot>{POLICY_STATUS[p.status].label}</Badge>
                      </Inline>
                    </Inline>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Stack gap={4}>
                      <Text variant="body" tone="muted">{p.description}</Text>
                      <DescriptionList
                        dense
                        columns={2}
                        items={[
                          { term: 'Policy ID', description: p.id },
                          { term: 'Created by', description: p.createdBy },
                          { term: 'Last updated', description: p.updated },
                          { term: 'Assigned to', description: p.assigned > 0 ? `${p.assigned} accounts` : 'Not assigned' },
                        ]}
                      />
                      <Inline gap={2} wrap>
                        <Button size="sm" variant="outline" tone="neutral">
                          Edit policy
                        </Button>
                        <Button size="sm" variant="ghost" tone="neutral">
                          Duplicate
                        </Button>
                        {p.status === 'active' ? (
                          <Button size="sm" variant="soft" tone="danger">Disable</Button>
                        ) : (
                          <Button size="sm" variant="soft" tone="success">Enable</Button>
                        )}
                      </Inline>
                    </Stack>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Surface>
        )}
      </Stack>
    </div>
  )
}

/* ---- Page ---------------------------------------------------------------------- */

export function PolicyListTemplatePage() {
  return (
    <ComponentPage
      title="Policy List"
      description="The policies page: an expandable list, not a table. Each row shows what a policy is at a glance — name, type, whether it's inherited from the parent account or set locally, how many accounts use it, and its status. Open a row and the details unfold in place: description, metadata, and the actions. One row open at a time keeps the list calm. This body slots into the MSP Shell template's content region."
      installCode={`import { PageHeader, SearchInput, Select, Accordion, Badge, Tag, DescriptionList } from 'vipre-design-system'`}
    >
      <Section
        title="Anatomy"
        note="All live. Search or pick a status to filter the list. Click a row to unfold it — opening another row closes the first (Accordion type='single'). Everything inside the closed row is non-interactive on purpose: the whole row is the trigger button, so labels are Tags and Badges, never nested buttons. The actions live in the unfolded body. Filter to nothing to see the empty state."
      >
        <Preview
          canvas={<PolicyListDemo />}
          code={`<PageHeader
  icon={ShieldCheck} title="Policies"
  subtitle="6 policies · 4 active · 1 disabled · 1 draft"
  actions={<Button size="sm">New policy</Button>}
  filters={<><SearchInput onChange={setQuery} /><Select options={statusOptions} … /></>}
/>

<Surface padding={2}>
  <Accordion type="single">
    {policies.map((p) => (
      <AccordionItem key={p.id} value={p.id}>
        <AccordionTrigger>
          {/* label-only row: no buttons inside the trigger */}
          <Inline as="span" gap={2} wrap style={{ width: '100%' }}>
            <Text as="span">{p.name}</Text>
            <Tag size="sm" tone="azure">{p.type}</Tag>
            <Badge tone="info">Inherited</Badge>
            <Inline as="span" gap={2} style={{ marginLeft: 'auto' }}>
              <Text as="span" variant="detail" tone="muted">{p.assigned} assigned</Text>
              <Badge tone="success" dot>Active</Badge>
            </Inline>
          </Inline>
        </AccordionTrigger>
        <AccordionContent>
          <Text tone="muted">{p.description}</Text>
          <DescriptionList dense columns={2} items={metadata} />
          <Inline gap={2}>
            <Button size="sm" variant="outline" tone="neutral">Edit policy</Button>
            <Button size="sm" variant="ghost" tone="neutral">Duplicate</Button>
            <Button size="sm" variant="soft" tone="danger">Disable</Button>
          </Inline>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</Surface>`}
        />
      </Section>

      <Section title="Regions">
        <div className="vds-text vds-text--body" style={{ display: 'grid', gap: '0.75rem', maxWidth: 720 }}>
          {[
            ['Page header', 'Names the page, shows the counts, holds the New policy button. The filters slot carries search + a status select.', <span key="a"><IC>PageHeader</IC> with <IC>actions</IC> + <IC>filters</IC></span>],
            ['Policy list', 'One Accordion on a Surface. type="single" keeps at most one policy open.', <span key="b"><IC>Surface</IC> + <IC>Accordion</IC> (<IC>vds-accordion</IC>)</span>],
            ['Row summary', 'The trigger content: name, a Tag for the policy type, a Badge for Inherited/Local, the assigned count, a status Badge with a dot. All non-interactive — the row itself is the button.', <span key="c"><IC>AccordionTrigger</IC> + <IC>Tag</IC> + <IC>Badge</IC></span>],
            ['Row detail', 'The unfolded body: plain-language description, labelled metadata, then the action buttons.', <span key="d"><IC>AccordionContent</IC> + <IC>DescriptionList</IC> + <IC>Button</IC>s</span>],
            ['Empty state', 'When filters match nothing: a short explanation and a Clear filters button.', <IC key="e">EmptyState</IC>],
          ].map(([region, resp, comp]) => (
            <div key={region} style={{ display: 'grid', gridTemplateColumns: '8rem 1fr', gap: '0.75rem', alignItems: 'start' }}>
              <strong style={{ color: 'var(--vds-ink)' }}>{region}</strong>
              <span style={{ color: 'var(--vds-ink-muted)' }}>{resp} — {comp}</span>
            </div>
          ))}
        </div>
      </Section>
    </ComponentPage>
  )
}
