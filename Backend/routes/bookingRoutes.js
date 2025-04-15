const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Get user's bookings
router.get('/user/:userId', bookingController.getUserBookings);

// Cancel booking
router.post('/:id/cancel', bookingController.cancelBooking);

// Check in
router.post('/:id/check-in', bookingController.checkIn);

// Check out
router.post('/:id/check-out', bookingController.checkOut);

module.exports = router; 