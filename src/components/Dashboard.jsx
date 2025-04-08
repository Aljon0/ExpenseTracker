import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SummaryCards from "./SummaryCards";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import { FiMenu, FiX } from "react-icons/fi";

const Dashboard = ({ user, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openAddForm = () => {
    setExpenseToEdit(null);
    setShowForm(true);
  };

  const openEditForm = (expense) => {
    setExpenseToEdit(expense);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setExpenseToEdit(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <Sidebar
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <div className="w-full md:w-auto relative">
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={searchTerm}
              onChange={handleSearchChange}
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

        <SummaryCards />

        {/* Render the form as an overlay when showForm is true */}
        {showForm && (
          <ExpenseForm
            expenseToEdit={expenseToEdit}
            setExpenseToEdit={setExpenseToEdit}
            onClose={closeForm}
          />
        )}

        <ExpenseList
          onEditExpense={openEditForm}
          openAddForm={openAddForm}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default Dashboard;
