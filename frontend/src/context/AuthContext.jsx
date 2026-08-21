import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/authService.js';
import { navigate } from '../hooks/usePathname.js';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = async (token) => {
    try {
      const data = await fetchCurrentUser(token);
      setUser(data);
    } catch {
      localStorage.removeItem('careerprep_token');
      localStorage.removeItem('careerprep_userid');
      localStorage.removeItem('careerprep_username');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('careerprep_token');
    if (token) {
      restoreSession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('careerprep_token', token);
    localStorage.setItem('careerprep_userid', userData.id);
    localStorage.setItem('careerprep_username', userData.name);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('careerprep_token');
    localStorage.removeItem('careerprep_userid');
    localStorage.removeItem('careerprep_username');
    localStorage.removeItem('careerprep_role_resumes');
    setUser(null);
    navigate('/auth');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
    if (updatedUser.name) {
      localStorage.setItem('careerprep_username', updatedUser.name);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
