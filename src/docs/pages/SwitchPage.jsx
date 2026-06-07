import { ComponentPage } from '../ComponentPage.jsx'
import { COMPONENT_COLORS } from "../colorUsage.js"
import { Section, Preview, IC } from '../primitives.jsx'
import { Switch } from '../../components/index.js'

const COL = { display: 'flex', flexDirection: 'column', gap: '0.75rem' }

export function SwitchPage() {
  return (
    <ComponentPage
      colors={COMPONENT_COLORS.Switch}
      title="Switch"
      description="An on/off toggle for settings that apply immediately (dark mode, a filter, a feature flag). For 'select then submit' choices, use a Checkbox instead."
      installCode={`import { Switch } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'children' }, { code: 'ReactNode' }, '—', 'Optional label content'],
            [{ code: '…props' }, { code: 'InputHTMLAttributes' }, '—', 'checked, defaultChecked, onChange, disabled…'],
          ],
        },
      ]}
      accessibility={[
        <>Exposed as <IC>role="switch"</IC> with on/off state; the native input handles keyboard.</>,
        <>Focus ring uses <IC>--vds-focus-ring</IC> on the track via <IC>:focus-visible</IC>.</>,
        <>Use for instant changes — not for form fields that need a Save action.</>,
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
    </ComponentPage>
  )
}
