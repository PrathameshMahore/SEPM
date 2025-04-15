const express = require("express");
const router = express.Router();
const ParkingHistory = require("../models/parkingHistory");

// Get parking history for a specific user
router.get("/history", async (req, res) => {
  try {
    const { userName } = req.query;
    
    if (!userName) {
      return res.status(400).json({ message: "User name is required" });
    }

    const history = await ParkingHistory.find({ userName })
      .sort({ startTime: -1 }) // Sort by most recent first
      .limit(10); // Limit to 10 most recent bookings
    
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking history", error: error.message });
  }
});

// Get all parking history (admin only)
router.get("/all", async (req, res) => {
  try {
    const history = await ParkingHistory.find()
      .sort({ startTime: -1 })
      .limit(50);
    
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all parking history", error: error.message });
  }
});

// Add a new parking history entry
router.post("/", async (req, res) => {
  try {
    const newHistory = new ParkingHistory(req.body);
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(400).json({ message: "Error adding parking history", error: error.message });
  }
});

// Update a parking history entry
router.put("/:id", async (req, res) => {
  try {
    const updatedHistory = await ParkingHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedHistory) {
      return res.status(404).json({ message: "Parking history not found" });
    }
    
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: "Error updating parking history", error: error.message });
  }
});

// Delete a parking history entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedHistory = await ParkingHistory.findByIdAndDelete(req.params.id);
    
    if (!deletedHistory) {
      return res.status(404).json({ message: "Parking history not found" });
    }
    
    res.status(200).json({ message: "Parking history deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting parking history", error: error.message });
  }
});

// Get parking statistics for a user
router.get("/stats", async (req, res) => {
  try {
    const { userName } = req.query;
    
    if (!userName) {
      return res.status(400).json({ message: "User name is required" });
    }

    const userHistory = await ParkingHistory.find({ userName });
    
    // Calculate statistics
    const totalBookings = userHistory.length;
    const totalSpent = userHistory.reduce((sum, booking) => sum + booking.totalCost, 0);
    const totalHours = userHistory.reduce((sum, booking) => 
      sum + booking.duration.hours + (booking.duration.minutes / 60), 0);
    
    // Get most used slot
    const slotCounts = {};
    userHistory.forEach(booking => {
      slotCounts[booking.slotNumber] = (slotCounts[booking.slotNumber] || 0) + 1;
    });
    
    const mostUsedSlot = Object.entries(slotCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    // Get preferred payment method
    const paymentMethodCounts = {};
    userHistory.forEach(booking => {
      paymentMethodCounts[booking.paymentMethod] = (paymentMethodCounts[booking.paymentMethod] || 0) + 1;
    });
    
    const preferredPaymentMethod = Object.entries(paymentMethodCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    res.status(200).json({
      totalBookings,
      totalSpent,
      totalHours: Math.round(totalHours * 10) / 10,
      mostUsedSlot,
      preferredPaymentMethod,
      lastBooking: userHistory[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking statistics", error: error.message });
  }
});

module.exports = router;
