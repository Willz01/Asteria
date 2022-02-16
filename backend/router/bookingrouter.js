const express = require('express')

const router = express.Router()
const bookingServices = require('../services/bookingservices')


// get user's current bookings
router.get('/current', bookingServices.getCurrentBoookings)

// get user's previous bookings
router.get('/previous', bookingServices.getPreviousBookings)

// get user's booking 
router.get('/:id', bookingServices.getBookingById)

// post new booking
router.post('/new-booking', bookingServices.newBooking)

// edit user's booking
router.put('/:id', bookingServices.editBooking)

// delete user's booking
router.delete('/:id', bookingServices.deleteBooking)

module.exports = router