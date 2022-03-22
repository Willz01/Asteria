require('dotenv').config()
const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)
function getBookings(req, res, next) {
  res.send({ test: 'current bookings' })
}
function getBookingById(req, res, next) {
  console.log(req.params)
  runQuery(res, {},
    `SELECT * FROM bookings WHERE bookingId = ${req.params.id}`, true);
}

function getMyBookingByUserId(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM bookingsInfo WHERE userid = ${req.params.id}`, false);
}
// userId, adults, children, seniors
function newBooking(req, res, next) {
  console.log(req.body)
  const row = db.
    prepare('INSERT INTO bookings(bookingId, userId, adults, children, seniors) VALUES(?, ?, ?, ?, ?)')
    .run(req.body.bookingId, req.body.userId, req.body.adults, req.body.children, req.body.seniors);
  console.log(row);
}

function updateBooking(req, res, next) {
  runQuery(`
    UPDATE bookings 
    SET
    userId = ${req.body.userId}, 
    adults = ${req.body.adults},
    children = ${req.body.children},
    seniors = ${req.body.seniors}
    WHERE bookingId = ${req.body.bookingId}
  `);
}

function deleteBooking(req, res, next) {
  runQuery(res, {},
    `DELETE FROM bookings WHERE bookingId = ${req.params.id}`, true);
}

//booking and reserved seats join on 
function getBookingAndSeats(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO seats(taken, tempReserved, screeningId, bookingId, seatNumber) VALUES(
      FALSE, TRUE, ${req.body.screeningId}, ${req.body.bookingId}, ${req.body.seatNumber})`);
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
exports.getMyBookingByUserId = getMyBookingByUserId
exports.getBookingById = getBookingById
exports.getBookings = getBookings
exports.newBooking = newBooking
exports.updateBooking = updateBooking
exports.getBookingAndSeats = getBookingAndSeats
exports.deleteBooking = deleteBooking