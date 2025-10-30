const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getMyEmployeeProfile, // <-- 1. Import new function
} = require("../controllers/employeeController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Admin/HR routes
router
  .route("/")
  .get(restrictTo("admin", "hr"), getAllEmployees)
  .post(restrictTo("admin", "hr"), createEmployee);

// --- 2. ADD NEW ROUTE for individual employees ---
router.route("/my-profile").get(getMyEmployeeProfile);

module.exports = router;
