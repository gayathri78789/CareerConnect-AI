export function TypingIndicator() {
  return (
    <div className="chat-typing-indicator">
      <div className="chat-avatar chat-avatar--bot">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </div>
      <div className="chat-typing-bubble">
        <span className="chat-typing-text">Thinking</span>
        <div className="chat-typing-dots">
          <span className="chat-dot" />
          <span className="chat-dot" />
          <span className="chat-dot" />
        </div>
      </div>
    </div>
  );
}
