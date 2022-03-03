


// save logged user session
function saveSession(user = {}) {
  window.sessionStorage.setItem('user', JSON.stringify(user))
}

// get session : for checking if there is akready a logged user
function getSavedSession() {
  return window.sessionStorage.getItem('user')
}

// clear session: for logOut
function clearSession() {
  window.sessionStorage.removeItem('user')
}

function isSavedSession() {
  if (sessionStorage.getItem('user') === null)
    return false
  else
    return true
}
