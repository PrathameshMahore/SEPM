const mongoose = require('mongoose');
require('dotenv').config();
const NearbyParking = require('../models/nearbyParking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/IoT_based_smart_parking_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding nearby parking data'))
.catch(err => console.error('MongoDB connection error:', err));

// Dummy data for nearby parking systems
const nearbyParkingData = [
  {
    name: "Central City Parking",
    address: "123 Main Street, Downtown",
    distance: 0.5,
    availableSlots: 25,
    totalSlots: 50,
    hourlyRate: 30,
    imageUrl: "https://images.unsplash.com/photo-1573348722427-f1d6819dd313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    amenities: ["Security Cameras", "24/7 Access", "EV Charging", "Covered Parking"],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    isOpen: true
  },
  {
    name: "Green Valley Parking",
    address: "456 Park Avenue, Midtown",
    distance: 1.2,
    availableSlots: 15,
    totalSlots: 30,
    hourlyRate: 25,
    imageUrl: "https://images.unsplash.com/photo-1597071081839-463f8b3d5e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.2,
    amenities: ["Security Guard", "Well Lit", "Bicycle Parking"],
    coordinates: { lat: 12.9816, lng: 77.5846 },
    isOpen: true
  },
  {
    name: "Riverside Parking Complex",
    address: "789 River Road, Waterfront",
    distance: 2.5,
    availableSlots: 40,
    totalSlots: 80,
    hourlyRate: 20,
    imageUrl: "https://images.unsplash.com/photo-1597071081839-463f8b3d5e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.0,
    amenities: ["Security Cameras", "24/7 Access", "Car Wash", "Valet Service"],
    coordinates: { lat: 12.9916, lng: 77.5746 },
    isOpen: true
  },
  {
    name: "Skyline Parking Tower",
    address: "321 Sky Tower, Uptown",
    distance: 3.0,
    availableSlots: 60,
    totalSlots: 100,
    hourlyRate: 35,
    imageUrl: "https://images.unsplash.com/photo-1573348722427-f1d6819dd313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    amenities: ["Security Cameras", "24/7 Access", "EV Charging", "Covered Parking", "Valet Service", "Car Wash"],
    coordinates: { lat: 13.0016, lng: 77.5646 },
    isOpen: true
  },
  {
    name: "Historic District Parking",
    address: "555 Old Town Square, Historic District",
    distance: 1.8,
    availableSlots: 10,
    totalSlots: 20,
    hourlyRate: 28,
    imageUrl: "https://images.unsplash.com/photo-1597071081839-463f8b3d5e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 3.8,
    amenities: ["Security Guard", "Well Lit", "Bicycle Parking"],
    coordinates: { lat: 13.0116, lng: 77.5546 },
    isOpen: true
  },
  {
    name: "Shopping Mall Parking",
    address: "777 Mall Drive, Retail District",
    distance: 4.2,
    availableSlots: 200,
    totalSlots: 300,
    hourlyRate: 15,
    imageUrl: "https://images.unsplash.com/photo-1573348722427-f1d6819dd313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.3,
    amenities: ["Security Cameras", "24/7 Access", "EV Charging", "Covered Parking", "Family Parking"],
    coordinates: { lat: 13.0216, lng: 77.5446 },
    isOpen: true
  },
  {
    name: "Airport Express Parking",
    address: "999 Airport Road, Near Terminal",
    distance: 5.5,
    availableSlots: 150,
    totalSlots: 250,
    hourlyRate: 40,
    imageUrl: "https://images.unsplash.com/photo-1597071081839-463f8b3d5e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    amenities: ["Security Cameras", "24/7 Access", "EV Charging", "Covered Parking", "Shuttle Service", "Car Wash"],
    coordinates: { lat: 13.0316, lng: 77.5346 },
    isOpen: true
  },
  {
    name: "University Campus Parking",
    address: "444 University Avenue, Campus Area",
    distance: 2.8,
    availableSlots: 80,
    totalSlots: 120,
    hourlyRate: 18,
    imageUrl: "https://images.unsplash.com/photo-1573348722427-f1d6819dd313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.1,
    amenities: ["Security Cameras", "24/7 Access", "EV Charging", "Bicycle Parking", "Student Discount"],
    coordinates: { lat: 13.0416, lng: 77.5246 },
    isOpen: true
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await NearbyParking.deleteMany({});
    console.log('Cleared existing nearby parking data');

    // Insert new data
    await NearbyParking.insertMany(nearbyParkingData);
    console.log('Successfully seeded nearby parking data');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

// Run the seeding function
seedDatabase(); 