const mongoose = require('mongoose');
require('dotenv').config();

const Slot = require('../models/slot');

const initSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/IoT_based_smart_parking_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Clear existing slots
    await Slot.deleteMany({});
    console.log('Existing slots cleared');

    // Create 6 slots (all available)
    const slotData = Array.from({ length: 6 }, (_, i) => ({
      slotNumber: i + 1,
      slotStatus: 0 // 0 means available
    }));

    await Slot.insertMany(slotData);
    console.log('Slot data inserted successfully');

    // Verify the slots were created
    const slots = await Slot.find({});
    console.log('Current slots:', slots);

    process.exit(0);
  } catch (error) {
    console.error('Error initializing slots:', error);
    process.exit(1);
  }
};

initSlots(); 