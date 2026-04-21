export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-row1">
        <div className="footer-brand">
          <div className="wordmark">
            reveal<span className="dot">.</span>
          </div>
          <div className="footer-legal">Reveal Labs LLC — Colorado</div>
          <p className="footer-tagline">
            Revenue intelligence for independent restaurants.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="mailto:chayadol@reveallabs.co">Contact</a>
          <a
            href="https://www.linkedin.com/company/reveallabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </nav>
      </div>
      <div className="footer-row2">
        <div className="copy">© 2026 Reveal Labs LLC.</div>
        <div className="motto">
          Built for restaurant owners who want clarity.
        </div>
      </div>
    </footer>
  );
}
