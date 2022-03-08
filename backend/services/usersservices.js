require('dotenv').config()

const sqlite = require('better-sqlite3');
const e = require('express');
const db = sqlite(process.env.SQLITE_URL)

function login(req, res, next) {
  console.log(req.body);
  runQuery(res, req.body,
    `SELECT * FROM users WHERE password = '?p' AND email = '?e'`, true);
  //`SELECT * FROM users WHERE password = (${req.body.password}) AND email = (${req.body.email})`, true);
}

function getAllUsers(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM users`, false);
}

function signUp(req, res) {
  delete req.body.id;
  console.log(req.body);

  runQuery(res, req.body,
    `
        INSERT INTO users (${Object.keys(req.body)})
        VALUES (${Object.keys(req.body).map(x => ':' + x)})
      `);
}

function runQuery(res, parameters, sqlForPreparedStatement, onlyOne = false) {
  let result;
  try {
    let stmt
    if (sqlForPreparedStatement == `SELECT * FROM users WHERE password = '?p' AND email = '?e'`) {
      console.log(sqlForPreparedStatement)

      const sqlForPreparedStatementP = sqlForPreparedStatement.replace('?p', parameters.password);
      var sqlForPreparedStatementE = sqlForPreparedStatementP.replace('?e', parameters.email);

      console.log(sqlForPreparedStatementE)

      stmt = db.prepare(sqlForPreparedStatementE);
    } else {
      stmt = db.prepare(sqlForPreparedStatement);
    }

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
  console.log(result)
  res.json(result);
}

exports.login = login
exports.getAllUsers = getAllUsers
exports.signUp = signUp
