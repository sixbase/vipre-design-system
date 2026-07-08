/* MSP Menu Quickstart — how a front-end dev (React, Angular, or plain HTML)
   adds the menu to their app in ~5 minutes. Authored as a self-contained page
   (public/msp-menu/quickstart.html) that sits next to the working demo + the
   real files, so its relative links resolve. Embedded here for the docs sidebar. */
export function MenuQuickstartPage() {
  const src = `${import.meta.env.BASE_URL}msp-menu/quickstart.html`
  return (
    <div className="vds-doc">
      <h1 className="vds-heading vds-heading--display">Menu Quickstart</h1>
      <p className="vds-text vds-text--body-lg vds-text--tone-muted" style={{ marginTop: '0.25rem' }}>
        Add the MSP menu to any app — React, Angular, or plain HTML — in about five minutes.
        Three files, three steps, one event to wire.{' '}
        <a href={src} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>
      </p>
      <iframe
        title="MSP Menu — Quickstart"
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
