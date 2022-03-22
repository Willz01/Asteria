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
  const row = db.
    prepare('INSERT INTO reservedseats(bookingId, screeningId, seatId, dateTime, isTemp) VALUES(?, ?, ?, ?, ?)')
    .run(req.body.bookingId, req.body.screeningId, req.body.seatId, req.body.dateTime, req.body.isTemp);
  console.log(row);
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
  const row = db.prepare(
    `DELETE FROM reservedseats WHERE reservationSeatId = ?`).run(req.params.id);
  console.log(row)
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
