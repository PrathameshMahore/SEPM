const mongoose = require("mongoose");

const nearbyParkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  totalSlots: {
    type: Number,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  amenities: [{
    type: String,
  }],
  coordinates: {
    lat: Number,
    lng: Number,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NearbyParking = mongoose.model("NearbyParking", nearbyParkingSchema);

module.exports = NearbyParking; 