import { Globe } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Tag } from '../../components/Tag/index.js'

export function TagPage() {
  return (
    <ComponentPage
      title="Tag"
      description="A chip you can work with — click it, remove it, or both. It's Badge's bigger sibling. Badge says how healthy something is; Tag groups and filters things. Its colors are just colors: they don't mean good or bad."
      installCode={`import { Tag } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'tone' }, { code: "'neutral' | 'rose' | 'clay' | 'amber' | 'lime' | 'emerald' | 'harbor' | 'azure' | 'cobalt' | 'purple' | 'orchid' | 'magenta'" }, { code: "'neutral'" }, 'Chip color — grouping only, no meaning'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Chip height: 22 / 28px'],
            [{ code: 'icon' }, { code: 'component' }, '—', 'Small icon in front of the label'],
            [{ code: 'onClick' }, { code: '() => void' }, '—', 'Makes the whole chip a button'],
            [{ code: 'onDismiss' }, { code: '() => void' }, '—', 'Adds an × button. You remove the tag'],
            [{ code: 'dismissLabel' }, { code: 'string' }, { code: '"Remove {text}"' }, 'Custom name for the ×, when the label isn’t plain text'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Faded out and not clickable'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Passed to the root element'],
          ],
        },
      ]}
      accessibility={[
        <>The × is labelled <IC>"Remove {'{text}'}"</IC>, so screen readers know what goes away. Pass <IC>dismissLabel</IC> when the label isn't plain text.</>,
        <>On touch screens the × keeps a 44px hit area (<IC>--vds-tap-target</IC>), even though the glyph stays tiny.</>,
        <>Clickable + dismissible renders two sibling buttons — never a button inside a button — so both work with the keyboard.</>,
        <>Disabled is the standard recipe: <IC>opacity: 0.5</IC> + <IC>pointer-events: none</IC>.</>,
      ]}
    >
      <Section title="Tones" note="Neutral plus eleven color families. Use them to group, not to judge.">
        <Preview
          canvas={
            <>
              <Tag>Neutral</Tag>
              <Tag tone="rose">Rose</Tag>
              <Tag tone="clay">Clay</Tag>
              <Tag tone="amber">Amber</Tag>
              <Tag tone="lime">Lime</Tag>
              <Tag tone="emerald">Emerald</Tag>
              <Tag tone="harbor">Harbor</Tag>
              <Tag tone="azure">Azure</Tag>
              <Tag tone="cobalt">Cobalt</Tag>
              <Tag tone="purple">Purple</Tag>
              <Tag tone="orchid">Orchid</Tag>
              <Tag tone="magenta">Magenta</Tag>
            </>
          }
          code={`<Tag>Neutral</Tag>
<Tag tone="azure">Endpoint</Tag>
<Tag tone="emerald">EDR</Tag>`}
        />
      </Section>

      <Section title="Sizes and icons" note="Two sizes. Any tag can carry a small leading icon.">
        <Preview
          canvas={
            <>
              <Tag size="sm" tone="azure">Small</Tag>
              <Tag size="md" tone="azure">Medium</Tag>
              <Tag icon={Globe} tone="harbor">EU region</Tag>
            </>
          }
          code={`<Tag size="sm" tone="azure">Small</Tag>
<Tag icon={Globe} tone="harbor">EU region</Tag>`}
        />
      </Section>

      <Section title="Dismissible" note="onDismiss adds an ×. Good for filter chips and picked items.">
        <Preview
          canvas={
            <>
              <Tag tone="emerald" onDismiss={() => {}}>EDR</Tag>
              <Tag tone="azure" onDismiss={() => {}}>Endpoint</Tag>
              <Tag onDismiss={() => {}}>Windows</Tag>
            </>
          }
          code={`<Tag tone="emerald" onDismiss={() => remove('EDR')}>EDR</Tag>`}
        />
      </Section>

      <Section title="Clickable" note="onClick turns the chip into a button. With onDismiss too, the label and the × become two separate buttons.">
        <Preview
          canvas={
            <>
              <Tag tone="azure" onClick={() => {}}>Filter: Endpoint</Tag>
              <Tag tone="orchid" onClick={() => {}} onDismiss={() => {}}>Site: Seattle</Tag>
              <Tag tone="azure" disabled onDismiss={() => {}}>Disabled</Tag>
            </>
          }
          code={`<Tag tone="azure" onClick={() => filterBy('endpoint')}>Filter: Endpoint</Tag>
<Tag tone="orchid" onClick={open} onDismiss={clear}>Site: Seattle</Tag>
<Tag disabled onDismiss={clear}>Disabled</Tag>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Static tags need no JS; × and click need your handlers."
      >
        <Code>{`<!-- plain tag -->
<span class="vds-tag vds-tag--azure vds-tag--md">
  <span class="vds-tag__label">Endpoint</span>
</span>

<!-- dismissible -->
<span class="vds-tag vds-tag--emerald vds-tag--md">
  <span class="vds-tag__label">EDR</span>
  <button type="button" class="vds-tag__dismiss" aria-label="Remove EDR">
    <svg class="vds-icon">…</svg>
  </button>
</span>

<!-- clickable (the whole chip is a button) -->
<button type="button" class="vds-tag vds-tag--azure vds-tag--md vds-tag--interactive">
  <span class="vds-tag__label">Filter: Endpoint</span>
</button>

<!-- clickable AND dismissible: passive shell, two sibling buttons -->
<span class="vds-tag vds-tag--orchid vds-tag--md vds-tag--split">
  <button type="button" class="vds-tag__action"><span class="vds-tag__label">Site: Seattle</span></button>
  <button type="button" class="vds-tag__dismiss" aria-label="Remove Site: Seattle">…</button>
</span>`}</Code>
      </Section>
    </ComponentPage>
  )
}
