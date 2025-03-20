import React, { createContext, useState, useContext } from "react";

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Grocery Shopping",
      amount: 89.54,
      category: "Food",
      date: "2025-03-15",
    },
    {
      id: 2,
      title: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      date: "2025-03-10",
    },
    {
      id: 3,
      title: "Electricity Bill",
      amount: 124.35,
      category: "Utilities",
      date: "2025-03-05",
    },
    {
      id: 4,
      title: "Train Tickets",
      amount: 42.5,
      category: "Travel",
      date: "2025-03-12",
    },
    {
      id: 5,
      title: "Restaurant Dinner",
      amount: 78.25,
      category: "Food",
      date: "2025-03-14",
    },
  ]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: expenses.length + 1,
      amount: parseFloat(expense.amount),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === updatedExpense.id
          ? { ...updatedExpense, amount: parseFloat(updatedExpense.amount) }
          : expense
      )
    );
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Summary calculations
  const getTotalExpenses = () =>
    expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);

  const getCategoryTotals = () =>
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
    getCategoryTotals,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
