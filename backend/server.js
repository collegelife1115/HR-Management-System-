// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
// This is correct. It will read PORT=5001 from your .env file
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Allows parsing of JSON requests

// 1. MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully! 🚀");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Check your MONGO_URI in the .env file!");
    process.exit(1); // Exit process with failure if connection fails
  }
};

// Connect to DB immediately
connectDB();

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("AI-HRMS Backend API is running!");
});

// 2. Route Definition (Link the Auth routes)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes")); // <-- THIS IS THE MISSING LINE
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/performance", require("./routes/performanceRoutes"));
app.use("/api/ai", require("./routes/aiRoutes.js"));

// ------------------------------------------------------------------
// 3. Error Middleware (MUST BE LAST, catches errors from async-handler)
app.use(notFound);
app.use(errorHandler);
// ------------------------------------------------------------------

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
