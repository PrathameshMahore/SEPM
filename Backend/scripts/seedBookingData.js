const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('../models/booking');
const Parking = require('../models/parking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/IoT_based_smart_parking_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding booking data'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to get random parking ID
const getRandomParkingId = async () => {
  const parking = await Parking.findOne();
  return parking ? parking._id : null;
};

// Sample booking data
const generateBookingData = async () => {
  const parkingId = await getRandomParkingId();
  if (!parkingId) {
    console.error('No parking found in database. Please seed parking data first.');
    process.exit(1);
  }

  return [
    {
      userId: "65f1a2b3c4d5e6f7g8h9i0j1", // Dummy user ID
      parkingId: parkingId,
      slotNumber: "A-101",
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      totalCost: 60,
      status: "confirmed",
      paymentStatus: "paid",
      vehicleNumber: "KA01AB1234",
      vehicleType: "car",
      checkInTime: null,
      checkOutTime: null,
      bookingType: "online",
      specialRequests: "Near entrance if possible"
    },
    {
      userId: "65f1a2b3c4d5e6f7g8h9i0j2", // Different dummy user ID
      parkingId: parkingId,
      slotNumber: "B-202",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // 2 hours after start
      totalCost: 60,
      status: "pending",
      paymentStatus: "pending",
      vehicleNumber: "KA02CD5678",
      vehicleType: "suv",
      checkInTime: null,
      checkOutTime: null,
      bookingType: "online",
      specialRequests: "Need space for large vehicle"
    },
    {
      userId: "65f1a2b3c4d5e6f7g8h9i0j3", // Another dummy user ID
      parkingId: parkingId,
      slotNumber: "C-303",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      endTime: new Date(Date.now() - 22 * 60 * 60 * 1000), // 2 hours after start
      totalCost: 60,
      status: "completed",
      paymentStatus: "paid",
      vehicleNumber: "KA03EF9012",
      vehicleType: "motorcycle",
      checkInTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
      checkOutTime: new Date(Date.now() - 21 * 60 * 60 * 1000),
      bookingType: "online",
      specialRequests: "Bike parking area preferred"
    }
  ];
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Booking.deleteMany({});
    console.log('Cleared existing booking data');

    // Generate and insert new data
    const bookingData = await generateBookingData();
    await Booking.insertMany(bookingData);
    console.log('Successfully seeded booking data');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

// Run the seed function
seedDatabase(); 