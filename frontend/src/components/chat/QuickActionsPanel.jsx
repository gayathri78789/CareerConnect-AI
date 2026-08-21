const QUICK_ACTIONS = [
  { id: 'resume', icon: '📄', label: 'Review Resume', prompt: 'Critique my resume using the Google X-Y-Z formula and suggest improvements.' },
  { id: 'ats', icon: '📊', label: 'Resume ATS Score', prompt: 'Calculate ATS match score for my resume against top tech job descriptions.' },
  { id: 'cert', icon: '🎓', label: 'Analyze Certificate', prompt: 'Analyze my attached certificate for skills validation and career impact.' },
  { id: 'interview', icon: '🎯', label: 'Interview Prep', prompt: 'Give me realistic mock interview questions and answers for my target role.' },
  { id: 'study', icon: '📅', label: 'Generate Study Plan', prompt: 'Create a structured 30-day technical learning and practice roadmap.' },
  { id: 'gaps', icon: '🔍', label: 'Find Skill Gaps', prompt: 'Identify my missing technical skill gaps based on current market demands.' },
  { id: 'linkedin', icon: '💼', label: 'Improve LinkedIn', prompt: 'How can I optimize my LinkedIn profile headline, summary, and projects?' },
  { id: 'behavioral', icon: '🗣️', label: 'Behavioral Questions', prompt: 'Give me top STAR behavioral interview questions and framework answers.' },
  { id: 'coding', icon: '💻', label: 'Coding Practice', prompt: 'Suggest key Data Structures and Algorithms problems to master.' },
  { id: 'aptitude', icon: '🧠', label: 'Aptitude Practice', prompt: 'Give me quantitative reasoning and problem-solving practice questions.' },
];

export function QuickActionsPanel({ onSelectAction, isCollapsed, onToggleCollapse }) {
  return (
    <aside className={`quick-actions-panel ${isCollapsed ? 'quick-actions-panel--collapsed' : ''}`}>
      <div className="quick-actions-panel__header">
        <div className="quick-actions-panel__title">
          <span>⚡ Quick AI Actions</span>
        </div>
        <button
          type="button"
          className="btn-toggle-quick-panel"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? '◀' : '▶'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="quick-actions-panel__grid">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="quick-action-card"
              onClick={() => onSelectAction(action.prompt)}
            >
              <span className="quick-action-card__icon">{action.icon}</span>
              <div className="quick-action-card__text">
                <strong className="quick-action-card__label">{action.label}</strong>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
