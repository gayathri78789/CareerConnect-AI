import { Icon } from '../../components/Icon.jsx';
import { RouteLink } from '../../components/Common/RouteLink.jsx';

export default function NotFoundPage() {
  return (
    <div className="auth-shell auth-shell--single">
      <article className="card panel not-found">
        <Icon name="warning" />
        <h2>Page not found</h2>
        <p>The requested route is not in the current CareerPrep frontend set.</p>
        <div className="page-header__actions">
          <RouteLink path="/" className="ghost-button">Back to Landing</RouteLink>
          <RouteLink path="/dashboard" className="primary-button">Open Dashboard</RouteLink>
        </div>
      </article>
    </div>
  );
}
