import React from "react";
import { useExpenses } from "../contexts/ExpenseContext";

const ExpenseList = ({ setIsAdding, setIsEditing, setCurrentExpense }) => {
  const { expenses, deleteExpense } = useExpenses();

  const handleEdit = (expense) => {
    setIsEditing(true);
    setIsAdding(true);
    setCurrentExpense(expense);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b">
        <h3 className="text-lg font-medium">Recent Expenses</h3>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
          }}
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Expense
        </button>
      </div>

      <div className="overflow-x-auto">
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
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
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
                    onClick={() => handleEdit(expense)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(expense.id)}
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

      {expenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No expenses found. Add your first expense to get started!
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
