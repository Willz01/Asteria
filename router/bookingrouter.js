const express = require('express')
const getOldBookings = require('../services/bookingservice')
const router = express.Router()
const getCurrentBookings = require('../services/bookingservice')


router.get('/current', getCurrentBookings)

router.get('/previous', getOldBookings)

module.exports = router