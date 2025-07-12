import { useState } from "react";
import { useFinancialData } from "./hooks";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import BudgetManager from "./components/BudgetManager";
import { Wallet, PlusCircle, BarChart3, Target } from "lucide-react";

type ActiveTab = "dashboard" | "transactions" | "add" | "budget";

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const financialData = useFinancialData();

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "transactions" as const, label: "Transactions", icon: Wallet },
    { id: "add" as const, label: "Add Transaction", icon: PlusCircle },
    { id: "budget" as const, label: "Budget", icon: Target },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard data={financialData.data} />;
      case "transactions":
        return (
          <TransactionList
            transactions={financialData.data.transactions}
            onDelete={financialData.deleteTransaction}
          />
        );
      case "add":
        return (
          <TransactionForm
            onAdd={financialData.addTransaction}
            budgets={financialData.data.budgets}
          />
        );
      case "budget":
        return (
          <BudgetManager
            budgets={financialData.data.budgets}
            onUpdateBudget={financialData.updateBudget}
            savingsGoal={financialData.data.savingsGoal}
            onUpdateSavingsGoal={financialData.updateSavingsGoal}
          />
        );
      default:
        return <Dashboard data={financialData.data} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg"></div>
              <h1 className="text-xl font-bold text-white">Vibe Finance</h1>
            </div>
            <div className="text-sm text-gray-400">Smart Money Management</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-neon-green text-neon-green"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
