const adultPrice = 100;
const childPrice = 60;
const seniorPrice = 65;

function getTotal() {
  let booking = JSON.parse(window.sessionStorage.getItem("booking"));
  let total = 0;
  if (booking.adults > 0) {
    total += booking.adults * adultPrice;
  }

  if (booking.children > 0) {
    total += booking.children * childPrice;
  }

  if (booking.seniors > 0) {
    total += booking.seniors * seniorPrice;
  }
  return total;

}

function randomId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function reserveSeat(seatId) {

}

async function increaseAttendees(type) {
  let booking = JSON.parse(window.sessionStorage.getItem("booking"));
  if (type === "adult") {
    booking.adults++;
  } else if (type === "child") {
    booking.children++;
  } else {
    booking.seniors++;
  }
  window.sessionStorage.setItem("booking", JSON.stringify(booking));
  newBooking();
}

async function reduceAttendees(type) {
  let booking = JSON.parse(window.sessionStorage.getItem("booking"));
  console.log(booking);
  if (type === "adult") {
    if (booking.adults > 0) {
      booking.adults--;
    }
  } else if (type === "child") {
    if (booking.children > 0) {
      booking.children--;
    }
  } else {
    if (booking.seniors > 0) {
      booking.seniors--;
    }
  }
  window.sessionStorage.setItem("booking", JSON.stringify(booking));
  newBooking();
}

async function newBooking() {
  let theaterScreening = document.querySelector(".new_booking");
  const screening = JSON.parse(window.sessionStorage.getItem("screening"));
  console.log(screening);
  window.addEventListener('resize', newBooking);

  let booking = JSON.parse(window.sessionStorage.getItem("booking"));
  let user = getSavedSession();
  if (user != undefined) {
    booking.userId = user.userId;
    booking.id = randomId() + '-' + booking.userId + '-' + randomId();
  }

  console.log(booking);

  window.sessionStorage.setItem("booking", JSON.stringify(booking));

  let html = `
  <div class="new_booking__header">
    <h1>${screening.title}</h2>  
    <h2>Total price: ${getTotal()} SEK</h3>
    <h3>${screening.time}</h1>
    <p>${screening.date} | ${screening.name}</p>
  </div>

    <div class="ticket_seat_selection">
      <div class="ticket_selection">
      <ul>
            <li class="ticket">
              <h1>Child</h1>
              <button onclick={reduceAttendees("child")} class="ticket_button_less">-</button>
              <button onclick={increaseAttendees("child")} class="ticket_button_more">+</button>
              <h1>${booking.children}</h1>
            </li>
            <li class="ticket">
              <h1>Adult</h1>
              <button onclick={reduceAttendees("adult")} class="ticket_button_less">-</button>
              <button onclick={increaseAttendees("adult")} class="ticket_button_more">+</button>
              <h1>${booking.adults}</h1>
            </li>
            <li class="ticket">
              <h1>Senior</h1>
              <button onclick={reduceAttendees("senior")} class="ticket_button_less">-</button>
              <button onclick={increaseAttendees("senior")} class="ticket_button_more">+</button>
              <h1>${booking.seniors}</h1>
            </li>
          </ul>
      </div>
      <div class="seats_container">
      <svg version="1.1" viewBox="0 0 500 600" 
            preserveAspectRatio="xMidYMid meet" class="svg-content">
            `;

  html += ` <rect fill="#00000" x="${0}" height="45" y="${50}"
          width="45" rx="2"/>`;
  html += `
      </svg>
    </div>
  </div>`

  theaterScreening.innerHTML = html;
}


// Refresh or reload page.
function refresh() {
  window.location.reload();
}

