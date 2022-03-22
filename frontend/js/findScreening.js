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

  const chosenMovie = getStorage("filterMovie");

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

async function bookScreening(screeningId) {
  let screening = await (await fetch('http://localhost:5600/api/screenings/' + screeningId)).json();
  console.log(screening);
  setStorage("screening", screening);
  if (getStorage("booking") === (undefined || null)) {
    let booking = { "bookingId": "", "userId": "", "adults": 0, "children": 0, "seniors": 0 }
    setStorage("booking", booking);
  }

  history.pushState(null, null, "/newBooking");
  router();
}

function playVideo(screeningId) {
  const iframes = document.querySelectorAll(".iframe");

  for (let iframe of iframes) {
    if (iframe.id == screeningId) {
      iframe.classList.toggle("playingVideo");
    }
  }
}

async function generateScreenings() {

  let html = '';

  for (let screening of filteredScreenings) {
    let link = screening.link.split("/").pop();
    let timeArray = screening.time.split(":");
    let hr = timeArray[0];
    let min = timeArray[1];

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
            <h1 onclick="bookScreening(${screening.screeningId})">${hr}:${min}</h1>
            <p>Book this</p>
          </div>
        </div>
      </div>
      <div class="movieMedia">
         <img
        onclick="playVideo(${screening.screeningId})"
        src="${screening.thumbnailUrl}"
        alt=""></img>

        <iframe class="iframe" id="${screening.screeningId}" src="http://www.imdb.com/video/imdb/${link}/imdb/embed"
        autoplay="true" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true" mozallowfullscreen="true"
        webkitallowfullscreen="true" scrolling="no"></iframe>
      </div>
    </div>
    `;
  }

  screeningHolder.innerHTML = html;
}