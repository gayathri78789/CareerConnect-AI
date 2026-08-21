import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { navigate } from '../../hooks/usePathname.js';
import { useDashboard } from '../../hooks/useDashboard.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileTopBar } from '../../components/Layout/AppShell.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { NotificationDrawer } from '../../components/Notifications/NotificationDrawer.jsx';
import { DashboardFullSkeleton } from '../../components/Dashboard/DashboardSkeletons.jsx';
import {
  OnboardingHeaderBanner,
  OnboardingCardsGrid,
  EmptyRecentActivity,
  EmptyUpcomingInterview,
} from '../../components/Dashboard/OnboardingCards.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    dashboardData,
    loading: dashboardLoading,
    newGoalTitle,
    setNewGoalTitle,
    addingGoal,
    handleToggleGoal,
    handleAddGoalSubmit,
    handleDeleteGoal,
  } = useDashboard();

  const { unreadCount } = useNotifications();

  // State Management Audit: Independent state names
  const [notificationOpen, setNotificationOpen] = useState(false);

  const firstName = dashboardData?.greeting || (user?.name ? user.name.split(' ')[0] : 'User');
  const userInitial = firstName.charAt(0).toUpperCase();

  const readinessScore = dashboardData?.careerReadiness ?? dashboardData?.readiness ?? 0;
  const resumeScoreVal = dashboardData?.resumeScore || 'Not Generated';
  const interviewRankVal = dashboardData?.interviewRank || '--';
  const codingXPVal = dashboardData?.codingXP !== undefined ? `${dashboardData.codingXP} XP` : '0 XP';

  const dailyGoalsList = dashboardData?.dailyGoals || dashboardData?.goals || [];
  const recentActivities = dashboardData?.recentActivity || [];
  const weeklyActivityData = dashboardData?.weeklyActivity || [
    { day: 'Mon', count: 0 }, { day: 'Tue', count: 0 }, { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 }, { day: 'Fri', count: 0 }, { day: 'Sat', count: 0 }, { day: 'Sun', count: 0 },
  ];

  const upcomingInterview = dashboardData?.upcomingInterview;

  // Onboarding mode flag: true if user has not completed any career prep activity yet
  const hasPrepActivity =
    (dashboardData?.codingXP || 0) > 0 ||
    readinessScore > 0 ||
    dailyGoalsList.length > 0 ||
    Boolean(upcomingInterview) ||
    (dashboardData?.resumeScore && dashboardData.resumeScore !== 'Not Generated') ||
    (dashboardData?.interviewRank && dashboardData.interviewRank !== '--');

  const onboardingMode = !dashboardData || !hasPrepActivity;

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />

      <main className="main-content--dashboard">
        {/* TOP HEADER BAR */}
        <div className="db-top-bar">
          <div>
            <h1 className="db-welcome-title">Hello, {firstName} 👋</h1>
            <p className="db-welcome-sub">
              Ready to land your dream role? Here's your prep summary.
            </p>
          </div>

          <div className="db-header-right">
            <button
              type="button"
              className="jd-icon-btn db-notif-bell-btn"
              aria-label="Open Notifications Drawer"
              onClick={() => setNotificationOpen(true)}
            >
              {unreadCount > 0 && (
                <span className="db-notif-unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
              <Icon name="bell" />
            </button>
            <div className="db-avatar-chip" title={firstName}>
              {(user?.avatar || user?.avatarUrl || dashboardData?.user?.avatar || dashboardData?.profile?.avatarUrl) ? (
                <img
                  src={user?.avatar || user?.avatarUrl || dashboardData?.user?.avatar || dashboardData?.profile?.avatarUrl}
                  alt={firstName}
                  className="db-avatar-chip-img"
                  onError={(e) => { e.currentTarget.src = '/images/alex_thompson.png'; }}
                />
              ) : (
                userInitial
              )}
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {dashboardLoading ? (
          <DashboardFullSkeleton />
        ) : (
          <>
            {/* ONBOARDING WELCOME BANNER FOR NEW USERS */}
            {onboardingMode && <OnboardingHeaderBanner />}

            {/* TOP 2-COLUMN GRID */}
            <div className="db-top-grid">
              {/* CAREER READINESS CARD */}
              <div className="db-readiness-card">
                <div className="db-card-label-row">
                  <span className="db-card-label">CAREER READINESS</span>
                  <div className="db-sparkle-icon">
                    <Icon name="spark" />
                  </div>
                </div>

                <div className="db-gauge-circle-lg">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#256cf0"
                      strokeWidth="3.2"
                      strokeDasharray={`${readinessScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="db-gauge-center">
                    <span className="db-gauge-val-num">{readinessScore}</span>
                    <span className="db-gauge-val-pct">%</span>
                  </div>
                </div>

                <div className="db-readiness-bottom">
                  <h3>
                    {readinessScore > 75
                      ? 'Outstanding Progress!'
                      : readinessScore > 40
                      ? 'Good Progress!'
                      : readinessScore > 0
                      ? 'Getting Started'
                      : 'Not Calculated Yet'}
                  </h3>
                  <p>
                    {interviewRankVal !== '--'
                      ? `You're in the ${interviewRankVal} of candidates`
                      : 'Complete your first practice drill to rank candidate readiness.'}
                  </p>
                </div>
              </div>

              {/* RIGHT STACK: STATS & ACTIVITY GRAPH */}
              <div className="db-right-stack">
                {/* 3 STAT CARDS ROW */}
                <div className="db-stats-3col">
                  <div
                    className="db-stat-card-box db-stat-card-box--active"
                    onClick={() => navigate('/resume')}
                  >
                    <span className="db-stat-sublabel">Resume Score</span>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span className="db-stat-main-val">
                        {resumeScoreVal.replace('/100', '').trim()}
                      </span>
                      <span className="db-stat-sub-text">
                        {resumeScoreVal.includes('/') ? '/100' : ''}
                      </span>
                    </div>
                  </div>

                  <div
                    className="db-stat-card-box"
                    onClick={() => navigate('/mock-interviews')}
                  >
                    <span className="db-stat-sublabel">Interview Rank</span>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span className="db-stat-main-val">{interviewRankVal}</span>
                    </div>
                  </div>

                  <div
                    className="db-stat-card-box"
                    onClick={() => navigate('/practice')}
                  >
                    <span className="db-stat-sublabel">Coding XP</span>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span className="db-stat-main-val">{codingXPVal}</span>
                    </div>
                  </div>
                </div>

                {/* WEEKLY ACTIVITY GRAPH */}
                <div className="db-activity-card">
                  <div className="db-activity-header">
                    <span className="db-card-label">WEEKLY ACTIVITY</span>
                    <select className="db-filter-select">
                      <option>Last 7 Days</option>
                    </select>
                  </div>

                  <div
                    className="db-wave-chart-box"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '8px',
                      padding: '12px 16px',
                      height: '90px',
                    }}
                  >
                    {weeklyActivityData.map((d, idx) => {
                      const maxCount = Math.max(
                        ...weeklyActivityData.map((w) => w.count || 0),
                        5
                      );
                      const barHeight = Math.max(
                        12,
                        Math.round(((d.count || 0) / maxCount) * 60)
                      );
                      return (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span style={{ fontSize: '10px', color: '#64748b' }}>
                            {d.count || 0}
                          </span>
                          <div
                            style={{
                              width: '100%',
                              height: `${barHeight}px`,
                              background:
                                d.count > 0
                                  ? 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
                                  : 'rgba(148, 163, 184, 0.2)',
                              borderRadius: '4px',
                              transition: 'height 0.3s ease',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="db-chart-labels-row">
                    {weeklyActivityData.map((d, idx) => (
                      <span key={idx}>{d.day}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ONBOARDING ACTION CARDS FOR NEW USERS */}
            {onboardingMode && <OnboardingCardsGrid />}

            {/* LOWER GRID (2 COLUMNS) */}
            <div className="db-lower-grid">
              {/* LEFT COLUMN: INTERVIEW BANNER + DAILY GOALS */}
              <div className="db-lower-left-stack">
                {/* UPCOMING INTERVIEW BANNER CARD */}
                {upcomingInterview ? (
                  <div className="db-banner-interview-card">
                    <svg className="db-banner-watermark" viewBox="0 0 100 100">
                      <rect
                        x="10"
                        y="20"
                        width="80"
                        height="70"
                        rx="10"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="4"
                      />
                      <line x1="10" y1="40" x2="90" y2="40" stroke="#ffffff" strokeWidth="4" />
                      <circle cx="30" cy="15" r="5" fill="#ffffff" />
                      <circle cx="70" cy="15" r="5" fill="#ffffff" />
                    </svg>

                    <div className="db-banner-top-row">
                      <div className="db-camera-badge">
                        <Icon name="video" />
                      </div>
                      <div className="db-banner-info">
                        <h3>Upcoming Interview</h3>
                        <p>
                          {upcomingInterview.targetCompany || 'Target Company'} |{' '}
                          {upcomingInterview.role || upcomingInterview.title || 'Product Role'}
                        </p>
                      </div>
                    </div>

                    <div className="db-banner-bottom-row">
                      <div className="db-days-left-counter">
                        <strong>02</strong>
                        <span>DAYS LEFT</span>
                      </div>
                      <button
                        type="button"
                        className="btn-prepare-now"
                        onClick={() => navigate('/mock-interviews')}
                      >
                        Prepare Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <EmptyUpcomingInterview />
                )}

                {/* DAILY GOALS CARD */}
                <div className="db-goals-card-box">
                  <div
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <span className="db-card-label">DAILY GOALS</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {dailyGoalsList.filter((g) => g.done).length} / {dailyGoalsList.length} Complete
                    </span>
                  </div>

                  <form
                    onSubmit={handleAddGoalSubmit}
                    style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}
                  >
                    <input
                      type="text"
                      placeholder="Add a new daily goal..."
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={addingGoal || !newGoalTitle.trim()}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#256cf0',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        opacity: addingGoal || !newGoalTitle.trim() ? 0.6 : 1,
                      }}
                    >
                      {addingGoal ? 'Adding...' : '+ Add'}
                    </button>
                  </form>

                  <div className="db-goals-list">
                    {dailyGoalsList.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '12px 0' }}>
                        No daily goals set yet. Add your first goal above!
                      </p>
                    ) : (
                      dailyGoalsList.map((goal) => {
                        const goalId = goal._id || goal.id;
                        return (
                          <div
                            key={goalId}
                            className="db-goal-item-card"
                            onClick={() => handleToggleGoal(goalId, goal.done)}
                          >
                            <div className="db-goal-left">
                              <div
                                className={
                                  goal.done
                                    ? 'db-checkbox-square db-checkbox-square--checked'
                                    : 'db-checkbox-square'
                                }
                              >
                                {goal.done && '✓'}
                              </div>
                              <span className={goal.done ? 'text-strike' : ''}>{goal.title}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={goal.done ? 'badge-goal-complete' : 'badge-goal-blue'}>
                                {goal.done ? 'Complete' : 'Pending'}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteGoal(goalId, e)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                }}
                                title="Delete Goal"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: RECENT ACTIVITY TIMELINE */}
              <div className="db-recent-card-box">
                <span className="db-card-label">RECENT ACTIVITY</span>

                <div className="db-recent-list">
                  {recentActivities.length === 0 ? (
                    <EmptyRecentActivity />
                  ) : (
                    recentActivities.slice(0, 5).map((act, i) => (
                      <div key={act.id || act._id || i} className="db-recent-item">
                        <div className="db-recent-icon-circle">
                          <Icon
                            name={
                              act.tone === 'mint'
                                ? 'checkCircle'
                                : act.tone === 'violet'
                                ? 'spark'
                                : 'refresh'
                            }
                          />
                        </div>
                        <div className="db-recent-info">
                          <strong>{act.title}</strong>
                          <p>{act.desc}</p>
                          <span>{act.time || 'Recently'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  className="db-view-history-btn"
                  onClick={() => navigate('/dashboard/activity')}
                >
                  View Full Activity Log →
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <MobileNav />

      {/* DEDICATED NOTIFICATION DRAWER */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
}
