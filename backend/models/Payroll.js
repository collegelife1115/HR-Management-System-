const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee", // This must match the name of your Employee model
    },
    periodStartDate: {
      type: Date,
      required: true,
    },
    periodEndDate: {
      type: Date,
      required: true,
    },
    grossSalary: {
      type: Number,
      required: true,
    },
    deductions: {
      // e.g., taxes, insurance
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-calculate netSalary before saving
payrollSchema.pre("save", function (next) {
  if (this.isModified("grossSalary") || this.isModified("deductions")) {
    this.netSalary = this.grossSalary - this.deductions;
  }
  next();
});

const Payroll = mongoose.model("Payroll", payrollSchema);

module.exports = Payroll;
