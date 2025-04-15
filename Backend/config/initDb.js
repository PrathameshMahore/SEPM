const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/IoT_based_smart_parking_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Create collections if they don't exist
    const collections = [
      'users',
      'admins',
      'slots',
      'parkingdurations',
      'parkingtransactions',
      'parkinghistories'
    ];

    for (const collection of collections) {
      try {
        await mongoose.connection.createCollection(collection);
        console.log(`Collection ${collection} created successfully`);
      } catch (error) {
        if (error.code !== 48) { // 48 is the error code for collection already exists
          console.error(`Error creating collection ${collection}:`, error);
        }
      }
    }

    // Insert initial admin data
    const Admin = require('../models/adminModel');
    const adminData = [
      { adminKey: 'admin1', password: 'password1' },
      { adminKey: 'admin2', password: 'password2' },
      { adminKey: 'admin3', password: 'password3' }
    ];

    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        await Admin.insertMany(adminData);
        console.log('Admin data inserted successfully');
      }
    } catch (error) {
      console.error('Error inserting admin data:', error.message);
    }

    // Insert initial slot data
    const Slot = require('../models/slot');
    const slotData = Array.from({ length: 6 }, (_, i) => ({
      slotNumber: i + 1,
      slotStatus: 0 // 0 means available
    }));

    try {
      const slotCount = await Slot.countDocuments();
      if (slotCount === 0) {
        await Slot.insertMany(slotData);
        console.log('Slot data inserted successfully');
      }
    } catch (error) {
      console.error('Error inserting slot data:', error.message);
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB(); 