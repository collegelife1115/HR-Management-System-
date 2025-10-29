import React from "react";
// --- Import the card component (ensure this file exists and is correct) ---
import EmployeeCard from "../components/EmployeeCard"; // Using standard import path

// --- Inlined icon components ---
const IconPlus = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconBell = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconSearch = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconSort = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 4h18M3 10h12M3 16h6M13 16l4 4 4-4" />
  </svg>
);
// --- End of inlined icons ---

// Mock data based on your screenshot
const mockEmployeeData = [
  {
    id: 1,
    name: "Daksh Pokhriyal",
    role: "Sales Dept.",
    department: "Sales",
    hiredDate: "02/05/2025",
    email: "Daksh489@gamil.com",
    phone: "9985635210",
    imageUrl: "", // Will use placeholder
  },
  {
    id: 2,
    name: "Nikita Sharma",
    role: "Rental Dept.",
    department: "Rental",
    hiredDate: "02/07/2025",
    email: "Nikita645@gamil.com",
    phone: "8985635210",
    imageUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    name: "Ketan Singh",
    role: "Parking Dept.",
    department: "Parking",
    hiredDate: "11/01/2025",
    email: "Ketanrs6@gamil.com",
    phone: "8006363510",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 4,
    name: "Nikita Sharma",
    role: "Rental Dept.",
    department: "Rental",
    hiredDate: "02/07/2025",
    email: "Nikita645@gamil.com",
    phone: "8985635210",
    imageUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 5,
    name: "Ketan Singh",
    role: "Parking Dept.",
    department: "Parking",
    hiredDate: "11/01/2025",
    email: "Ketanrs6@gamil.com",
    phone: "8006363510",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 6,
    name: "Daksh Pokhriyal",
    role: "Sales Dept.",
    department: "Sales",
    hiredDate: "02/05/2025",
    email: "Daksh489@gamil.com",
    phone: "9985635210",
    imageUrl: "", // Will use placeholder
  },
];

const EmployeesPage = () => {
  // Removed useUser import as it's not needed in this version

  return (
    <div className="space-y-6">
      {/* Page Header (Original Version) */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800">Employee</h2>

        {/* --- REVERTED: Add button and Bell always visible --- */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            <IconPlus className="w-5 h-5 mr-2" />
            Add New Employee
          </button>
          <button className="relative text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <IconBell className="w-6 h-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        {/* --- End of Revert --- */}
      </div>

      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <IconSearch className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        {/* Sort Button */}
        <button className="flex items-center space-x-2 text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          <IconSort className="w-5 h-5" />
          <span className="font-medium">Sort By</span>
        </button>
      </div>

      {/* Employee Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockEmployeeData.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
