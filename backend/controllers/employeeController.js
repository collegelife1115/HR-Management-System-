const Employee = require("../models/Employee");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Create a new employee profile
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = asyncHandler(async (req, res) => {
  const { userId, firstName, lastName, position, department, salary } =
    req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if employee profile already exists for this user
  const employeeExists = await Employee.findOne({ user: userId });
  if (employeeExists) {
    res.status(400);
    throw new Error("Employee profile already exists for this user");
  }

  const employee = await Employee.create({
    user: userId,
    firstName,
    lastName,
    position,
    department,
    salary,
  });

  res.status(201).json(employee);
});

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin or Private/HR
exports.getAllEmployees = asyncHandler(async (req, res) => {
  // 'populate' will fetch the user's name and email from the User model
  const employees = await Employee.find({}).populate("user", "name email role");
  res.status(200).json(employees);
});
