import { Eye, Pencil, Trash2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, Kbd, IC, PropsTable } from '../primitives.jsx'
import { Button, Icon, Inline } from '../../components/index.js'

/* A labelled token table for the Tokens section. */
function TokenGroup({ label, headers, rows }) {
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <p className="vds-text vds-text--eyebrow" style={{ margin: '0 0 0.4rem' }}>{label}</p>
      <PropsTable headers={headers} rows={rows} />
    </div>
  )
}

export function ButtonPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Button}
      title="Button"
      description="A button people click. Two choices: variant is how loud it looks (solid, soft, outline, ghost) and tone is its job and color (primary, neutral, success, warning, danger, info). Any look works with any color. Three sizes, a spinner for loading, a faded look when off, and a ring you can see when you tab to it. Passes through all normal button props."
      installCode={`<!-- Tokens-only: link the CSS variables, build your own button against them. -->
<link rel="stylesheet" href="vipre-tokens.css">`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'variant' }, { code: "'solid' | 'soft' | 'outline' | 'ghost'" }, { code: "'solid'" }, 'How loud the button looks'],
            [{ code: 'tone' }, { code: "'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'" }, { code: "'primary'" }, 'The button’s job and color'],
            [{ code: 'size' }, { code: "'sm' | 'md' | 'lg'" }, { code: "'md'" }, 'How tall the button is and its text size'],
            [{ code: 'loading' }, { code: 'boolean' }, { code: 'false' }, 'Show a spinner and stop clicks while it works'],
            [{ code: 'fullWidth' }, { code: 'boolean' }, { code: 'false' }, 'Stretch to fill the space it sits in'],
            [{ code: 'iconOnly' }, { code: 'boolean' }, { code: 'false' }, 'Make it a square for a single icon (needs aria-label)'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Turn it off and fade it (opacity 0.5)'],
            [{ code: 'type' }, { code: "'button' | 'submit'" }, { code: "'button'" }, 'The normal button type'],
            [{ code: '…props' }, { code: 'ButtonHTMLAttributes' }, '—', 'onClick, aria-*, and more, passed to <button>'],
          ],
        },
      ]}
      accessibility={[
        <>Keyboard: <Kbd>Enter</Kbd> and <Kbd>Space</Kbd> activate the button.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> and only shows when you tab to it (<IC>:focus-visible</IC>).</>,
        <><IC>loading</IC> sets <IC>aria-busy</IC> and turns the button off so it can’t be clicked twice.</>,
        <>Disabled uses <IC>opacity</IC> + <IC>pointer-events: none</IC> — never a new gray.</>,
        <>Icon-only buttons must have an <IC>aria-label</IC> so screen readers know what they do.</>,
      ]}
    >
      <Section title="Variants" note="Four levels of loudness, from a solid fill down to a see-through ghost.">
        <Preview
          canvas={
            <>
              <Button variant="solid">Solid</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </>
          }
        />
      </Section>

      <Section title="Tones" note="The color for the button’s job. Any tone works with any look — shown here as soft fills.">
        <Preview
          canvas={
            <>
              <Button variant="soft" tone="primary">Primary</Button>
              <Button variant="soft" tone="neutral">Neutral</Button>
              <Button variant="soft" tone="success">Success</Button>
              <Button variant="soft" tone="warning">Warning</Button>
              <Button variant="soft" tone="danger">Danger</Button>
              <Button variant="soft" tone="info">Info</Button>
            </>
          }
        />
      </Section>

      <Section title="Sizes">
        <Preview
          canvas={
            <>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </>
          }
        />
      </Section>

      <Section title="Loading" note="Shows a spinner, sets aria-busy, and blocks clicks. Keep the label so the width doesn’t jump.">
        <Preview
          canvas={
            <>
              <Button loading>Saving…</Button>
              <Button variant="soft" tone="success" loading>Approving…</Button>
              <Button variant="outline" loading>Loading</Button>
            </>
          }
        />
      </Section>

      <Section title="Icon-only" note="Square buttons for a single icon — great as quiet actions in table rows. Always pass an aria-label.">
        <Preview
          canvas={
            <Inline gap={1}>
              <Button variant="ghost" size="sm" iconOnly aria-label="View"><Icon as={Eye} size="sm" /></Button>
              <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><Icon as={Pencil} size="sm" /></Button>
              <Button variant="ghost" tone="danger" size="sm" iconOnly aria-label="Delete"><Icon as={Trash2} size="sm" /></Button>
              <Button variant="outline" tone="neutral" iconOnly aria-label="Edit"><Icon as={Pencil} size="sm" /></Button>
            </Inline>
          }
        />
      </Section>

      <Section title="Full width" note="Stretches to fill the space around it — handy in forms, pop-ups, and skinny side panels.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '20rem' }}>
              <Button fullWidth>Continue</Button>
            </div>
          }
        />
      </Section>

      <Section title="States">
        <Preview
          canvas={
            <>
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
            </>
          }
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes — this is the reference implementation of the token contract below, not a shipped package. Build your own button component in whatever framework you use and bind it to these classes and --vds-button-* tokens. Always three modifiers: a variant, a tone, and a size. No JS needed — the loading spinner is a nested Spinner span you add yourself."
      >
        <Code>{`<!-- variant: --solid | --soft | --outline | --ghost
     tone:    --primary | --neutral | --success | --warning | --danger | --info
     size:    --sm | --md | --lg -->
<button type="button" class="vds-button vds-button--solid vds-button--primary vds-button--md">
  Add device
</button>

<!-- loading: add --loading, aria-busy, disabled, and a Spinner inside -->
<button type="button" disabled aria-busy="true"
        class="vds-button vds-button--solid vds-button--primary vds-button--md vds-button--loading">
  <span class="vds-spinner vds-spinner--sm" role="status" aria-label="Loading"></span> Saving…
</button>

<!-- icon-only: add --icon and an aria-label -->
<button type="button" aria-label="Edit"
        class="vds-button vds-button--ghost vds-button--primary vds-button--sm vds-button--icon">
  <svg class="vds-icon" width="16" height="16" aria-hidden="true">…</svg>
</button>

<!-- full width: add vds-button--full -->`}</Code>
      </Section>

      <Section
        title="Tokens"
        note="Every visual value is a --vds-button-* custom property set on the .vds-button root, bound to foundation tokens only. Re-declare any of them on your own selector to re-space or re-shape the button; nothing else in the system changes."
      >
        <TokenGroup label="Sizing" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-button-h-sm' }, { code: '2rem (32px)' }, 'Small height'],
          [{ code: '--vds-button-h-md' }, { code: '2.25rem (36px)' }, 'Medium height (default)'],
          [{ code: '--vds-button-h-lg' }, { code: '2.75rem (44px)' }, 'Large height'],
          [{ code: '--vds-button-pad-x-sm' }, { code: '0.75rem (12px)' }, 'Small horizontal padding'],
          [{ code: '--vds-button-pad-x-md' }, { code: '1rem (16px)' }, 'Medium horizontal padding'],
          [{ code: '--vds-button-pad-x-lg' }, { code: '1.5rem (24px)' }, 'Large horizontal padding'],
          [{ code: '--vds-button-gap' }, { code: '0.5rem (8px)' }, 'Icon ↔ label gap'],
        ]} />

        <TokenGroup label="Shape" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-button-radius' }, { code: '0.25rem (4px)' }, 'Corner radius'],
          [{ code: '--vds-button-border-w' }, { code: '1px' }, 'Border hairline width'],
        ]} />

        <TokenGroup label="Type" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-button-weight' }, { code: '500' }, 'Label font weight'],
        ]} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
          Size is a typescale step, not a raw value: sm = <IC>detail</IC>, md = <IC>body</IC>, lg = <IC>body-lg</IC>.
        </p>

        <TokenGroup label="Focus ring" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-button-ring-w' }, { code: '2px' }, 'Ring thickness'],
          [{ code: '--vds-button-ring-offset' }, { code: '2px' }, 'Ring offset from the button edge'],
        ]} />
        <p className="vds-text vds-text--detail vds-text--tone-muted" style={{ marginTop: '0.5rem' }}>
          Action controls (buttons, checkboxes) use a hard outline ring — it reads clearly on any tone fill. Field controls (inputs, selects) use a softer shadow ring instead; the two are deliberately different recipes.
        </p>

        <TokenGroup label="Motion" headers={['Token', 'Value', 'Controls']} rows={[
          [{ code: '--vds-button-dur' }, { code: '120ms' }, 'Hover / focus transition speed'],
          [{ code: '--vds-button-ease' }, { code: 'cubic-bezier(0.16, 1, 0.3, 1)' }, 'Easing curve'],
        ]} />

        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '1.25rem' }}>
          <strong>Tone &amp; variant colors</strong> aren’t their own token set — every fill, hover, and ink comes
          from the semantic <IC>--vds-primary</IC> / <IC>--vds-danger</IC> / <IC>--vds-success</IC> / … families,
          one per tone. See <a href="#/foundation/color-usage">Color usage →</a>.
        </p>
      </Section>
    </ComponentPage>
  )
}
