import { useState } from "react";
import { Budget } from "../types";
import { Target, DollarSign, Edit3 } from "lucide-react";

interface BudgetManagerProps {
  budgets: Budget[];
  onUpdateBudget: (category: string, allocated: number) => void;
  savingsGoal: number;
  onUpdateSavingsGoal: (goal: number) => void;
}

const BudgetManager = ({
  budgets,
  onUpdateBudget,
  savingsGoal,
  onUpdateSavingsGoal,
}: BudgetManagerProps) => {
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [editingSavings, setEditingSavings] = useState(false);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});

  const handleBudgetEdit = (category: string, currentAmount: number) => {
    setEditingBudget(category);
    setTempValues({ ...tempValues, [category]: currentAmount.toString() });
  };

  const handleBudgetSave = (category: string) => {
    const newAmount = parseFloat(tempValues[category] || "0");
    if (newAmount >= 0) {
      onUpdateBudget(category, newAmount);
    }
    setEditingBudget(null);
  };

  const handleSavingsEdit = () => {
    setEditingSavings(true);
    setTempValues({ ...tempValues, savings: savingsGoal.toString() });
  };

  const handleSavingsSave = () => {
    const newGoal = parseFloat(tempValues.savings || "0");
    if (newGoal >= 0) {
      onUpdateSavingsGoal(newGoal);
    }
    setEditingSavings(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Budget Management</h2>

      {/* Savings Goal */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Savings Goal</h3>
          </div>
          {!editingSavings && (
            <button
              onClick={handleSavingsEdit}
              className="text-neon-green hover:text-neon-blue transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {editingSavings ? (
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={tempValues.savings || ""}
                onChange={(e) =>
                  setTempValues({ ...tempValues, savings: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none"
                placeholder="Enter savings goal"
              />
            </div>
            <button
              onClick={handleSavingsSave}
              className="px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditingSavings(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-2xl font-bold text-neon-blue">
            ${savingsGoal.toFixed(2)}
          </div>
        )}
      </div>

      {/* Budget Categories */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <h3 className="text-lg font-semibold text-white mb-6">
          Budget Categories
        </h3>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            const isOverBudget = percentage > 100;
            const isEditing = editingBudget === budget.category;

            return (
              <div
                key={budget.category}
                className="bg-dark-bg p-4 rounded-lg border border-dark-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{budget.category}</h4>
                  {!isEditing && (
                    <button
                      onClick={() =>
                        handleBudgetEdit(budget.category, budget.allocated)
                      }
                      className="text-neon-green hover:text-neon-blue transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={tempValues[budget.category] || ""}
                        onChange={(e) =>
                          setTempValues({
                            ...tempValues,
                            [budget.category]: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none"
                        placeholder="Budget amount"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBudgetSave(budget.category)}
                        className="px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-opacity-80 transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBudget(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Spent: ${budget.spent.toFixed(2)}
                      </span>
                      <span className="text-gray-400">
                        Budget: ${budget.allocated.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isOverBudget
                            ? "bg-red-500"
                            : percentage > 75
                            ? "bg-yellow-500"
                            : "bg-neon-green"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          isOverBudget ? "text-red-400" : "text-gray-300"
                        }`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>

                      {isOverBudget && (
                        <span className="text-xs text-red-400 bg-red-400 bg-opacity-10 px-2 py-1 rounded">
                          Over budget by $
                          {(budget.spent - budget.allocated).toFixed(2)}
                        </span>
                      )}

                      {percentage > 75 && !isOverBudget && (
                        <span className="text-xs text-yellow-400 bg-yellow-400 bg-opacity-10 px-2 py-1 rounded">
                          Almost at limit
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h4 className="text-gray-400 text-sm mb-2">Total Allocated</h4>
          <p className="text-2xl font-bold text-neon-green">
            ${budgets.reduce((sum, b) => sum + b.allocated, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h4 className="text-gray-400 text-sm mb-2">Total Spent</h4>
          <p className="text-2xl font-bold text-red-400">
            ${budgets.reduce((sum, b) => sum + b.spent, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h4 className="text-gray-400 text-sm mb-2">Remaining Budget</h4>
          <p
            className={`text-2xl font-bold ${
              budgets.reduce((sum, b) => sum + (b.allocated - b.spent), 0) >= 0
                ? "text-neon-blue"
                : "text-red-400"
            }`}
          >
            $
            {budgets
              .reduce((sum, b) => sum + (b.allocated - b.spent), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
