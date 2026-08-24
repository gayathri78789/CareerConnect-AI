import { useAuth } from '../../context/AuthContext.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';
import { appNav } from '../../constants/navigation.js';

function ShellNav({ compact = false, onItemClick }) {
  return (
    <>
      {appNav.map((item) => (
        <RouteLink
          key={item.path}
          path={item.path}
          className={`nav-link ${compact ? 'nav-link--compact' : ''}`}
          activeClassName="nav-link--active"
          onClick={onItemClick}
        >
          <div className="nav-link__icon">
            <Icon name={item.icon} />
          </div>
          <span className="nav-link__label">{item.label}</span>
        </RouteLink>
      ))}
    </>
  );
}

export function SidebarShell({ isOpen: propIsOpen, onClose: propOnClose }) {
  const { logout } = useAuth();
  const context = useSidebar();

  const isOpen = propIsOpen !== undefined ? propIsOpen : (context?.isOpen || false);
  const handleClose = propOnClose || context?.closeSidebar || (() => {});

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* HEADER */}
        <div className="sidebar__header">
          <RouteLink
            path="/dashboard"
            className="brand"
            onClick={handleClose}
            style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
          >
            <div className="brand__mark brand__mark--img">
              <img src="/logo.png" alt="CareerConnect Logo" className="brand__logo-img" />
            </div>
            <div>
              <h1>CareerConnect</h1>
              <div className="brand__meta">
                <span>AI Career</span>
                <span className="brand__badge">LIVE</span>
              </div>
            </div>
          </RouteLink>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={handleClose}
            aria-label="Close navigation sidebar"
            title="Close menu"
          >
            ×
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="sidebar__body">
          {/* MAIN NAV */}
          <nav className="sidebar__nav">
            <ShellNav onItemClick={handleClose} />
          </nav>

          {/* PROMO BANNER */}
          <div className="sidebar__promo">
            <div className="sidebar__promo-badge">PRO PLAN</div>
            <h4 className="sidebar__promo-title">Upgrade to Premium</h4>
            <p className="sidebar__promo-desc">
              Unlock AI JD analysis & unlimited mock interviews.
            </p>
            <RouteLink
              path="/settings?tab=billing"
              className="sidebar__promo-btn"
              onClick={handleClose}
            >
              <span>Go Premium</span>
              <Icon name="arrow-right" />
            </RouteLink>
          </div>

          {/* FOOTER NAV */}
          <div className="sidebar__footer">
            <RouteLink path="/settings" className="nav-link" activeClassName="nav-link--active" onClick={handleClose}>
              <div className="nav-link__icon">
                <Icon name="settings" />
              </div>
              <span className="nav-link__label">Settings</span>
            </RouteLink>

            <RouteLink path="/profile" className="nav-link" activeClassName="nav-link--active" onClick={handleClose}>
              <div className="nav-link__icon">
                <Icon name="user" />
              </div>
              <span className="nav-link__label">Profile</span>
            </RouteLink>

            <button
              type="button"
              onClick={() => {
                if (handleClose) handleClose();
                logout();
              }}
              className="nav-link nav-link--logout"
            >
              <div className="nav-link__icon">
                <Icon name="logout" />
              </div>
              <span className="nav-link__label">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
