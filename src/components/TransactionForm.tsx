import { useState } from "react";
import { Transaction, Budget } from "../types";
import { PlusCircle, DollarSign } from "lucide-react";

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  budgets: Budget[];
}

const TransactionForm = ({ onAdd, budgets }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Other",
  ];
  const expenseCategories = budgets.map((b) => b.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    onAdd({
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    // Reset form
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });

    alert("Transaction added successfully!");
  };

  const categories =
    formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-card p-8 rounded-lg border border-dark-border">
        <div className="flex items-center space-x-3 mb-6">
          <PlusCircle className="w-6 h-6 text-neon-green" />
          <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type: "income", category: "" })
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === "income"
                    ? "border-neon-green bg-neon-green bg-opacity-10 text-neon-green"
                    : "border-dark-border bg-dark-bg text-gray-400 hover:border-gray-500"
                }`}
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                <span className="block font-medium">Income</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type: "expense", category: "" })
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === "expense"
                    ? "border-red-400 bg-red-400 bg-opacity-10 text-red-400"
                    : "border-dark-border bg-dark-bg text-gray-400 hover:border-gray-500"
                }`}
              >
                <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                <span className="block font-medium">Expense</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-green focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none"
              placeholder="Enter description..."
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-green focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Import missing icons
import { TrendingUp, TrendingDown } from "lucide-react";

export default TransactionForm;
