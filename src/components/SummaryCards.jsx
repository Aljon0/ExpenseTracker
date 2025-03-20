import React from "react";
import { useExpenses } from "../contexts/ExpenseContext";

const SummaryCards = () => {
  const { getTotalExpenses, getCategoryTotals } = useExpenses();
  const totalExpenses = getTotalExpenses();
  const categoryTotals = getCategoryTotals();

  // Get current month
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Get top category
  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0] || ["None", 0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg shadow-md p-6 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Total Expenses</h3>
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">${totalExpenses}</p>
        <p className="text-sm opacity-80 mt-2">Month of {currentMonth}</p>
      </div>

      <div
        style={{ backgroundColor: "#8AA2A9" }}
        className="rounded-lg shadow-md p-6 text-white"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Top Category</h3>
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">{topCategory[0]}</p>
        <p className="text-sm opacity-80 mt-2">${topCategory[1].toFixed(2)}</p>
      </div>

      <div
        style={{ backgroundColor: "#717C89" }}
        className="rounded-lg shadow-md p-6 text-white"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Expenses</h3>
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">
          {Object.keys(categoryTotals).length}
        </p>
        <p className="text-sm opacity-80 mt-2">Month of {currentMonth}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
