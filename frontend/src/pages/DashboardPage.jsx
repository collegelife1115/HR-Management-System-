import React from "react";
// We'll add icons for these statistics later if you want
// import { IconRevenue, IconCustomers, etc. } from '../components/icons';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card (Placeholder for HR Metrics) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,250</p>
          <p className="text-gray-400 text-xs mt-1">Since last month</p>
        </div>

        {/* Customers Card (Placeholder for HR Metrics) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">New Hires</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
          <p className="text-gray-400 text-xs mt-1">This quarter</p>
        </div>

        {/* Unit Sold Card (Placeholder for HR Metrics) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Open Positions</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
          <p className="text-gray-400 text-xs mt-1">Currently</p>
        </div>

        {/* Stock Available Card (Placeholder for HR Metrics) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Departments</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
          <p className="text-gray-400 text-xs mt-1">Across organization</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Turnover Rate (Pie Chart Placeholder) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Employee Breakdown
            </h3>
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          {/* Placeholder for Pie Chart */}
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              Pie Chart (e.g., Departmental Headcount)
            </p>
          </div>
        </div>

        {/* Hiring Trend (Bar Chart Placeholder) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Hiring Trend
            </h3>
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          {/* Placeholder for Bar Chart */}
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Bar Chart (e.g., Monthly Hires)</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Activities
          </h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">
            View all
            <svg
              className="inline-block h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Table Content - Placeholder */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Sample Row 1 */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Riya Sharma
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Leave Request
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  24/10/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline">
                  View
                </td>
              </tr>
              {/* Sample Row 2 */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Akhil Kumar
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Performance Review
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  23/10/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline">
                  View
                </td>
              </tr>
              {/* Sample Row 3 */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #003
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Vishwas Pandey
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  New Hire Onboarding
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  22/10/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline">
                  View
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
