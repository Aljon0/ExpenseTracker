import React from "react";

const Sidebar = ({ user, onLogoutClick }) => {
  // Extract user's display name or use email if name isn't available
  const displayName = user?.name || user?.email || "User";

  // Get first character for avatar
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="w-64 bg-gray-800 text-white h-full min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="text-green-400">Expense</span>Tracker
        </h1>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li className="flex items-center p-2 rounded bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm md:text-base">Dashboard</span>
          </li>
          <li className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm md:text-base">Transactions</span>
          </li>
          <li className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm md:text-base">Reports</span>
          </li>
          <li className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm md:text-base">Settings</span>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
              {avatarInitial}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium truncate max-w-[120px]">
                {displayName}
              </p>
            </div>
          </div>
          <button
            onClick={onLogoutClick}
            className="p-2 rounded-full hover:bg-gray-700 transition duration-150"
            title="Sign Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
