const express = require("express");
const router = express.Router();
const {
  getAllPerformanceReviews,
  createPerformanceReview,
  getMyPerformanceReviews, // <-- 1. Import new function
} = require("../controllers/performanceController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

// Admin/HR routes
router
  .route("/")
  .get(restrictTo("admin", "hr"), getAllPerformanceReviews)
  .post(restrictTo("admin", "hr"), createPerformanceReview);

// --- 2. ADD NEW ROUTE for individual employees ---
router.route("/my-reviews").get(getMyPerformanceReviews);

module.exports = router;
