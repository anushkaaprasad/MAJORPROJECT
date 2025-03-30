const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title for your event'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Please select a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please select an end time']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one booking for the same time slot
BookingSchema.index({ startTime: 1, endTime: 1 }, { unique: false });

// Validate that end time is after start time
BookingSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    const error = new Error('End time must be after start time');
    return next(error);
  }
  next();
});

// Static method to check if a time slot is available
BookingSchema.statics.isTimeSlotAvailable = async function(startTime, endTime, excludeBookingId = null) {
  const query = {
    status: 'approved',
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  const bookings = await this.find(query);
  return bookings.length === 0;
};

module.exports = mongoose.model('Booking', BookingSchema); 