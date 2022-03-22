const express = require('express')

const router = express.Router()
const reservedSeatServices = require('../services/reservedseatservices')

// Admin get all reservations
router.get('/', reservedSeatServices.getAllReservations)

// get a seat reservation by the bookingId  
router.get('/booking/:id', reservedSeatServices.getByBookingId)

// get all seat reservation by the screeningId
router.get('/screening/:id', reservedSeatServices.getByScreeningId)

// create new seat reservation
router.post('/new-reservation', reservedSeatServices.newReservation)

router.put('/update', reservedSeatServices.updateReservation)

router.delete('/delete', reservedSeatServices.deleteSeatReservation)

module.exports = router