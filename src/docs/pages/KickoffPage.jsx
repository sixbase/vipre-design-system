/* Kickoff + Notes — the combined adoption doc: the plain-language "how we use
   the design system" story flowing into the decisions to make, with note fields
   that auto-save in the reader's browser. Authored as a self-contained page
   (public/kickoff.html) so its note-taking JS + localStorage work; embedded here
   for the docs sidebar. */
export function KickoffPage() {
  const src = `${import.meta.env.BASE_URL}kickoff.html`
  return (
    <div className="vds-doc">
      <h1 className="vds-heading vds-heading--display">Kickoff &amp; Notes</h1>
      <p className="vds-text vds-text--body-lg vds-text--tone-muted" style={{ marginTop: '0.25rem' }}>
        A two-minute, plain-language read on how we use the design system, flowing into the
        decisions to make — with note fields you can fill in live during the meeting.{' '}
        <a href={src} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>{' '}
        (best for note-taking — notes save in that tab).
      </p>
      <iframe
        title="Design System — Kickoff & Notes"
        src={src}
        style={{
          width: '100%',
          height: 'calc(100dvh - 11rem)',
          minHeight: 560,
          marginTop: '1rem',
          border: '1px solid var(--vds-line)',
          borderRadius: 'var(--vds-radius-lg)',
          background: 'var(--vds-surface)',
        }}
      />
    </div>
  )
}
