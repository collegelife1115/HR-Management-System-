import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";

// --- 1. IMPORT THE NEW MODAL ---
import MarkAttendanceModal from "../components/MarkAttendanceModal.jsx";

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
// ... other icons
// --- End Icons ---

const AttendancePage = () => {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. ADD STATE TO CONTROL THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper to format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/attendance");
        setRecords(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch attendance records");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // --- 3. FUNCTION TO UPDATE LIST AFTER ADDING ---
  const handleRecordAdded = (newRecord) => {
    // This function re-fetches the data to get the populated employee info
    const fetchUpdatedRecords = async () => {
      const response = await axiosInstance.get("/attendance");
      setRecords(response.data);
    };
    fetchUpdatedRecords();
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Present":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {status}
          </span>
        );
      case "Absent":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            {status}
          </span>
        );
      case "Leave":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* --- 4. RENDER THE MODAL --- */}
      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRecordAdded={handleRecordAdded}
      />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>

          {/* --- 5. CONNECT THE BUTTON --- */}
          {(user.role === "admin" || user.role === "hr") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <IconPlus className="w-5 h-5 mr-2" />
              Mark Attendance
            </button>
          )}
        </div>

        {/* --- Dynamic Attendance Table --- */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading attendance records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {record.employee ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {record.employee.firstName}{" "}
                            {record.employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.employee.jobTitle}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-red-500">
                          Employee not found
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusChip(record.status)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkIn)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkOut)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
