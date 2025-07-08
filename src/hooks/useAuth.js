import { useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, getUser } from '../services/api/authApi';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, passkey) => {
    const res = await apiLogin(email, passkey);
    localStorage.setItem('token', res.token);
    setUser(res.user);
  };

  const signup = async (name, email, passkey) => {
    const res = await apiSignup(name, email, passkey);
    localStorage.setItem('token', res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  return { user, loading, login, signup, logout };
}
