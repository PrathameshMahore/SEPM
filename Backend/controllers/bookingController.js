const Booking = require('../models/booking');
const Parking = require('../models/parking');
const User = require('../models/userModel');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      parkingId,
      slotNumber,
      startTime,
      endTime,
      duration,
      paymentMethod,
      vehicleDetails
    } = req.body;

    // Validate required fields
    if (!userId || !parkingId || !slotNumber || !startTime || !endTime || !duration || !paymentMethod || !vehicleDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if parking exists
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }

    // Check if slot is available
    const isSlotBooked = parking.bookedSlotsArray.some(slot => slot.slotNumber === slotNumber);
    if (isSlotBooked) {
      return res.status(400).json({
        success: false,
        message: 'Slot is already booked'
      });
    }

    // Calculate total price
    const totalPrice = duration * parking.pricePerHour;

    // Create booking
    const booking = new Booking({
      userId,
      parkingId,
      slotNumber,
      startTime,
      endTime,
      duration,
      totalPrice,
      paymentMethod,
      vehicleDetails
    });

    // Save booking
    await booking.save();

    // Update parking - book the slot
    await parking.bookSlot(slotNumber, booking._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('parkingId', 'name address pricePerHour');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting booking',
      error: error.message
    });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookings = await Booking.find({ userId })
      .populate('parkingId', 'name address pricePerHour')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user bookings',
      error: error.message
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }
    
    // Cancel booking
    await booking.cancelBooking(reason);
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// Check in
exports.checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking can be checked in
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be checked in'
      });
    }
    
    // Check in
    await booking.checkIn();
    
    res.status(200).json({
      success: true,
      message: 'Checked in successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking in',
      error: error.message
    });
  }
};

// Check out
exports.checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking can be checked out
    if (booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be checked out'
      });
    }
    
    // Check out
    await booking.checkOut();
    
    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking out',
      error: error.message
    });
  }
}; 