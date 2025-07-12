import { useState, useEffect } from 'react';
import { FinancialData, Transaction, Budget } from './types';

const STORAGE_KEY = 'vibe-finance-data';

const defaultData: FinancialData = {
  transactions: [],
  budgets: [
    { category: 'Food', allocated: 500, spent: 0 },
    { category: 'Transportation', allocated: 200, spent: 0 },
    { category: 'Entertainment', allocated: 150, spent: 0 },
    { category: 'Utilities', allocated: 300, spent: 0 },
  ],
  savingsGoal: 5000,
  currentSavings: 0,
};

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialData>(defaultData);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    }
  }, []);

  const saveData = (newData: FinancialData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const updatedData = {
      ...data,
      transactions: [...data.transactions, newTransaction],
    };

    // Update budget spending if it's an expense
    if (transaction.type === 'expense') {
      const budgetIndex = updatedData.budgets.findIndex(
        b => b.category === transaction.category
      );
      if (budgetIndex !== -1) {
        updatedData.budgets[budgetIndex].spent += transaction.amount;
      }
    }

    // Update current savings
    if (transaction.type === 'income') {
      updatedData.currentSavings += transaction.amount;
    } else {
      updatedData.currentSavings -= transaction.amount;
    }

    saveData(updatedData);
  };

  const deleteTransaction = (id: string) => {
    const transaction = data.transactions.find(t => t.id === id);
    if (!transaction) return;

    const updatedData = {
      ...data,
      transactions: data.transactions.filter(t => t.id !== id),
    };

    // Reverse budget spending if it's an expense
    if (transaction.type === 'expense') {
      const budgetIndex = updatedData.budgets.findIndex(
        b => b.category === transaction.category
      );
      if (budgetIndex !== -1) {
        updatedData.budgets[budgetIndex].spent -= transaction.amount;
      }
    }

    // Reverse savings update
    if (transaction.type === 'income') {
      updatedData.currentSavings -= transaction.amount;
    } else {
      updatedData.currentSavings += transaction.amount;
    }

    saveData(updatedData);
  };

  const updateBudget = (category: string, allocated: number) => {
    const updatedData = {
      ...data,
      budgets: data.budgets.map(budget =>
        budget.category === category
          ? { ...budget, allocated }
          : budget
      ),
    };
    saveData(updatedData);
  };

  const updateSavingsGoal = (goal: number) => {
    saveData({ ...data, savingsGoal: goal });
  };

  return {
    data,
    addTransaction,
    deleteTransaction,
    updateBudget,
    updateSavingsGoal,
  };
};
