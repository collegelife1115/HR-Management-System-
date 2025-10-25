const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Link this employee profile to a user account in the User model
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One employee profile per user account
    },
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
    },
    position: {
      type: String,
      required: [true, "Please add a position (e.g., Software Engineer)"],
    },
    department: {
      type: String,
      enum: ["Engineering", "HR", "Marketing", "Sales", "Management"],
      required: [true, "Please add a department"],
    },
    salary: {
      type: Number,
      required: [true, "Please add a salary"],
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    // We can add more fields here later (contact, address, etc.)
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
