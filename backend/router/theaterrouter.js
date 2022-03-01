const express = require('express')
const router = express.Router()

const theaterServices = require('../services/theaterservices')

// theater/:id
router.get('/:id', theaterServices.getTheaterById)

// /movies
router.get('/', theaterServices.getAllTheaters)


module.exports = router