const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    // Link to the specific employee profile
    employee: {
      type: mongoose.Schema.ObjectId,
      ref: "Employee",
      required: true,
    },
    // Link to the user (manager/admin) who is submitting the review
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please add a rating between 1 and 5"],
    },
    comments: {
      type: String,
      required: [true, "Please add review comments"],
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Performance", performanceSchema);
