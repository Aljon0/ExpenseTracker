import React from "react";

const Login = ({ setIsLoggedIn }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-green-400">Expense</span>Tracker
          </h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md"
              type="submit"
            >
              Sign In
            </button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <span className="text-green-500 cursor-pointer">Sign Up</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
