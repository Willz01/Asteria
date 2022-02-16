const express = require('express')
const router = express.Router()

const userServices = require('../services/usersservices')
const bookingRouter = require('./bookingrouter')


// '/users/:id'
router.get('/:userId', userServices.getUserById)

// '/users' --admin
router.get('/', userServices.getAllUsers)


// '/users/:userId/bookings' -- booking router
router.use('/:userId/bookings', bookingRouter)


module.exports = router