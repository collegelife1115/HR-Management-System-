const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Get all users (Admin Only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
