import { useEffect } from 'react';
import { navigate } from '../../hooks/usePathname.js';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * A button-based link that uses the custom pushState router.
 * Applies activeClassName when the current pathname matches path.
 */
export function RouteLink({ path, children, className = '', activeClassName = '', style, title, onClick }) {
  const cleanPath = (path || '/').split('?')[0].split('#')[0];
  const rawPath = window.location.pathname || '/';
  const currentPath = rawPath !== '/' && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

  const active = currentPath === cleanPath;

  return (
    <button
      type="button"
      style={style}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        navigate(path);
        onClick?.();
      }}
      className={`route-link-btn ${className} ${active ? activeClassName : ''}`.trim()}
    >
      {children}
    </button>
  );
}

/**
 * Guards routes behind authentication.
 * Redirects unauthenticated users to /auth and authenticated users
 * away from /auth to /dashboard.
 */
export function RouteGuard({ path, children }) {
  const { user, loading } = useAuth();
  const rawPath = path || '/';
  const cleanPath = rawPath.split('?')[0].split('#')[0];

  useEffect(() => {
    if (!loading && !user && cleanPath !== '/' && cleanPath !== '/auth') {
      navigate('/auth');
    }
    if (!loading && user && cleanPath === '/auth') {
      navigate('/dashboard');
    }
  }, [user, loading, cleanPath]);

  if (loading) {
    return (
      <div
        className="auth-shell auth-shell--single"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#090d16',
        }}
      >
        <div style={{ textAlign: 'center', color: '#6366f1' }}>
          <div
            className="spinner"
            style={{
              border: '4px solid rgba(255,255,255,0.1)',
              borderTop: '4px solid #6366f1',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Verifying your secure session...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const isPublic = cleanPath === '/' || cleanPath === '/auth';
  if (!user && !isPublic) return null;

  return children;
}

