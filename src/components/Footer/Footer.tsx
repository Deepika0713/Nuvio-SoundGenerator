import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#about" className="footer-link">About</a>
          <span className="footer-separator">•</span>
          <a href="#feedback" className="footer-link">Feedback</a>
          <span className="footer-separator">•</span>
          <a href="#privacy" className="footer-link">Privacy</a>
        </nav>
        
        <p className="footer-attribution">
          © {currentYear} Nuvio. By Deepika. Crafted with care for focus and relaxation.
        </p>
      </div>
    </footer>
  );
}
