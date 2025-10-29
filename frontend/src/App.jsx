import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
// --- FIX: Removed .jsx extensions ---
import { UserProvider, useUser } from "./context/UserContext";

// --- Page Imports (FIX: Removed .jsx extensions) ---
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage"; // --- Import the real Employees Page ---
import DashboardLayout from "./components/DashboardLayout";

// --- Placeholders for routes that match your current sidebar ---
const RecruitmentPage = () => (
  <div className="p-6">
    <h2>Recruitment</h2>
    <p>Content for Recruitment will go here.</p>
  </div>
);
const PayrollPage = () => (
  <div className="p-6">
    <h2>Payroll Management</h2>
    <p>Content for Payroll will go here.</p>
  </div>
);
const SettingsPage = () => (
  <div className="p-6">
    <h2>Settings</h2>
    <p>Content for Settings will go here.</p>
  </div>
);
// Removed unused placeholders like Attendance, Performance, Support for now

// --- This component handles the protected routes ---
const ProtectedRoutes = () => {
  const { user } = useUser(); // Get user from context

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" />;
  }

  // If user exists, render the DashboardLayout which contains the Outlet
  // The Outlet will render the specific child route (DashboardPage, EmployeesPage, etc.)
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoutes />}>
            {/* Default route inside protected area redirects to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            {/* Specific Protected Routes */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="recruitment" element={<RecruitmentPage />} />
            <Route path="employees" element={<EmployeesPage />} />{" "}
            {/* --- Now uses the real page --- */}
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Optional: Add a catch-all inside protected routes if needed */}
            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
          </Route>

          {/* Catch-all for any other routes (e.g., if someone tries an invalid URL when logged out) */}
          {/* This is a simplified catch-all, assumes if not a protected route, redirect based on login status */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
