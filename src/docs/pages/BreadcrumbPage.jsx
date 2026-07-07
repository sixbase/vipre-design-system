import { Building2 } from '@icons'
import { ComponentPage } from '../ComponentPage.jsx'
import { Section, Preview, Code, IC } from '../primitives.jsx'
import { Breadcrumb } from '../../components/Breadcrumb/index.js'
import { Icon } from '../../components/Icon/index.js'

export function BreadcrumbPage() {
  return (
    <ComponentPage
      title="Breadcrumb"
      description="The trail that shows where you are. Pass the path as a list; the last item is the current page and isn’t a link. Long trails fold their middle into a '…' button that opens a little menu. Long names get cut with an ellipsis so the trail stays on one line."
      installCode={`import { Breadcrumb } from 'vipre-design-system'`}
      props={[
        {
          headers: ['Prop', 'Type', 'Default', 'Description'],
          rows: [
            [{ code: 'items' }, { code: '[{ label, href?, onClick?, icon? }]' }, '—', 'The trail, root first. Last item = current page'],
            [{ code: 'maxItems' }, { code: 'number' }, { code: '4' }, 'Fold the middle into “…” past this many crumbs (Infinity = never)'],
            [{ code: 'separator' }, { code: 'node' }, 'chevron', 'What sits between crumbs'],
            [{ code: '…props' }, { code: 'HTMLAttributes' }, '—', 'Passed to the <nav>'],
          ],
        },
      ]}
      accessibility={[
        <>Renders <IC>&lt;nav aria-label="Breadcrumb"&gt;</IC> with an ordered list, so screen readers announce it as one landmark.</>,
        <>The current page carries <IC>aria-current="page"</IC> and isn’t clickable.</>,
        <>Separators are decoration only (<IC>aria-hidden</IC>).</>,
        <>The “…” button says how many pages it hides, and its menu composes the Popover primitive — <IC>Escape</IC> and outside clicks close it, focus returns to the button.</>,
        <>Focus rings use <IC>--vds-focus-ring</IC>; transitions stop under <IC>prefers-reduced-motion</IC>.</>,
      ]}
    >
      <Section title="Basic" note="Give each crumb an href (renders a link) or an onClick (renders a button). The last one is just text.">
        <Preview
          canvas={
            <Breadcrumb
              items={[
                { label: 'All Accounts', href: '#' },
                { label: 'Meridian MSP', href: '#' },
                { label: 'Devices' },
              ]}
            />
          }
          code={`<Breadcrumb
  items={[
    { label: 'All Accounts', href: '/accounts' },
    { label: 'Meridian MSP', href: '/accounts/meridian' },
    { label: 'Devices' },
  ]}
/>`}
        />
      </Section>

      <Section title="Collapsed middle" note="More crumbs than maxItems? The middle folds into a '…' button. Click it to see the hidden pages.">
        <Preview
          popover
          reserve={200}
          canvas={
            <Breadcrumb
              items={[
                { label: 'All Accounts', href: '#' },
                { label: 'Meridian MSP', href: '#' },
                { label: 'Northwind Group', href: '#' },
                { label: 'Contoso Ltd', href: '#' },
                { label: 'Seattle Office', href: '#' },
                { label: 'Devices' },
              ]}
            />
          }
          code={`<Breadcrumb maxItems={4} items={sixItems} />
{/* renders: All Accounts › … › Seattle Office › Devices */}`}
        />
      </Section>

      <Section title="Icons and custom separator" note="Any crumb can carry a small icon. Swap the separator for any node — a slash, a dot, anything.">
        <Preview
          canvas={
            <Breadcrumb
              separator={<span>/</span>}
              items={[
                { label: 'Meridian MSP', href: '#', icon: <Icon as={Building2} size="xs" /> },
                { label: 'Policies', href: '#' },
                { label: 'Ransomware shield' },
              ]}
            />
          }
          code={`<Breadcrumb
  separator={<span>/</span>}
  items={[
    { label: 'Meridian MSP', href: '/m', icon: <Icon as={Building2} size="xs" /> },
    { label: 'Policies', href: '/m/policies' },
    { label: 'Ransomware shield' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Markup"
        note="The rendered HTML with the vds- classes, for teams not using React. The plain trail needs no JS; the '…' collapse needs JS for its Popover menu (open/close, Escape, focus return)."
      >
        <Code>{`<nav class="vds-breadcrumb" aria-label="Breadcrumb">
  <ol class="vds-breadcrumb__list">
    <li class="vds-breadcrumb__item">
      <a class="vds-breadcrumb__crumb" href="/accounts">
        <span class="vds-breadcrumb__text">All Accounts</span>
      </a>
    </li>
    <li class="vds-breadcrumb__item">
      <span class="vds-breadcrumb__sep" aria-hidden="true"><svg class="vds-icon">…</svg></span>
      <a class="vds-breadcrumb__crumb" href="/accounts/meridian">
        <span class="vds-breadcrumb__text">Meridian MSP</span>
      </a>
    </li>
    <li class="vds-breadcrumb__item">
      <span class="vds-breadcrumb__sep" aria-hidden="true"><svg class="vds-icon">…</svg></span>
      <span class="vds-breadcrumb__crumb vds-breadcrumb__crumb--current" aria-current="page">
        <span class="vds-breadcrumb__text">Devices</span>
      </span>
    </li>
  </ol>
</nav>

<!-- Collapsed middle (needs JS — it's a Popover menu): -->
<!-- <button class="vds-breadcrumb__ellipsis" aria-label="Show 3 hidden pages">…</button> -->`}</Code>
      </Section>
    </ComponentPage>
  )
}
