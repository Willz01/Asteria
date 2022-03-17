
let searchButton = null;
let theatreSelect = null;
let screeningHolder = null;
let screenings = [];
let theatres = [];
let movies = [];
let filteredScreenings = [];

function fillSelections() {
  //screenings = getScreenings();
  //theatres = getTheatres();
  //movies = getMovies();

  screenings = [
    {
      screeningId: 1, theatreId: 2, day: "8/3", time: "16:15", movieId: 1
    }, {
      screeningId: 2, theatreId: 2, day: "8/3", time: "16:30", movieId: 1
    },
    {
      screeningId: 3, theatreId: 2, day: "8/3", time: "15:00", movieId: 2
    },
    {
      screeningId: 4, theatreId: 2, day: "9/3", time: "09:30", movieId: 3
    },
    {
      screeningId: 5, theatreId: 1, day: "9/3", time: "16:30", movieId: 1
    }
  ];
  theatres = [
    { theatreId: 1, name: "Salong 1" },
    { theatreId: 2, name: "Salong 2" }
  ];
  movies = [
    {
      movieId: 1, title: "Superman", moviePlot: `The defense and the prosecution have rested, and the jury is filing into the jury room to
        decide if a young man
        is guilty or innocent of murdering his father.What begins as an open- and - shut case of murder soon becomes a
        detective
        story that presents a succession of clues creating doubt, and a mini - drama of each of the jurors' prejudices and
        preconceptions about the trial, the accused, AND each other.Based on the play, all of the action takes place on
        the
        stage of the jury room`, movieDuration: "1 hour | 35 min"
    },
    {
      movieId: 2, title: "Hobbit", moviePlot: `An ancient Ring thought lost for centuries has been found, 
      and through a strange twist of fate has been given to a small Hobbit named Frodo. When Gandalf discovers the Ring is in 
      fact the One Ring of the Dark Lord Sauron, Frodo must make an epic quest to the Cracks of Doom in order to destroy it. 
      However, he does not go alone. He is joined by Gandalf, Legolas the elf, Gimli the Dwarf, Aragorn, Boromir, 
      and his three Hobbit friends Merry, Pippin, and Samwise. Through mountains, snow, darkness, forests, rivers 
      and plains, facing evil and danger at every corner the Fellowship of the Ring must go. 
      Their quest to destroy the One Ring is the only hope for the end of the Dark Lords reign.`, movieDuration: "2 hours | 3 min"
    },
    {
      movieId: 3, title: "Invisible man", moviePlot: `The Godfather \"Don\" Vito Corleone is the head 
      of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's 
      youngest son and a decorated WW II Marine is also present at the wedding. Michael seems to be uninterested 
      in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect 
      but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs 
      the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values 
      and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against 
      all the other mafia families which could tear the Corleone family apart.`, movieDuration: "1 hour | 30 min"
    }

  ];

  document.querySelector('#search-button').addEventListener('click', filterScreenings);

  theatreSelect = document.querySelector('#select-theatre');
  daySelect = document.querySelector('#select-day');
  movieSelect = document.querySelector('#select-movie');
  screeningHolder = document.querySelector('#screenings-holder');

  fillTheatre();
  fillDay();
  fillMovie();

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
  for (let { day } of screenings) {
    if (!days.includes(day)) {
      days.push(day);
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
  })

  filteredScreenings = screeningsAndMoviesAndTheatres.filter(e => {
    return (!theatreSelect.value || e.name === theatreSelect.value) && (!daySelect.value || e.day === daySelect.value) && (!movieSelect.value || e.title === movieSelect.value);
  });

  generateScreenings();

}

async function bookScreening(element) {
  let id = element.id;

  screening = await (await fetch('http://localhost:5600/api/screenings/' + id)).json()
  console.log(screening)

  window.sessionStorage.setItem("screening", JSON.stringify(screening));
  let booking = { "bookingId": "", "userId": "", "adults": 0, "children": 0, "seniors": 0 }
  window.sessionStorage.setItem("booking", JSON.stringify(booking));

  history.pushState(null, null, "http://localhost:5601/newBooking");
  await router();
}

async function generateScreenings() {

  console.log(filteredScreenings);
  let html = '';

  for (let screening of filteredScreenings) {
    console.log(screening.screeningId);


    html += `
    <div id="screening-container">
      <div class="movie-information">
        <h2>${screening.title}</h2>
        <p id="movie-plot">${screening.moviePlot}</p>
        <p>
        <span class="info-screening left">${screening.movieDuration}</span>
        <span class="info-screening">${screening.name}</span>
        </p>
        <div class="screening-times">
      <div class="screening">
      <h1 id="${screening.screeningId} "onclick="bookScreening(this)">${screening.time}</h1>
        <p>Book this</p>
      </div>
   </div>
    </div>
      <img
        src="https://m.media-amazon.com/images/M/MV5BNjE3MWNhZDYtYjFlMS00MzM4LTg5M2YtYTAwMGY2ZDg0OGY0XkEyXkFqcGdeQXVyNzU1NzE3NTg@._V1_.jpg"
        alt="">
    </div>
    `;
  }

  screeningHolder.innerHTML = html;

}


