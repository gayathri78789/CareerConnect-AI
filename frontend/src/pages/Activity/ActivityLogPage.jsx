import { useState, useEffect, useCallback } from 'react';
import { AppShell } from '../../components/Layout/AppShell.jsx';
import { Icon } from '../../components/Icon.jsx';
import { getActivityLog } from '../../services/dashboardService.js';
import { navigate } from '../../hooks/usePathname.js';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const categories = [
    'All',
    'Resume Builder',
    'Mock Interviews',
    'JD Analyzer',
    'Coding Practice',
    'AI Coach',
    'Profile Updates',
  ];

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActivityLog({ search, category, page, limit: 10 });
      setActivities(data.activities || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.total || 0);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <AppShell
      title="Activity Log"
      subtitle="A complete audit history of all your career preparation actions and AI sessions."
      actions={
        <button
          type="button"
          className="ghost-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      }
    >
      <div className="activity-page-wrap" style={{ marginTop: '20px' }}>
        {/* SEARCH & FILTER HEADER */}
        <div className="activity-filter-bar">
          <div className="search activity-search">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Search activity log..."
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <button
                type="button"
                className="activity-clear-search"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="activity-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`activity-pill ${category === cat ? 'activity-pill--active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT STACK */}
        {loading ? (
          <div className="activity-loading-box">
            <div className="spinner-sm" />
            <p>Loading activity log...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="card panel activity-empty-panel">
            <div className="activity-empty-icon">
              <Icon name="refresh" />
            </div>
            <h3>No activities found</h3>
            <p>
              {search || category !== 'All'
                ? 'Try adjusting your search or category filter.'
                : 'You have not logged any activity yet. Start by exploring practice problems or building your resume!'}
            </p>
            {(search || category !== 'All') && (
              <button
                type="button"
                className="primary-button"
                style={{ marginTop: '12px' }}
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="card panel activity-table-card">
            <div className="activity-count-meta">
              Showing {activities.length} of {totalItems} total entries
            </div>

            <div className="activity-list">
              {activities.map((act, i) => (
                <div key={act.id || act._id || i} className="activity-row-item">
                  <div className={`activity-icon-badge activity-icon-badge--${act.tone || 'blue'}`}>
                    <Icon name={act.tone === 'mint' ? 'checkCircle' : act.tone === 'violet' ? 'spark' : 'analytics'} />
                  </div>

                  <div className="activity-row-main">
                    <div className="activity-row-title-line">
                      <strong>{act.title}</strong>
                      <span className="activity-category-tag">{act.category || 'General'}</span>
                    </div>
                    <p>{act.desc}</p>
                  </div>

                  <div className="activity-row-time">
                    {act.time || 'Recently'}
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="activity-pagination-bar">
                <button
                  type="button"
                  className="pager-button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="pager-button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
