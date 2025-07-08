import { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense, updateExpense, editExpense } from '../services/api/expenseApi';

export default function useExpenses({ year, month }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (year && month) {
      setLoading(true);
      getExpenses({ year, month })
        .then(data => setExpenses(data))
        .catch(err => console.error('Failed to load expenses:', err))
        .finally(() => setLoading(false));
    }
  }, [year, month]);

  const add = async (expense) => {
    const newExpense = await addExpense(expense);
    setExpenses(prev => [...prev, newExpense]);
  };

  const remove = async (id) => {
    await deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const update = async (id, expense) => {
    const newExpense = await editExpense(id, expense);
    setExpenses(prev =>
      prev.some(e => e.id === newExpense.id)
        ? prev.map(e => (e.id === newExpense.id ? newExpense : e))
        : [...prev, newExpense]
    );
  };
  return { expenses, loading, add, update, remove };
}
