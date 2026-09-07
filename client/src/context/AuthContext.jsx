import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Single admin account, no customer accounts — the login response already
// carries the full user payload, so it's stored as-is rather than re-fetched
// from a /me endpoint. A stale/expired token gets cleared by the response
// interceptor in services/api.js the next time an admin API call 401s.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('adminUser');
    return stored ? JSON.parse(stored) : null;
  });
  const loading = false;

  async function login(email, password) {
    const { data } = await api.post('/admin/login', { email, password });
    const { token, ...userData } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
