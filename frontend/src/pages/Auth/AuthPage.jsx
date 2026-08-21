import { useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { navigate } from '../../hooks/usePathname.js';
import { RouteLink } from '../../components/Common/RouteLink.jsx';
import { submitAuth } from '../../services/authService.js';

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim() || (!isLogin && !form.name.trim())) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const data = await submitAuth(form, isLogin);
      if (data.token && data.user) {
        login(data.token, data.user);
      }
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    login('demo_google_token_123', {
      id: 'usr_google_1',
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: '/images/avatar_alex.png',
    });
    navigate('/dashboard');
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-panel--form">
        <div className="auth-form">
          <div style={{ marginBottom: '12px' }}>
            <RouteLink path="/" className="ghost-button" style={{ fontSize: '0.82rem', padding: '4px 12px', minHeight: 'unset' }}>
              ← Back to Home
            </RouteLink>
          </div>

          <div className="auth-brand">
            <RouteLink path="/" className="brand__mark brand__mark--img" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
              <img src="/logo.png" alt="CareerPrep Logo" className="brand__logo-img" />
            </RouteLink>
            <div>
              <h1>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
              <p>
                {isLogin
                  ? 'Enter your details to access your career dashboard.'
                  : 'Start your journey toward professional excellence.'}
              </p>
            </div>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={isLogin ? 'auth-toggle__item auth-toggle__item--active' : 'auth-toggle__item'}
              onClick={() => setIsLogin(true)}
            >
              Log in
            </button>
            <button
              type="button"
              className={!isLogin ? 'auth-toggle__item auth-toggle__item--active' : 'auth-toggle__item'}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </div>

          <button type="button" className="oauth-button" onClick={handleGoogleAuth}>
            <Icon name="spark" />
            Continue with Google
          </button>


          <div className="divider">
            <span>or email</span>
          </div>

          <form className="auth-fields" onSubmit={handleSubmit} noValidate>
            {!isLogin ? (
              <input
                aria-label="Full name"
                placeholder="Full Name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            ) : null}
            <input
              aria-label="Email address"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              aria-label="Password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <button
              type="submit"
              className="primary-button primary-button--full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : isLogin ? 'Log in to your account' : 'Get started for free'}
            </button>
          </form>

          <p className="auth-footnote">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => setIsLogin((value) => !value)}>
              {isLogin ? 'Create one now' : 'Log in here'}
            </button>
          </p>
        </div>
      </section>

      <section className="auth-panel auth-panel--visual">
        <div className="auth-visual-card">
          <div className="pill pill--inverse">
            <Icon name="spark" />
            <span>AI-Powered Growth</span>
          </div>
          <h2>Master your career trajectory with precision.</h2>
          <p>
            Connect your profile and let our intelligence engine map the path from
            entry-level to leadership.
          </p>
          <div className="auth-visual-card__stats">
            <article>
              <span>Success Rate</span>
              <strong>94.8%</strong>
            </article>
            <article>
              <span>Paths Created</span>
              <strong>12.5k+</strong>
            </article>
          </div>
          <div className="bars">
            {[24, 44, 78, 51, 100, 74, 37, 60].map((height) => (
              <span key={height} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
