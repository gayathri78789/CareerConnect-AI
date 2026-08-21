export function ReadinessCardSkeleton() {
  return (
    <div className="db-readiness-card db-skeleton-box">
      <div className="db-card-label-row">
        <div className="skeleton-line skeleton-line--short" />
      </div>
      <div className="db-gauge-circle-lg db-skeleton-circle" />
      <div className="db-readiness-bottom" style={{ width: '100%' }}>
        <div className="skeleton-line skeleton-line--mid" style={{ margin: '0 auto 8px' }} />
        <div className="skeleton-line skeleton-line--long" style={{ margin: '0 auto' }} />
      </div>
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="db-stats-3col">
      {[1, 2, 3].map((i) => (
        <div key={i} className="db-stat-card-box db-skeleton-box">
          <div className="skeleton-line skeleton-line--short" style={{ marginBottom: '12px' }} />
          <div className="skeleton-line skeleton-line--title" />
        </div>
      ))}
    </div>
  );
}

export function WeeklyChartSkeleton() {
  return (
    <div className="db-activity-card db-skeleton-box">
      <div className="db-activity-header">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--short" style={{ width: '60px' }} />
      </div>
      <div className="db-wave-chart-box" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '16px 0' }}>
        {[40, 65, 30, 80, 50, 20, 60].map((h, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton-bar" style={{ height: `${h}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InterviewBannerSkeleton() {
  return (
    <div className="db-banner-interview-card db-skeleton-box" style={{ background: 'var(--slate-800)' }}>
      <div className="db-banner-top-row">
        <div className="db-camera-badge db-skeleton-circle" />
        <div style={{ flex: 1 }}>
          <div className="skeleton-line skeleton-line--mid" style={{ marginBottom: '6px' }} />
          <div className="skeleton-line skeleton-line--long" />
        </div>
      </div>
    </div>
  );
}

export function GoalsCardSkeleton() {
  return (
    <div className="db-goals-card-box db-skeleton-box">
      <div className="skeleton-line skeleton-line--short" style={{ marginBottom: '16px' }} />
      <div className="db-goals-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="db-goal-item-card db-skeleton-box" style={{ minHeight: '44px' }}>
            <div className="skeleton-line skeleton-line--long" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="db-recent-card-box db-skeleton-box">
      <div className="skeleton-line skeleton-line--short" style={{ marginBottom: '16px' }} />
      <div className="db-recent-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="db-recent-item" style={{ padding: '12px 0' }}>
            <div className="db-recent-icon-circle db-skeleton-circle" />
            <div style={{ flex: 1 }}>
              <div className="skeleton-line skeleton-line--mid" style={{ marginBottom: '6px' }} />
              <div className="skeleton-line skeleton-line--long" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardFullSkeleton() {
  return (
    <div className="db-skeleton-wrapper">
      <div className="db-top-grid">
        <ReadinessCardSkeleton />
        <div className="db-right-stack">
          <StatCardsSkeleton />
          <WeeklyChartSkeleton />
        </div>
      </div>
      <div className="db-lower-grid">
        <div className="db-lower-left-stack">
          <InterviewBannerSkeleton />
          <GoalsCardSkeleton />
        </div>
        <RecentActivitySkeleton />
      </div>
    </div>
  );
}
