import { Heading, Text } from '../components/index.js'

/* ----------------------------------------------------------------------------
   DocPage — lighter shell for foundation pages (Colors, Typography) and the
   intro. Title + description, then freeform sections supplied as children.
   -------------------------------------------------------------------------- */

export function DocPage({ title, description, children }) {
  return (
    <article>
      <Heading level="title" as="h1" className="vds-page__title">
        {title}
      </Heading>
      {description && (
        <Text variant="body-lg" tone="muted" className="vds-page__desc">
          {description}
        </Text>
      )}
      {children}
    </article>
  )
}
