const Attendance = require("../models/Attendance");
const asyncHandler = require("express-async-handler");

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin, Private/HR
exports.getAllAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({}).populate(
    "employee",
    "firstName lastName jobTitle"
  );
  res.status(200).json(records);
});

// @desc    Mark attendance (check-in)
// @route   POST /api/attendance
// @access  Private (for now, any logged-in user)
exports.markCheckIn = asyncHandler(async (req, res) => {
  // In a real app, you'd get the employee ID from req.user
  // For now, we'll let the admin/HR add it.
  const { employee, date, status, checkIn } = req.body;

  // Basic validation
  if (!employee || !date || !status) {
    res.status(400);
    throw new Error("Please provide employee, date, and status");
  }

  // Check if a record for this employee on this date already exists
  const today = new Date(date).setHours(0, 0, 0, 0);
  const existingRecord = await Attendance.findOne({
    employee,
    date: {
      $gte: today,
      $lt: new Date(today).setDate(new Date(today).getDate() + 1),
    },
  });

  if (existingRecord) {
    res.status(400);
    throw new Error("Attendance already marked for this employee today");
  }

  const attendance = await Attendance.create({
    employee,
    date,
    status,
    checkIn: checkIn || new Date(),
  });

  res.status(201).json(attendance);
});

// We can add a check-out function later if needed
