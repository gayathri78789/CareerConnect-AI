import { useNotifications } from '../../hooks/useNotifications.js';
import { Icon } from '../../components/Icon.jsx';
import { AppShell } from '../../components/Layout/AppShell.jsx';
import { EmptyState } from '../../components/Common/EmptyState.jsx';

export default function NotificationsPage() {
  const { items, handleDeleteNotif, handleClearAll } = useNotifications();

  return (
    <AppShell
      title="Notifications"
      subtitle="A consolidated feed of reminders, AI suggestions, and progress milestones."
      actions={
        items.length ? (
          <button type="button" className="ghost-button" onClick={handleClearAll}>
            Clear all
          </button>
        ) : null
      }
    >
      {items.length === 0 ? (
        <section className="card panel" style={{ marginTop: '24px' }}>
          <EmptyState
            title="No notifications"
            message="You're all caught up! System updates and reminders will appear here."
            icon="bell"
          />
        </section>
      ) : (
        <section className="stack-section">
          {items.map((item) => (
            <article key={item.id || item.title} className="card panel notification-row">
              <div className={`feature-card__icon feature-card__icon--${item.accent || 'blue'}`}>
                <Icon name="bell" />
              </div>
              <div style={{ flex: 1 }}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{item.time}</span>
                {item.id ? (
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleDeleteNotif(item.id)}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}
