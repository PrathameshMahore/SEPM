const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const parkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  availableSlots: {
    type: Number,
    required: true,
    min: 0
  },
  bookedSlots: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  bookedSlotsArray: [{
    slotNumber: {
      type: Number,
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  owner: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  operatingHours: {
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  images: [{
    type: String,
    required: true
  }],
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
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

// Create a geospatial index for location-based queries
parkingSchema.index({ location: '2dsphere' });

// Method to book a slot
parkingSchema.methods.bookSlot = async function(slotNumber, bookingId) {
  // Check if slot is already booked
  const isSlotBooked = this.bookedSlotsArray.some(slot => slot.slotNumber === slotNumber);
  
  if (isSlotBooked) {
    throw new Error('Slot is already booked');
  }
  
  // Check if parking has available slots
  if (this.availableSlots <= 0) {
    throw new Error('No available slots');
  }
  
  // Add slot to booked slots array
  this.bookedSlotsArray.push({
    slotNumber,
    bookingId,
    bookedAt: new Date()
  });
  
  // Update counts
  this.availableSlots -= 1;
  this.bookedSlots += 1;
  
  // Save changes
  await this.save();
  
  return this;
};

// Method to release a slot
parkingSchema.methods.releaseSlot = async function(slotNumber) {
  // Find the slot in booked slots array
  const slotIndex = this.bookedSlotsArray.findIndex(slot => slot.slotNumber === slotNumber);
  
  if (slotIndex === -1) {
    throw new Error('Slot not found in booked slots');
  }
  
  // Remove slot from booked slots array
  this.bookedSlotsArray.splice(slotIndex, 1);
  
  // Update counts
  this.availableSlots += 1;
  this.bookedSlots -= 1;
  
  // Save changes
  await this.save();
  
  return this;
};

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking; 