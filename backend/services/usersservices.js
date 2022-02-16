
function getUserById(req, res, next) {
  res.send({ userId: req.params.userId })
}

function getAllUsers(req, res, next) {
  res.send({ test: 'all users' })
}

exports.getUserById = getUserById
exports.getAllUsers = getAllUsers