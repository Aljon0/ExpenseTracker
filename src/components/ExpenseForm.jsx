import React, { useState, useEffect } from "react";
import { useExpenses } from "../contexts/ExpenseContext";
import { useToast } from "../contexts/ToastContext";

const ExpenseForm = ({ expenseToEdit, setExpenseToEdit, onClose }) => {
  const initialFormState = {
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().substr(0, 10),
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const { addExpense, updateExpense, isLoading } = useExpenses();
  const { success } = useToast();

  // Update form when editing an expense
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        amount: expenseToEdit.amount.toString(),
        category: expenseToEdit.category,
        date: expenseToEdit.date,
        description: expenseToEdit.description || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [expenseToEdit]);

  const categories = [
    "Food",
    "Housing",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Personal",
    "Education",
    "Travel",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (expenseToEdit) {
        await updateExpense({
          id: expenseToEdit.id,
          ...formData,
          amount: parseFloat(formData.amount),
        });
        success("Expense updated successfully!");
        setExpenseToEdit(null);
      } else {
        await addExpense({
          ...formData,
          amount: parseFloat(formData.amount),
        });
        success("Expense added successfully!");
      }
      setFormData(initialFormState);
      onClose(); // Close the form after submission
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleClose = () => {
    setExpenseToEdit(null);
    setFormData(initialFormState);
    onClose(); // Close the form using the provided prop
  };

  // Prevent clicks within the form from closing the overlay
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Overlay container with backdrop blur
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex justify-center items-center z-50">
      {/* Close overlay when clicking outside the form */}
      <div
        className="w-full h-full flex justify-center items-center"
        onClick={handleClose}
      >
        {/* Form card with max width */}
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4"
          onClick={handleFormClick}
        >
          {/* Header with title and close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {expenseToEdit ? "Edit Expense" : "Add New Expense"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
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
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isLoading}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? expenseToEdit
                    ? "Updating..."
                    : "Adding..."
                  : expenseToEdit
                  ? "Update Expense"
                  : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
