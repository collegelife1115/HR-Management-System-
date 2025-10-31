// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const payrollRoutes = require("./routes/payrollRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- ✅ FIXED CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", // for local development
  "https://hr-management-system-eta-ten.vercel.app", // ✅ your deployed frontend
  "https://hr-management-system-git-main-collegelife1115s-projects.vercel.app", // optional preview build
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or same-origin requests)
      if (!origin) return callback(null, true);

      // Check if the origin is allowed
      if (!allowedOrigins.includes(origin)) {
        console.log("❌ Blocked by CORS:", origin);
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      console.log("✅ Allowed by CORS:", origin);
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies or auth headers
  })
);

// Middleware setup
app.use(express.json()); // Allows parsing of JSON requests

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("Check your MONGO_URI in the .env file!");
    process.exit(1);
  }
};

connectDB();

// Base route
app.get("/", (req, res) => {
  res.send("AI-HRMS Backend API is running! 🚀");
});

// Route Definitions
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/performance", require("./routes/performanceRoutes"));
app.use("/api/ai", require("./routes/aiRoutes.js"));
app.use("/api/payroll", payrollRoutes);
app.use("/api/attendance", attendanceRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Access it at: http://localhost:${PORT}`);
});
