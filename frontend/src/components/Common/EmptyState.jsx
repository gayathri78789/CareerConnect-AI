import { Icon } from '../Icon.jsx';

/**
 * Reusable empty-state placeholder used across multiple pages.
 */
export function EmptyState({
  title = 'No data available',
  message = 'Complete actions to populate this section.',
  actionLabel,
  onAction,
  icon = 'bulb',
}) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>
        <Icon name={icon} />
      </div>
      <h4 style={{ color: '#f8fafc', margin: '4px 0', fontSize: '1.05rem', fontWeight: 600 }}>
        {title}
      </h4>
      <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#94a3b8' }}>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="primary-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
