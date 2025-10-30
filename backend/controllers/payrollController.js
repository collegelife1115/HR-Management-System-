const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee"); // <-- THE MISSING IMPORT
const asyncHandler = require("express-async-handler");

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private/Admin, Private/HR
exports.getAllPayrolls = asyncHandler(async (req, res) => {
  const payrolls = await Payroll.find({}).populate(
    "employee",
    "firstName lastName email jobTitle"
  );

  res.status(200).json(payrolls);
});

// @desc    Create a new payroll record (for Admin)
// @route   POST /api/payroll
// @access  Private/Admin
exports.createPayroll = asyncHandler(async (req, res) => {
  const { employee, periodStartDate, periodEndDate, grossSalary, deductions } =
    req.body;

  if (
    !employee ||
    !periodStartDate ||
    !periodEndDate ||
    grossSalary === undefined
  ) {
    res.status(400);
    throw new Error("Please provide all required payroll fields");
  }

  // Net salary is now calculated by the pre-save hook in the model

  const payroll = new Payroll({
    employee,
    periodStartDate,
    periodEndDate,
    grossSalary,
    deductions,
  });

  const createdPayroll = await payroll.save();
  res.status(201).json(createdPayroll);
});

// --- NEW FUNCTION (FIXED) ---
// @desc    Get all payroll records for the logged-in user
// @route   GET /api/payroll/my-payslips
// @access  Private (any logged-in user)
exports.getMyPayrollRecords = asyncHandler(async (req, res) => {
  const employeeProfile = await Employee.findOne({ user: req.user._id });
  if (!employeeProfile) {
    res.status(404);
    throw new Error("Employee profile not found");
  }

  const payrolls = await Payroll.find({ employee: employeeProfile._id });
  res.status(200).json(payrolls);
});
