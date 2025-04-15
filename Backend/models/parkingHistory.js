const mongoose = require("mongoose");

const parkingHistorySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  slotNumber: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
  },
  totalCost: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["credit", "upi", "cash"],
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  discountApplied: {
    type: Boolean,
    default: false,
  },
  discountCode: {
    type: String,
    default: null,
  },
  originalCost: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ["completed", "cancelled", "active"],
    default: "completed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index on userName for faster queries
parkingHistorySchema.index({ userName: 1 });

const ParkingHistory = mongoose.model("ParkingHistory", parkingHistorySchema);

module.exports = ParkingHistory; 