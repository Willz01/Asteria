const express = require('express')
const router = express.Router()

const movieServices = require('../services/moviesservices')

// movies/:id
router.get('/:id', movieServices.getMovieById)

// /movies
router.get('/', movieServices.getAllMovies)


module.exports = router