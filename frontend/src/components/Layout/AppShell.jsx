import { SidebarShell } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';

export function MobileTopBar() {
  return (
    <header className="mobile-top-bar">
      <RouteLink path="/dashboard" className="mobile-top-bar__brand">
        <img src="/logo.png" alt="CareerConnect AI Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
        <span>CareerConnect AI</span>
      </RouteLink>
      <div className="mobile-top-bar__actions">
        <RouteLink path="/notifications" className="icon-circle" title="Notifications">
          <Icon name="bell" />
        </RouteLink>
      </div>
    </header>
  );
}

export function AppShell({ title, subtitle, actions, children, mainClassName = 'main-content' }) {
  return (
    <div className="app-shell">
      {/* Top Bar for Mobile & Tablet screens */}
      <MobileTopBar />

      <SidebarShell />

      <main className={mainClassName}>
        {title && (
          <header className="page-header">
            <div>
              <h2>{title}</h2>
              {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
          </header>
        )}
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
