const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true
  },
  slotNumber: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'wallet', 'cash'],
    required: true
  },
  paymentId: {
    type: String
  },
  vehicleDetails: {
    type: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    model: String,
    color: String
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  cancellationReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total price
bookingSchema.pre('save', function(next) {
  if (this.isModified('duration') || this.isModified('totalPrice')) {
    // If the total price is not set, calculate it based on duration and parking's price per hour
    if (!this.totalPrice) {
      this.totalPrice = this.duration * this.pricePerHour;
    }
  }
  next();
});

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  
  // If payment was made, set up refund process
  if (this.paymentStatus === 'paid') {
    this.paymentStatus = 'refunded';
    // Here you would integrate with your payment gateway to process refund
  }
  
  await this.save();
  
  // Release the slot in the parking
  const Parking = mongoose.model('Parking');
  const parking = await Parking.findById(this.parkingId);
  
  if (parking) {
    await parking.releaseSlot(this.slotNumber);
  }
  
  return this;
};

// Method to check in
bookingSchema.methods.checkIn = async function() {
  this.status = 'active';
  this.checkInTime = new Date();
  await this.save();
  return this;
};

// Method to check out
bookingSchema.methods.checkOut = async function() {
  this.status = 'completed';
  this.checkOutTime = new Date();
  
  // Calculate actual duration and adjust price if needed
  const actualDuration = (this.checkOutTime - this.checkInTime) / (1000 * 60 * 60); // in hours
  this.duration = Math.ceil(actualDuration); // Round up to nearest hour
  
  // Recalculate total price based on actual duration
  const Parking = mongoose.model('Parking');
  const parking = await Parking.findById(this.parkingId);
  
  if (parking) {
    this.totalPrice = this.duration * parking.pricePerHour;
  }
  
  await this.save();
  
  // Release the slot in the parking
  if (parking) {
    await parking.releaseSlot(this.slotNumber);
  }
  
  return this;
};

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking; 