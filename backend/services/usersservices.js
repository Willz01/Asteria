require('dotenv').config()

const sqlite = require('better-sqlite3')
const db = sqlite(process.env.SQLITE_URL)

function getUser(req, res, next) {
  console.log(req.body);
  getUserFromDb(req, res)
}

// email and password : signIn
function getUserFromDb(req, res) {
  const row = db.prepare('SELECT * FROM users WHERE email = ? and password = ?').get(req.body.email, req.body.password);
  if (row != undefined) {
    console.log(row);
    console.log(row.email);
    res.status(200).send(row)
  } else {
    console.log("UNDEFINED OBJECT; DOESNT EXIST");
    res.status(404).json({ message: "User doesn't exist" })
  }
}

function getAllUsers(req, res, next) {
  const stm = db.prepare('SELECT * FROM users;')
  let all = stm.all()
  console.log(all);
  res.send(all)
}

function getMyBookingByUserId(req, res, next) {
  runQuery(res, {},
    `SELECT * FROM bookingsInfo WHERE userid = ${req.params.id}`, false);
}



function postNewUser(req, res) {
  delete req.body.id;
  console.log(req.body);
  addNewUser(req, res)
}

// email, username and password : sign Up
function addNewUser(req, res) {
  // save
  try {
    const row = db.
      prepare('INSERT INTO users(email, userName, password) VALUES(?, ?, ?)')
      .run(req.body.email, req.body.userName, req.body.password);
    console.log(row);
    // read, check and send
    getUserFromDb(req, res)
  } catch (err) {
    console.error(err);
    res.status(501).json({ message: "Use a different username or email" })
  }

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

exports.getUser = getUser
exports.getAllUsers = getAllUsers
exports.postNewUser = postNewUser
exports.getMyBookingByUserId = getMyBookingByUserId
