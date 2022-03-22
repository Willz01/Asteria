let searchButton = null;
let theaterSelect = null;
let screeningHolder = null;
let screenings = [];
let theaters = [];
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

async function getTheaters() {
  let theaters = await (await fetch('http://localhost:5600/api/theaters')).json();
  return theaters;
}

async function fillSelections() {
  screenings = await getScreenings();
  theaters = await getTheaters();
  movies = await getMovies();

  document.querySelector('#search-button').addEventListener('click', filterScreenings);

  theaterSelect = document.querySelector('#select-theater');
  daySelect = document.querySelector('#select-day');
  movieSelect = document.querySelector('#select-movie');
  screeningHolder = document.querySelector('#screenings-holder');

  fillTheater();
  fillDay();
  fillMovie();

  const chosenMovie = getStorage("filterMovie");

  if (chosenMovie) {
    movieSelect.value = chosenMovie
    document.querySelector('#search-button').click();
  }

}

function fillTheater() {

  let html = '<option value="" disabled selected>Select theater</option>';

  for (let { name } of theaters) {
    html += `<option>${name}</option>`;
  }

  theaterSelect.innerHTML = html;
}

function formatDate(input) {
  let date = new Date(input.replace(/ /g, 'T'));
  return [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ][date.getMonth()] + ' ' + date.getDate();
}

function fillDay() {

  let html = '<option value="" disabled selected>Select day</option>';
  let days = [];
  for (let { date } of screenings) {
    if (!days.includes(formatDate(date))) {
      days.push(formatDate(date));
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

  let screeningsAndMoviesAndTheaters = screeningsAndMovies.map((screening) => {
    let haveEqualId = (theater) => theater.theaterId === screening.theaterId
    let theaterWithEqualId = theaters.find(haveEqualId)
    return Object.assign({}, screening, theaterWithEqualId)
  });

  console.log(screeningsAndMoviesAndTheaters);

  filteredScreenings = screeningsAndMoviesAndTheaters.filter(e => {
    return (!theaterSelect.value || e.name === theaterSelect.value) && (!daySelect.value || formatDate(e.date) === daySelect.value) && (!movieSelect.value || e.title === movieSelect.value);
  });

  console.log(filteredScreenings);

  generateScreenings();

}

async function bookScreening(element) {
  let id = element.id;

  let screening = await (await fetch('http://localhost:5600/api/screenings/' + id)).json();

  window.sessionStorage.setItem("screening", JSON.stringify(screening));
  let booking = { "bookingId": "", "userId": "", "adults": 0, "children": 0, "seniors": 0 }
  window.sessionStorage.setItem("booking", JSON.stringify(booking));

  history.pushState(null, null, "/newBooking");
  router();
}

function playVideo(screeningId) {
  const iframes = document.querySelectorAll(".iframe");

  let thisScreening;
  for (let screening of filteredScreenings) {
    if (screeningId == screening.screeningId) {
      thisScreening = screening;
    }
  }

  for (let iframe of iframes) {
    if (iframe.id == screeningId) {
      console.log(iframe.id)
      iframe.classList.add("playingVideo");
      iframe.src = `http://www.imdb.com/video/imdb/${thisScreening.link.split("/").pop()}/imdb/embed`;
    }
  }
}

async function generateScreenings(start = 0, end = 20) {

  let html = '';
  let partOfFilteredScreenings = filteredScreenings;

  if (filteredScreenings.length > end) {
    partOfFilteredScreenings = filteredScreenings.slice(start, end);
  }
  for (let screening of partOfFilteredScreenings) {

    html += `
    <div id="screening-container">
      <div class="movie-information">
        <h2>${screening.title}</h2>
        <p id="movie-plot">${screening.plot}</p>
        <p>
        <span class="info-screening">${screening.date}</span>
        <span class="info-screening">${screening.duration}</span>
        <span class="info-screening">${screening.name}</span>
        </p>
        <div class="screening-times">
          <div class="screening">
            <h1 id="${screening.screeningId}" onclick="bookScreening(${screening.screeningId})">${screening.time}</h1>
            <p>Book this</p>
          </div>
        </div>
      </div>
      <div class="movieMedia">
         <img
        onclick="playVideo(${screening.screeningId})"
        src="${screening.thumbnailUrl}"
        alt=""></img>
        <iframe class="iframe" id="${screening.screeningId}" src=""
        frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen = "true" mozallowfullscreen = "true"
        webkitallowfullscreen = "true" scrolling = "no" ></iframe >
      </div>
    </div>
    `;
  }

  if (filteredScreenings.length > end) {
    html += `<button id="loadMoreButton" onclick="generateScreenings(${start + 20}, ${end + 20})">Load more screenings</button>`
  }

  screeningHolder.innerHTML = html;
}