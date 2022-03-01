require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)


function getTheaterById(req, res, next) {
  runQuery(res, req.params.id,
    `SELECT * FROM movies WHERE id = ${req.params.id}`, true);
  res.send({ theaterID: req.params.id })
}

function getAllTheaters(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM theaters`, false);
  res.send({ testALL: 'theaters' })
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

exports.getTheaterById = getTheaterById
exports.getAllTheaters = getAllTheaters