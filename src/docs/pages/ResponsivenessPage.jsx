import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable, IC } from '../primitives.jsx'
import { BREAKPOINTS, CONTROLS } from '../tokens.js'

export function ResponsivenessPage() {
  return (
    <DocPage
      title="Responsiveness"
      description="How the system handles screens of every size. Five named widths, a set of SCSS helpers, big text that shrinks on small screens, and page padding that grows on big ones."
    >
      <Section
        title="Philosophy"
        note="Two simple rules keep everything predictable."
      >
        <PropsTable
          headers={['Rule', 'What it means']}
          rows={[
            [
              'Components adapt to their container',
              'A card or table looks right in a narrow column or a wide one. It never asks how big the screen is — only how much room it has.',
            ],
            [
              'Pages adapt to the viewport',
              'The page decides the big moves: when the sidenav collapses, when columns stack, how much padding hugs the edges. Pages use the breakpoints below.',
            ],
          ]}
        />
      </Section>

      <Section
        title="Breakpoints"
        note={
          <>
            A breakpoint is a screen width where the layout is allowed to change. There are five,
            and they are the only ones. The <IC>--vds-bp-*</IC> tokens are for JavaScript
            (like <IC>matchMedia</IC>) — CSS media queries can't read custom properties, so in
            styles you use the SCSS mixins below instead.
          </>
        }
      >
        <PropsTable
          headers={['Name', 'Token', 'Width', 'Think of it as']}
          rows={BREAKPOINTS.map((b) => [
            { code: b.name },
            { code: b.token },
            b.value,
            b.usage,
          ])}
        />
      </Section>

      <Section
        title="The SCSS mixins"
        note={
          <>
            Import the breakpoints partial and wrap styles in a mixin. Write styles for the
            smallest screen first, then add <IC>up()</IC> blocks as the screen grows —
            that's called mobile-first, and it means small screens never carry extra rules.
          </>
        }
      >
        <Code>{`@use '../../styles/breakpoints' as bp;

.vds-thing {
  flex-direction: column;          // small screens: stack

  @include bp.up(md) {             // 768px and wider
    flex-direction: row;           // side by side
  }

  @include bp.down(sm) { … }       // narrower than 640px
  @include bp.between(md, xl) { …} // from 768px up to (not including) 1280px

  @include bp.coarse { … }         // touch screens (fingers, not a mouse)
  @include bp.motion-ok { … }      // only if the user hasn't turned motion off
}`}</Code>
        <PropsTable
          headers={['Mixin', 'Matches when']}
          rows={[
            [{ code: 'bp.up(name)' }, 'The screen is this wide or wider. Your default pick.'],
            [{ code: 'bp.down(name)' }, 'The screen is narrower than this. Use sparingly.'],
            [{ code: 'bp.between(a, b)' }, 'The screen is at least a but narrower than b.'],
            [{ code: 'bp.coarse' }, 'The pointer is a finger or stylus, not a mouse. Grow hit areas here.'],
            [{ code: 'bp.motion-ok' }, 'The user has not asked for reduced motion. Put every animation inside this.'],
          ]}
        />
      </Section>

      <Section
        title="Fluid type"
        note={
          <>
            The three biggest text sizes shrink smoothly on small screens and reach full size on
            big ones — no jumps, no extra classes. It just happens. Everything from{' '}
            <IC>subheading</IC> down stays fixed, because small UI text must never drift.
          </>
        }
      >
        <PropsTable
          headers={['Step', 'On a phone (320px)', 'Full size', 'Full size by']}
          rows={[
            [{ code: 'display' }, '24px', '30px', '1280px'],
            [{ code: 'title' }, '20px', '24px', '1120px'],
            [{ code: 'heading' }, '18px', '20px', '1120px'],
          ]}
        />
      </Section>

      <Section
        title="Page rhythm"
        note={
          <>
            <IC>--vds-page-pad</IC> is the padding between the page edge and the content. It grows
            with the screen on its own — bind the page shell to the token once and forget it.
            The grid gutter and section gap also open up a little on laptops and wider.
          </>
        }
      >
        <PropsTable
          headers={['Token', 'Base', 'From md (768px)', 'From lg (1024px)']}
          rows={[
            [{ code: '--vds-page-pad' }, '16px', '24px', '32px'],
            [{ code: '--vds-gutter' }, '24px', '24px', '32px'],
            [{ code: '--vds-section' }, '48px', '48px', '64px'],
          ]}
        />
      </Section>

      <Section
        title="Touch targets"
        note={
          <>
            Fingers are wider than mouse pointers. On touch screens, anything you can tap should
            be at least <IC>--vds-tap-target</IC> (44px) tall — wrap the bump in{' '}
            <IC>bp.coarse</IC> so mouse users keep the dense sizing. The shared control heights
            live as tokens too, so components can bind to them instead of hard-coding a height.
          </>
        }
      >
        <PropsTable
          headers={['Token', 'Value', 'Use for']}
          rows={CONTROLS.map((c) => [{ code: c.token }, c.value, c.usage])}
        />
        <Code>{`.vds-row__action {
  height: var(--vds-control-h-sm); // dense by default

  @include bp.coarse {
    min-height: var(--vds-tap-target); // finger-friendly on touch
  }
}`}</Code>
      </Section>
    </DocPage>
  )
}
