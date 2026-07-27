import { createContext, useContext, useState, useCallback } from 'react';
import { loginApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [fullName, setFullName] = useState(localStorage.getItem('fullName'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  const login = useCallback(async (emailVal, password) => {
    const res = await loginApi(emailVal, password);
    const { token: t, role: r, fullName: f, email: e } = res.data;
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    localStorage.setItem('fullName', f);
    localStorage.setItem('email', e);
    setToken(t);
    setRole(r);
    setFullName(f);
    setEmail(e);
    return r;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    setToken(null);
    setRole(null);
    setFullName(null);
    setEmail(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, fullName, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
