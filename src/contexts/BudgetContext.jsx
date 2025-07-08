import { createContext, useContext, useState } from 'react';
import { getBudgets } from '../services/api/budgetApi';

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  // Dummy load
  useState(() => { getBudgets().then(setBudgets); }, []);
  return (
    <BudgetContext.Provider value={{ budgets, setBudgets }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  return useContext(BudgetContext);
} 