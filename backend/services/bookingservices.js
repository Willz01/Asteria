require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getBookings(req, res, next) {
  runQuery(`SELECT * FROM bookings`, false);
}

function getBookingById(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM bookings WHERE id = ${req.params.id}`, true);
}

// userId, adults, children, seniors
function newBooking(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO bookings(userId, adults, children, seniors) VALUES(
      ${req.body.userId}, ${req.body.adults}, ${req.body.children}, ${req.body.seniors})`);
}

function updateBooking(req, res, next) {
  runQuery(`
    UPDATE bookings 
    SET
    userId = ${req.body.userId}, 
    adults = ${req.body.adults},
    children = ${req.body.children},
    seniors
    WHERE bookingId = ${req.body.bookingId}
  `);
}

//booking and reserved seats join on 
function getBookingAndSeats(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `SELECT 
    bookings.bookingId,
    bookings.userId,
    bookings.adults,
    bookings.children,
    bookings.seniors,
    reservedseats.reservedSeatId,
    reservedseats.screeningId,
    reservedseats.seatId,
    reservedseats.dateTime,
    reservedseats.isTemp
    FROM bookings
    JOIN reservedseats
    ON bookings.bookingId = reservedseats.bookingId
    WHERE bookings.bookingId = ${req.params.id}
    `);
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
exports.updateBooking = updateBooking
exports.getBookingAndSeats = getBookingAndSeats

