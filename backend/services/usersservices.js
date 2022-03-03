require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)

function getUserById(req, res) {
  runQuery(res, req.params.userId,
    `SELECT * FROM users WHERE id = ${req.params.id}`, true);
  res.send({ userId: req.params.userId })
}

function getAllUsers(req, res) {
  runQuery(res, {},
    `SELECT * FROM users`, false);
}

function postNewUser(req, res) {
  delete req.body.id;

  runQuery(res, req.body,
    `
        INSERT INTO users (${Object.keys(req.body)})
        VALUES (${Object.keys(req.body).map(x => ':' + x)})
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

exports.getUserById = getUserById
exports.getAllUsers = getAllUsers
exports.postNewUser = postNewUser

