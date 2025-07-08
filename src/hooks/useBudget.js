import { useState, useEffect } from 'react';
import { getBudgets, setBudget } from '../services/api/budgetApi';

export default function useBudget({ year, month }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (year && month) {
      setLoading(true);
      getBudgets({ year, month }).then(data => {
        setBudgets(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [year, month]);

  const addOrUpdate = async (budget) => {
    const newBudget = await setBudget(budget);
    setBudgets(prev => {
      const idx = prev.findIndex(b => b.category === newBudget.category);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = newBudget;
        return updated;
      }
      return [...prev, newBudget];
    });
  };

  return { budgets, loading, addOrUpdate };
}
