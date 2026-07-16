import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { DescriptionList } from '../../components/DescriptionList/index.js'
import { Badge } from '../../components/index.js'

const deviceItems = [
  { term: 'Hostname', description: 'WKS-0142' },
  { term: 'OS', description: 'Windows 11 Pro' },
  { term: 'IP address', description: '10.0.4.17' },
  { term: 'Last seen', description: '2 minutes ago' },
  { term: 'Agent version', description: '12.4.1' },
  { term: 'Policy', description: 'Ransomware shield' },
]

export function DescriptionListPage() {
  return (
    <ComponentPage
      title="DescriptionList"
      description="Labels and their values, in a real <dl>. It's the workhorse for detail panels and record summaries: hostname, OS, last seen, policy. Labels are muted, values are dark, and a value can be anything — a Badge, an Avatar, a link. Columns watch their CONTAINER: put a 3-column list in a narrow drawer and it folds back to one column by itself."
      installCode={`import { DescriptionList } from 'vipre-design-system'`}
      props={[
        {
          name: 'DescriptionList',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'items' }, { code: '[{ term, description, span? }]' }, '—', 'The pairs. Or compose <DescriptionList.Item> children'],
            [{ code: 'columns' }, { code: '1 | 2 | 3' }, { code: '1' }, 'Grid columns when there’s room. Narrow containers fold toward 1'],
            [{ code: 'orientation' }, { code: "'vertical' | 'horizontal'" }, { code: "'vertical'" }, 'Term above the value, or term left / value right'],
            [{ code: 'divided' }, { code: 'boolean' }, { code: 'false' }, 'Hairline rule under each row'],
            [{ code: 'dense' }, { code: 'boolean' }, { code: 'false' }, 'Tighter rhythm for packed side panels'],
            [{ code: '…props' }, { code: 'HTMLAttributes<div>' }, '—', 'Passed to the root'],
          ],
        },
        {
          name: 'DescriptionList.Item',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'term' }, { code: 'node' }, '—', 'The label (<dt>)'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The value (<dd>) — any node'],
            [{ code: 'span' }, { code: '2 | 3' }, '—', 'Stretch this pair across columns'],
            [{ code: '…props' }, { code: 'HTMLAttributes<div>' }, '—', 'Passed to the pair’s wrapper <div>'],
          ],
        },
      ]}
      accessibility={[
        <>It's a real <IC>&lt;dl&gt;</IC> with <IC>&lt;dt&gt;</IC>/<IC>&lt;dd&gt;</IC> pairs, so screen readers announce each value with its label.</>,
        <>Each pair sits in a <IC>&lt;div&gt;</IC> — valid HTML, and it gives the grid its cell.</>,
        <>Columns are visual only. The reading order is always term → value, top to bottom.</>,
      ]}
    >
      <Section title="Basic" note="One column: label on top, value below.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 320 }}>
              <DescriptionList items={deviceItems.slice(0, 4)} />
            </div>
          }
          code={`<DescriptionList
  items={[
    { term: 'Hostname', description: 'WKS-0142' },
    { term: 'OS', description: 'Windows 11 Pro' },
    { term: 'IP address', description: '10.0.4.17' },
    { term: 'Last seen', description: '2 minutes ago' },
  ]}
/>`}
        />
      </Section>

      <Section title="Columns" note="2 or 3 columns when there's room. Shrink the container and it folds toward 1 on its own — it watches the container, not the window. span stretches one pair across.">
        <Preview
          canvas={
            <div style={{ width: '100%' }}>
              <DescriptionList
                columns={3}
                items={[
                  ...deviceItems,
                  { term: 'Notes', description: 'Reimaged after the March incident; watch for driver rollbacks.', span: 3 },
                ]}
              />
            </div>
          }
          code={`<DescriptionList
  columns={3}
  items={[
    { term: 'Hostname', description: 'WKS-0142' },
    { term: 'OS', description: 'Windows 11 Pro' },
    { term: 'IP address', description: '10.0.4.17' },
    { term: 'Last seen', description: '2 minutes ago' },
    { term: 'Agent version', description: '12.4.1' },
    { term: 'Policy', description: 'Ransomware shield' },
    { term: 'Notes', description: 'Reimaged after the March incident…', span: 3 },
  ]}
/>`}
        />
      </Section>

      <Section title="Horizontal" note="Term left, value right — the classic settings-panel look. Add divided for ruled rows.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 480 }}>
              <DescriptionList orientation="horizontal" divided items={deviceItems.slice(0, 4)} />
            </div>
          }
          code={`<DescriptionList orientation="horizontal" divided items={items} />`}
        />
      </Section>

      <Section title="Composed items" note="Need a Badge or a link as the value? Use DescriptionList.Item children instead of the items array. dense tightens everything for side panels.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 320 }}>
              <DescriptionList dense divided>
                <DescriptionList.Item term="Status">
                  <Badge tone="success" dot>Protected</Badge>
                </DescriptionList.Item>
                <DescriptionList.Item term="Risk">
                  <Badge tone="warning" dot>At risk</Badge>
                </DescriptionList.Item>
                <DescriptionList.Item term="Owner">Dana Osei</DescriptionList.Item>
              </DescriptionList>
            </div>
          }
          code={`<DescriptionList dense divided>
  <DescriptionList.Item term="Status">
    <Badge tone="success" dot>Protected</Badge>
  </DescriptionList.Item>
  <DescriptionList.Item term="Owner">Dana Osei</DescriptionList.Item>
</DescriptionList>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Pure CSS — the folding into fewer columns is all CSS, no JS."
      >
        <Code>{`<div class="vds-dl vds-dl--cols-2 vds-dl--vertical vds-dl--divided">
  <dl class="vds-dl__list">
    <div class="vds-dl__item">
      <dt class="vds-dl__term">Hostname</dt>
      <dd class="vds-dl__desc">WKS-0142</dd>
    </div>
    <div class="vds-dl__item">
      <dt class="vds-dl__term">OS</dt>
      <dd class="vds-dl__desc">Windows 11 Pro</dd>
    </div>
    <div class="vds-dl__item vds-dl__item--span-2">
      <dt class="vds-dl__term">Notes</dt>
      <dd class="vds-dl__desc">Reimaged after the March incident…</dd>
    </div>
  </dl>
</div>

<!-- horizontal: swap vds-dl--vertical for vds-dl--horizontal -->
<!-- packed panels: add vds-dl--dense -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
