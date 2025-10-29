import React from "react";
import { IconArrowUpRight } from "./icons/IconArrowUpRight.jsx";
import { IconMail } from "./icons/IconMail.jsx";
import { IconPhone } from "./icons/IconPhone.jsx";

/**
 * Generates a placeholder image URL based on employee initials.
 * @param {string} name - The employee's full name.
 * @returns {string} A placehold.co URL.
 */
const getPlaceholderImage = (name) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
  const colors = [
    "e0f2fe/0284c7",
    "dcfce7/16a34a",
    "fee2e2/dc2626",
    "ffedd5/f97316",
  ];
  const color = colors[name.length % colors.length]; // Simple hash for varied colors
  return `https://placehold.co/100x100/${color}?text=${initials}&font=roboto`;
};

/**
 * A reusable card component to display employee summary.
 * @param {object} props
 * @param {object} props.employee - The employee data object.
 * @param {string} props.employee.name - Employee's full name.
 * @param {string} props.employee.role - Employee's job title or role.
 * @param {string} props.employee.department - Employee's department.
 * @param {string} props.employee.hiredDate - Date employee was hired.
 * @param {string} props.employee.email - Employee's email.
 * @param {string} props.employee.phone - Employee's phone number.
 * @param {string} [props.employee.imageUrl] - Optional image URL.
 */
const EmployeeCard = ({ employee }) => {
  const { name, role, department, hiredDate, email, phone, imageUrl } =
    employee;

  // Use provided image or generate a placeholder
  const displayImage = imageUrl || getPlaceholderImage(name);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          {/* Image and Name/Role */}
          <div className="flex items-center space-x-4">
            <img
              src={displayImage}
              alt={name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = getPlaceholderImage(name); // Fallback on image error
              }}
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
          {/* Arrow Icon */}
          <button className="text-gray-400 hover:text-indigo-600">
            <IconArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        {/* Details: Department and Hired Date */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <span className="text-xs text-gray-400 uppercase">Department</span>
            <p className="text-sm font-medium text-gray-700">{department}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase">Hired Date</span>
            <p className="text-sm font-medium text-gray-700">{hiredDate}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center space-x-3">
            <IconMail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <IconPhone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
