function movieView() {
  //movies/superman
}

async function fillMovieCards() {

  let html = ''
  let movies = await (await fetch('http://localhost:5600/api/movies')).json();

  console.log(movies);
  for (let movie of movies) {
    html += `
    <div class="movie-card">
      <div class="movie-information">
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


