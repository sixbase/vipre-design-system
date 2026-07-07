import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Skeleton } from '../../components/Skeleton/index.js'

export function SkeletonPage() {
  return (
    <ComponentPage
      title="Skeleton"
      description="A gray shimmering shape that holds the spot while real content loads. Match the shape to what's coming: text lines, a block, or a circle for an avatar. It uses the same shimmer as the Table and StatTile loaders, so everything pulses together."
      installCode={`import { Skeleton } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'text' | 'rect' | 'circle'" }, { code: "'text'" }, 'The shape'],
            [{ code: 'width' }, { code: 'number | string' }, 'per shape', 'Width. Numbers become px'],
            [{ code: 'height' }, { code: 'number | string' }, 'per shape', 'Height. Numbers become px'],
            [{ code: 'lines' }, { code: 'number' }, { code: '1' }, 'Text only — how many bars. The last one is shorter'],
            [{ code: '…props' }, { code: 'HTMLAttributes<span>' }, '—', 'Passed to the root <span>'],
          ],
        },
      ]}
      accessibility={[
        <>Skeletons are <IC>aria-hidden</IC> — they carry no information.</>,
        <>Announce loading on the region instead: put <IC>aria-busy</IC> on the container, or add a visually hidden "Loading…".</>,
        <>With <IC>prefers-reduced-motion</IC>, the shimmer stops and the bars hold a still gray.</>,
      ]}
    >
      <Section title="Text lines" note="A paragraph stand-in. The last line runs short, so it reads like text, not a gray slab.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: 420 }}>
              <Skeleton variant="text" lines={3} />
            </div>
          }
          code={`<Skeleton variant="text" lines={3} />`}
        />
      </Section>

      <Section title="Shapes" note="Circle for avatars, rect for cards, charts, and images.">
        <Preview
          canvas={
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', width: '100%', maxWidth: 420 }}>
              <Skeleton variant="circle" width={40} height={40} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rect" height={80} />
              </div>
            </div>
          }
          code={`<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="text" width="60%" />
<Skeleton variant="rect" height={80} />`}
        />
      </Section>

      <Section title="A loading card" note="Compose skeletons into the shape of the real thing, so nothing jumps when the data lands.">
        <Preview
          canvas={
            <div aria-busy="true" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 360 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton variant="text" width="40%" />
              </div>
              <Skeleton variant="rect" height={96} />
              <Skeleton variant="text" lines={2} />
            </div>
          }
          code={`<div aria-busy="true">
  <Skeleton variant="circle" width={32} height={32} />
  <Skeleton variant="text" width="40%" />
  <Skeleton variant="rect" height={96} />
  <Skeleton variant="text" lines={2} />
</div>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. Pure CSS — no JS at all."
      >
        <Code>{`<!-- one text bar -->
<span class="vds-skeleton vds-skeleton--text" aria-hidden="true"></span>

<!-- block / circle -->
<span class="vds-skeleton vds-skeleton--rect" aria-hidden="true" style="height: 80px"></span>
<span class="vds-skeleton vds-skeleton--circle" aria-hidden="true"></span>

<!-- multi-line text: a stack of bars; the last one is shorter automatically -->
<span class="vds-skeleton vds-skeleton--lines" aria-hidden="true">
  <span class="vds-skeleton__line"></span>
  <span class="vds-skeleton__line"></span>
  <span class="vds-skeleton__line"></span>
</span>`}</Code>
      </Section>
    </ComponentPage>
  )
}
