require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)

function getUserById(req, res, next) {
  console.log(req.body);
  res.send(req.body)
  /* runQuery(res, req.params.userId,
    `SELECT * FROM users WHERE password = ${req.params.id}`, true); */
}

function getAllUsers(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM users`, false);
}

function newUser(req, res, next) {
  console.log('new user');
  console.log(req.body);
  res.send(req.body)
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

exports.getUserById = getUserById
exports.getAllUsers = getAllUsers
exports.newUser = newUser
