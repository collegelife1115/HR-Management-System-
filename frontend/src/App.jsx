import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

// --- Page Imports ---
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import PayrollPage from "./pages/PayrollPage";
import PerformancePage from "./pages/PerformancePage";
import AttendancePage from "./pages/AttendancePage";
import AddEmployeePage from "./pages/AddEmployeePage";
import SupportPage from "./pages/SupportPage";
import MyTasksPage from "./pages/MyTasksPage";
import DashboardLayout from "./components/DashboardLayout";

// --- 1. IMPORT THE NEW PROFILE PAGE ---
import EmployeeProfilePage from "./pages/EmployeeProfilePage"; // <-- ADDED THIS

// --- (ProtectedRoutes and LoginRoute components are unchanged) ---
const ProtectedRoutes = () => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
const LoginRoute = () => {
  const { user } = useUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LoginPage />;
};

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginRoute />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/new" element={<AddEmployeePage />} />

            {/* --- 2. ADD THE NEW DYNAMIC ROUTE --- */}
            <Route path="employees/:id" element={<EmployeeProfilePage />} />

            <Route path="attendance" element={<AttendancePage />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="my-tasks" element={<MyTasksPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
