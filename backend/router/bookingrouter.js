const express = require('express')

const router = express.Router()
const bookingServices = require('../services/bookingservices')


// get user's bookings
router.get('/bookings', bookingServices.getBookings)

// get user's booking 
router.get('/:id', bookingServices.getBookingById)

// post new booking
router.post('/new-booking', bookingServices.newBooking)

// book seats for a new booking
router.post('/book-seats', bookingServices.bookSeats)

// temporarily book seats, not sure if it will be used
// call this method when clicking on the seats but prior to booking I guess
router.post('/temp-book-seats', bookingServices.tempBookSeats)


// edit user's booking
//router.put('/:id', bookingServices.editBooking)

// delete user's booking
//router.delete('/:id', bookingServices.deleteBooking)

module.exports = router