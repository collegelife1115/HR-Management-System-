import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // Load initial user and token from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Save to localStorage on login
  const handleLogin = (loggedInUser, userToken) => {
    setUser(loggedInUser);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", userToken);
    console.log("User logged in and token stored.");
  };

  // Clear from localStorage on logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("User logged out and token cleared.");
  };

  return (
    <UserContext.Provider value={{ user, token, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
