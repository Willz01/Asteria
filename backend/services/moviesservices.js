require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.nextTick.SQLITE_URL)


function getMovieById(req, res, next) {
  res.send({ movieID: req.params.id })
}

function getAllMovies(req, res, next) {
  res.send({ testALL: 'movies' })
}

exports.getMovieById = getMovieById
exports.getAllMovies = getAllMovies