/* eslint-disable no-unused-vars */
import { Client, Account, Databases, ID, Query } from "appwrite";

const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  expensesCollectionId: import.meta.env.VITE_APPWRITE_EXPENSES_COLLECTION_ID,
};

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize Appwrite services
const account = new Account(client);
const databases = new Databases(client);

// Auth functions
const createAccount = async (email, password, name) => {
  try {
    // Create account first
    await account.create(ID.unique(), email, password, name);

    // Return success without trying to login immediately
    return { success: true };
  } catch (error) {
    if (error.code === 409) {
      throw new Error("Email already exists. Please try logging in.");
    } else {
      throw error; // Let the error propagate with its original message
    }
  }
};

const login = async (email, password) => {
  try {
    const user = await account.createEmailPasswordSession(email, password);

    console.log("User logged in:", user.current);
    localStorage.setItem("sessionActive", "true");
    return user;
  } catch (error) {
    localStorage.removeItem("sessionActive");
    throw error;
  }
};

// Guest login function for demo access
const guestLogin = async () => {
  try {
    // Create anonymous session
    const session = await account.createAnonymousSession();
    
    // Set up guest user data
    const guestUser = {
      $id: session.userId,
      name: "Guest User",
      email: "guest@example.com",
      isGuest: true
    };
    
    console.log("Guest logged in:", guestUser);
    localStorage.setItem("sessionActive", "true");
    localStorage.setItem("isGuestUser", "true");
    
    // Initialize empty guest expenses array if not already present
    if (!localStorage.getItem("guestExpenses")) {
      // Initialize with sample expenses to help users understand the system
      const sampleExpenses = [
        {
          $id: "guest-expense-" + (Date.now() - 100),
          title: "Sample: Groceries",
          amount: 85.47,
          category: "Food",
          date: new Date().toISOString(),
          userId: session.userId,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("guestExpenses", JSON.stringify(sampleExpenses));
    }
    
    return guestUser;
  } catch (error) {
    localStorage.removeItem("sessionActive");
    localStorage.removeItem("isGuestUser");
    localStorage.removeItem("guestExpenses");
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const sessionActive = localStorage.getItem("sessionActive");
    if (!sessionActive) return null; // No active session
    
    // Check if this is a guest user
    if (localStorage.getItem("isGuestUser") === "true") {
      // Return the guest user information
      return {
        $id: "guest-user",
        name: "Guest User",
        email: "guest@example.com",
        isGuest: true
      };
    }
    
    const user = await account.get();
    if (user) {
      localStorage.setItem("sessionActive", "true");
    }
    return user;
  } catch (error) {
    localStorage.removeItem("sessionActive");
    localStorage.removeItem("isGuestUser");
    if (error.code === 401) {
      // Session is invalid/expired
      return null;
    }
    console.error("Error getting current user:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    // Check if this is a guest user
    const isGuest = localStorage.getItem("isGuestUser") === "true";
    
    if (!isGuest) {
      // Delete all sessions (not just current) for regular users
      await account.deleteSessions();
    }
    
    // Clear any local storage
    localStorage.removeItem("sessionActive");
    localStorage.removeItem("isGuestUser");
    localStorage.removeItem("session");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("guestExpenses"); // Clear guest expenses when logging out
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    // Even if there's an error, clear local storage
    localStorage.removeItem("sessionActive");
    localStorage.removeItem("isGuestUser");
    localStorage.removeItem("session");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("guestExpenses");
    throw error;
  }
};

// Expense functions
const createExpense = async (data) => {
  try {
    await prepareRequest();
    
    // For guest users, store expense in localStorage
    if (localStorage.getItem("isGuestUser") === "true") {
      // Get existing guest expenses or initialize with empty array
      const guestExpenses = JSON.parse(localStorage.getItem("guestExpenses") || "[]");
      
      // Create a new expense object with an ID
      const newExpense = {
        ...data,
        $id: "guest-expense-" + Date.now(), // Generate a unique ID
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString()
      };
      
      // Add the expense to the array
      guestExpenses.push(newExpense);
      
      // Save back to localStorage
      localStorage.setItem("guestExpenses", JSON.stringify(guestExpenses));
      
      return newExpense;
    }
    
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.expensesCollectionId,
      ID.unique(),
      data
    );
  } catch (error) {
    if (error.code === 409) {
      throw new Error("Expense already exists. Please try again.");
    } else if (error.code === 429) {
      throw new Error("Too many requests. Please try again later.");
    } else {
      throw error;
    }
  }
};

const getExpenses = async (userId) => {
  try {
    await prepareRequest();
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    // For guest users, return expenses from localStorage
    if (localStorage.getItem("isGuestUser") === "true") {
      // Get guest expenses from localStorage or initialize with an empty array
      const guestExpenses = JSON.parse(localStorage.getItem("guestExpenses") || "[]");
      
      return {
        documents: guestExpenses,
        total: guestExpenses.length
      };
    }
    
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.expensesCollectionId,
      [Query.equal("userId", userId)]
    );
  } catch (error) {
    if (error.code === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
};

const updateExpense = async (documentId, data) => {
  try {
    await prepareRequest();
    
    // For guest users, update the expense in localStorage
    if (localStorage.getItem("isGuestUser") === "true") {
      // Get existing guest expenses
      const guestExpenses = JSON.parse(localStorage.getItem("guestExpenses") || "[]");
      
      // Find the expense to update
      const expenseIndex = guestExpenses.findIndex(expense => expense.$id === documentId);
      
      if (expenseIndex === -1) {
        throw new Error("Expense not found. Please check the ID.");
      }
      
      // Update the expense
      const updatedExpense = {
        ...guestExpenses[expenseIndex],
        ...data,
        $id: documentId,
        $updatedAt: new Date().toISOString()
      };
      
      // Replace the old expense with the updated one
      guestExpenses[expenseIndex] = updatedExpense;
      
      // Save back to localStorage
      localStorage.setItem("guestExpenses", JSON.stringify(guestExpenses));
      
      return updatedExpense;
    }
    
    return await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.expensesCollectionId,
      documentId,
      data
    );
  } catch (error) {
    if (error.code === 404) {
      throw new Error("Expense not found. Please check the ID.");
    } else if (error.code === 429) {
      throw new Error("Too many requests. Please try again later.");
    } else {
      throw error;
    }
  }
};

const deleteExpense = async (documentId) => {
  try {
    await prepareRequest();
    
    // For guest users, delete the expense from localStorage
    if (localStorage.getItem("isGuestUser") === "true") {
      // Get existing guest expenses
      const guestExpenses = JSON.parse(localStorage.getItem("guestExpenses") || "[]");
      
      // Find the expense to delete
      const expenseIndex = guestExpenses.findIndex(expense => expense.$id === documentId);
      
      if (expenseIndex === -1) {
        throw new Error("Expense not found. Please check the ID.");
      }
      
      // Remove the expense from the array
      guestExpenses.splice(expenseIndex, 1);
      
      // Save back to localStorage
      localStorage.setItem("guestExpenses", JSON.stringify(guestExpenses));
      
      return { $id: documentId };
    }
    
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.expensesCollectionId,
      documentId
    );
  } catch (error) {
    if (error.code === 404) {
      throw new Error("Expense not found. Please check the ID.");
    } else if (error.code === 429) {
      throw new Error("Too many requests. Please try again later.");
    } else {
      throw error;
    }
  }
};

// Add this to handle authentication before making database requests
const prepareRequest = async () => {
  if (!localStorage.getItem("sessionActive")) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("No active session");
      }
    } catch (error) {
      throw new Error("Authentication required");
    }
  }
};

export {
  client,
  account,
  databases,
  createAccount,
  login,
  guestLogin,
  getCurrentUser,
  logout,
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};