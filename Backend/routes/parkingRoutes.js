const express = require('express');
const router = express.Router();
const Parking = require('../models/parking');

// Get all parking systems
router.get('/', async (req, res) => {
  try {
    const parkings = await Parking.find({});
    res.json({
      success: true,
      data: parkings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking data',
      error: error.message
    });
  }
});

// Get parking by ID
router.get('/:id', async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    res.json({
      success: true,
      data: parking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking data',
      error: error.message
    });
  }
});

// Get nearby parking systems
router.get('/nearby/:latitude/:longitude/:radius', async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.params;
    
    const parkings = await Parking.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    });

    res.json({
      success: true,
      data: parkings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby parking',
      error: error.message
    });
  }
});

// Add a review to a parking system
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }

    parking.reviews.push({
      userId,
      rating,
      comment
    });

    // Update average rating
    const totalRatings = parking.reviews.reduce((sum, review) => sum + review.rating, 0);
    parking.rating = totalRatings / parking.reviews.length;

    await parking.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: parking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

// Update parking availability
router.put('/:id/availability', async (req, res) => {
  try {
    const { availableSlots } = req.body;
    
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }

    parking.availableSlots = availableSlots;
    await parking.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: parking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
});

module.exports = router; 