
const API_URL_SIGN_UP = 'http://127.0.0.1:5600/api/users/signUp'
const API_URL_SIGN_IN = 'http://127.0.0.1:5600/api/users/signIn'

/* document.querySelector('#logout').addEventListener('click', () => {
  window.location.href = "/"
}) */

var c = 1
function toogle() {
  if (c % 2 == 0) {
    document.getElementById('userName-div').style.display = 'Block'
    document.getElementById('submit-btn').innerText = 'Sign Up'
    document.getElementById('userName').value = ''
    c++
  } else {
    document.getElementById('userName-div').style.display = 'None'
    // for signing in
    document.getElementById('userName').value = 'empty'
    document.getElementById('submit-btn').innerText = 'Sign In'
    c++
  }
}

function hideUN() {
  toogle()
}

document.getElementById('sign-thing').addEventListener('click', () => {

  var text = document.getElementById('sign-thing').innerText
  if (text == 'SIGN OUT') {
    // clear session
    clearSession()
    // return to home page
    window.location.href = '/'
  } else {
    // redirect to sign UP/sign IN
    window.location.href = '/signUp'
  }
})

function handleAccount() {
  console.log('Sign Up Page')
  document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault()
    console.log('Form clicked');

    let data = new FormData(document.getElementById('form'))

    let email = data.get('email')
    let userName = data.get('userName')
    let password = data.get('password')

    // sign IN
    if (userName === 'empty') {
      console.log('logged in');
      var auth = {
        email: email,
        password: btoa(password)
      }

      let result = postData(API_URL_SIGN_IN, {
        email: email,
        password: btoa(password)
      })
      if (result != undefined) {
        alert('Invalid Login credentials')
      } else {
        // sucess
        saveSession(auth)
        window.location.href = '/'
      }

    } else {  // sign Up
      console.log("POSTING SIGN UP");
      var auth = {
        email: email,
        userName: userName,
        password: btoa(password)
      }
      let r = postData(API_URL_SIGN_UP, auth)
      if (r.data != undefined) {
        saveSession(auth)

        window.location.href = '/'
      }
    }

    console.log(email, userName, password);
  })
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
