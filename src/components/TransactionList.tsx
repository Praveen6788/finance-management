import { Transaction } from "../types";
import { format } from "date-fns";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="bg-dark-card p-8 rounded-lg border border-dark-border text-center">
        <div className="text-gray-400 mb-4">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg">No transactions yet</p>
          <p className="text-sm">Add your first transaction to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">
        Transaction History
      </h2>

      <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {sortedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-dark-bg transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-4 h-4 text-neon-green" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          transaction.type === "income"
                            ? "text-neon-green"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-dark-bg text-gray-300 rounded-full">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-neon-green"
                          : "text-red-400"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this transaction?"
                          )
                        ) {
                          onDelete(transaction.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
          <p className="text-gray-400 text-sm">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
          <p className="text-gray-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-neon-green">
            {
              transactions.filter((t) => {
                const transactionDate = new Date(t.date);
                const now = new Date();
                return (
                  transactionDate.getMonth() === now.getMonth() &&
                  transactionDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
        <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
          <p className="text-gray-400 text-sm">Recent Activity</p>
          <p className="text-2xl font-bold text-neon-blue">
            {
              transactions.filter((t) => {
                const transactionDate = new Date(t.date);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return transactionDate >= sevenDaysAgo;
              }).length
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
