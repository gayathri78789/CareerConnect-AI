import { useState, useEffect } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { API_BASE_URL } from '../../services/api.js';

// ── Sub-components (Admin-only, not reused elsewhere) ────────────────────────

function StatCard({ stat }) {
  return (
    <article className="card stat-card">
      <div className="stat-card__head">
        <div className={`stat-icon stat-icon--${stat.tone}`}>
          <Icon name={stat.icon} />
        </div>
        <div className={`stat-change ${stat.trend === 'down' ? 'stat-change--down' : 'stat-change--up'}`}>
          <span>{stat.change}</span>
          {stat.trend !== 'neutral' ? <Icon name={stat.trend === 'down' ? 'trendDown' : 'trendUp'} /> : null}
        </div>
      </div>
      <p className="stat-card__label">{stat.title}</p>
      <h3>{stat.value}</h3>
      <div className="progress">
        <span className={`progress__fill progress__fill--${stat.tone}`} style={{ width: `${stat.progress}%` }} />
      </div>
    </article>
  );
}

function UserTable({ users }) {
  return (
    <section className="card panel panel--table">
      <div className="panel__header">
        <h3>Recent User Activity</h3>
        <label className="search">
          <Icon name="search" />
          <input type="text" placeholder="Search users..." />
        </label>
      </div>

      <div className="table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>
                  <div className="user-cell">
                    <div className={`avatar avatar--${user.accent}`}>{user.initials}</div>
                    <div>
                      <div className="user-cell__name">{user.name}</div>
                      <div className="user-cell__email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill status-pill--${user.statusTone}`}>
                    <span className="status-pill__dot" />
                    {user.status}
                  </span>
                </td>
                <td className={user.subscription !== 'Free' ? 'table-link' : ''}>{user.subscription}</td>
                <td>{user.activity}</td>
                <td>
                  <button type="button" className="icon-button" aria-label={`More actions for ${user.name}`}>
                    <Icon name="more" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel__footer">
        <span>Showing 3 of 42,892 users</span>
        <div className="panel__pager">
          <button type="button" className="pager-button" aria-label="Previous page">
            <Icon name="chevronLeft" />
          </button>
          <button type="button" className="pager-button" aria-label="Next page">
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ResourcePanel({ group }) {
  return (
    <section className="card panel">
      <div className="resource-panel__header">
        <h3>
          <span className={`resource-panel__icon resource-panel__icon--${group.tone}`}>
            <Icon name={group.icon} />
          </span>
          {group.title}
        </h3>
        <button type="button" className="text-button">{group.action}</button>
      </div>

      <div className="resource-panel__items">
        {group.items.map((item) => (
          <article key={item.title} className="resource-item">
            <div>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
            <button type="button" className="icon-button" aria-label={`Edit ${item.title}`}>
              <Icon name="edit" />
            </button>
          </article>
        ))}
      </div>

      <button type="button" className="dashed-button">{group.buttonLabel}</button>
    </section>
  );
}

function ReportsCard({ reports, topSkills }) {
  return (
    <section className="card panel reports-card">
      <div className="reports-card__mark">
        <Icon name="analytics" />
      </div>
      <h3>Reports</h3>

      <div className="reports-card__metrics">
        {reports.map((item) => (
          <div key={item.label}>
            <div className="reports-card__row">
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </div>
            <div className="progress progress--tall">
              <span className={`progress__fill progress__fill--${item.tone}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="reports-card__tags">
        <p>Top Skills In Demand</p>
        <div className="tag-list">
          {topSkills.map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemHealthCard({ systemHealth }) {
  return (
    <section className="system-card">
      <div className="system-card__title">
        <span className="system-card__pulse" />
        <p>System Health</p>
      </div>
      <div className="system-card__list">
        {systemHealth.map((item) => (
          <div key={item.label} className="system-card__row">
            <span>{item.label}</span>
            <strong className={item.accent ? `text-${item.accent}` : ''}>{item.value}</strong>
          </div>
        ))}
      </div>
      <button type="button" className="system-card__button">View Log Explorer</button>
    </section>
  );
}

function AdminCard() {
  return (
    <section className="admin-card">
      <div className="admin-card__avatar"><span>AA</span></div>
      <h3>Alex Admin</h3>
      <p>Super Admin Access</p>
      <button type="button">Terminate Session</button>
    </section>
  );
}

// ── Main AdminPage ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin`)
      .then((response) => response.json())
      .then((data) => setAdminData(data))
      .catch(() => setAdminData(null));
  }, []);

  if (!adminData) {
    return (
      <div className="app-shell">
        <MobileTopBar />
        <SidebarShell />
        <main className="main-content">
          <p className="text-muted">Loading admin data…</p>
        </main>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />
      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Operations Console</p>
            <h2>Intelligence Dashboard</h2>
            <p className="page-header__subtitle">Real-time system overview and performance metrics.</p>
          </div>
          <div className="page-header__actions">
            <button type="button" className="ghost-button">
              <Icon name="calendar" />Last 30 Days
            </button>
            <button type="button" className="primary-button">Download Report</button>
          </div>
        </header>

        <section className="stats-grid">
          {adminData.stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </section>

        <section className="content-grid">
          <div className="content-grid__main">
            <UserTable users={adminData.userActivity} />
            <div className="resource-grid">
              {adminData.resourceGroups.map((group) => (
                <ResourcePanel key={group.title} group={group} />
              ))}
            </div>
          </div>
          <aside className="content-grid__side">
            <ReportsCard reports={adminData.reports} topSkills={adminData.topSkills} />
            <SystemHealthCard systemHealth={adminData.systemHealth} />
            <AdminCard />
          </aside>
        </section>
      </main>
      <MobileNav />
    </div>
  );
}
