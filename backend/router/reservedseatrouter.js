const express = require('express')

const router = express.Router()
const reservedSeatServices = require('../services/reservedseatservices')

// Admin get all reservations
router.get('/', reservedSeatServices.getAllReservations)

// get a seat reservation by the bookingId  
router.get('/booking/:id', reservedSeatServices.getByBookingId)

// get all seat reservation by the screeningId
router.get('/:id', reservedSeatServices.getByScreeningId)

// create new seat reservation
router.post('/new-reservation', reservedSeatServices.newReservation)

module.exports = router