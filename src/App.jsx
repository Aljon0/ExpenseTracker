/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Toast from "./components/Toast";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import { ToastProvider } from "./contexts/ToastContext";
import { getCurrentUser, logout } from "./services/appwrite";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        // Clear any invalid session
        try {
          await logout();
        } catch (logoutError) {
          console.error("Session cleanup failed:", logoutError);
        }
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);
      // Force a full reload to reset all state
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <ExpenseProvider>
        <div className="min-h-screen bg-gray-100">
          {isLoggedIn ? (
            <Dashboard
              user={user}
              setIsLoggedIn={setIsLoggedIn}
              onLogout={handleLogout}
            />
          ) : (
            <div className="flex min-h-screen">
              <div className="w-64 bg-gray-800 hidden md:block">
                <div className="p-4">
                  <h1 className="text-2xl font-bold text-white">
                    <span className="text-green-400">Expense</span>Tracker
                  </h1>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                {showLogin ? (
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setShowLogin={setShowLogin}
                    setUser={setUser}
                  />
                ) : (
                  <Register
                    setShowLogin={setShowLogin}
                    setIsLoggedIn={setIsLoggedIn}
                    setUser={setUser}
                  />
                )}
              </div>
            </div>
          )}
          <Toast />
        </div>
      </ExpenseProvider>
    </ToastProvider>
  );
};

export default App;
