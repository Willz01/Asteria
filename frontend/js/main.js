

document.querySelector('body').addEventListener('click', function (event) {
  let aTag = event.target.closest('a');

  if (!aTag) {
    return;
  }

  let href = aTag.getAttribute('href');

  if (href.indexOf('http') === 0) {
    aTag.setAttribute('target', '_blank');
    return;
  }

  event.preventDefault();

  history.pushState(null, null, href);

  router();
});


function makeMenuChoiceActive(route) {
  document.querySelector('.dropdown').classList.remove('active');
  // change active link in the menu
  let aTagsInNav = document.querySelectorAll('nav a');
  for (let aTag of aTagsInNav) {
    aTag.classList.remove('active');
    let href = aTag.getAttribute('href');
    if (href === route) {
      aTag.classList.add('active');
    }
  }

  if (route === '/findScreening' || route === '/bookings') {
    document.querySelector('.dropdown').classList.add('active');
  }
}

async function router() {
  let route = location.pathname;
  console.log(route);
  makeMenuChoiceActive(route);
  // transform route to be a path to a partial
  route = route === '/' ? '/start' : route;
  route = '/views' + route + '.html';
  // load the content from the partial
  let content = await (await fetch(route)).text();
  // if no content found then load the start page
  content.includes('<title>Error</title>') && location.replace('/');
  // replace the content of the main element
  document.querySelector('main').innerHTML = content;
  // run the productLister function (in another file)
  // if the route is '/partials/products.html';
  route === '/views/start.html' && fillMovieCards();
  route === '/views/bookings.html';
  route === '/views/findScreening.html' && fillSelections();
  route === '/views/signUp.html';
  route === '/views/newBooking.html' && await newBooking();
  route === '/views/signUp.html' && handleAccount();
}

if (isSavedSession()) {

  console.log(getSavedSession());
  document.getElementById('sign-thing').innerText = 'SIGN OUT'
  document.getElementById('sign-thing').style.color = 'red'
} else {
  console.log('No saved session');
  document.getElementById('sign-thing').innerText = 'SIGN UP/IN'
  // document.getElementById('sign-thing').style.color = 'white'
}
console.log(isSavedSession());

// runt the router when using the back/forward buttons
window.addEventListener('popstate', router);

// run the router on page load
router();

document.querySelector('.booking-btn').addEventListener('click', () => {
  if (isSavedSession()) {

  } else {
    window.location.href = '/signUp'
  }
})