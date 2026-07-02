export function Footer() {
  return (
    <footer className="footer">
      <div className="frame footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" />
          <div className="footer-brand-text">
            <span className="footer-brand-name">Intentional Studio</span>
            <span className="footer-legal">Intentional Studio AI, LLC</span>
          </div>
        </div>
        <div className="footer-meta">
          <span>© MMXXVI</span>
          <span className="footer-dot">·</span>
          <a href="https://github.com/cmeiliu/" target="_blank" rel="noopener">
            GitHub
          </a>
          <span className="footer-dot">·</span>
          <a href="mailto:mei@intentional.studio">mei@intentional.studio</a>
        </div>
      </div>
    </footer>
  );
}
