import axios from 'axios';

const API_BASE = 'https://ftbackend.onrender.com';
const token = () => localStorage.getItem('token');

export const getBudgets = async ({ year, month }) => {
  const res = await axios.get(`${API_BASE}/budgets?year=${year}&month=${month}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    }
  });
  return res.data;
};

export const setBudget = async ({ category, amount, year, month }) => {
  const res = await axios.post(`${API_BASE}/budgets`, {
    category,
    amount,
    year,
    month,
  }, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });
  return res.data;
};
