const Performance = require("../models/Performance");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Create a new performance review
// @route   POST /api/performance
// @access  Private/Admin or Private/Manager
exports.createReview = asyncHandler(async (req, res) => {
  const { employeeId, rating, comments } = req.body;

  // The 'reviewer' is the logged-in user (from our 'protect' middleware)
  const reviewerId = req.user._id;

  // Check if employee exists
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const review = await Performance.create({
    employee: employeeId,
    reviewer: reviewerId,
    rating,
    comments,
  });

  res.status(201).json(review);
});

// @desc    Get all performance reviews
// @route   GET /api/performance
// @access  Private/Admin or Private/Manager or Private/HR
exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Performance.find({})
    .populate("employee", "firstName lastName position")
    .populate("reviewer", "name email");

  res.status(200).json(reviews);
});
