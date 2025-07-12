import { FinancialData } from "../types";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Target, Wallet } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardProps {
  data: FinancialData;
}

const Dashboard = ({ data }: DashboardProps) => {
  const totalIncome = data.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const savingsProgress = (data.currentSavings / data.savingsGoal) * 100;

  // Expense by category chart data
  const expensesByCategory = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const doughnutData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          "rgba(0, 255, 136, 0.8)",
          "rgba(0, 204, 255, 0.8)",
          "rgba(204, 0, 255, 0.8)",
          "rgba(255, 136, 0, 0.8)",
          "rgba(255, 0, 136, 0.8)",
        ],
        borderColor: [
          "rgba(0, 255, 136, 1)",
          "rgba(0, 204, 255, 1)",
          "rgba(204, 0, 255, 1)",
          "rgba(255, 136, 0, 1)",
          "rgba(255, 0, 136, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Monthly income vs expenses chart
  const monthlyData = data.transactions.reduce((acc, t) => {
    const month = format(new Date(t.date), "MMM yyyy");
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (t.type === "income") {
      acc[month].income += t.amount;
    } else {
      acc[month].expenses += t.amount;
    }
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const barData = {
    labels: Object.keys(monthlyData).slice(-6), // Last 6 months
    datasets: [
      {
        label: "Income",
        data: Object.values(monthlyData)
          .slice(-6)
          .map((d) => d.income),
        backgroundColor: "rgba(0, 255, 136, 0.8)",
        borderColor: "rgba(0, 255, 136, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: Object.values(monthlyData)
          .slice(-6)
          .map((d) => d.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border card-gradient">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-neon-green">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-neon-green" />
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  netBalance >= 0 ? "text-neon-green" : "text-red-400"
                }`}
              >
                ${netBalance.toFixed(2)}
              </p>
            </div>
            <Wallet
              className={`w-8 h-8 ${
                netBalance >= 0 ? "text-neon-green" : "text-red-400"
              }`}
            />
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Savings Goal</p>
              <p className="text-2xl font-bold text-neon-blue">
                {savingsProgress.toFixed(1)}%
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                ></div>
              </div>
            </div>
            <Target className="w-8 h-8 text-neon-blue" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-4">
            Income vs Expenses
          </h3>
          <Bar data={barData} options={chartOptions} />
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-4">
            Expenses by Category
          </h3>
          {Object.keys(expensesByCategory).length > 0 ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <p className="text-gray-400 text-center py-8">
              No expense data to display
            </p>
          )}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <h3 className="text-lg font-semibold text-white mb-4">
          Budget Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.budgets.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div key={budget.category} className="bg-dark-bg p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {budget.category}
                  </span>
                  <span
                    className={`text-sm ${
                      isOverBudget ? "text-red-400" : "text-gray-400"
                    }`}
                  >
                    ${budget.spent.toFixed(2)} / ${budget.allocated.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget
                        ? "bg-red-500"
                        : percentage > 75
                        ? "bg-yellow-500"
                        : "bg-neon-green"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    isOverBudget ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {percentage.toFixed(1)}% used
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
