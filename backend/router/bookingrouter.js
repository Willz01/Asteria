const express = require('express')

const router = express.Router()
const bookingServices = require('../services/bookingservices')



router.get('/current', bookingServices.getCurrentBoookings)

router.get('/previous', bookingServices.getPreviousBookings)

router.get('/:id', bookingServices.getBookingById)

router.post('/new-booking', bookingServices.newBooking)

router.put('/:id', bookingServices.editBooking)

router.delete('/:id', bookingServices.deleteBooking)

module.exports = router