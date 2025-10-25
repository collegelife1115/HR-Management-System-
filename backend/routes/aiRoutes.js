const express = require("express");
const router = express.Router();

// 1. IMPORT THE NEW FUNCTION AND MIDDLEWARE
const { getAIInsights, screenResume } = require("../controllers/aiController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // <-- IMPORT UPLOAD

// Protect all AI routes
router.use(protect);

// Define the insights route (this was already here)
router
  .route("/insights")
  .get(restrictTo("admin", "manager", "hr"), getAIInsights);

// 2. ADD THE NEW RESUME SCREENING ROUTE
router.route("/screen-resume").post(
  restrictTo("admin", "hr"), // Only admin/hr can screen
  upload.single("resume"), // Use multer to find a file named 'resume'
  screenResume // Run our controller
);

module.exports = router;
