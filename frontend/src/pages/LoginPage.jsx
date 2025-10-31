import React, { useState } from "react";
import axios from "axios"; // Use standard axios just for the login page
import { useUser } from "../context/UserContext";

const API_URL = "http://localhost:5001/api/auth/login";

const LoginPage = () => {
  const { handleLogin } = useUser();

  // Use the admin user we created with curl
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Make the REAL API call
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      // 2. On success, save the user and token to context/localStorage
      // response.data contains { _id, name, email, role, token }
      handleLogin(response.data, response.data.token);

      // The router will now automatically redirect to the dashboard
    } catch (err) {
      // 3. On failure, show an error
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* --- Left Side (Logo) --- */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
        <img
          src="./assets/companyLogo.png"
          alt="HR Portal Logo"
          className="max-w-[300px] md:max-w-[400px]"
        />
      </div>

      {/* --- Right Side (Login Form) --- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Log in</h2>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Login Failed: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="User ID (Email)"
                required
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex justify-end items-center">
              <a
                href="#"
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
