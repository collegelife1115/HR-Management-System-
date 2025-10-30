import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";

// --- Icons ---
const IconPlus = (props) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconCheckCircle = (props) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconClock = (props) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
// --- End Icons ---

const PayrollPage = () => {
  const { user } = useUser(); // Get current user
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to format date strings
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // You can change this
    }).format(amount);
  };

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/payroll");
        setPayrolls(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch payroll records");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayrolls();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payroll</h1>

        {/* --- CONDITIONAL "CREATE" BUTTON --- */}
        {user.role === "admin" && (
          <button className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            <IconPlus className="w-5 h-5 mr-2" />
            Create Payroll Record
          </button>
        )}
      </div>

      {/* --- Dynamic Payroll Table --- */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Period
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Salary
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Salary
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading payroll records...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : payrolls.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No payroll records found.
                </td>
              </tr>
            ) : (
              payrolls.map((record) => (
                <tr key={record._id}>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {record.employee.firstName} {record.employee.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.employee.jobTitle}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.periodStartDate)} -{" "}
                    {formatDate(record.periodEndDate)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(record.grossSalary)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(record.deductions)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(record.netSalary)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {record.status === "Paid" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <IconCheckCircle className="w-4 h-4 mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <IconClock className="w-4 h-4 mr-1" /> Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;
