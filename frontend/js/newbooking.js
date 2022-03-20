const adultPrice = 100;
const childPrice = 60;
const seniorPrice = 65;

function getTotal() {
  let booking = getStorage("booking");
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

function getStorage(key) {
  return JSON.parse(window.sessionStorage.getItem(key));
}

function setStorage(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}


async function reserveSeat(element) {
  let seatId = element.id;
  let user = getSavedSession();
  let booking = getStorage("booking");
  if (user === undefined) {
    history.pushState(null, null, "http://localhost:5601/signUp");
    await router();
  }

  let totalPersons = booking.adults + booking.children + booking.seniors;
  if (totalPersons > 0) {
    let databaseBooking = await (await fetch("http://localhost:5600/api/bookings/" + booking.bookingId)).json();

    if (databaseBooking === undefined) {
      await fetch("http://localhost:5600/api/bookings/new-booking", {
        method: 'POST',
        body: booking
      });
    }
    let reservation = await (await fetch("http://localhost:5600/api/bookings/full-booking" + booking.bookingId)).json();
    if (totalPersons > reservation.length) {
      await fetch("http://localhost:5600/api/reservedseat/new-reservation", {
        method: 'POST',
        body: {
          "bookingId": booking.bookingId,
          "screeningId": screening.screeningId,
          "seatId": seatId,
          "dateTime": new Date(),
          "isTemp": true
        }

      });
    }
  }

  newBooking();
}

async function unreserveSeat(element) {
  let seatId = element.id;
  await fetch("http://localhost:5600/api/reservedseat/" + seatId);
  newBooking();
}

async function increaseAttendees(type) {
  let booking = getStorage("booking");
  if (type === "adult") {
    booking.adults++;
  } else if (type === "child") {
    booking.children++;
  } else {
    booking.seniors++;
  }
  setStorage("booking", booking);
  newBooking();
}

async function reduceAttendees(type) {
  let booking = getStorage("booking");
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
  setStorage("booking", booking);
  newBooking();
}

async function newBooking() {
  let theaterScreening = document.querySelector(".new_booking");
  let screening = getStorage("screening");
  console.log(screening);
  window.addEventListener('resize', newBooking);

  let booking = getStorage("booking");
  let user = getSavedSession();
  if (user != undefined) {
    booking.userId = user.userId;
    booking.id = randomId() + '-' + booking.userId + '-' + randomId();
  }

  console.log(booking);

  setStorage("booking", booking);

  let html = `
  <div class="new_booking_header">
    <h1>${screening.title}</h1>
    <h1>\t\t</h1>
    <h2>Total price: ${getTotal()} SEK</h2>
  </div>
  <div class="new-_booking__header">
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

  let allReservations = await (await fetch('http://localhost:5600/api/reservedseat/screening/' + screening.screeningId)).json();
  let count = 1;

  let seatArray = {};
  let userSeats = {};
  for (let reservation in allReservations) {
    if (reservation.isTemp === true) {
      let now = new Date();
      console.log()
      reservation.dateTime.setMinutes(reservation.dateTime.getMinutes() + 5);
      if (reservation.dateTime > now) {
        await fetch('http://localhost:5600/api/reservedseat/' + reservation.reservedSeatId);
      } else {

        if (booking.bookingId === reservation.bookingId) {
          userSeats.add(seatId);
        } else {
          seatArray.add(seatId);
        }
      }

    }
  }

  let sizing = (500) / (screening.mainColumns * 2)
  let y_pos = 50;
  for (let row = 0; row < screening.mainRows; row++) {
    let x_pos = 20
    for (let column = 0; column < screening.mainColumns; column++) {
      if (seatArray.length > 0) {
        for (let seatId in seatArray) {
          if (count === seatId) {
            html += `<rect id="${count}" " fill="red" x="${x_pos}" height="${sizing}" y="${y_pos}"
            width="${sizing}" rx="4" />`

            count++;
            x_pos += sizing * 2;
            continue;
          }
        }
      }

      if (userSeats.length > 0) {
        for (let seatId in seatArray) {
          if (count === seatId) {
            html += `<rect id="${count}" " fill="blue" x="${x_pos}" height="${sizing}" y="${y_pos}"
            width="${sizing}" rx="4" onclick="unreserveSeat(this)"/>`

            count++;
            x_pos += sizing * 2;
            continue;
          }
        }
      }
      html += `<rect id="${count}" fill="#00000" x="${x_pos}" height="${sizing}" y="${y_pos}"
        width="${sizing}" rx="4" onclick="reserveSeat(this)"/>`;
      count++;
      x_pos += sizing * 2
    }
    y_pos += sizing * 2;
  }

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

