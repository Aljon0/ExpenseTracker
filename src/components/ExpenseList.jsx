import React, { useState, useMemo, useEffect } from "react";
import { useExpenses } from "../contexts/ExpenseContext";

const ExpenseList = ({ onEditExpense, openAddForm, searchTerm }) => {
  const { expenses, deleteExpense } = useExpenses();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(5);
      }
    };

    handleResize(); // Initial setting
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter expenses based on search term (title or category)
  const filteredExpenses = useMemo(() => {
    if (!searchTerm) return expenses;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        expense.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [expenses, searchTerm]);

  // Calculate pagination based on filtered expenses
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle delete with confirmation
  const handleDelete = (id) => {
    deleteExpense(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 md:p-6 border-b">
        <h3 className="text-base md:text-lg font-medium">Recent Expenses</h3>
        <button
          onClick={openAddForm}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md flex items-center text-sm md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentExpenses.map((expense) => (
              <tr key={expense.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {expense.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      expense.category === "Food"
                        ? "bg-green-100 text-green-800"
                        : expense.category === "Entertainment"
                        ? "bg-purple-100 text-purple-800"
                        : expense.category === "Utilities"
                        ? "bg-blue-100 text-blue-800"
                        : expense.category === "Travel"
                        ? "bg-yellow-100 text-yellow-800"
                        : expense.category === "Shopping"
                        ? "bg-pink-100 text-pink-800"
                        : expense.category === "Housing"
                        ? "bg-indigo-100 text-indigo-800"
                        : expense.category === "Healthcare"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(expense.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {currentExpenses.map((expense) => (
          <div key={expense.$id} className="p-4 border-b hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {expense.title}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      expense.category === "Food"
                        ? "bg-green-100 text-green-800"
                        : expense.category === "Entertainment"
                        ? "bg-purple-100 text-purple-800"
                        : expense.category === "Utilities"
                        ? "bg-blue-100 text-blue-800"
                        : expense.category === "Travel"
                        ? "bg-yellow-100 text-yellow-800"
                        : expense.category === "Shopping"
                        ? "bg-pink-100 text-pink-800"
                        : expense.category === "Housing"
                        ? "bg-indigo-100 text-indigo-800"
                        : expense.category === "Healthcare"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${expense.amount.toFixed(2)}
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="text-blue-600 hover:text-blue-900 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(expense.id)}
                    className="text-red-600 hover:text-red-900 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this expense?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No expenses found. Add your first expense to get started!
        </div>
      ) : (
        <div className="px-4 md:px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <div className="text-xs text-gray-500 mx-2 flex items-center">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, expenses.length)}
                </span>{" "}
                of <span className="font-medium">{expenses.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs md:text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers - show fewer on mobile */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((pageNumber) => {
                    if (totalPages <= 5) return true;
                    if (window.innerWidth < 640) {
                      return (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      );
                    }
                    return true;
                  })
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border text-xs md:text-sm ${
                        pageNumber === currentPage
                          ? "bg-green-50 border-green-500 text-green-600 z-10"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } font-medium`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs md:text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
