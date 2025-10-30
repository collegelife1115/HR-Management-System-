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

const AddReviewModal = ({ isOpen, onClose, onReviewAdded }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
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
    if (!selectedEmployee || rating === 0) {
      setError("Please select an employee and provide a rating.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reviewData = {
        employee: selectedEmployee,
        rating,
        comments,
        reviewDate: new Date().toISOString(), // Set current date
      };

      // This hits your POST /api/performance endpoint
      const response = await axiosInstance.post("/performance", reviewData);

      onReviewAdded(response.data); // Pass new review back to parent page
      onClose(); // Close the modal

      // Reset form
      setSelectedEmployee(employees.length > 0 ? employees[0]._id : "");
      setRating(0);
      setComments("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
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
          <h3 className="text-lg font-semibold">Add New Performance Review</h3>
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
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <svg
                    key={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className={`w-8 h-8 cursor-pointer ${
                      ratingValue <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z" />
                  </svg>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700"
            >
              Comments
            </label>
            <textarea
              id="comments"
              rows="4"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter feedback and comments..."
            ></textarea>
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
              {isLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
