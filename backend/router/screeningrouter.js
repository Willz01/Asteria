const express = require('express')

const router = express.Router()
const screeningServices = require('../services/screeningservices')

// get all screenings
router.get('/', screeningServices.getScreenings)

// get a screening by the Id  
router.get('/:id', screeningServices.getScreeningById)

// Admin create new screening
router.post('/new-screening', screeningServices.newScreening)

module.exports = router