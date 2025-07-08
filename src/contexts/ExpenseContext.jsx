import { createContext, useContext, useState } from 'react';
import { getExpenses } from '../services/api/expenseApi';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  // Dummy load
  useState(() => { getExpenses().then(setExpenses); }, []);
  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
} 