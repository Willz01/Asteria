
// save logged user session
function saveSession(user = {}) {
  window.sessionStorage.setItem('userHash', btoa(JSON.stringify(user)))
  window.localStorage.setItem('userHash', btoa(JSON.stringify(user)))
}

// get session : for checking if there is akready a logged user
function getSavedSession() {
  return window.sessionStorage.getItem('userHash') || window.localStorage.getItem('userHash')
}

// clear session: for logOut
function clearSession() {
  window.sessionStorage.removeItem('userHash')
  window.localStorage.removeItem('userHash')
}

function isSavedSession() {
  if (sessionStorage.getItem('userHash') === null && localStorage.getItem('userHash') === null)
    return false
  else
    return true
}

