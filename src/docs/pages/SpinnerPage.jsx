import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Spinner, Button } from '../../components/index.js'

export function SpinnerPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Spinner}
      title="Spinner"
      description={'A spinning loader for when you don\'t know how long a wait will take. By default it takes the color of the text around it, so it fits right into buttons and text; set tone="primary" for a brand-colored one.'}
      installCode={`import { Spinner } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, '16 / 20 / 24px'],
            [{ code: 'tone' }, { code: "'current' | 'primary'" }, { code: "'current'" }, 'Color — matches the text, or uses the brand'],
            [{ code: 'label' }, { code: 'string' }, { code: "'Loading'" }, 'A name for screen readers (role=status)'],
          ],
        },
      ]}
      accessibility={[
        <>It uses <IC>role="status"</IC> and <IC>aria-label</IC> so screen readers say it's loading.</>,
        <>It respects <IC>prefers-reduced-motion</IC> — the ring stops spinning for people who turn motion off.</>
      ]}
    >
      <Section title="Sizes">
        <Preview
          canvas={
            <>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </>
          }
          code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
        />
      </Section>

      <Section title="Tone" note="The default matches the text color; primary uses the brand color.">
        <Preview
          canvas={
            <>
              <Spinner tone="primary" />
              <span style={{ color: 'var(--vds-ink-muted)', display: 'inline-flex' }}>
                <Spinner />
              </span>
            </>
          }
          code={`<Spinner tone="primary" />
<Spinner />            {/* inherits currentColor */}`}
        />
      </Section>

      <Section title="In a button" note="Put it in a disabled Button to show an action is still working.">
        <Preview
          canvas={
            <Button disabled>
              <Spinner size="sm" /> Saving…
            </Button>
          }
          code={`<Button disabled><Spinner size="sm" /> Saving…</Button>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. One empty span — the ring and the spin are pure CSS. No JS needed."
      >
        <Code>{`<!-- sizes: vds-spinner--sm | --md | --lg -->
<span class="vds-spinner vds-spinner--md" role="status" aria-label="Loading"></span>

<!-- brand-colored -->
<span class="vds-spinner vds-spinner--md vds-spinner--primary" role="status" aria-label="Loading"></span>`}</Code>
      </Section>
    </ComponentPage>
  )
}
