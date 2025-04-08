import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiFileText,
  FiAlertCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = ({ user, onLogout, isOpen, onClose }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Extract user's display name or use email if name isn't available
  const displayName = user?.name || user?.email || "User";

  // Get first character for avatar
  const avatarInitial = displayName.charAt(0).toUpperCase();

  // Handle logout function
  const handleLogout = async () => {
    try {
      if (typeof onLogout === "function") {
        await onLogout();
      } else {
        console.error("onLogout is not a function");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      const mobileMenuButton = document.querySelector(".md\\:hidden");

      if (isOpen && sidebar && !sidebar.contains(event.target)) {
        if (!mobileMenuButton || !mobileMenuButton.contains(event.target)) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`sidebar fixed md:relative w-64 bg-gray-800 text-white h-full min-h-screen z-50 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">
            <span className="text-green-400">Expense</span>Tracker
          </h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center p-2 rounded bg-gray-700">
              <FiHome className="h-5 w-5 mr-3" />
              Dashboard
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-150">
              <FiFileText className="h-5 w-5 mr-3" />
              Transactions
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-150">
              <FiAlertCircle className="h-5 w-5 mr-3" />
              Reports
            </li>
            <li className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-150">
              <FiSettings className="h-5 w-5 mr-3" />
              Settings
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 p-4 w-full border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
                {avatarInitial}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium truncate max-w-[120px]">
                  {displayName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-full hover:bg-gray-700 transition duration-150"
              title="Sign Out"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Logout confirmation modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full text-gray-800">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Sign Out</h3>
              </div>
              <p className="mb-6">
                Are you sure you want to sign out? Any unsaved changes will be
                lost.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowLogoutConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-150"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
