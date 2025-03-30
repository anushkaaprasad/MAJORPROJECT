const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking
} = require('../controllers/booking');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getBookings);
router.get('/:id', getBooking);

// Protected routes (authenticated users)
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

// Admin only routes
router.put('/:id/approve', protect, authorize('admin'), approveBooking);
router.put('/:id/reject', protect, authorize('admin'), rejectBooking);

module.exports = router; 