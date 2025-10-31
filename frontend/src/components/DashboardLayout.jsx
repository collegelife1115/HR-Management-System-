import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Import all icons
import { IconDashboard } from "./icons/IconDashboard.jsx";
import { IconUserPlus } from "./icons/IconUserPlus.jsx";
import { IconClipboardList } from "./icons/IconClipboardList.jsx";
import { IconBriefcase } from "./icons/IconBriefcase.jsx";
import { IconCreditCard } from "./icons/IconCreditCard.jsx";
import { IconLifeBuoy } from "./icons/IconLifeBuoy.jsx";
import { IconLogOut } from "./icons/IconLogOut.jsx";
// --- NEW ICON FOR TASKS ---
import { IconCheckSquare } from "./icons/IconCheckSquare.jsx"; // We'll re-use this

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, handleLogout } = useUser();
  const location = useLocation();

  // --- Admin/HR Links ---
  const adminNavItems = [
    { name: "Dashboard", icon: IconDashboard, path: "/dashboard" },
    { name: "Employees", icon: IconUserPlus, path: "/employees" },
    { name: "Attendance", icon: IconClipboardList, path: "/attendance" },
    { name: "Payroll", icon: IconCreditCard, path: "/payroll" },
    { name: "Performance", icon: IconBriefcase, path: "/performance" },
  ];

  // --- FIX: UPDATED EMPLOYEE LINKS ---
  const employeeNavItems = [
    { name: "Dashboard", icon: IconDashboard, path: "/dashboard" },
    { name: "My Tasks", icon: IconCheckSquare, path: "/my-tasks" }, // <-- NEW LINK
  ];

  // Choose the correct links based on role
  let navItems;
  switch (user?.role) {
    case "admin":
    case "hr":
      navItems = adminNavItems;
      break;
    case "employee":
      navItems = employeeNavItems;
      break;
    default:
      navItems = [];
  }

  const bottomNavItems = [
    { name: "Support", icon: IconLifeBuoy, path: "/support" },
  ];

  // Function to get the page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/employees") return "Employees";
    if (path === "/employees/new") return "Add New Employee";
    if (path === "/dashboard") return "Dashboard";
    if (path === "/attendance") return "Attendance";
    if (path === "/payroll") return "Payroll";
    if (path === "/performance") return "Performance";
    if (path === "/support") return "Support";
    if (path === "/my-tasks") return "My Tasks"; // <-- NEW TITLE
    return "Dashboard";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- Sidebar --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out md:flex md:flex-col md:w-64 h-screen`}
      >
        <div className="flex items-center justify-center h-20 bg-white border-b border-gray-200">
          <img src="/Dash.png" alt="HR Portal" className="h-10" />
        </div>

        {/* Render the dynamic nav items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                  isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Nav (Support & Logout) */}
        <nav className="p-4 space-y-2 border-t border-gray-200">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                  isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <IconLogOut className="w-5 h-5 mr-3" />
            <span>Log out</span>
          </button>
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="flex items-center justify-between h-20 bg-white border-b border-gray-200 px-6 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden mr-4"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {location.pathname === "/employees" &&
              (user.role === "admin" || user.role === "hr") && (
                <Link
                  to="/employees/new"
                  className="hidden md:flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <IconUserPlus className="w-5 h-5 mr-2" />
                  Add Employee
                </Link>
              )}

            {/* Notification Bell */}
            <button className="relative text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <img
                className="h-9 w-9 rounded-full object-cover"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=eef2ff&color=4f46e5`}
                alt="User Avatar"
              />
              <span className="text-gray-700 font-medium hidden md:block">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
