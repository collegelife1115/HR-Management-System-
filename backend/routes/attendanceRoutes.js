const express = require("express");
const router = express.Router();
const {
  getAllAttendance,
  markCheckIn,
} = require("../controllers/attendanceController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Get all attendance (HR, Admin)
// Mark attendance (Admin, HR)
router
  .route("/")
  .get(restrictTo("admin", "hr"), getAllAttendance)
  .post(restrictTo("admin", "hr"), markCheckIn);

module.exports = router;
