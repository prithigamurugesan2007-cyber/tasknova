import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Prototype only: wire this up to a real "send reset email" backend route when ready.
    setSent(true);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🚀 TaskNova</div>
        <div className="auth-tagline">Reset your password</div>

        {sent ? (
          <div className="error-box" style={{ background: '#dcfce7', color: '#166534' }}>
            If an account exists for {email}, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button className="btn-primary">Send reset link</button>
          </form>
        )}

        <div className="auth-links" style={{ justifyContent: 'center', marginTop: 16 }}>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
