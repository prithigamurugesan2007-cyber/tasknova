import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  function update(field, value) { setForm(f => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(form);
      loginWithToken(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🚀 TaskNova</div>
        <div className="auth-tagline">Create your free account</div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={e => update('password', e.target.value)} placeholder="At least 6 characters" />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input type="password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat password" />
          </div>
          <button className="btn-primary" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>

        <div className="auth-links" style={{ justifyContent: 'center', marginTop: 16 }}>
          <span>Already have an account?&nbsp;</span><Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
