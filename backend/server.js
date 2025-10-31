// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Ensure this is imported
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// --- 1. Define allowed origins (including your Vercel URL) ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://hr-management-system-git-main-collegelife1115s-projects.vercel.app",
];

// --- Import new routes ---
const payrollRoutes = require("./routes/payrollRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Correct CORS Configuration (MUST BE BEFORE express.json()) ---
// This block correctly implements the policy to allow ONLY your Vercel and local origins.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin on Render)
      if (!origin) return callback(null, true);

      // Check if the requesting origin is in our allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// --- End CORS Configuration ---

// Middleware setup
app.use(express.json()); // Allows parsing of JSON requests

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully! 🚀");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Check your MONGO_URI in the .env file!");
    process.exit(1);
  }
};

// Connect to DB immediately
connectDB();

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("AI-HRMS Backend API is running!");
});

// 3. Route Definitions
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/performance", require("./routes/performanceRoutes"));
app.use("/api/ai", require("./routes/aiRoutes.js"));
app.use("/api/payroll", payrollRoutes);
app.use("/api/attendance", attendanceRoutes);

// ------------------------------------------------------------------
// 4. Error Middleware
app.use(notFound);
app.use(errorHandler);
// ------------------------------------------------------------------

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
