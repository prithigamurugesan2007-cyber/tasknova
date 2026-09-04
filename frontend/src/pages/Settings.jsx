import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [notifications, setNotifications] = useState(!!user?.notifications_enabled);
  const [message, setMessage] = useState('');

  async function toggleNotifications() {
    const next = !notifications;
    setNotifications(next);
    try {
      await api.updateSettings({ notifications_enabled: next });
      setUser({ ...user, notifications_enabled: next });
      setMessage(next ? 'Notifications turned ON.' : 'Notifications turned OFF.');
      setTimeout(() => setMessage(''), 2500);
    } catch {
      setNotifications(!next); // revert on failure
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Settings" />

        {message && <div className="error-box" style={{ background: '#dcfce7', color: '#166534' }}>{message}</div>}

        <div className="card">
          <h3>Notifications</h3>
          <div className="toggle-row">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Task notifications</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Reminders for due dates and task updates.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifications} onChange={toggleNotifications} />
              <span className="slider"></span>
            </label>
          </div>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
            Notifications are currently <strong>{notifications ? 'ON' : 'OFF'}</strong>.
          </p>
        </div>

        <div className="card">
          <h3>Account</h3>
          <p style={{ color: '#6b7280', fontSize: 13 }}>
            Signed in as <strong>{user?.email}</strong> via {user?.provider === 'local' ? 'email/password' : user?.provider}.
          </p>
        </div>
      </div>
    </div>
  );
}
