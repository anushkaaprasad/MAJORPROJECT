const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public
exports.getBookings = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource with enhanced user population
    query = Booking.find(JSON.parse(queryStr)).populate({
      path: 'user',
      select: 'name email _id'
    });
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const bookings = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'user',
      select: 'name email _id'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check if time slot is available
    const isAvailable = await Booking.isTimeSlotAvailable(
      new Date(req.body.startTime),
      new Date(req.body.endTime)
    );
    
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }
    
    // Check if the booking status is already approved or rejected
    if (booking.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot update a booking that is ${booking.status}`
      });
    }
    
    // Check if time slot is available
    if (req.body.startTime && req.body.endTime) {
      const isAvailable = await Booking.isTimeSlotAvailable(
        new Date(req.body.startTime),
        new Date(req.body.endTime),
        req.params.id
      );
      
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
    }
    
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'user',
      select: 'name email _id'
    });
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }
    
    await booking.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private/Admin
exports.approveBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Check if the booking is already approved
    if (booking.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already approved'
      });
    }
    
    // Check if time slot is available
    const isAvailable = await Booking.isTimeSlotAvailable(
      booking.startTime,
      booking.endTime,
      req.params.id
    );
    
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked by another approved event'
      });
    }
    
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'user',
      select: 'name email _id'
    });
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private/Admin
exports.rejectBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Check if the booking is already rejected
    if (booking.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already rejected'
      });
    }
    
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'user',
      select: 'name email _id'
    });
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
}; 