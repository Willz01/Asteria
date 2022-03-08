
const express = require('express')
const router = express.Router()

const userServices = require('../services/usersservices')
const bookingRouter = require('./bookingrouter')


// '/users/:id'
router.post('/signIn', userServices.login)

// '/users' --admin
router.get('/', userServices.getAllUsers)

router.post('/signUp', userServices.signUp)

// '/users/:id/bookings' -- booking router
router.use('/:id/bookings', bookingRouter)


module.exports = router