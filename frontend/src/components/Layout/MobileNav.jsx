import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';

const mobileNavItems = [
  { label: 'Home', path: '/dashboard', icon: 'dashboard' },
  { label: 'Resume', path: '/resume', icon: 'document' },
  { label: 'Analyze', path: '/jd-analyzer', icon: 'analytics' },
  { label: 'Coach', path: '/coach', icon: 'chat' },
];

export function MobileNav() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <nav className="mobile-nav">
      {mobileNavItems.map((item) => (
        <RouteLink
          key={item.path}
          path={item.path}
          className="mobile-nav__item"
          activeClassName="mobile-nav__item--active"
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </RouteLink>
      ))}

      <button
        type="button"
        className={`mobile-nav__item ${isOpen ? 'mobile-nav__item--active' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Navigation Drawer"
      >
        <Icon name="menu" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
