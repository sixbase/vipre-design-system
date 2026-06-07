import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Spinner, Button } from '../../components/index.js'

export function SpinnerPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Spinner}
      title="Spinner"
      description={'An indeterminate loading indicator. Inherits the surrounding text color by default, so it sits naturally inside buttons and text; set tone="primary" for a branded spinner.'}
      installCode={`import { Spinner } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, '16 / 20 / 24px'],
            [{ code: 'tone' }, { code: "'current' | 'primary'" }, { code: "'current'" }, 'Color — inherits text, or brand'],
            [{ code: 'label' }, { code: 'string' }, { code: "'Loading'" }, 'Accessible name (role=status)'],
          ],
        },
      ]}
      accessibility={[
        <>Exposed via <IC>role="status"</IC> + <IC>aria-label</IC> so the loading state is announced.</>,
        <>Honors <IC>prefers-reduced-motion</IC> — the ring stops spinning.</>,
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

      <Section title="Tone" note="Default inherits text color; primary uses the brand.">
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

      <Section title="In a button" note="Pair with a disabled Button for a pending action.">
        <Preview
          canvas={
            <Button disabled>
              <Spinner size="sm" /> Saving…
            </Button>
          }
          code={`<Button disabled><Spinner size="sm" /> Saving…</Button>`}
        />
      </Section>
    </ComponentPage>
  )
}
