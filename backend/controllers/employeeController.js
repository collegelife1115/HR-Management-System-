const Employee = require("../models/Employee");
const User = require("../models/User");
const Payroll = require("../models/Payroll");
const Performance = require("../models/Performance"); // <-- Import Performance
const Attendance = require("../models/Attendance"); // <-- Import Attendance
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

// --- NEW FUNCTIONS BELOW ---

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin, Private/HR
exports.getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate(
    "user",
    "role"
  );

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.status(200).json(employee);
});

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = asyncHandler(async (req, res) => {
  // Only Admin can update
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Update Employee fields
  const { firstName, lastName, email, jobTitle, department, salary } = req.body;
  employee.firstName = firstName || employee.firstName;
  employee.lastName = lastName || employee.lastName;
  employee.email = email || employee.email;
  employee.jobTitle = jobTitle || employee.jobTitle;
  employee.department = department || employee.department;
  employee.salary = salary || employee.salary;

  const updatedEmployee = await employee.save();

  // Also update User model if email or name changed
  const user = await User.findById(employee.user);
  user.name = `${updatedEmployee.firstName} ${updatedEmployee.lastName}`;
  user.email = updatedEmployee.email;
  // We'll skip changing the role for now to keep it simple
  await user.save();

  res.status(200).json(updatedEmployee);
});

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = asyncHandler(async (req, res) => {
  // Only Admin can delete
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // 1. Delete all associated records (Payroll, Performance, Attendance)
  await Payroll.deleteMany({ employee: employee._id });
  await Performance.deleteMany({ employee: employee._id });
  await Attendance.deleteMany({ employee: employee._id });

  // 2. Delete the User (login)
  await User.findByIdAndDelete(employee.user);

  // 3. Delete the Employee profile
  await employee.deleteOne(); // or await Employee.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Employee and all associated data removed" });
});
