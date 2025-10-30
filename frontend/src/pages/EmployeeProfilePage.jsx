import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useUser } from "../context/UserContext"; // <-- 1. Import useUser to check role

// --- 2. IMPORT THE NEW MODAL ---
import EditEmployeeModal from "../components/EditEmployeeModal.jsx";

// --- Icons for the page ---
const IconEdit = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconDollar = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconCalendar = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
// --- End Icons ---

const EmployeeProfilePage = () => {
  const { id } = useParams(); // Gets the employee ID from the URL
  const { user } = useUser(); // Get the logged-in user
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. ADD STATE TO CONTROL THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployee = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]); // Re-run if the ID in the URL changes

  // --- 4. FUNCTION TO UPDATE PAGE AFTER EDITING ---
  const handleEmployeeUpdated = (updatedEmployee) => {
    // Set the new employee data, so the page refreshes
    setEmployee(updatedEmployee);
    // We could also re-run fetchEmployee()
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return <div className="p-6">Loading employee profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!employee) {
    return <div className="p-6">Employee not found.</div>;
  }

  return (
    <>
      {/* --- 5. RENDER THE MODAL --- */}
      <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeId={employee._id}
        onEmployeeUpdated={handleEmployeeUpdated}
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="p-6 border-b flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={`https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=eef2ff&color=4f46e5&size=128`}
                alt="User Avatar"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-md text-gray-500">{employee.jobTitle}</p>
              </div>
            </div>

            {/* --- 6. CONNECT BUTTON (Only for Admin) --- */}
            {user.role === "admin" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                <IconEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Details Grid */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-500">Email</span>
                <p className="text-gray-800">{employee.email}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-500">Employee ID</span>
                <p className="text-gray-800">{employee.employeeId}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-500">Department</span>
                <p className="text-gray-800">{employee.department}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-500">Role</span>
                <p className="text-gray-800 capitalize">{employee.user.role}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-500">Joining Date</span>
                <p className="text-gray-800">
                  {formatDate(employee.joiningDate)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-500">Salary</span>
                <p className="text-gray-800">
                  {formatCurrency(employee.salary)}
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder for other info */}
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Stats
            </h3>
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center p-4 bg-green-50 rounded-lg">
                <IconCalendar className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Attendance</span>
                  <p className="font-bold text-gray-800">98% (Mock)</p>
                </div>
              </div>
              <div className="flex-1 flex items-center p-4 bg-yellow-50 rounded-lg">
                <IconDollar className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Latest Payslip</span>
                  <p className="font-bold text-gray-800">
                    {formatCurrency(employee.salary * 0.9)} (Mock)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfilePage;
