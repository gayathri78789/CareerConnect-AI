import { useAuth } from '../../context/AuthContext.jsx';
import { useRoadmap } from '../../hooks/useRoadmap.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileTopBar } from '../../components/Layout/AppShell.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { getInitials } from '../../utils/helpers.js';

/* ── Tone-to-color mapping ── */
const TONE_COLORS = {
  mint: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  blue: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  violet: { bg: '#f5f3ff', color: '#7c3aed', border: '#c4b5fd' },
  slate: { bg: '#f8fafc', color: '#475569', border: '#cbd5e1' },
  amber: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  rose: { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
};

/* ── Category icon mapping ── */
const RESOURCE_ICONS = { Course: '📚', Book: '📖', Platform: '💻', YouTube: '🎬', Documentation: '📄' };

/* ── Skeleton Loader Components ── */
function SkeletonCard() {
  return (
    <div className="rm-card-box rm-skeleton-card">
      <div className="rm-skeleton-line rm-skeleton-line--sm" />
      <div className="rm-skeleton-line rm-skeleton-line--lg" />
      <div className="rm-skeleton-line rm-skeleton-line--md" />
      <div className="rm-skeleton-line rm-skeleton-line--md" />
    </div>
  );
}

function SkeletonTimeline() {
  return (
    <div className="rm-timeline-wrap">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rm-timeline-node">
          <div className="rm-timeline-date-col"><div className="rm-skeleton-line rm-skeleton-line--sm" /></div>
          <div className="rm-marker-circle rm-skeleton-circle" />
          <div className="rm-card-content rm-skeleton-card" style={{ padding: '16px' }}>
            <div className="rm-skeleton-line rm-skeleton-line--md" />
            <div className="rm-skeleton-line rm-skeleton-line--lg" />
            <div className="rm-skeleton-line rm-skeleton-line--sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Toast Component ── */
function Toast({ type, message, onClose }) {
  if (!message) return null;
  return (
    <div className={`rm-toast rm-toast--${type}`}>
      <span className="rm-toast-icon">{type === 'success' ? '✓' : '⚠'}</span>
      <span className="rm-toast-text">{message}</span>
      <button className="rm-toast-close" onClick={onClose}>×</button>
    </div>
  );
}

/* ── Empty State Component ── */
function EmptyState() {
  return (
    <div className="rm-empty-state">
      <div className="rm-empty-icon">🗺️</div>
      <h3>No Roadmap Generated Yet</h3>
      <p>Enter your target role and company above, then click "Generate Roadmap with AI" to create your personalized career preparation plan.</p>
    </div>
  );
}

export default function RoadmapPage() {
  const { user } = useAuth();
  const {
    isGenerating,
    isLoading,
    targetRole,
    setTargetRole,
    targetCompany,
    setTargetCompany,
    roadmapData,
    milestones,
    completedCount,
    progressPercent,
    error,
    successMessage,
    handleAiGenerate,
    handleToggleMilestone,
  } = useRoadmap(user);

  const candidateName = user?.name || 'Candidate';
  const userInitials = getInitials(candidateName);

  const hasRoadmap = milestones.length > 0;
  const timeline = roadmapData?.timeline || [];
  const resources = roadmapData?.resources || [];
  const skillPriority = roadmapData?.skillPriority || [];
  const interviewStrategy = roadmapData?.interviewStrategy || [];
  const focusAreas = roadmapData?.focusAreas || [];
  const estimatedDuration = roadmapData?.estimatedDuration || '';
  const generatedAt = roadmapData?.generatedAt;

  /* Group resources by category */
  const groupedResources = resources.reduce((acc, r) => {
    const cat = r.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  /* Format generatedAt */
  const lastUpdated = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />

      <main className="main-content--roadmap">
        {/* TOASTS */}
        <Toast type="error" message={error} onClose={() => {}} />
        <Toast type="success" message={successMessage} onClose={() => {}} />

        {/* TOP HEADER BAR */}
        <div className="rm-top-bar">
          <div className="rm-header-left">
            <h1 className="rm-title">Career Roadmap</h1>
            <span className="rm-level-pill">Target: {targetRole || 'Not Set'}</span>
          </div>

          <div className="rm-header-right">
            <div className="rm-user-block">
              <div className="rm-user-text">
                <span className="rm-user-name">{candidateName}</span>
                <span className="rm-user-sub">{targetRole} @ {targetCompany}</span>
              </div>
              <div className="rm-avatar-chip">
                {(user?.avatar || user?.avatarUrl) ? (
                  <img
                    src={user.avatar || user.avatarUrl}
                    alt={candidateName}
                    onError={(e) => { e.currentTarget.src = '/images/alex_thompson.png'; }}
                  />
                ) : (
                  userInitials
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TOP INPUT & GENERATION BAR */}
        <div className="card panel rm-generation-bar">
          <div className="rm-gen-inputs">
            <div className="rm-gen-field">
              <label>Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                disabled={isGenerating}
              />
            </div>
            <div className="rm-gen-field">
              <label>Target Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google / Top Tech Firms"
                disabled={isGenerating}
              />
            </div>
            <button
              type="button"
              className="btn-ai-adjust rm-gen-btn"
              onClick={handleAiGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="rm-spinner" />
                  <span>Generating Roadmap...</span>
                </>
              ) : (
                <>
                  <Icon name="spark" />
                  <span>{hasRoadmap ? 'Regenerate Roadmap' : 'Generate Roadmap with AI'}</span>
                </>
              )}
            </button>
          </div>
          {isGenerating && (
            <div className="rm-gen-status">
              <span className="rm-gen-status-text">✨ Generating your personalized {targetRole} roadmap for {targetCompany}...</span>
            </div>
          )}
          {lastUpdated && !isGenerating && (
            <div className="rm-gen-meta">
              <span>Last generated: {lastUpdated}</span>
              {estimatedDuration && <span>• Est. duration: {estimatedDuration}</span>}
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {isLoading && !hasRoadmap ? (
          <div className="rm-top-3col" style={{ marginTop: '20px' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : isGenerating && !hasRoadmap ? (
          <>
            <div className="rm-top-3col" style={{ marginTop: '20px' }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonTimeline />
          </>
        ) : !hasRoadmap ? (
          <EmptyState />
        ) : (
          <>
            {/* ── TOP 3-COLUMN CARDS ── */}
            <div className="rm-top-3col">
              {/* CARD 1: OVERALL PROGRESS */}
              <div className="rm-card-box">
                <span className="rm-card-label">ROADMAP READINESS PROGRESS</span>
                <h2 className="rm-card-title-lg">{progressPercent}% Completed</h2>

                <div className="rm-progress-split">
                  <div className="rm-ring-small">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#e2e8f0" strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke={progressPercent === 100 ? '#059669' : '#256cf0'} strokeWidth="3.5"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="rm-ring-center-num">{progressPercent}%</span>
                  </div>

                  <div className="rm-progress-text-block">
                    <p><strong>{completedCount} of {milestones.length}</strong> Milestones Achieved</p>
                    <div className="rm-progress-bar-track">
                      <div className="rm-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    {progressPercent === 100 && (
                      <span className="rm-completion-badge">🏆 Roadmap Complete!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 2: STRATEGIC FOCUS AREAS */}
              <div className="rm-card-box">
                <div className="rm-goals-header">
                  <Icon name="roadmap" />
                  <span>Strategic Focus Areas</span>
                  <span className="rm-focus-count">{focusAreas.length}</span>
                </div>
                <div className="rm-focus-scroll">
                  {focusAreas.map((f) => (
                    <div key={f.id || f.title} className="rm-goal-item-btn" style={{ cursor: 'default' }}>
                      <div className="rm-goal-left">
                        <div className="rm-goal-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                          <Icon name="spark" />
                        </div>
                        <div className="rm-goal-info">
                          <strong>{f.title}</strong>
                          <span>{f.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: TARGET TIMELINE OVERVIEW */}
              <div className="rm-card-box">
                <span className="rm-card-label" style={{ textTransform: 'none', fontSize: '0.88rem', color: '#0f172a', fontWeight: 800 }}>
                  Timeline Overview
                </span>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '8px', marginBottom: '12px' }}>
                  {roadmapData?.bannerMeta || 'Generate a custom roadmap to see targeted readiness timelines.'}
                </p>
                {timeline.length > 0 && (
                  <div className="rm-timeline-mini">
                    {timeline.map((t, i) => (
                      <div key={t.id || i} className="rm-timeline-mini-item">
                        <div className="rm-timeline-mini-dot" />
                        <div className="rm-timeline-mini-content">
                          <strong>{t.phase}</strong>
                          <span>{t.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── SKILL PRIORITY CHIPS ── */}
            {skillPriority.length > 0 && (
              <div className="rm-section-block">
                <div className="rm-section-header">
                  <h3>🎯 Skill Priority Order</h3>
                  <span className="rm-section-subtitle">Focus on these skills in order of importance</span>
                </div>
                <div className="rm-skill-chips">
                  {skillPriority.map((skill, i) => (
                    <span key={skill} className="rm-skill-chip">
                      <span className="rm-skill-rank">#{i + 1}</span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── TIMELINE PHASES ── */}
            {timeline.length > 0 && (
              <div className="rm-section-block">
                <div className="rm-section-header">
                  <h3>📅 Preparation Timeline</h3>
                  <span className="rm-section-subtitle">{estimatedDuration ? `Estimated duration: ${estimatedDuration}` : 'Step-by-step preparation phases'}</span>
                </div>
                <div className="rm-phase-grid">
                  {timeline.map((phase, i) => {
                    const toneKeys = ['blue', 'violet', 'amber', 'rose', 'slate', 'mint'];
                    const tone = TONE_COLORS[toneKeys[i % toneKeys.length]];
                    return (
                      <div key={phase.id || i} className="rm-phase-card" style={{ borderColor: tone.border, background: tone.bg }}>
                        <div className="rm-phase-card-header">
                          <span className="rm-phase-badge" style={{ background: tone.color, color: '#fff' }}>{phase.phase}</span>
                        </div>
                        <h4 style={{ color: tone.color }}>{phase.title}</h4>
                        <p>{phase.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── MILESTONE CHECKLIST ── */}
            <div className="rm-journey-header-row">
              <div className="rm-journey-title-block">
                <h2>{roadmapData?.bannerSubtitle || `${targetRole} @ ${targetCompany}`}</h2>
                <p>Interactive Milestone Checklist — {completedCount}/{milestones.length} completed</p>
              </div>
            </div>

            <div className="rm-timeline-wrap">
              {milestones.map((m, index) => {
                const tone = TONE_COLORS[m.tone] || TONE_COLORS.slate;
                return (
                  <div key={m.id || index} className={`rm-timeline-node ${m.done ? 'rm-timeline-node--done' : ''}`}>
                    <div className="rm-timeline-date-col">
                      <span className="rm-date-text">{m.time || `Phase ${index + 1}`}</span>
                    </div>
                    <div
                      className={`rm-marker-circle ${m.done ? 'rm-marker-circle--completed' : 'rm-marker-circle--active'}`}
                      onClick={() => handleToggleMilestone(m.id, m.done)}
                      style={{ cursor: 'pointer', borderColor: tone.color }}
                    >
                      {m.done ? <Icon name="check" /> : <span>{index + 1}</span>}
                    </div>

                    <div className={`rm-card-content ${m.done ? 'rm-card-content--done' : 'rm-card-content--active'}`}>
                      <div className="rm-phase-top-row">
                        <h3 className="rm-phase-title">{m.title}</h3>
                        <span className={m.done ? 'rm-badge-completed' : 'rm-badge-active'} style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}>
                          {m.done ? '✓ COMPLETED (+100 XP)' : m.time || 'IN PROGRESS'}
                        </span>
                      </div>
                      <p className="rm-phase-desc">{m.desc}</p>
                      <button
                        type="button"
                        onClick={() => handleToggleMilestone(m.id, m.done)}
                        className={`rm-milestone-btn ${m.done ? 'rm-milestone-btn--done' : ''}`}
                      >
                        {m.done ? '↩ Mark Incomplete' : '✓ Mark Complete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── INTERVIEW STRATEGY ── */}
            {interviewStrategy.length > 0 && (
              <div className="rm-section-block">
                <div className="rm-section-header">
                  <h3>🎤 Interview Preparation Strategy</h3>
                  <span className="rm-section-subtitle">Tailored strategies for {targetCompany}</span>
                </div>
                <div className="rm-strategy-grid">
                  {interviewStrategy.map((s, i) => (
                    <div key={s.id || i} className="rm-strategy-card">
                      <div className="rm-strategy-num">{i + 1}</div>
                      <div className="rm-strategy-content">
                        <h4>{s.title}</h4>
                        <p>{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── RESOURCES ── */}
            {resources.length > 0 && (
              <div className="rm-section-block">
                <div className="rm-section-header">
                  <h3>📚 Learning Resources</h3>
                  <span className="rm-section-subtitle">{resources.length} recommended resources</span>
                </div>
                {Object.entries(groupedResources).map(([category, items]) => (
                  <div key={category} className="rm-resource-group">
                    <h4 className="rm-resource-category">
                      <span className="rm-resource-cat-icon">{RESOURCE_ICONS[category] || '📌'}</span>
                      {category}s
                      <span className="rm-resource-count">{items.length}</span>
                    </h4>
                    <div className="rm-resource-list">
                      {items.map((r, i) => (
                        <div key={r.id || i} className="rm-resource-item">
                          <div className="rm-resource-info">
                            <span className="rm-resource-title">{r.title}</span>
                            <span className={`rm-resource-type rm-resource-type--${r.resourceType || r.type || r.costType || 'free'}`}>{r.resourceType || r.type || r.costType || 'free'}</span>
                          </div>
                          {r.url && r.url !== 'N/A' && (
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="rm-resource-link">
                              Visit →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
