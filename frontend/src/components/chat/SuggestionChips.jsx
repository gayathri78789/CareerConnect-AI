export function SuggestionChips({ suggestions = [], onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div className="chat-suggestions">
      <span className="chat-suggestions-title">💡 Suggested Next Actions</span>
      <div className="chat-suggestions-list">
        {suggestions.map((text, i) => (
          <button
            key={i}
            type="button"
            className="chat-suggestion-chip"
            onClick={() => onSelect(text)}
          >
            <span className="suggestion-chip-spark">⚡</span>
            <span>{text}</span>
            <span className="suggestion-chip-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
