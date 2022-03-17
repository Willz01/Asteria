let searchButton = null;
let theatreSelect = null;
let screeningHolder = null;
let screenings = [];
let theatres = [];
let movies = [];
let filteredScreenings = [];

async function getScreenings() {
  let screenings = await (await fetch('http://localhost:5600/api/screenings')).json();
  return screenings;
}

async function getMovies() {
  let movies = await (await fetch('http://localhost:5600/api/movies')).json();
  return movies;
}

async function getTheatres() {
  let theatres = await (await fetch('http://localhost:5600/api/theatres')).json();
  return theatres;
}

async function fillSelections() {
  screenings = await getScreenings();
  //theatres = getTheatres();
  movies = await getMovies();

  document.querySelector('#search-button').addEventListener('click', filterScreenings);

  theatreSelect = document.querySelector('#select-theatre');
  daySelect = document.querySelector('#select-day');
  movieSelect = document.querySelector('#select-movie');
  screeningHolder = document.querySelector('#screenings-holder');

  fillTheatre();
  fillDay();
  fillMovie();

  const chosenMovie = JSON.parse(window.sessionStorage.getItem("filterMovie"));

  if (chosenMovie) {
    movieSelect.value = chosenMovie
    document.querySelector('#search-button').click();
  }

}

function fillTheatre() {

  let html = '<option value="" disabled selected>Select theatre</option>';

  for (let { name } of theatres) {
    html += `<option>${name}</option>`;
  }

  theatreSelect.innerHTML = html;
}

function fillDay() {

  let html = '<option value="" disabled selected>Select day</option>';
  let days = [];
  for (let { date } of screenings) {
    if (!days.includes(date)) {
      days.push(date);
    }
  }

  for (let day of days) {
    html += `<option>${day}</option>`;
  }

  daySelect.innerHTML = html;
}

function fillMovie() {

  let html = '<option value="" disabled selected>Select movie</option>';

  for (let { title } of movies) {
    html += `<option>${title}</option>`;
  }

  movieSelect.innerHTML = html;
}

function filterScreenings() {

  let screeningsAndMovies = screenings.map((screening) => {
    let haveEqualId = (movie) => movie.movieId === screening.movieId
    let movieWithEqualId = movies.find(haveEqualId)
    return Object.assign({}, screening, movieWithEqualId)
  })

  let screeningsAndMoviesAndTheatres = screeningsAndMovies.map((screening) => {
    let haveEqualId = (theatre) => theatre.theatreId === screening.theatreId
    let theatreWithEqualId = theatres.find(haveEqualId)
    return Object.assign({}, screening, theatreWithEqualId)
  });

  filteredScreenings = screeningsAndMoviesAndTheatres.filter(e => {
    return (!theatreSelect.value || e.name === theatreSelect.value) && (!daySelect.value || e.date === daySelect.value) && (!movieSelect.value || e.title === movieSelect.value);
  });

  generateScreenings();

}

async function bookScreening(element) {
  let id = element.id;
  console.log(id)

  let screening = await (await fetch('http://localhost:5600/api/screenings/' + id)).json();
  console.log(screening);

  window.sessionStorage.setItem("screening", JSON.stringify(screening));
  let booking = { "bookingId": "", "userId": "", "adults": 0, "children": 0, "seniors": 0 }
  window.sessionStorage.setItem("booking", JSON.stringify(booking));

  history.pushState(null, null, "/newBooking");
  router();
}

async function generateScreenings() {

  let html = '';

  for (let screening of filteredScreenings) {

    html += `
    <div id="screening-container">
      <div class="movie-information">
        <h2>${screening.title}</h2>
        <p id="movie-plot">${screening.plot}</p>
        <p>
        <span class="info-screening left">2 hours</span>
        <span class="info-screening">${screening.name}</span>
        </p>
        <div class="screening-times">
      <div class="screening">
      <h1 id=${screening.screeningId} onclick="bookScreening(this)">${screening.time.slice(0, -3)}</h1>
        <p>Book this</p>
      </div>
   </div>
    </div>
      <img
        src="${screening.thumbnailUrl}"
        alt="">
    </div>
    `;
  }

  screeningHolder.innerHTML = html;

}


