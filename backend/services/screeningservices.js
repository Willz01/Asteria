require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getScreenings(req, res, next) {
  runQuery(res, {}, `SELECT * FROM screenings`);
}

function getAllOfScreenings(req, res, next) {
  runQuery(res, {}, `SELECT 
        screenings.screeningId,
        screenings.date,
        screenings.time,
        movies.movieId,
        movies.title,
        movies.plot,
        movies.thumbnailUrl,
        movies.link,
        theaters.theaterId,
        theaters.name,
        theaters.mainRows,
        theaters.mainColumns 
      FROM screenings 
      JOIN movies ON screenings.movieId = movies.movieId 
      JOIN theaters ON screenings.theaterId = theaters.theaterId `);
}

function getScreeningById(req, res, next) {
  try {
    runQuery(res, {}, `SELECT 
        screenings.screeningId,
        screenings.date,
        screenings.time,
        movies.movieId,
        movies.title,
        movies.plot,
        movies.thumbnailUrl,
        movies.link,
        theaters.theaterId,
        theaters.name,
        theaters.mainRows,
        theaters.mainColumns 
      FROM screenings 
      JOIN movies ON screenings.movieId = movies.movieId 
      JOIN theaters ON screenings.theaterId = theaters.theaterId 
      WHERE screenings.screeningId = ${req.params.id}`, true);
  } catch (err) {
    console.log(err)
  }
}

// screeningId, date, time, theaterId, movieId
function newScreening(req, res, next) {
  console.log(req.body)
  runQuery(res, {},
    `INSERT INTO screenings(date, time, theaterId, movieId) VALUES(
      ${req.body.date}, ${req.body.time}, ${req.body.theaterId}, ${req.body.movieId})`);
}

function deleteSeatReservation(req, res, next) {
  const row = db.prepare(
    `DELETE FROM reservedseats WHERE seatId = ? AND screeningId = ?`).run(req.body.seatId, req.body.screeningId);
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


exports.getAllOfScreenings = getAllOfScreenings
exports.getScreeningById = getScreeningById
exports.getScreenings = getScreenings
exports.newScreening = newScreening
exports.deleteSeatReservation = deleteSeatReservation

