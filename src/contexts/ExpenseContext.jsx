/* eslint-disable no-unused-vars*/
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense as updateAppwriteExpense,
  deleteExpense as deleteAppwriteExpense,
  getCurrentUser,
} from "../services/appwrite";
import { useToast } from "./ToastContext";

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { error } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await fetchExpenses(currentUser.$id);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchExpenses = async (userId) => {
    try {
      setIsLoading(true);
      const response = await getExpenses(userId);
      if (response && response.documents) {
        setExpenses(response.documents);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      error("Failed to load expenses");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // First useEffect to check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setIsAuthenticated(!!currentUser);
        setIsLoading(false);
      } catch (err) {
        console.error("Error checking authentication status:", err);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Second useEffect to fetch expenses only when authenticated
  useEffect(() => {
    const fetchExpenses = async () => {
      // Only fetch if user is authenticated
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        const response = await getExpenses(currentUser.$id);
        if (response && response.documents) {
          setExpenses(response.documents);
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
        error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [isAuthenticated, error]);

  // Rest of your code remains the same
  const addExpense = async (expense) => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const newExpense = {
        ...expense,
        amount: parseFloat(expense.amount),
        userId: currentUser.$id,
      };

      const response = await createExpense(newExpense);
      setExpenses([...expenses, response]);
      return response;
    } catch (err) {
      console.error("Error adding expense:", err);
      error("Failed to add expense");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (updatedExpense) => {
    try {
      setIsLoading(true);
      const expenseToUpdate = {
        ...updatedExpense,
        amount: parseFloat(updatedExpense.amount),
      };

      const response = await updateAppwriteExpense(
        updatedExpense.$id,
        expenseToUpdate
      );

      setExpenses(
        expenses.map((expense) =>
          expense.$id === response.$id ? response : expense
        )
      );
      return response;
    } catch (err) {
      console.error("Error updating expense:", err);
      error("Failed to update expense");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      setIsLoading(true);
      await deleteAppwriteExpense(id);
      setExpenses(expenses.filter((expense) => expense.$id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      error("Failed to delete expense");
      throw err;
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    user,
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
    getCategoryTotals,
    fetchExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
