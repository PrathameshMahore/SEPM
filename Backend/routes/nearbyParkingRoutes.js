const express = require("express");
const router = express.Router();
const NearbyParking = require("../models/nearbyParking");

// Get all nearby parking systems
router.get("/", async (req, res) => {
  try {
    const nearbyParkings = await NearbyParking.find().sort({ distance: 1 });
    res.status(200).json(nearbyParkings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby parking systems", error: error.message });
  }
});

// Get nearby parking systems by distance (in km)
router.get("/by-distance", async (req, res) => {
  try {
    const { maxDistance = 10 } = req.query;
    const nearbyParkings = await NearbyParking.find({
      distance: { $lte: parseFloat(maxDistance) }
    }).sort({ distance: 1 });
    res.status(200).json(nearbyParkings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby parking systems", error: error.message });
  }
});

// Get nearby parking systems by rating
router.get("/by-rating", async (req, res) => {
  try {
    const { minRating = 0 } = req.query;
    const nearbyParkings = await NearbyParking.find({
      rating: { $gte: parseFloat(minRating) }
    }).sort({ rating: -1 });
    res.status(200).json(nearbyParkings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby parking systems", error: error.message });
  }
});

// Add a new nearby parking system
router.post("/", async (req, res) => {
  try {
    const newParking = new NearbyParking(req.body);
    const savedParking = await newParking.save();
    res.status(201).json(savedParking);
  } catch (error) {
    res.status(400).json({ message: "Error adding nearby parking system", error: error.message });
  }
});

// Update a nearby parking system
router.put("/:id", async (req, res) => {
  try {
    const updatedParking = await NearbyParking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedParking) {
      return res.status(404).json({ message: "Parking system not found" });
    }
    res.status(200).json(updatedParking);
  } catch (error) {
    res.status(400).json({ message: "Error updating nearby parking system", error: error.message });
  }
});

// Delete a nearby parking system
router.delete("/:id", async (req, res) => {
  try {
    const deletedParking = await NearbyParking.findByIdAndDelete(req.params.id);
    if (!deletedParking) {
      return res.status(404).json({ message: "Parking system not found" });
    }
    res.status(200).json({ message: "Parking system deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting nearby parking system", error: error.message });
  }
});

module.exports = router; 