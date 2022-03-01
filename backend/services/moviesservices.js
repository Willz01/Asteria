require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getMovieById(req, res, next) {
  runQuery(res, req.params.userId,
    `SELECT * FROM movies WHERE id = ${req.params.userId}`, true);
  res.send({ movieID: req.params.id })
}

function getAllMovies(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM movies`, false);
  res.send({ testALL: 'movies' })
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

exports.getMovieById = getMovieById
exports.getAllMovies = getAllMovies