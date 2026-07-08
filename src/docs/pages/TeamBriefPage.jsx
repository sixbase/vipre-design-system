/* Team Brief — the design-system adoption doc for the whole team.
   The doc is authored as a self-contained HTML file (public/team-brief.html) so
   it keeps its own briefing-page design; we embed it here so it lives in the
   docs sidebar. `import.meta.env.BASE_URL` keeps the src correct under the
   GitHub Pages base path. */
export function TeamBriefPage() {
  const src = `${import.meta.env.BASE_URL}team-brief.html`
  return (
    <div className="vds-doc">
      <h1 className="vds-heading vds-heading--display">Team Brief</h1>
      <p className="vds-text vds-text--body-lg vds-text--tone-muted" style={{ marginTop: '0.25rem' }}>
        A plain-language brief for design + engineering: how the system is maintained, and how the
        React and Angular teams consume it. Share this to align on adoption.{' '}
        <a href={src} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>
      </p>
      <iframe
        title="Vipre Design System — Team Brief"
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
