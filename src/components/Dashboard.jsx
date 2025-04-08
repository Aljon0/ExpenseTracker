import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SummaryCards from "./SummaryCards";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import { useToast } from "../contexts/ToastContext";

const Dashboard = ({ user, setIsLoggedIn }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({
    id: null,
    title: "",
    amount: "",
    category: "Food",
    date: "",
  });
  const { success } = useToast();

  const handleLogout = () => {
    success("Logged out successfully");
    setIsLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search expenses..."
                className="border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute right-3 top-2.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <SummaryCards />

        {isAdding && (
          <ExpenseForm
            currentExpense={currentExpense}
            setCurrentExpense={setCurrentExpense}
            isEditing={isEditing}
            setIsAdding={setIsAdding}
            setIsEditing={setIsEditing}
          />
        )}

        <ExpenseList
          setIsAdding={setIsAdding}
          setIsEditing={setIsEditing}
          setCurrentExpense={setCurrentExpense}
        />
      </div>
    </div>
  );
};

export default Dashboard;
