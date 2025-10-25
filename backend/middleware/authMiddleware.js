const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Middleware to protect routes: checks for valid JWT token in the header
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request contains an Authorization header starting with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (removes 'Bearer ' prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the token payload and attach to request object
      // Exclude the password field
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("JWT Token Verification Error:", error.message);
      res.status(401); // Unauthorized
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized, no token");
  }
});

// Middleware to restrict access based on user role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error("Not authorized to access this route.");
    }
    next();
  };
};

module.exports = { protect, restrictTo };
