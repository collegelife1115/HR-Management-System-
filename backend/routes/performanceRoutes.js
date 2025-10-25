const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
} = require("../controllers/performanceController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// Protect all routes below (user must be logged in)
router.use(protect);

router
  .route("/")
  .post(restrictTo("admin", "manager"), createReview)
  .get(restrictTo("admin", "manager", "hr"), getAllReviews);

module.exports = router;
