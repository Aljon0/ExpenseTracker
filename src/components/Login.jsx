import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { login, getCurrentUser } from "../services/appwrite";

const Login = ({ setIsLoggedIn, setShowLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { success, error } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!credentials.email || !credentials.password) {
      error("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      // Use Appwrite to login
      await login(credentials.email, credentials.password);

      // Get current user
      const user = await getCurrentUser();
      if (user) {
        success("Login successful!");
        // Set user to context or state management
        setIsLoggedIn(true);
      }
    } catch (err) {
      error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center mt-5"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
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
          className={`w-full py-2 px-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        <div className="text-center text-sm text-gray-500">
          Don't have an account?
          <button
            onClick={() => setShowLogin(false)}
            className="text-green-500 hover:text-green-600 ml-1  cursor-pointer"
            type="button"
            disabled={isLoading}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
