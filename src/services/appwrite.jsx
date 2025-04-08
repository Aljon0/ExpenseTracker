import { Client, Account, Databases, ID, Query } from "appwrite";

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
    await account.create(ID.unique(), email, password, name);

    // Create session (login)
    await login(email, password);
  } catch (error) {
    if (error.code === 409) {
      throw new Error("Email already exists. Please try logging in.");
    } else {
      throw new Error("An error occurred while creating the account.");
    }
  }
};

const login = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    if (error.code === 401) {
      throw new Error("Invalid email or password. Please try again.");
    } else if (error.code === 429) {
      throw new Error("Too many login attempts. Please try again later.");
    } else {
      throw error;
    }
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
    throw error;
  }
};
const logout = async () => {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    if (error.code === 401) {
      console.error("User is not logged in.");
      return;
    } else if (error.code === 429) {
      throw new Error("Too many logout attempts. Please try again later.");
    }
    console.error("Error logging out:", error);
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
