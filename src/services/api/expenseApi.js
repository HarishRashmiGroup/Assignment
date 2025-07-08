import axios from 'axios';

const API_BASE = 'https://ftbackend.onrender.com';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getExpenses = async ({ year, month }) => {
  const res = await axios.get(`${API_BASE}/expenses?year=${year}&month=${month}`, {
    headers: authHeader(),
  });
  return res.data;
};

export const addExpense = async (expense) => {
  const res = await axios.post(`${API_BASE}/expenses`, expense, {
    headers: authHeader(),
  });
  return res.data;
};

export const editExpense = async (id, expense) => {
  const res = await axios.put(`${API_BASE}/expenses/edit/${id}`, expense, {
    headers: authHeader(),
  });
  return res.data;
};


export const deleteExpense = async (id) => {
  await axios.delete(`${API_BASE}/expenses/${id}`, {
    headers: authHeader(),
  });
};
