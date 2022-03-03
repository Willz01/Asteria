export const DUMMY_THEATER1 = {
  theater_size: {
    main: {
      rows: 4,
      columns: 11,
      nbr_seats: 44,
    },
    offset: {
      rows: 2,
      columns: 9,
      nbr_seats: 18,
    },
    handicap: {
      rows: 1,
      columns: 2,
    },
    total_nbr_seats: 66,
  },
  prices: {
    child: 60,
    adult: 100,
    senior: 65,
  },
  movie: "Superman Vs. Batman",
  time: {
    hr: 14,
    min: 30,
  },
  newbooking: {
    name: "",
    adults: 0,
    child: 0,

  }
}

async function loadJsonAndDisplayTheSeats() {

  //let rawData = await fetch();
  //let theater_screening = rawData.json();

  //temp stuff here to 
  let theater_screening = DUMMY_THEATER1;
  let seats = {};
  for (let i = 0; i < theater_screening.nbr_seats; i++) {

    const seat = 0;
    seats.push(seat)

  }

  //here
  let html = '';
  let beginning = `
    <article class="">
      <h1 class="">${theater_screening.movie}</h1>
      <h2 class=""> <
      
  `;


  //document.querySelector('theater').innerHTML = html;

}
