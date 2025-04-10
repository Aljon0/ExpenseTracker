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
    await account.createEmailPasswordSession(email, password);
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    localStorage.removeItem("sessionActive");
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const user = await account.get();
    if (user) {
      localStorage.setItem("sessionActive", "true");
    }
    return user;
  } catch (error) {
    localStorage.removeItem("sessionActive");
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
    // Delete all sessions (not just current)
    await account.deleteSessions();
    // Clear any local storage
    localStorage.removeItem("sessionActive");
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    // Even if there's an error, clear local storage
    localStorage.removeItem("sessionActive");
    throw error;
  }
};

// Expense functions
const createExpense = async (data) => {
  try {
    await prepareRequest();
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
  getCurrentUser,
  logout,
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
