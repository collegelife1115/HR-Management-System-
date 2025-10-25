const express = require("express");
const router = express.Router();
const { registerUser, authUser } = require("../controllers/authController");

// /api/auth/register
router.post("/register", registerUser);

// /api/auth/login
router.post("/login", authUser);

module.exports = router;
