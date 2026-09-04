import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

// This page is where Google/Facebook redirect back to after a successful login.
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) { navigate('/login?error=oauth_failed'); return; }
    localStorage.setItem('tasknova_token', token);
    api.me()
      .then(data => { loginWithToken(token, data.user); navigate('/dashboard'); })
      .catch(() => navigate('/login?error=oauth_failed'));
  }, []);

  return <div style={{ padding: 40 }}>Signing you in...</div>;
}
