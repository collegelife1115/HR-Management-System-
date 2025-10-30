import React from "react";

const MyTasksPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">
          This is where your assigned tasks for today will appear.
        </p>
        <p className="text-gray-500 mt-4">(Feature coming soon)</p>
      </div>
    </div>
  );
};

export default MyTasksPage;
