import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const data = await api.updateProfile({ name, bio, avatar });
      setUser(data.user);
      setMessage('Profile updated successfully.');
    } catch (err) { setError(err.message); }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwError(''); setPwMessage('');
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPwMessage('Password changed successfully.');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) { setPwError(err.message); }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Profile" />

        <div className="card">
          <h3>Account Information</h3>
          {message && <div className="error-box" style={{ background: '#dcfce7', color: '#166534' }}>{message}</div>}
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={saveProfile}>
            <div className="field"><label>Profile name</label>
              <input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="field"><label>Email</label>
              <input value={user?.email} disabled />
            </div>
            <div className="field"><label>Profile picture URL</label>
              <input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." />
            </div>
            <div className="field"><label>Bio</label>
              <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself" />
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '9px 18px' }}>Save Changes</button>
          </form>
        </div>

        {user?.provider === 'local' && (
          <div className="card">
            <h3>Change Password</h3>
            {pwMessage && <div className="error-box" style={{ background: '#dcfce7', color: '#166534' }}>{pwMessage}</div>}
            {pwError && <div className="error-box">{pwError}</div>}
            <form onSubmit={changePassword}>
              <div className="field"><label>Current password</label>
                <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="field"><label>New password</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '9px 18px' }}>Update Password</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
