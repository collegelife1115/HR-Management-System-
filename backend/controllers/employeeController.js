const Employee = require("../models/Employee");
const User = require("../models/User");
const Payroll = require("../models/Payroll");
const asyncHandler = require("express-async-handler");

// @desc    Create a new employee (and their user login)
// @route   POST /api/employees
// @access  Private/Admin, Private/HR
exports.createEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    joiningDate,
    jobTitle,
    department,
    salary, // This is the grossSalary
    role,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name: `${firstName} ${lastName}`,
    email,
    password,
    role,
  });

  if (!user) {
    res.status(400);
    throw new Error("Failed to create user login");
  }

  const count = await Employee.countDocuments();
  const newEmployeeId = `EMP${(count + 1).toString().padStart(4, "0")}`;

  const employee = await Employee.create({
    user: user._id,
    firstName,
    lastName,
    email,
    employeeId: newEmployeeId,
    joiningDate,
    jobTitle,
    department,
    salary,
  });

  const grossSalary = salary;
  const deductions = 0;
  const netSalary = grossSalary - deductions;

  await Payroll.create({
    employee: employee._id,
    periodStartDate: new Date(joiningDate),
    periodEndDate: new Date(
      new Date(joiningDate).setMonth(new Date(joiningDate).getMonth() + 1)
    ),
    grossSalary: grossSalary,
    deductions: deductions,
    netSalary: netSalary,
    status: "Pending",
  });

  const populatedEmployee = await Employee.findById(employee._id).populate(
    "user",
    "role"
  );
  res.status(201).json(populatedEmployee);
});

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin, Private/HR
exports.getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({}).populate("user", "role");
  res.status(200).json(employees);
});

// --- NEW FUNCTION (FIXED) ---
// @desc    Get the logged-in user's employee profile
// @route   GET /api/employees/my-profile
// @access  Private (any logged-in user)
exports.getMyEmployeeProfile = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });

  if (!employee) {
    res.status(404);
    throw new Error("Employee profile not found for this user");
  }

  res.status(200).json(employee);
});
