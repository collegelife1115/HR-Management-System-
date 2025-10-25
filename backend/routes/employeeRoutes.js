const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
} = require("../controllers/employeeController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

router
  .route("/")
  .post(restrictTo("admin"), createEmployee)
  .get(restrictTo("admin", "hr"), getAllEmployees);

module.exports = router;
