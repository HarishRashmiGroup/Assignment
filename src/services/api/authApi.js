import axios from 'axios';

const API_BASE = 'https://ftbackend.onrender.com';

export const login = async (email, passkey) => {
  try {
    const res = await axios.post(`${API_BASE}/user/log-in`, { email, passkey });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const signup = async (name, email, passkey) => {
  try {
    const res = await axios.post(`${API_BASE}/user/sign-up`, { name, email, passkey });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Signup failed');
  }
};

export const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  try {
    const res = await axios.get(`${API_BASE}/user/basic`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch user');
  }
};
