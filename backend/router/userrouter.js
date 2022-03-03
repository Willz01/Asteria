const { request, response } = require('express')
const express = require('express')
const router = express.Router()

const userServices = require('../services/usersservices')
const bookingRouter = require('./bookingrouter')


// '/users/:id'
router.get('/:id', userServices.getUserById)

// '/users' --admin
router.get('/', userServices.getAllUsers)

router.post('/newuser', userServices.postNewUser)

// '/users/:id/bookings' -- booking router
router.use('/:id/bookings', bookingRouter)


module.exports = router