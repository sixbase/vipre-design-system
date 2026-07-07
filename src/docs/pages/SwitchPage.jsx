import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Switch } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '0.75rem' }

export function SwitchPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Switch}
      title="Switch"
      description="An on/off switch for settings that change right away (dark mode, a filter, a feature flag). If people pick first and save later, use a Checkbox instead."
      installCode={`import { Switch } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'children' }, { code: 'ReactNode' }, '—', 'The label text (optional)'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'checked, defaultChecked, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Told to screen readers as <IC>role="switch"</IC> with its on/off state; the real input handles the keyboard.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> on the track when you tab to it (<IC>:focus-visible</IC>).</>,
        <>Use it for changes that happen right away — not for form fields that need a Save button.</>,
      ]}
    >
      <Section title="States">
        <Preview
          canvas={
            <div style={COL}>
              <Switch>Off</Switch>
              <Switch defaultChecked>On</Switch>
              <Switch disabled>Disabled (off)</Switch>
              <Switch defaultChecked disabled>
                Disabled (on)
              </Switch>
            </div>
          }
          code={`<Switch>Off</Switch>
<Switch defaultChecked>On</Switch>
<Switch disabled>Disabled</Switch>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. It's a real checkbox with role='switch'; the track and thumb are just paint. No JS needed — checking the input moves the thumb."
      >
        <Code>{`<label class="vds-switch">
  <input type="checkbox" role="switch" class="vds-switch__input" />
  <span class="vds-switch__track" aria-hidden="true">
    <span class="vds-switch__thumb"></span>
  </span>
  <span class="vds-switch__label">Email alerts</span>
</label>

<!-- disabled: add the modifier AND the disabled attribute -->
<label class="vds-switch vds-switch--disabled">
  <input type="checkbox" role="switch" class="vds-switch__input" disabled checked />
  <span class="vds-switch__track" aria-hidden="true"><span class="vds-switch__thumb"></span></span>
  <span class="vds-switch__label">Disabled (on)</span>
</label>`}</Code>
      </Section>
    </ComponentPage>
  )
}
