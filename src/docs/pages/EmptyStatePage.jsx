import { Monitor, Search, ShieldCheck } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { EmptyState } from '../../components/EmptyState/index.js'
import { Button } from '../../components/index.js'

export function EmptyStatePage() {
  return (
    <ComponentPage
      title="EmptyState"
      description="A friendly 'nothing here' panel. A big soft icon, a short title, a line that explains why it's empty, and the button that fixes it. Use it in tables, cards, and pages when a list starts empty or a search finds nothing."
      installCode={`import { EmptyState } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'icon' }, { code: 'component | node' }, '—', 'Big muted icon in a soft ring'],
            [{ code: 'title' }, { code: 'node' }, '—', 'Short headline ("No devices yet")'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The explanation under the title'],
            [{ code: 'actions' }, { code: 'node' }, '—', 'The button(s) that fix the emptiness'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'Padding, ring, and text size'],
            [{ code: 'inset' }, { code: 'boolean' }, { code: 'false' }, 'Dashed well — for use inside an existing card'],
            [{ code: '…props' }, { code: 'HTMLAttributes<div>' }, '—', 'Passed to the root <div>'],
          ],
        },
      ]}
      accessibility={[
        <>The title is a real <IC>&lt;h3&gt;</IC>, so it shows up in the heading outline.</>,
        <>The icon is decoration (<IC>aria-hidden</IC>).</>,
        <>Put the primary fix in <IC>actions</IC>, so keyboard users find it right where the message is.</>,
      ]}
    >
      <Section title="Basic" note="Icon, title, explanation, and the fix.">
        <Preview
          canvas={
            <EmptyState
              icon={Monitor}
              title="No devices yet"
              actions={<Button>Add a device</Button>}
            >
              Devices appear here after their agent first checks in.
            </EmptyState>
          }
          code={`<EmptyState icon={Monitor} title="No devices yet"
            actions={<Button>Add a device</Button>}>
  Devices appear here after their agent first checks in.
</EmptyState>`}
        />
      </Section>

      <Section title="Sizes" note="Small for tight spots (a card, a side panel), large for a whole empty page.">
        <Preview
          canvas={
            <div style={{ width: '100%' }}>
              <EmptyState size="sm" icon={Search} title="No results" >
                Try fewer filters.
              </EmptyState>
              <EmptyState size="lg" icon={ShieldCheck} title="All clear"
                actions={<Button variant="outline" tone="neutral">View report</Button>}>
                No threats detected across your fleet this week.
              </EmptyState>
            </div>
          }
          code={`<EmptyState size="sm" icon={Search} title="No results">Try fewer filters.</EmptyState>
<EmptyState size="lg" icon={ShieldCheck} title="All clear">…</EmptyState>`}
        />
      </Section>

      <Section title="Inset" note="Inside an existing card or table? inset draws a dashed well so it reads as 'this area is empty', not 'the page is broken'.">
        <Preview
          canvas={
            <div style={{ width: '100%' }}>
              <EmptyState inset size="sm" icon={Search} title="No matching policies">
                Nothing matches this filter. Clear it to see all policies.
              </EmptyState>
            </div>
          }
          code={`<EmptyState inset size="sm" icon={Search} title="No matching policies">
  Nothing matches this filter. Clear it to see all policies.
</EmptyState>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Pure CSS — no JS."
      >
        <Code>{`<div class="vds-empty vds-empty--md">
  <span class="vds-empty__ring" aria-hidden="true"><svg class="vds-icon">…</svg></span>
  <h3 class="vds-empty__title">No devices yet</h3>
  <div class="vds-empty__desc">Devices appear here after their agent first checks in.</div>
  <div class="vds-empty__actions"><!-- buttons --></div>
</div>

<!-- inside a card: add vds-empty--inset (dashed canvas well) -->
<div class="vds-empty vds-empty--sm vds-empty--inset">…</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
