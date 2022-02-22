require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getBookings(req, res, next) {
  res.send({ test: 'current bookings' })
}

function getBookingById(req, res, next) {
  res.send({ bookingID: req.params.id })
}

function deleteBooking(req, res, next) {
  res.send({ deleted: req.params.id })
}

function newBooking(req, res, next) {
  res.send(req.query)
}

function editBooking(req, res, next) {
  res.send(req.query)
}

exports.deleteBooking = deleteBooking
exports.getBookingById = getBookingById
exports.getBookings = getBookings
exports.newBooking = newBooking
exports.editBooking = editBooking

