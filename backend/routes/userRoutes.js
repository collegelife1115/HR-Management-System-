const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

// Import our new middleware
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Apply the middleware to the route
// 1. 'protect' checks if user is logged in
// 2. 'restrictTo('admin')' checks if user.role is 'admin'
router.route("/").get(protect, restrictTo("admin"), getUsers);

module.exports = router;
