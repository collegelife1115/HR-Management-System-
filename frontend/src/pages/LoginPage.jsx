import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // <-- FIX: Import useUser

const LoginPage = () => {
  // <-- FIX: Removed unused onLogin prop
  const { handleLogin: contextLogin } = useUser(); // <-- FIX: Get handleLogin from context

  const [selectedRole, setSelectedRole] = useState("hr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    // <-- Renamed to avoid confusion
    e.preventDefault();
    const userMap = {
      admin: { name: "Vishwas (Admin)", role: "admin" },
      hr: { name: "Shivani (HR)", role: "hr" },
      manager: { name: "Akhil (Manager)", role: "manager" },
      employee: { name: "Riya (Employee)", role: "employee" },
    };

    // --- FIX: Call the handleLogin function from the context ---
    contextLogin(userMap[selectedRole] || userMap.hr);

    // No navigation needed here, the router in App.jsx will handle it
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
            {" "}
            {/* <-- FIX: Use new submit handler */}
            {/* User ID field */}
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
                placeholder="User ID"
                required
              />
            </div>
            {/* Password field */}
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
            {/* Role Select and Forgot Password */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto sm:flex-1 sm:mr-4">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
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
