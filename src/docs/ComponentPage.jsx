import { Heading, Text } from '../components/index.js'
import { Section, Code, PropsTable, A11yList } from './primitives.jsx'

/* ----------------------------------------------------------------------------
   ComponentPage — fixed anatomy for every component, matching Mason:
     title → description → Installation → [example sections] → Props → Accessibility
   `props` is an array of { name?, headers, rows }; `accessibility` is nodes[].
   -------------------------------------------------------------------------- */

export function ComponentPage({
  title,
  description,
  installCode,
  children,
  props = [],
  accessibility = [],
}) {
  return (
    <article>
      <Heading level="title" as="h1" className="vds-page__title">
        {title}
      </Heading>
      <Text variant="body-lg" tone="muted" className="vds-page__desc">
        {description}
      </Text>

      <Section title="Installation">
        <Code>{installCode}</Code>
      </Section>

      {children}

      {props.length > 0 && (
        <Section title="Props">
          {props.map((table, i) => (
            <div key={i}>
              {table.name && (
                <Heading level="subheading" as="h3" style={{ margin: '1.25rem 0 0.5rem' }}>
                  {table.name}
                </Heading>
              )}
              <PropsTable headers={table.headers} rows={table.rows} />
            </div>
          ))}
        </Section>
      )}

      {accessibility.length > 0 && (
        <Section title="Accessibility">
          <A11yList items={accessibility} />
        </Section>
      )}
    </article>
  )
}
