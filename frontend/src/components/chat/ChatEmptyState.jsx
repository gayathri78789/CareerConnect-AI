const capabilities = [
  { icon: '📄', label: 'Resume Review', desc: 'Optimize your resume for ATS & Google X-Y-Z formula' },
  { icon: '🎯', label: 'Interview Preparation', desc: 'Mock interviews, coding & STAR behavioral framework' },
  { icon: '🗺️', label: 'Career Roadmap', desc: 'Personalized 30-day technical learning path' },
  { icon: '📊', label: 'Skill Gap Analysis', desc: 'Identify technical gaps against top tech roles' },
];

const starterPrompts = [
  { icon: '📄', label: 'Review my Resume', prompt: 'Review my resume and suggest improvements using the X-Y-Z formula for a software engineering role.' },
  { icon: '🎯', label: 'Prepare for Google Interview', prompt: 'Give me realistic Google software engineer interview questions and STAR framework answer guidelines.' },
  { icon: '⚡', label: 'Find Skill Gaps', prompt: 'Analyze my skills and identify missing technical gaps for a senior full stack developer role.' },
  { icon: '📅', label: 'Create Study Plan', prompt: 'Create a structured 30-day technical learning and practice roadmap for fullstack development.' },
  { icon: '💼', label: 'Improve LinkedIn Profile', prompt: 'How can I optimize my LinkedIn profile headline, summary, and projects for tech recruiter visibility?' },
  { icon: '🗣️', label: 'Practice HR Questions', prompt: 'Give me top behavioral and HR interview questions with sample answers.' },
];

export function ChatEmptyState({ onSendPrompt }) {
  return (
    <div className="chat-empty">
      <div className="chat-empty__hero">
        <div className="chat-empty__wave">✨</div>
        <h2 className="chat-empty__title">How can I assist your career today?</h2>
        <p className="chat-empty__subtitle">Select a prompt below or ask any question to start your coaching session</p>
      </div>

      <div className="chat-empty__capabilities">
        {capabilities.map((cap) => (
          <div
            key={cap.label}
            className="chat-empty__cap-card"
            onClick={() => onSendPrompt(`Help me with ${cap.label}: ${cap.desc}`)}
          >
            <span className="chat-empty__cap-icon">{cap.icon}</span>
            <div className="chat-empty__cap-text">
              <strong className="chat-empty__cap-label">{cap.label}</strong>
              <span className="chat-empty__cap-desc">{cap.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-empty__starters">
        <div className="chat-empty__starters-label">💡 Suggested Conversation Starters</div>
        <div className="chat-empty__starters-grid">
          {starterPrompts.map((s) => (
            <button
              key={s.label}
              type="button"
              className="chat-empty__starter-btn"
              onClick={() => onSendPrompt(s.prompt)}
            >
              <span className="starter-btn-icon">{s.icon}</span>
              <span className="starter-btn-label">{s.label}</span>
              <span className="starter-btn-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
