const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getMyEmployeeProfile,
  getEmployeeById, // <-- 1. Import new function
  updateEmployee, // <-- 1. Import new function
  deleteEmployee, // <-- 1. Import new function
} = require("../controllers/employeeController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Admin/HR routes for main list
router
  .route("/")
  .get(restrictTo("admin", "hr"), getAllEmployees)
  .post(restrictTo("admin", "hr"), createEmployee);

// Employee route for their own profile
router.route("/my-profile").get(getMyEmployeeProfile);

// --- 2. ADD NEW ROUTES for View, Edit, and Delete ---
router
  .route("/:id")
  .get(restrictTo("admin", "hr"), getEmployeeById) // View
  .put(restrictTo("admin"), updateEmployee) // Edit (Admin only)
  .delete(restrictTo("admin"), deleteEmployee); // Delete (Admin only)

module.exports = router;
