import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { api } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStats().then(setStats).catch(e => setError(e.message));
  }, []);

  const statusLabel = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Dashboard" />
        {error && <div className="error-box">{error}</div>}

        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="num">{stats.total}</div><div className="label">Total Tasks</div></div>
              <div className="stat-card"><div className="num">{stats.completed}</div><div className="label">🟢 Completed</div></div>
              <div className="stat-card"><div className="num">{stats.inProgress}</div><div className="label">🟡 In Progress</div></div>
              <div className="stat-card"><div className="num">{stats.pending}</div><div className="label">🔴 Pending</div></div>
            </div>

            <div className="card">
              <h3>Task Progress Overview</h3>
              {stats.total === 0 ? <p style={{ color: '#6b7280' }}>No tasks yet — add your first task to see progress here.</p> : (
                <div style={{ background: '#e5e7eb', borderRadius: 8, height: 14, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${(stats.completed/stats.total)*100}%`, background: '#16a34a' }} />
                  <div style={{ width: `${(stats.inProgress/stats.total)*100}%`, background: '#d97706' }} />
                  <div style={{ width: `${(stats.pending/stats.total)*100}%`, background: '#dc2626' }} />
                </div>
              )}
            </div>

            <div className="card">
              <h3>Upcoming Tasks</h3>
              {stats.upcoming.length === 0 ? <p style={{ color: '#6b7280' }}>Nothing due soon.</p> : (
                <table><tbody>
                  {stats.upcoming.map(t => (
                    <tr key={t.id}><td>{t.title}</td><td>{t.due_date}</td><td><span className={`badge ${t.status}`}>{statusLabel[t.status]}</span></td></tr>
                  ))}
                </tbody></table>
              )}
            </div>

            <div className="card">
              <h3>Recently Created</h3>
              {stats.recent.length === 0 ? <p style={{ color: '#6b7280' }}>No tasks created yet.</p> : (
                <table><tbody>
                  {stats.recent.map(t => (
                    <tr key={t.id}><td>{t.title}</td><td>{t.category}</td><td><span className={`badge ${t.priority}`}>{t.priority}</span></td></tr>
                  ))}
                </tbody></table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
