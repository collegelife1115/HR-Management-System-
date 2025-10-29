import React, { createContext, useState, useContext } from "react";

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the provider component
// This component will wrap our entire app and "provide" the user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    console.log("User logged in:", loggedInUser);
    // In a real app, you'd also store the token
  };

  const handleLogout = () => {
    setUser(null);
    console.log("User logged out");
    // Clear token here
  };

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Create a custom hook to easily access the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
