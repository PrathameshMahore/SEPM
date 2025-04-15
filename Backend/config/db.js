// config/db.js
const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/IoT_based_smart_parking_system', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error(`MongoDB connection attempt ${retries + 1} failed: ${error.message}`);
      
      if (retries < maxRetries) {
        retries++;
        console.log(`Retrying connection in 5 seconds... (Attempt ${retries} of ${maxRetries})`);
        setTimeout(connect, 5000);
      } else {
        console.error('Max retries reached. Could not connect to MongoDB.');
        console.error('Please make sure MongoDB is installed and running.');
        console.error('You can start MongoDB by:');
        console.error('1. Opening Services (Win + R, type "services.msc")');
        console.error('2. Finding "MongoDB" service');
        console.error('3. Right-clicking and selecting "Start"');
        process.exit(1);
      }
    }
  };

  await connect();
};

module.exports = connectDB;
