require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getCurrentBoookings(req, res, next) {
  res.send({ test: 'works' })
}

function getPreviousBookings(req, res, next) {

}

function getBookingById(req, res, next) {
  res.send({ bookingID: req.params.id })
}

function deleteBooking(req, res, next) {

}

function newBooking(req, res, next) {

}

function editBooking(req, res, next) {

}

exports.deleteBooking = deleteBooking
exports.getBookingById = getBookingById
exports.getCurrentBoookings = getCurrentBoookings
exports.getPreviousBookings = getPreviousBookings
exports.newBooking = newBooking
exports.editBooking = editBooking

