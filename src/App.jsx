import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Toast from "./components/Toast";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import { ToastProvider } from "./contexts/ToastContext";
import { getCurrentUser, logout } from "./services/appwrite";
/* eslint-disable no-unused-vars */

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Clear any invalid session
        try {
          await logout();
        } catch (logoutError) {
          console.error("Session cleanup failed:", logoutError);
        }
        setIsAuthenticated(false);
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
      setUser(null);
      setIsAuthenticated(false);
      // React Router will handle the navigation in the protected route
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
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

    return isAuthenticated ? children : <Navigate to="/" replace />;
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
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <div className="flex flex-col min-h-screen items-center justify-center p-4">
                      <div className="mb-6 text-center">
                        <div className="flex justify-center mb-2">
                          <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                            </svg>
                          </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                          <span className="text-green-500">Expense</span>Tracker
                        </h1>
                        <p className="text-gray-600 mt-1">
                          Manage your finances with ease
                        </p>
                      </div>
                      <div className="w-full max-w-md">
                        <Login setUser={setUser} />
                      </div>
                    </div>
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <div className="flex flex-col min-h-screen items-center justify-center p-4">
                      <div className="mb-6 text-center">
                        <div className="flex justify-center mb-2">
                          <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                            </svg>
                          </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                          <span className="text-green-500">Expense</span>Tracker
                        </h1>
                        <p className="text-gray-600 mt-1">
                          Manage your finances with ease
                        </p>
                      </div>
                      <div className="w-full max-w-md">
                        <Register setUser={setUser} />
                      </div>
                    </div>
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard user={user} onLogout={handleLogout} />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toast />
          </div>
        </Router>
      </ExpenseProvider>
    </ToastProvider>
  );
};

export default App;
