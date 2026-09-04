import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tasknova_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('tasknova_token'))
      .finally(() => setLoading(false));
  }, []);

  function loginWithToken(token, userData) {
    localStorage.setItem('tasknova_token', token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('tasknova_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
