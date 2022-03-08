
const express = require('express')
const router = express.Router()

const userServices = require('../services/usersservices')
const bookingRouter = require('./bookingrouter')


// '/users/:id'
router.post('/signIn', userServices.getUser)

// '/users' --admin
router.get('/all', userServices.getAllUsers)

router.post('/signUp', userServices.postNewUser)

// '/users/:id/bookings' -- booking router
router.use('/:id/bookings', bookingRouter)


module.exports = router