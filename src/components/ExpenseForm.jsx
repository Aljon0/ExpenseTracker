import React from "react";
import { useExpenses } from "../contexts/ExpenseContext";

const ExpenseForm = ({
  currentExpense,
  setCurrentExpense,
  isEditing,
  setIsAdding,
  setIsEditing,
}) => {
  const { addExpense, updateExpense } = useExpenses();

  // Available categories
  const categories = [
    "Food",
    "Entertainment",
    "Utilities",
    "Travel",
    "Shopping",
    "Housing",
    "Healthcare",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateExpense(currentExpense);
      setIsEditing(false);
    } else {
      addExpense(currentExpense);
    }
    setCurrentExpense({
      id: null,
      title: "",
      amount: "",
      category: "Food",
      date: "",
    });
    setIsAdding(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentExpense({ ...currentExpense, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? "Edit Expense" : "Add New Expense"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={currentExpense.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            name="amount"
            value={currentExpense.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={currentExpense.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={currentExpense.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="md:col-span-2 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setIsEditing(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md"
          >
            {isEditing ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
