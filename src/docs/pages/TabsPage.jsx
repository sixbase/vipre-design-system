import { useState } from 'react'
import { Monitor, Shield, Mail } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, Kbd, IC } from '../primitives.jsx'
import { Tabs, TabList, Tab, TabPanel } from '../../components/Tabs/index.js'
import { Icon } from '../../components/Icon/index.js'
import { Text } from '../../components/Text/index.js'

function ControlledExample() {
  const [tab, setTab] = useState('devices')
  return (
    <div style={{ width: '100%' }}>
      <Tabs value={tab} onChange={setTab}>
        <TabList aria-label="Security areas">
          <Tab value="devices" icon={<Icon as={Monitor} size="sm" />}>Devices</Tab>
          <Tab value="threats" icon={<Icon as={Shield} size="sm" />} count={12}>Threats</Tab>
          <Tab value="email" icon={<Icon as={Mail} size="sm" />}>Email</Tab>
        </TabList>
        <TabPanel value="devices"><Text tone="muted">1,204 devices protected.</Text></TabPanel>
        <TabPanel value="threats"><Text tone="muted">12 threats need review.</Text></TabPanel>
        <TabPanel value="email"><Text tone="muted">98,412 emails scanned.</Text></TabPanel>
      </Tabs>
    </div>
  )
}

export function TabsPage() {
  return (
    <ComponentPage
      title="Tabs"
      description="Tabs show one panel at a time. Click a tab (or use the arrow keys) to switch. Four parts work together: Tabs holds the choice, TabList is the strip, Tab is one button, TabPanel is one panel. If the strip gets too wide, it scrolls sideways instead of wrapping."
      installCode={`import { Tabs, TabList, Tab, TabPanel } from 'vipre-design-system'`}
      props={[
        {
          name: 'Tabs',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string' }, '—', 'Which tab is open (controlled)'],
            [{ code: 'defaultValue' }, { code: 'string' }, '—', 'Which tab starts open (uncontrolled)'],
            [{ code: 'onChange' }, { code: '(value) => void' }, '—', 'Called with the new tab value'],
            [{ code: 'variant' }, { code: "'underline' | 'pill'" }, { code: "'underline'" }, 'Line under the tab, or a soft pill fill'],
            [{ code: 'size' }, { code: "'sm' | 'md'" }, { code: "'md'" }, 'Tab height and text size'],
            [{ code: 'fitted' }, { code: 'boolean' }, { code: 'false' }, 'Tabs stretch to share the full width'],
          ],
        },
        {
          name: 'Tab',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string' }, '—', 'Pairs the tab with its panel (required)'],
            [{ code: 'icon' }, { code: 'node' }, '—', 'Small icon before the label'],
            [{ code: 'count' }, { code: 'number | string' }, '—', 'Little count chip after the label'],
            [{ code: 'disabled' }, { code: 'boolean' }, { code: 'false' }, 'Fade the tab and block clicks'],
          ],
        },
        {
          name: 'TabPanel',
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'value' }, { code: 'string' }, '—', 'Matches its Tab (required)'],
          ],
        },
      ]}
      accessibility={[
        <>Follows the WAI-ARIA tabs pattern: <IC>role="tablist"</IC>, <IC>role="tab"</IC>, <IC>role="tabpanel"</IC>, with <IC>aria-selected</IC> and <IC>aria-controls</IC> wired for you.</>,
        <>Just one tab stop: <Kbd>Tab</Kbd> lands on the selected tab; <Kbd>←</Kbd> <Kbd>→</Kbd> move and select; <Kbd>Home</Kbd> / <Kbd>End</Kbd> jump to the ends.</>,
        <>Give the <IC>TabList</IC> an <IC>aria-label</IC> that says what the set is about.</>,
        <>The focus ring uses <IC>--vds-focus-ring</IC> and sits inside the strip so scrolling never hides it.</>,
        <>Panels keep <IC>tabIndex=0</IC> so keyboard users can scroll long content.</>,
        <>Hover and selection transitions turn off under <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section title="Basic" note="Uncontrolled: give it a defaultValue and it manages itself.">
        <Preview
          canvas={
            <div style={{ width: '100%' }}>
              <Tabs defaultValue="overview">
                <TabList aria-label="Example sections">
                  <Tab value="overview">Overview</Tab>
                  <Tab value="activity">Activity</Tab>
                  <Tab value="settings" disabled>Settings</Tab>
                </TabList>
                <TabPanel value="overview"><Text tone="muted">The overview panel.</Text></TabPanel>
                <TabPanel value="activity"><Text tone="muted">The activity panel.</Text></TabPanel>
                <TabPanel value="settings"><Text tone="muted">Settings.</Text></TabPanel>
              </Tabs>
            </div>
          }
          code={`<Tabs defaultValue="overview">
  <TabList aria-label="Example sections">
    <Tab value="overview">Overview</Tab>
    <Tab value="activity">Activity</Tab>
    <Tab value="settings" disabled>Settings</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
  <TabPanel value="settings">…</TabPanel>
</Tabs>`}
        />
      </Section>

      <Section title="Icons and counts" note="Controlled: you hold the value and pass onChange. Counts are handy for 'needs attention' numbers.">
        <Preview
          canvas={<ControlledExample />}
          code={`const [tab, setTab] = useState('devices')

<Tabs value={tab} onChange={setTab}>
  <TabList aria-label="Security areas">
    <Tab value="devices" icon={<Icon as={Monitor} size="sm" />}>Devices</Tab>
    <Tab value="threats" icon={<Icon as={Shield} size="sm" />} count={12}>Threats</Tab>
    <Tab value="email" icon={<Icon as={Mail} size="sm" />}>Email</Tab>
  </TabList>
  …
</Tabs>`}
        />
      </Section>

      <Section title="Pill variant" note="A softer look for filters inside a card. fitted makes the tabs share the width evenly.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '24rem' }}>
              <Tabs defaultValue="day" variant="pill" size="sm" fitted>
                <TabList aria-label="Time range">
                  <Tab value="day">Day</Tab>
                  <Tab value="week">Week</Tab>
                  <Tab value="month">Month</Tab>
                </TabList>
              </Tabs>
            </div>
          }
          code={`<Tabs defaultValue="day" variant="pill" size="sm" fitted>
  <TabList aria-label="Time range">
    <Tab value="day">Day</Tab>
    <Tab value="week">Week</Tab>
    <Tab value="month">Month</Tab>
  </TabList>
</Tabs>`}
        />
      </Section>

      <Section title="Overflow" note="Too many tabs? The strip scrolls sideways. The scrollbar is hidden and the edges fade where more tabs hide.">
        <Preview
          canvas={
            <div style={{ width: '100%', maxWidth: '22rem' }}>
              <Tabs defaultValue="t1">
                <TabList aria-label="Many sections">
                  <Tab value="t1">Dashboard</Tab>
                  <Tab value="t2">Devices</Tab>
                  <Tab value="t3">Threats</Tab>
                  <Tab value="t4">Policies</Tab>
                  <Tab value="t5">Quarantine</Tab>
                  <Tab value="t6">Reports</Tab>
                </TabList>
              </Tabs>
            </div>
          }
          code={`{/* nothing to configure — overflow scrolls automatically */}`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. JS you must supply yourself: switching aria-selected / tabindex / hidden on click, arrow-key movement, and toggling the fade classes on scroll."
      >
        <Code>{`<div class="vds-tabs vds-tabs--underline vds-tabs--md">
  <div class="vds-tabs__list" role="tablist" aria-label="Example sections">
    <button class="vds-tabs__tab vds-tabs__tab--selected" role="tab"
            id="tab-overview" aria-selected="true" aria-controls="panel-overview" tabindex="0">
      <span class="vds-tabs__label">Overview</span>
    </button>
    <button class="vds-tabs__tab" role="tab"
            id="tab-activity" aria-selected="false" aria-controls="panel-activity" tabindex="-1">
      <span class="vds-tabs__label">Activity</span>
      <span class="vds-tabs__count">12</span>
    </button>
  </div>
  <div class="vds-tabs__panel" role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" tabindex="0">…</div>
  <div class="vds-tabs__panel" role="tabpanel" id="panel-activity" aria-labelledby="tab-activity" tabindex="0" hidden>…</div>
</div>

<!-- Optional scroll fades (JS toggles these on the list): -->
<!--   vds-tabs__list--fade-start  vds-tabs__list--fade-end   -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
