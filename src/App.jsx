/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Toast from "./components/Toast";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState({
    name: "Alex Morgan",
    email: "alex@example.com",
  });

  return (
    <ToastProvider>
      <ExpenseProvider>
        <div className="min-h-screen bg-gray-100">
          {isLoggedIn ? (
            <Dashboard user={user} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <div className="flex min-h-screen">
              <div className="w-64 bg-gray-800">
                <div className="p-4">
                  <h1 className="text-2xl font-bold text-white">
                    <span className="text-green-400">Expense</span>Tracker
                  </h1>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                {showLogin ? (
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setShowLogin={setShowLogin}
                  />
                ) : (
                  <Register setShowLogin={setShowLogin} />
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
