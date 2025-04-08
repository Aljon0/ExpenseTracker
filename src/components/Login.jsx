import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";

const Login = ({ setIsLoggedIn, setShowLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { success, error, warning } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation
    if (!credentials.email || !credentials.password) {
      error("Email and password are required");
      return;
    }

    // Demo credentials for easy testing
    if (
      credentials.email === "demo@example.com" &&
      credentials.password === "password"
    ) {
      success("Login successful!");
      setIsLoggedIn(true);
    } else {
      // For demo purposes, let's accept any non-empty credentials
      if (credentials.password.length < 6) {
        warning("Using a weak password");
      }
      success("Login successful!");
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Sign In
      </h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <button
              type="button"
              className="text-green-500 hover:text-green-600"
            >
              Forgot password?
            </button>
          </div>
        </div>
        <button
          className="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md"
          type="submit"
        >
          Sign In
        </button>
        <div className="text-center text-sm text-gray-500">
          Don't have an account?
          <button
            onClick={() => setShowLogin(false)}
            className="text-green-500 hover:text-green-600 ml-1"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
