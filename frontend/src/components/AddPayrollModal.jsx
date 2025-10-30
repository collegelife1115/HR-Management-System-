import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// Simple "X" icon for closing
const IconClose = (props) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AddPayrollModal = ({ isOpen, onClose, onRecordAdded }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [periodStartDate, setPeriodStartDate] = useState("");
  const [periodEndDate, setPeriodEndDate] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [deductions, setDeductions] = useState("0");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all employees to populate the dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        try {
          const response = await axiosInstance.get("/employees");
          setEmployees(response.data);
          if (response.data.length > 0) {
            setSelectedEmployee(response.data[0]._id); // Default to first employee
          }
        } catch (err) {
          setError("Failed to load employees list.");
        }
      };
      fetchEmployees();
    }
  }, [isOpen]); // Re-fetch when modal opens

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedEmployee ||
      !periodStartDate ||
      !periodEndDate ||
      !grossSalary
    ) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payrollData = {
        employee: selectedEmployee,
        periodStartDate,
        periodEndDate,
        grossSalary: parseFloat(grossSalary),
        deductions: parseFloat(deductions),
        // Net salary is calculated by the backend
      };

      // This hits your POST /api/payroll endpoint
      const response = await axiosInstance.post("/payroll", payrollData);

      onRecordAdded(response.data); // Pass new record back to parent page
      onClose(); // Close the modal

      // Reset form
      setPeriodStartDate("");
      setPeriodEndDate("");
      setGrossSalary("");
      setDeductions("0");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit payroll.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white w-full max-w-lg m-4 rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Create Payroll Record</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <IconClose />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="employee"
              className="block text-sm font-medium text-gray-700"
            >
              Employee
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.jobTitle})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="periodStartDate"
                className="block text-sm font-medium text-gray-700"
              >
                Pay Period Start
              </label>
              <input
                type="date"
                id="periodStartDate"
                value={periodStartDate}
                onChange={(e) => setPeriodStartDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="periodEndDate"
                className="block text-sm font-medium text-gray-700"
              >
                Pay Period End
              </label>
              <input
                type="date"
                id="periodEndDate"
                value={periodEndDate}
                onChange={(e) => setPeriodEndDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="grossSalary"
                className="block text-sm font-medium text-gray-700"
              >
                Gross Salary (₹)
              </label>
              <input
                type="number"
                id="grossSalary"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                placeholder="e.g., 50000"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="deductions"
                className="block text-sm font-medium text-gray-700"
              >
                Deductions (₹)
              </label>
              <input
                type="number"
                id="deductions"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="e.g., 5000"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayrollModal;
