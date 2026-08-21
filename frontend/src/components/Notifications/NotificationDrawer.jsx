import { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications.js';
import { Icon } from '../Icon.jsx';

export function NotificationDrawer({ isOpen, onClose }) {
  const {
    items,
    loading,
    unreadCount,
    handleMarkRead,
    handleMarkAllRead,
    handleDeleteNotif,
    handleClearAll,
  } = useNotifications();

  const [activeCategory, setActiveCategory] = useState('All');

  // ESC key handler to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { label: 'All', key: 'All' },
    { label: 'Reminders', key: 'reminder' },
    { label: 'AI Coach', key: 'coach' },
    { label: 'Resume', key: 'resume' },
    { label: 'Milestones', key: 'milestone' },
    { label: 'System', key: 'system' },
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'All') return true;
    const cat = activeCategory.toLowerCase();
    const titleLower = (item.title || '').toLowerCase();
    const detailLower = (item.detail || '').toLowerCase();
    return titleLower.includes(cat) || detailLower.includes(cat);
  });

  return (
    <div
      className="notif-drawer-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Notification Center Drawer"
    >
      <div
        className="notif-drawer-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* DRAWER HEADER */}
        <div className="notif-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="notif-drawer-title">Notifications</h2>
            {unreadCount > 0 && (
              <span className="notif-badge-count">{unreadCount} unread</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-text-btn"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              className="notif-close-btn"
              onClick={onClose}
              aria-label="Close Notification Drawer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="notif-tabs-bar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`notif-tab-chip ${activeCategory === cat.key ? 'notif-tab-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* NOTIFICATION LIST */}
        <div className="notif-drawer-body">
          {loading ? (
            <div className="notif-loading-state">
              <div className="spinner-sm" />
              <p>Loading notifications...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="notif-empty-state">
              <div className="notif-empty-icon">
                <Icon name="bell" />
              </div>
              <h3>You're all caught up!</h3>
              <p>No new notifications match your selection.</p>
            </div>
          ) : (
            <div className="notif-list-stack">
              {filteredItems.map((item) => {
                const id = item._id || item.id;
                return (
                  <div
                    key={id || item.title}
                    className={`notif-item-card ${!item.read ? 'notif-item-card--unread' : ''}`}
                    onClick={() => !item.read && handleMarkRead(id)}
                  >
                    {!item.read && <span className="notif-unread-dot" />}

                    <div className={`notif-icon-box notif-icon-box--${item.accent || 'blue'}`}>
                      <Icon name={item.accent === 'mint' ? 'checkCircle' : item.accent === 'violet' ? 'spark' : 'bell'} />
                    </div>

                    <div className="notif-item-main">
                      <div className="notif-item-top">
                        <h4>{item.title}</h4>
                        <span className="notif-time">{item.time || 'Just now'}</span>
                      </div>
                      <p className="notif-detail">{item.detail}</p>
                    </div>

                    <div className="notif-actions-col">
                      <button
                        type="button"
                        className="notif-delete-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotif(id);
                        }}
                        title="Delete notification"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DRAWER FOOTER */}
        {items.length > 0 && (
          <div className="notif-drawer-footer">
            <button
              type="button"
              className="notif-clear-all-btn"
              onClick={handleClearAll}
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
