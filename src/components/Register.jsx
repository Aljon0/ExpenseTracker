import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";

const Register = ({ setShowLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { success, error } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.fullName || !formData.email || !formData.password) {
      error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      error("Password must be at least 6 characters");
      return;
    }

    // Simulated successful registration
    success("Registration successful! You can now log in.");
    setShowLogin(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <button
          className="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md"
          type="submit"
        >
          Register
        </button>
        <div className="text-center text-sm text-gray-500">
          Already have an account?
          <button
            onClick={() => setShowLogin(true)}
            className="text-green-500 hover:text-green-600 ml-1"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
