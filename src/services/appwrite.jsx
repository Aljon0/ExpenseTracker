import { Client, Account, Databases, ID, Query } from "appwrite";
/* eslint-disable no-unused-vars */
const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67f4746900356096afe5", // Replace with your Appwrite project ID
  databaseId: "67f4758d0000ea978040", // Replace with your database ID
  expensesCollectionId: "67f4759e0016db9e1a51", // Replace with your collection ID
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
    // Store session token in localStorage
    if (user) {
      localStorage.setItem("sessionActive", "true");
    }
    return user;
  } catch (error) {
    localStorage.removeItem("sessionActive");
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    if (error.code === 401) {
      // Session is invalid/expired
      return null;
    }
    console.error("Error getting current user:", error);
  }
};
const logout = async () => {
  try {
    // Delete all sessions (not just current)
    await account.deleteSessions();
    // Clear any local storage
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    // Even if there's an error, clear local storage
    localStorage.clear();
    return false;
  }
};

// Expense functions
const createExpense = async (data) => {
  try {
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
      // Clear any invalid session
      await account.deleteSession("current");
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
};

const updateExpense = async (documentId, data) => {
  try {
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

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Add this to handle authentication
const handleRequest = async () => {
  if (!localStorage.getItem("sessionActive")) {
    try {
      const user = await getCurrentUser();
      if (user) {
        localStorage.setItem("sessionActive", "true");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  }
};

// Call this before making database requests
const prepareRequest = async () => {
  await handleRequest();
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
