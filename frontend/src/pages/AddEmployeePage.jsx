import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AddEmployeePage = () => {
  const navigate = useNavigate();

  // --- State matches the backend controller ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "Engineering",
    jobTitle: "SDE-I",
    role: "employee",
    salary: "",
    joiningDate: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // This is just for UI

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/employees", formData);
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
      setIsLoading(false);
    }
  };

  // --- THIS IS THE LINE I REMOVED ---
  // if (!isOpen) return null; // This was the bug

  return (
    <div className="bg-white shadow-md rounded-2xl w-full max-w-2xl p-8 mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Add New Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Profile Picture (UI Only) */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="profilePic"
            className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="text-gray-500 text-sm text-center">
              Upload a profile picture
            </span>
            <input
              type="file"
              id="profilePic"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Employee Details */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Employee Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="border p-3 rounded-lg text-sm"
              required
            />
            {/* This cell is now empty, which is fine */}
          </div>
        </section>

        {/* Login Access */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Login & Role
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="eg. employee32@gmail.com"
              className="border p-3 rounded-lg text-sm"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set Initial Password"
              className="border p-3 rounded-lg text-sm"
              required
            />
          </div>
        </section>

        {/* Job & Salary Details */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Job & Salary Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-3 rounded-lg text-sm"
            >
              <option value="Engineering">Employee</option>
              <option value="Parking">Recruitor</option>
              <option value="Finance">Admin</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary (₹)"
              className="border p-3 rounded-lg text-sm"
              required
            />
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/employees"
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeePage;
