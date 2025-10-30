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

const MarkAttendanceModal = ({ isOpen, onClose, onRecordAdded }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [status, setStatus] = useState("Present"); // Default to Present

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
    if (!selectedEmployee || !date || !status) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const attendanceData = {
        employee: selectedEmployee,
        date,
        status,
        checkIn: status === "Present" ? new Date().toISOString() : null,
      };

      // This hits your POST /api/attendance endpoint
      const response = await axiosInstance.post("/attendance", attendanceData);

      onRecordAdded(response.data); // Pass new record back to parent page
      onClose(); // Close the modal
    } catch (err) {
      // Handle the "already marked" error
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to submit attendance.");
      }
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
          <h3 className="text-lg font-semibold">Mark Attendance</h3>
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

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
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

export default MarkAttendanceModal;
