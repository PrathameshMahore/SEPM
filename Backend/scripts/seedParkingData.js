const mongoose = require('mongoose');
require('dotenv').config();
const Parking = require('../models/parking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/IoT_based_smart_parking_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding parking data'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample parking data
const parkingData = [
  {
    name: "Smart Parking Hub",
    address: "123 Tech Park Road, Bangalore",
    totalSlots: 50,
    availableSlots: 35,
    pricePerHour: 60,
    owner: {
      name: "John Doe",
      contact: "+91 9876543210",
      email: "john@smartparking.com"
    },
    amenities: [
      "24/7 Security",
      "CCTV Surveillance",
      "Electric Vehicle Charging",
      "Wheelchair Access",
      "Valet Parking"
    ],
    operatingHours: {
      open: "00:00",
      close: "23:59"
    },
    images: [
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    rating: 4.5,
    reviews: [
      {
        userId: "user1",
        rating: 5,
        comment: "Great parking facility with excellent security",
        date: new Date()
      },
      {
        userId: "user2",
        rating: 4,
        comment: "Convenient location and good service",
        date: new Date()
      }
    ]
  },
  {
    name: "Eco-Friendly Parking",
    address: "456 Green Valley, Bangalore",
    totalSlots: 30,
    availableSlots: 15,
    pricePerHour: 50,
    owner: {
      name: "Jane Smith",
      contact: "+91 9876543211",
      email: "jane@ecoparking.com"
    },
    amenities: [
      "Solar Powered",
      "Bike Parking",
      "Security Cameras",
      "Wheelchair Access"
    ],
    operatingHours: {
      open: "06:00",
      close: "22:00"
    },
    images: [
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    rating: 4.2,
    reviews: [
      {
        userId: "user3",
        rating: 4,
        comment: "Clean and well-maintained",
        date: new Date()
      }
    ]
  },
  {
    name: "City Center Parking",
    address: "789 Downtown, Bangalore",
    totalSlots: 100,
    availableSlots: 60,
    pricePerHour: 70,
    owner: {
      name: "Mike Johnson",
      contact: "+91 9876543212",
      email: "mike@cityparking.com"
    },
    amenities: [
      "24/7 Security",
      "CCTV Surveillance",
      "Valet Parking",
      "Car Wash Service",
      "Wheelchair Access"
    ],
    operatingHours: {
      open: "00:00",
      close: "23:59"
    },
    images: [
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    rating: 4.8,
    reviews: [
      {
        userId: "user4",
        rating: 5,
        comment: "Best parking in the city!",
        date: new Date()
      },
      {
        userId: "user5",
        rating: 4,
        comment: "Great location and service",
        date: new Date()
      }
    ]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Parking.deleteMany({});
    console.log('Cleared existing parking data');

    // Insert new data
    await Parking.insertMany(parkingData);
    console.log('Successfully seeded parking data');

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