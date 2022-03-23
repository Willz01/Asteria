const express = require('express')

const router = express.Router()
const bookingServices = require('../services/bookingservices')


// get user's bookings
router.get('/bookings', bookingServices.getBookings)

// get user's booking 
router.get('/:id', bookingServices.getBookingById)

// post new booking
router.post('/new-booking', bookingServices.newBooking)

router.get('/full-booking/:id', bookingServices.getBookingAndSeats)

// edit user's booking
router.put('/:id', bookingServices.updateBooking)

router.delete('/:id', bookingServices.deleteBooking)

// delete user's booking
//router.delete('/:id', bookingServices.deleteBooking)

module.exports = router