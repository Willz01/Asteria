require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getTheaterById(req, res, next) {
  runQuery(res, req.params.userId,
    `SELECT * FROM movies WHERE id = ${req.params.userId}`, true);
  res.send({ theaterID: req.params.id })
}

function getAllTheaters(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM theaters`, false);
  res.send({ testALL: 'theaters' })
}

exports.getTheaterById = getTheaterById
exports.getAllTheaters = getAllTheaters