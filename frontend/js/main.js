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
  // change active link in the menu
  let aTagsInNav = document.querySelectorAll('nav a');
  for (let aTag of aTagsInNav) {
    aTag.classList.remove('active');
    let href = aTag.getAttribute('href');
    if (href === route) {
      aTag.classList.add('active');
    }
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
  route === '/views/signUp.html';
}


// runt the router when using the back/forward buttons
window.addEventListener('popstate', router);

// run the router on page load
router();