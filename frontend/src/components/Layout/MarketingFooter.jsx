import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';

export function MarketingFooter() {
  return (
    <footer className="footer footer--marketing">
      <div className="footer-top">
        <RouteLink path="/" className="footer-brand" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
          <div className="brand__mark brand__mark--small brand__mark--img">
            <img src="/logo.png" alt="CareerConnect AI Logo" className="brand__logo-img" />
          </div>
          <span>CareerConnect AI</span>
        </RouteLink>

        <div className="footer__links">
          <RouteLink path="/" className="marketing-link">Privacy Policy</RouteLink>
          <RouteLink path="/" className="marketing-link">Terms of Service</RouteLink>
          <RouteLink path="/auth" className="marketing-link">Contact Support</RouteLink>
          <RouteLink path="/" className="marketing-link">Career Blog</RouteLink>
        </div>

        <div className="footer-actions">
          <button type="button" className="footer-icon-btn" title="Language">
            <Icon name="globe" />
          </button>
          <button type="button" className="footer-icon-btn" title="Support">
            <Icon name="mail" />
          </button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 CareerPrep AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

