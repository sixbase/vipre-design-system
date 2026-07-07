import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Avatar, AvatarGroup } from '../../components/Avatar/index.js'

export function AvatarPage() {
  return (
    <ComponentPage
      title="Avatar"
      description="A little picture chip for a person or team. It shows the photo if there is one. No photo (or the photo fails to load)? It shows the person's initials on a colored tint — and the same name always gets the same color. A small dot in the corner can show if they're online."
      installCode={`import { Avatar, AvatarGroup } from 'vipre-design-system'`}
      props={[
        {
          name: 'Avatar',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'src' }, { code: 'string' }, '—', 'Image URL. A broken image falls back to initials'],
            [{ code: 'alt' }, { code: 'string' }, { code: 'name' }, 'Image description'],
            [{ code: 'name' }, { code: 'string' }, '—', 'Person’s name → initials + their color'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, '20 / 24 / 32 / 40 / 56px'],
            [{ code: 'shape' }, { code: "'circle' | 'square'" }, { code: "'circle'" }, 'Round for people, square for teams and orgs'],
            [{ code: 'status' }, { code: "'online' | 'busy' | 'away' | 'offline'" }, '—', 'Presence dot in the corner'],
            [{ code: '…props' }, { code: 'HTMLAttributes<span>' }, '—', 'Passed to the root <span>'],
          ],
        },
        {
          name: 'AvatarGroup',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'max' }, { code: 'number' }, '—', 'Show this many, then fold the rest into a "+N" chip'],
            [{ code: 'size' }, { code: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, { code: "'md'" }, 'Applied to every avatar in the stack'],
            [{ code: '…props' }, { code: 'HTMLAttributes<div>' }, '—', 'Passed to the root <div>'],
          ],
        },
      ]}
      accessibility={[
        <>The photo gets a real <IC>alt</IC>. The initials fallback is <IC>aria-hidden</IC>, with the full name on the chip via <IC>aria-label</IC>.</>,
        <>The status dot has <IC>role="img"</IC> and a label ("Online", "Busy"…), so presence is spoken, not just colored.</>,
        <>The "+N" overflow chip is labelled "N more".</>,
        <>Name colors are decoration only — never the sole way to tell people apart.</>,
      ]}
    >
      <Section title="Initials fallback" note="No photo? The name becomes initials on a tint. The same name always lands on the same color.">
        <Preview
          canvas={
            <>
              <Avatar name="Dana Osei" />
              <Avatar name="Lee Wong" />
              <Avatar name="Ana Cruz" />
              <Avatar name="Sam Reed" />
              <Avatar name="Mira Patel" />
              <Avatar />
            </>
          }
          code={`<Avatar name="Dana Osei" />
<Avatar name="Lee Wong" />
<Avatar />   {/* no name → person glyph */}`}
        />
      </Section>

      <Section title="Sizes" note="Five sizes, 20 to 56px. xs shows one initial only — two don't fit.">
        <Preview
          canvas={
            <>
              <Avatar name="Dana Osei" size="xs" />
              <Avatar name="Dana Osei" size="sm" />
              <Avatar name="Dana Osei" size="md" />
              <Avatar name="Dana Osei" size="lg" />
              <Avatar name="Dana Osei" size="xl" />
            </>
          }
          code={`<Avatar name="Dana Osei" size="xs" />
<Avatar name="Dana Osei" size="xl" />`}
        />
      </Section>

      <Section title="Shape and status" note="Square reads as a team or org. The dot shows presence and says its name to screen readers.">
        <Preview
          canvas={
            <>
              <Avatar name="Dana Osei" size="lg" status="online" />
              <Avatar name="Lee Wong" size="lg" status="busy" />
              <Avatar name="Ana Cruz" size="lg" status="away" />
              <Avatar name="Sam Reed" size="lg" status="offline" />
              <Avatar name="VIPRE Ops" size="lg" shape="square" />
            </>
          }
          code={`<Avatar name="Dana Osei" size="lg" status="online" />
<Avatar name="VIPRE Ops" size="lg" shape="square" />`}
        />
      </Section>

      <Section title="AvatarGroup" note="A stack for 'who's on this'. Past max, the rest fold into a +N chip.">
        <Preview
          canvas={
            <AvatarGroup max={3}>
              <Avatar name="Dana Osei" />
              <Avatar name="Lee Wong" />
              <Avatar name="Ana Cruz" />
              <Avatar name="Sam Reed" />
              <Avatar name="Mira Patel" />
            </AvatarGroup>
          }
          code={`<AvatarGroup max={3}>
  <Avatar name="Dana Osei" />
  <Avatar name="Lee Wong" />
  <Avatar name="Ana Cruz" />
  <Avatar name="Sam Reed" />
  <Avatar name="Mira Patel" />
</AvatarGroup>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. The image→initials fallback needs JS (an onerror swap); everything else is CSS."
      >
        <Code>{`<!-- initials fallback (the fam- class picks the tint) -->
<span class="vds-avatar vds-avatar--md vds-avatar--circle vds-avatar--fam-harbor"
      role="img" aria-label="Dana Osei">
  <span class="vds-avatar__initials" aria-hidden="true">DO</span>
</span>

<!-- photo + presence dot -->
<span class="vds-avatar vds-avatar--lg vds-avatar--circle">
  <img class="vds-avatar__img" src="/dana.jpg" alt="Dana Osei" />
  <span class="vds-avatar__status vds-avatar__status--online" role="img" aria-label="Online"></span>
</span>

<!-- group with overflow chip -->
<div class="vds-avatar-group" role="group">
  <span class="vds-avatar vds-avatar--md vds-avatar--circle vds-avatar--fam-harbor">…</span>
  <span class="vds-avatar vds-avatar--md vds-avatar--circle vds-avatar--fam-rose">…</span>
  <span class="vds-avatar vds-avatar--md vds-avatar--circle vds-avatar-group__overflow"
        role="img" aria-label="2 more">+2</span>
</div>`}</Code>
      </Section>
    </ComponentPage>
  )
}
