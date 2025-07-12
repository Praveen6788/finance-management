export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  allocated: number;
  spent: number;
}

export interface FinancialData {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoal: number;
  currentSavings: number;
}
