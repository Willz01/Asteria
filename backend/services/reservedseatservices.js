require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getAllReservations(req, res, next) {
  runQuery(`SELECT * FROM reservedseats`, false);
}

function getByScreeningId(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM reservedseats WHERE screeningId = ${req.params.id}`, false);
}

function getByBookingId(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM reservedseats WHERE bookingId = ${req.params.id}`, false);
}

// screeningId, date, time, theaterId, movieId
function newReservation(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO reservedseats(reservedSeatId, bookingId, screeningId, seatId, dateTime, isTemp) VALUES(
      ${req.body.reservedSeatId}, ${req.body.bookingId}, ${req.body.screeningId}, ${req.body.seatId}, ${req.body.dateTime}, ${req.body.isTemp})`);
}

function updateReservation(req, res, next) {
  runQuery(`
    UPDATE reservedseats 
    SET
    screeningId = ${req.body.screeningId}, 
    seatId = ${req.body.seatId}, 
    dateTime = ${req.body.dateTime},
    isTemp = ${req.body.isTemp}
    WHERE bookingId = ${req.body.bookingId} AND reservedSeatId = ${req.body.reservedSeatId}
  `);
}

function deleteReservation(req, res, next) {
  runQuery(res, {},
    `DELETE FROM reservedseats WHERE reservedSeatId = ${req.params.id}`, true);
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
exports.updateReservation = updateReservation
exports.deleteReservation = deleteReservation
