import { Bell, Search } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { TopBar } from '../../components/TopBar/index.js'
import { Heading, Text } from '../../components/Text/index.js'
import { Button } from '../../components/Button/index.js'
import { Icon } from '../../components/Icon/index.js'
import { Badge } from '../../components/Badge/index.js'
import { VipreLogo } from '../VipreLogo.jsx'

export function TopBarPage() {
  return (
    <ComponentPage
      title="Top Bar"
      description="The strip across the top of a screen. It is --vds-topbar-h (56px) tall and has three slots: leading (left, never shrinks), children (the middle — your title or breadcrumb; it truncates first), and trailing (right, never shrinks). Two tones: surface follows the theme; navy is the same fixed midnight as the Side Nav, in both themes. Its side padding respects phone notches."
      installCode={`import { TopBar } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'leading' }, { code: 'node' }, '—', 'Pinned left — hamburger, logo. Never shrinks'],
            [{ code: 'children' }, { code: 'node' }, '—', 'The middle — title, breadcrumb, tabs. Truncates when squeezed'],
            [{ code: 'trailing' }, { code: 'node' }, '—', 'Pinned right — actions, search, avatar. Never shrinks'],
            [{ code: 'sticky' }, { code: 'boolean' }, { code: 'false' }, 'Stick to the top of the nearest scroll area (on --vds-z-sticky). Not needed inside an AppShell — the frame already pins it'],
            [{ code: 'tone' }, { code: "'surface' | 'navy'" }, { code: "'surface'" }, "surface follows the theme; navy is fixed midnight chrome"],
          ],
        },
      ]}
      accessibility={[
        <>Renders a real <IC>{'<header>'}</IC> landmark.</>,
        <>The bar itself is not interactive — the things you put in it (buttons, links) carry their own keyboard support and focus rings.</>,
        <>On the navy tone, focus rings inside the bar are re-mixed from white and the accent so they stay visible on midnight.</>,
        <>The middle slot truncates with an ellipsis — edge actions are never pushed off-screen, so nothing becomes unreachable.</>,
      ]}
    >
      <Section
        title="Surface tone"
        note="The default. A theme surface with a hairline under it — white in light mode, navy-900 in dark. Title in the middle, actions on the right."
      >
        <Preview
          canvas={
            <div style={{ width: '100%', border: '1px solid var(--vds-line)', borderRadius: 'var(--vds-radius-md)', overflow: 'hidden' }}>
              <TopBar
                trailing={
                  <>
                    <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Search">
                      <Icon as={Search} size="sm" />
                    </Button>
                    <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Alerts">
                      <Icon as={Bell} size="sm" />
                    </Button>
                    <Button size="sm">New policy</Button>
                  </>
                }
              >
                <Heading level="subheading" as="h1">Devices</Heading>
                <Badge tone="success">247 online</Badge>
              </TopBar>
            </div>
          }
          code={`<TopBar
  trailing={<>
    <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Alerts">
      <Icon as={Bell} size="sm" />
    </Button>
    <Button size="sm">New policy</Button>
  </>}
>
  <Heading level="subheading" as="h1">Devices</Heading>
  <Badge tone="success">247 online</Badge>
</TopBar>`}
        />
      </Section>

      <Section
        title="Navy tone"
        note="The fixed midnight chrome — the same navy as the Side Nav rail, and it does NOT flip with the theme. Use it when the bar is product chrome (a logo strip) rather than part of the page."
      >
        <Preview
          canvas={
            <div style={{ width: '100%', borderRadius: 'var(--vds-radius-md)', overflow: 'hidden' }}>
              <TopBar
                tone="navy"
                leading={<VipreLogo className="vds-logo" />}
                trailing={<Text variant="caption" style={{ color: 'var(--vds-midnight-300)' }}>alvin@sixbase.com</Text>}
              />
            </div>
          }
          code={`<TopBar tone="navy" leading={<VipreLogo />} trailing={<AccountMenu />} />`}
        />
      </Section>

      <Section
        title="Truncation"
        note="Squeeze the bar and the middle gives way first — it shrinks and ellipsizes. The edge slots hold their ground, so actions never fall off the screen."
      >
        <Preview
          canvas={
            <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--vds-line)', borderRadius: 'var(--vds-radius-md)', overflow: 'hidden' }}>
              <TopBar trailing={<Button size="sm">Export</Button>}>
                <Heading level="subheading" as="h1">
                  A very long report name that will not fit in a narrow bar
                </Heading>
              </TopBar>
            </div>
          }
          code={`// nothing to configure — the middle slot has min-width: 0 and ellipsizes`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. No JS needed — the bar is plain layout."
      >
        <Code>{`<header class="vds-topbar vds-topbar--surface">   <!-- or vds-topbar--navy, + vds-topbar--sticky -->
  <div class="vds-topbar__leading">
    <button class="vds-appshell-trigger" aria-label="Open navigation"><svg>…</svg></button>
  </div>
  <div class="vds-topbar__body">
    <h1 class="vds-text vds-text--subheading">Devices</h1>
  </div>
  <div class="vds-topbar__trailing">
    <button class="vds-button vds-button--solid vds-button--primary vds-button--sm">New policy</button>
  </div>
</header>`}</Code>
      </Section>
    </ComponentPage>
  )
}
