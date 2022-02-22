require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getTheaterById(req, res, next) {
  res.send({ theaterID: req.params.id })
}

function getAllTheaters(req, res, next) {
  res.send({ testALL: 'theaters' })
}

exports.getTheaterById = getTheaterById
exports.getAllTheaters = getAllTheaters