const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee", // This must match the name of your Employee model
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Leave"],
      default: "Present",
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure an employee can only have one record per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
