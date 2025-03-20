import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { ExpenseProvider } from "./contexts/ExpenseContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    name: "Alex Morgan",
    email: "alex@example.com",
  });

  return (
    <ExpenseProvider>
      {isLoggedIn ? (
        <Dashboard user={user} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </ExpenseProvider>
  );
};

export default App;
