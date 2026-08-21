import { RouteLink } from '../Common/RouteLink.jsx';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__brand">
        <strong>CareerConnect AI</strong>
        <span>© 2026 CareerConnect AI. All rights reserved.</span>
      </div>
      <div className="app-footer__links" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <RouteLink path="/settings" className="marketing-link">Privacy Policy</RouteLink>
        <RouteLink path="/settings" className="marketing-link">Terms of Service</RouteLink>
        <RouteLink path="/settings" className="marketing-link">Contact Support</RouteLink>
        <RouteLink path="/dashboard" className="marketing-link">Career Blog</RouteLink>
      </div>
    </footer>
  );
}

