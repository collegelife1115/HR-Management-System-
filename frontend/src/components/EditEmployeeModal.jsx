import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // make sure this file exists

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

const EditEmployeeModal = ({
  isOpen,
  onClose,
  employeeId,
  onEmployeeUpdated,
}) => {
  // Use a state to hold the form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    department: "",
    salary: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the current employee data when the modal opens
  useEffect(() => {
    let mounted = true;
    if (isOpen && employeeId) {
      setIsLoading(true);
      const fetchEmployee = async () => {
        try {
          const response = await axiosInstance.get(`/employees/${employeeId}`);
          const { firstName, lastName, email, jobTitle, department, salary } =
            response.data || {};
          if (mounted) {
            setFormData({
              firstName: firstName || "",
              lastName: lastName || "",
              email: email || "",
              jobTitle: jobTitle || "",
              department: department || "",
              salary: salary ?? "",
            });
            setError(null);
          }
        } catch (err) {
          console.error("Failed to load employee:", err);
          if (mounted) setError("Failed to load employee data.");
        } finally {
          if (mounted) setIsLoading(false);
        }
      };
      fetchEmployee();
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Make sure salary is a number (or send as-is if empty)
      const payload = {
        ...formData,
        salary: formData.salary === "" ? null : Number(formData.salary),
      };

      const response = await axiosInstance.put(
        `/employees/${employeeId}`,
        payload
      );

      // Notify parent of update (if callback provided)
      if (typeof onEmployeeUpdated === "function") {
        onEmployeeUpdated(response.data);
      }

      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update employee");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg m-4 rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Employee Profile</h3>
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

          {isLoading && !formData.firstName ? (
            <p>Loading data...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>

                <select
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Job Title</option>
                  <option value="SDE-I">SDE-I</option>
                  <option value="SDE-II">SDE-II</option>
                  <option value="Manager">Manager</option>
                  <option value="Senior Manager">Senior Manager</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <input
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary (₹)"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />

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
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
