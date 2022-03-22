async function lookAtMovie(movieTitle) {
  window.sessionStorage.setItem("filterMovie", JSON.stringify(movieTitle));

  history.pushState(null, null, "/findScreening");
  router();


}


async function fillMovieCards() {

  let html = ''
  let movies = await (await fetch('http://localhost:5600/api/movies')).json();

  for (let movie of movies) {
    html += `
    <div class="movie-card" onclick="lookAtMovie('${movie.title}')">
      <div class="movie-information" >
        <h2>${movie.title}</h2>
        <p>${movie.plot}</p>
      </div>
      <div class="movie-posters">
        <img src="${movie.thumbnailUrl}" alt="${movie.fullTitle}">
      </div>
    </div>
    `;
  }

  document.querySelector('.movie-cards').innerHTML = html;
}

