import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';
import { marketingLinks } from '../../constants/navigation.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function MarketingHeader() {
  const { user } = useAuth() || {};

  return (
    <header className="marketing-header">
      <RouteLink path="/" className="marketing-header__brand" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
        <div className="brand__mark brand__mark--small brand__mark--img">
          <img src="/logo.png" alt="CareerConnect AI Logo" className="brand__logo-img" />
        </div>
        <span className="brand-name-text">CareerConnect AI</span>
      </RouteLink>

      <nav className="marketing-header__nav">
        {marketingLinks.map((item) => (
          <RouteLink
            key={item.path}
            path={item.path}
            className="marketing-link"
            activeClassName="marketing-link--active"
          >
            {item.label}
          </RouteLink>
        ))}
      </nav>

      <div className="marketing-header__actions">
        {user ? (
          <>
            <RouteLink path="/dashboard" className="header-signin-btn">
              Dashboard
            </RouteLink>
            <RouteLink path="/notifications" className="header-icon-btn icon-circle" title="Notifications">
              <Icon name="bell" />
            </RouteLink>
            <RouteLink path="/settings" className="header-icon-btn icon-circle" title="Settings">
              <Icon name="settings" />
            </RouteLink>
            <RouteLink path="/profile" className="header-avatar-btn avatar-chip" title="Profile">
              {(user.avatar || user.avatarUrl) ? (
                <img
                  src={user.avatar || user.avatarUrl}
                  alt={user.name || 'User'}
                  className="avatar-chip-img"
                  onError={(e) => { e.currentTarget.src = '/images/alex_thompson.png'; }}
                />
              ) : (
                <span>{(user.name || 'U').charAt(0).toUpperCase()}</span>
              )}
            </RouteLink>
          </>
        ) : (
          <>
            <RouteLink path="/auth" className="header-signin-btn">
              Sign In
            </RouteLink>
            <RouteLink path="/auth" className="header-signup-btn">
              Get Started
            </RouteLink>
          </>
        )}
      </div>
    </header>
  );
}
