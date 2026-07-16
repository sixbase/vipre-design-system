/* Meeting Guide — facilitation notes for the design + eng handoff / source-of-
   truth alignment meeting. Authored as a self-contained HTML file
   (public/meeting-guide.html) to keep its own design; embedded here so it lives
   in the docs sidebar. `import.meta.env.BASE_URL` keeps the src correct under
   the GitHub Pages base path. */
export function MeetingGuidePage() {
  const src = `${import.meta.env.BASE_URL}meeting-guide.html`
  return (
    <div className="vds-doc">
      <h1 className="vds-heading vds-heading--display">Meeting Guide</h1>
      <p className="vds-text vds-text--body-lg vds-text--tone-muted" style={{ marginTop: '0.25rem' }}>
        A guide to help design and engineering agree on delivery, handoff, and moving the
        source of truth from Figma to the design system.{' '}
        <a href={src} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>
      </p>
      <iframe
        title="Design + Engineering — Meeting Guide"
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
