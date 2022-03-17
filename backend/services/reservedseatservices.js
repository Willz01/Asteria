require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getAllReservations(req, res, next) {
  res.send({ test: 'current reservations' })
}

function getByScreeningId(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM reservedseats WHERE screeningId = ${req.body.id}`, false);
}

function getByBookingId(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM reservedseats WHERE bookingId = ${req.body.id}`, false);
}

// screeningId, date, time, theaterId, movieId
function newReservation(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO reservedSeats(reservedSeatId, bookingId, screeningId, seatId) VALUES(
      ${req.body.reservedSeatId}, ${req.body.bookingId}, ${req.body.screeningId}, ${req.body.seatId})`);
}

function runQuery(res, parameters, sqlForPreparedStatement, onlyOne = false) {
  let result;
  try {
    let stmt = db.prepare(sqlForPreparedStatement);

    let method = sqlForPreparedStatement.trim().toLowerCase().indexOf('select') === 0 ?
      'all' : 'run';
    result = stmt[method](parameters);
  }
  catch (error) {

    result = { _error: error + '' };
  }
  if (onlyOne) { result = result[0]; }
  result = result || null;
  res.status(result ? (result._error ? 500 : 200) : 404);
  res.json(result);
}

exports.getAllReservations = getAllReservations
exports.getByScreeningId = getByScreeningId
exports.getByBookingId = getByBookingId
exports.newReservation = newReservation
