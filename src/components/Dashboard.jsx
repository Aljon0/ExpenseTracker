import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SummaryCards from "./SummaryCards";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";

const Dashboard = ({ user, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close sidebar by default on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on window size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    // Close sidebar on mobile when logout is clicked
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle the actual logout
  const handleLogout = async () => {
    try {
      if (typeof onLogout === "function") {
        await onLogout();
      } else {
        console.error("onLogout is not a function");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-xs bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed on mobile, permanent on desktop */}
      <div
        className={`
        fixed md:relative z-30 md:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar
          user={user}
          onLogout={onLogout}
          onLogoutClick={handleLogoutClick}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full transition-all duration-300 ease-in-out relative">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md mr-3 text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          </div>
          <div className="relative max-w-md w-full ml-auto hidden sm:block">
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

        {/* Main Content Area */}
        <div className="p-4 md:p-6 lg:p-8 pt-4">
          {/* Search bar for small screens */}
          <div className="relative mb-4 sm:hidden">
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

        {/* Logout confirmation overlay within dashboard area */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <div
              className="fixed inset-0 bg-opacity-30 backdrop-blur-xs"
              onClick={() => setShowLogoutConfirm(false)}
            ></div>
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 md:mr-24 m-4 max-w-sm w-full text-gray-800 z-50 relative">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Sign Out</h3>
              </div>
              <p className="mb-6 text-sm md:text-base">
                Are you sure you want to sign out? Any unsaved changes will be
                lost.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-150 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowLogoutConfirm(false);
                  }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-150 text-sm md:text-base"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
