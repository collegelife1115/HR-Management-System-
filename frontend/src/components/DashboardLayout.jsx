import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// --- FIX: Added all icon imports with the correct .jsx extension ---
import { IconDashboard } from "./icons/IconDashboard.jsx";
import { IconUserPlus } from "./icons/IconUserPlus.jsx";
import { IconClipboardList } from "./icons/IconClipboardList.jsx";
import { IconBriefcase } from "./icons/IconBriefcase.jsx";
import { IconCreditCard } from "./icons/IconCreditCard.jsx";
import { IconLifeBuoy } from "./icons/IconLifeBuoy.jsx";
import { IconLogOut } from "./icons/IconLogOut.jsx";
// --- End of Fix ---

const DashboardLayout = ({ user, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: IconDashboard, path: "/dashboard" },
    { name: "Employees", icon: IconUserPlus, path: "/employees" },
    { name: "Attendance", icon: IconClipboardList, path: "/attendance" },
    { name: "Payroll", icon: IconCreditCard, path: "/payroll" },
    { name: "Performance", icon: IconBriefcase, path: "/performance" },
  ];

  const bottomNavItems = [
    { name: "Support", icon: IconLifeBuoy, path: "/support" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out md:flex md:flex-col md:w-64`}
      >
        <div className="flex items-center justify-center h-20 bg-white border-b border-gray-200">
          <img src="/hr_portal_logo.png" alt="HR Portal" className="h-10" />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"} // 'end' prop only for the root dashboard link
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200
                ${
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
        <nav className="p-4 space-y-2 border-t border-gray-200">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200
                ${
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
            onClick={onLogout}
            className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <IconLogOut className="w-5 h-5 mr-3" />
            <span>Log out</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between h-20 bg-white border-b border-gray-200 px-6 shadow-sm">
          {/* --- FIX: Added all the header code back in --- */}
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
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

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md mx-4 md:mx-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Right side of header (Notifications, User Menu) */}
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full p-2 transition-colors duration-200">
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
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-2">
              <img
                className="h-9 w-9 rounded-full object-cover"
                src={`https://ui-avatars.com/api/?name=${user.name.replace(
                  " ",
                  "+"
                )}&background=eef2ff&color=4f46e5`} // Auto-generate avatar
                alt="User Avatar"
              />
              <span className="text-gray-700 font-medium hidden md:block">
                {user.name}
              </span>
              <svg
                className="h-4 w-4 text-gray-500 hidden md:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {/* --- End of Fix --- */}
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}{" "}
          {/* This is where the routed page (e.g., DashboardPage) will render */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
