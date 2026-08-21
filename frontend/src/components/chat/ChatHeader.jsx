export function ChatHeader({
  userInitials,
  targetRole,
  targetCompany,
  onToggleSidebar,
  onToggleQuickActions,
  onClearChat,
}) {
  return (
    <div className="chat-header">
      <div className="chat-header__left">
        <button
          type="button"
          className="btn-mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          title="Toggle Conversations History"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="chat-header__icon">
          ✨
        </div>
        <div>
          <div className="chat-header__title-row">
            <h1 className="chat-header__title">CareerPrep AI Coach</h1>
          </div>
          <span className="chat-header__subtitle">AI Career Architect & Interview Mentor</span>
        </div>
      </div>

      <div className="chat-header__right">
        <button
          type="button"
          className="btn-header-quick-actions"
          onClick={onToggleQuickActions}
          title="Toggle Quick Actions Panel"
        >
          ⚡ Actions
        </button>

        <button
          type="button"
          className="chat-header__clear-btn"
          onClick={onClearChat}
          title="Clear active conversation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          <span className="hide-mobile">Clear</span>
        </button>
        <div className="chat-header__avatar">{userInitials}</div>
      </div>
    </div>
  );
}
