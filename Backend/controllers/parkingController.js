const Parking = require('../models/parking');

// Create a new parking
exports.createParking = async (req, res) => {
  try {
    const {
      name,
      address,
      totalSlots,
      pricePerHour,
      ownerName,
      ownerContact,
      ownerEmail,
      amenities,
      operatingHours,
      images,
      location
    } = req.body;

    // Validate required fields
    if (!name || !address || !totalSlots || !pricePerHour || !ownerName || !ownerContact || !ownerEmail || !operatingHours || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create parking
    const parking = new Parking({
      name,
      address,
      totalSlots,
      availableSlots: totalSlots, // Initially all slots are available
      bookedSlots: 0,
      pricePerHour,
      ownerName,
      ownerContact,
      ownerEmail,
      amenities: amenities || [],
      operatingHours,
      images: images || [],
      location
    });

    // Save parking
    await parking.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Parking created successfully',
      data: parking
    });
  } catch (error) {
    console.error('Error creating parking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating parking',
      error: error.message
    });
  }
};

// Get all parkings
exports.getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find();
    
    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings
    });
  } catch (error) {
    console.error('Error getting parkings:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting parkings',
      error: error.message
    });
  }
};

// Get parking by ID
exports.getParkingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const parking = await Parking.findById(id);
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: parking
    });
  } catch (error) {
    console.error('Error getting parking:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting parking',
      error: error.message
    });
  }
};

// Update parking
exports.updateParking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Don't allow updating these fields directly
    delete updateData.availableSlots;
    delete updateData.bookedSlots;
    delete updateData.bookedSlotsArray;
    
    const parking = await Parking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Parking updated successfully',
      data: parking
    });
  } catch (error) {
    console.error('Error updating parking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating parking',
      error: error.message
    });
  }
};

// Delete parking
exports.deleteParking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const parking = await Parking.findByIdAndDelete(id);
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Parking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting parking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting parking',
      error: error.message
    });
  }
};

// Get nearby parkings
exports.getNearbyParkings = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }
    
    const parkings = await Parking.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings
    });
  } catch (error) {
    console.error('Error getting nearby parkings:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting nearby parkings',
      error: error.message
    });
  }
};

// Add review to parking
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;
    
    if (!userId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'User ID and rating are required'
      });
    }
    
    const parking = await Parking.findById(id);
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    
    // Add review
    parking.reviews.push({
      userId,
      rating,
      comment
    });
    
    // Update average rating
    const totalRating = parking.reviews.reduce((sum, review) => sum + review.rating, 0);
    parking.rating = totalRating / parking.reviews.length;
    
    await parking.save();
    
    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: parking
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
}; 