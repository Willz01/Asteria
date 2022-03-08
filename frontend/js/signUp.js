
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

      var auth = {
        email: email,
        password: btoa(password)
      }

      handAuthData(API_URL_SIGN_IN, {
        email: email,
        password: btoa(password)
      })

    } else {  // sign Up
      console.log("POSTING SIGN UP");
      var auth = {
        email: email,
        userName: userName,
        password: btoa(password)
      }
      handAuthData(API_URL_SIGN_UP, auth)
    }

    console.log(email, userName, password);
  })
}

async function handAuthData(url = '', data = {}) {
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

  let r = response
  if (r.status === 404) {
    alert('Invalid Login credentials')
  } else if (r.status === 200) {
    // sucess
    saveSession(data)
    window.location.replace('/')
  } if (r.status === 501) {
    alert('Username or email taken')
    window.location.replace('/signUp')
  }


  console.log(response.status);
  console.log(response);
  console.log(typeof response);
}
