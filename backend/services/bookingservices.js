require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getBookings(req, res, next) {
  res.send({ test: 'current bookings' })
}

function getBookingById(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM bookings WHERE id = ${req.body.id}`, false);
}

// userId, adults, children, seniors
function newBooking(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO bookings(userId, adults, children, seniors) VALUES(
      ${req.body.userId}, ${req.body.adults}, ${req.body.children}, ${req.body.seniors})`);
}

function bookSeats(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO seats(taken, tempReserved, screeningId, bookingId, seatNumber) VALUES(
      TRUE, FALSE, ${req.body.screeningId}, ${req.body.bookingId}, ${req.body.seatNumber})`);
}

function tempBookSeats(req, res, next) {
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

exports.getBookingById = getBookingById
exports.getBookings = getBookings
exports.newBooking = newBooking
exports.tempBookSeats = tempBookSeats
exports.bookSeats = bookSeats

